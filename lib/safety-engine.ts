import { Medicine, PatientDetails, SafetyAlert } from './types';
import { DRUG_DATABASE, DRUG_INTERACTION_RULES, ALLERGY_CROSS_REACTIVITY, DrugInfo } from './drug-database';

function normalizeName(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
}

function findDrugInfo(medicineName: string, brandName?: string): DrugInfo | null {
  const normMed = normalizeName(medicineName);
  const normBrand = brandName ? normalizeName(brandName) : '';

  // Direct key lookup
  for (const [key, info] of Object.entries(DRUG_DATABASE)) {
    if (normMed.includes(key) || (normBrand && normBrand.includes(key))) {
      return info;
    }
    if (normMed.includes(normalizeName(info.genericName))) {
      return info;
    }
    for (const b of info.brandNames) {
      if (normMed.includes(normalizeName(b)) || (normBrand && normBrand.includes(normalizeName(b)))) {
        return info;
      }
    }
    for (const alias of info.aliases) {
      if (normMed.includes(normalizeName(alias))) {
        return info;
      }
    }
  }
  return null;
}

export function runMedicationSafetyCheck(
  medicines: Medicine[],
  patientDetails: PatientDetails
): SafetyAlert[] {
  const alerts: SafetyAlert[] = [];
  let alertCount = 0;
  const generateId = () => `alert-${++alertCount}`;

  // 1. Check for Missing or Unclear Medication Information
  const isMissingVal = (val?: string | null) => {
    if (!val) return true;
    const norm = val.trim().toLowerCase();
    return norm === '' || norm === 'unspecified' || norm === 'not specified' || norm === 'unknown';
  };

  for (const med of medicines) {
    const missingParts: string[] = [];
    if (isMissingVal(med.strength)) {
      missingParts.push('Strength / Potency');
    }
    if (isMissingVal(med.frequency)) {
      missingParts.push('Frequency (how many times a day)');
    }
    if (isMissingVal(med.duration)) {
      missingParts.push('Duration of treatment');
    }
    if (!med.foodInstruction || med.foodInstruction === 'As directed') {
      missingParts.push('Food relation (Before / After meals)');
    }

    if (missingParts.length > 0 || med.isUncertain) {
      alerts.push({
        id: generateId(),
        type: 'missing_info',
        severity: missingParts.length >= 2 ? 'high' : 'moderate',
        medicinesInvolved: [med.name],
        title: `Unclear Prescription Details: ${med.name}`,
        description: `The prescription is missing or has ambiguous information for: ${
          missingParts.length > 0 ? missingParts.join(', ') : 'handwriting / clinical clarity'
        }.${med.uncertainReason ? ` Note: ${med.uncertainReason}` : ''}`,
        recommendation:
          'Do not guess or assume timing or dosage. Please have your pharmacist or doctor clarify this instruction before starting.',
        source: 'Clinical Safety Protocol - Missing Information Standard',
      });
    }
  }

  // 2. Check for Duplicate Active Ingredients
  const ingredientMap = new Map<string, { medName: string; brand?: string | null; strength: string }[]>();

  for (const med of medicines) {
    const info = findDrugInfo(med.name, med.brandName ?? undefined);
    const ingredients = info
      ? info.activeIngredients
      : med.activeIngredient
      ? [normalizeName(med.activeIngredient)]
      : [normalizeName(med.name)];

    for (const ing of ingredients) {
      if (!ing) continue;
      const existing = ingredientMap.get(ing) || [];
      existing.push({ medName: med.name, brand: med.brandName, strength: med.strength });
      ingredientMap.set(ing, existing);
    }
  }

  for (const [ingredient, medList] of ingredientMap.entries()) {
    if (medList.length > 1) {
      const medNames = medList.map((m) => (m.brand ? `${m.medName} (${m.brand})` : m.medName));
      alerts.push({
        id: generateId(),
        type: 'duplicate_ingredient',
        severity: 'critical',
        medicinesInvolved: medList.map((m) => m.medName),
        title: `Duplicate Active Ingredient Detected: ${ingredient.toUpperCase()}`,
        description: `You are prescribed multiple medications that contain the same active medicinal compound (${ingredient}): ${medNames.join(' AND ')}. Taking both simultaneously could lead to an accidental dangerous overdose.`,
        recommendation:
          'Contact your prescribing physician or pharmacist immediately. Do not take both medications together without explicit medical confirmation.',
        source: 'Pharmacopeia Drug Safety Rule: Active Compound De-duplication',
      });
    }
  }

  // 3. Known Allergy Conflicts
  const patientAllergies = patientDetails.allergies || [];
  const allergyStatus = patientDetails.allergyStatus;

  if (patientAllergies.length === 0 && allergyStatus !== 'none_documented') {
    // Prompt rule: Unknown allergy status must not be treated as no allergies.
    alerts.push({
      id: generateId(),
      type: 'allergy_conflict',
      severity: 'unverified',
      medicinesInvolved: medicines.map((m) => m.name),
      title: 'Unrecorded Patient Allergy Status',
      description:
        'No known allergy history is recorded on this prescription. This does not confirm the absence of drug allergies.',
      recommendation:
        'If you have had any past allergic rashes, facial swelling, or breathing difficulty from antibiotics (such as Penicillin/Sulfa) or pain relievers, notify your doctor immediately.',
      source: 'Patient Safety Standard: Allergy Verification Guideline',
    });
  } else if (patientAllergies.length > 0) {
    for (const allergy of patientAllergies) {
      const normAllergy = normalizeName(allergy);

      for (const [allergyGroup, data] of Object.entries(ALLERGY_CROSS_REACTIVITY)) {
        if (normAllergy.includes(allergyGroup)) {
          for (const med of medicines) {
            const normMed = normalizeName(med.name);
            const normBrand = med.brandName ? normalizeName(med.brandName) : '';

            const isMatch = data.genericMembers.some(gm => normMed.includes(gm) || normBrand.includes(gm));
            if (isMatch) {
              alerts.push({
                id: generateId(),
                type: 'allergy_conflict',
                severity: 'critical',
                medicinesInvolved: [med.name],
                title: `Critical Allergy Conflict: ${med.name} with ${allergy.toUpperCase()} Allergy`,
                description: `${data.warningText} Prescribed medicine: ${med.name} (${med.brandName || ''}).`,
                recommendation: 'DO NOT TAKE this medicine until you confirm with your treating doctor or pharmacist that an allergy-safe alternative has been substituted.',
                source: 'National Allergy Vigilance & Cross-Reactivity Registry'
              });
            }
          }
        }
      }
    }
  }

  // 4. Potential Conflicts between Existing & Newly Prescribed Medicines
  const existingMeds = patientDetails.existingMedications || [];
  if (existingMeds.length > 0) {
    for (const existMed of existingMeds) {
      const normExist = normalizeName(existMed);
      for (const newMed of medicines) {
        const normNew = normalizeName(newMed.name);

        // Check Aspirin/NSAID combination
        if (
          (normExist.includes('aspirin') || normExist.includes('ecosprin')) &&
          (normNew.includes('ibuprofen') || normNew.includes('brufen') || normNew.includes('diclofenac') || normNew.includes('aceclofenac'))
        ) {
          alerts.push({
            id: generateId(),
            type: 'existing_med_conflict',
            severity: 'critical',
            medicinesInvolved: [newMed.name, existMed],
            title: `Conflict: New ${newMed.name} + Existing ${existMed}`,
            description: `You are currently taking ${existMed} (blood thinner/antiplatelet). Adding ${newMed.name} (NSAID pain reliever) drastically increases gastrointestinal ulceration and bleeding risk.`,
            recommendation: 'Inform your doctor of your existing regular medication before taking this new pain relief medicine.',
            source: 'Drug-Drug Interaction Reference'
          });
        }

        // Check Metformin + Contrast or duplicate
        if (normExist.includes('metformin') && normNew.includes('metformin')) {
          alerts.push({
            id: generateId(),
            type: 'duplicate_ingredient',
            severity: 'critical',
            medicinesInvolved: [newMed.name, existMed],
            title: `Duplicate Therapy: ${newMed.name} with Existing ${existMed}`,
            description: `You already take ${existMed}. The newly prescribed ${newMed.name} contains the same drug, risking hypoglycemia or toxicity.`,
            recommendation: 'Clarify with doctor whether this replaces your existing medicine or modifies your dose.',
            source: 'Therapeutic Redundancy Safety Check'
          });
        }
      }
    }
  }

  // 5. Drug-Drug Interactions (Among newly prescribed medicines)
  for (let i = 0; i < medicines.length; i++) {
    for (let j = i + 1; j < medicines.length; j++) {
      const medA = medicines[i];
      const medB = medicines[j];
      const normA = normalizeName(medA.name + ' ' + (medA.brandName || ''));
      const normB = normalizeName(medB.name + ' ' + (medB.brandName || ''));

      for (const rule of DRUG_INTERACTION_RULES) {
        const matchDirect = normA.includes(rule.drugA) && normB.includes(rule.drugB);
        const matchReverse = normA.includes(rule.drugB) && normB.includes(rule.drugA);

        if (matchDirect || matchReverse) {
          alerts.push({
            id: generateId(),
            type: 'drug_interaction',
            severity: rule.severity,
            medicinesInvolved: [medA.name, medB.name],
            title: `Potential Interaction: ${medA.name} + ${medB.name}`,
            description: rule.description,
            recommendation: rule.recommendation,
            source: 'Verified Clinical Drug Interaction Reference'
          });
        }
      }
    }
  }

  // 6. Dosage Inconsistency Checks
  for (const med of medicines) {
    const info = findDrugInfo(med.name, med.brandName);
    if (info && info.standardMaxDailyDoseMg) {
      // Extract numeric milligram dosage
      const matchStrength = med.strength.match(/(\d+)\s*(?:mg|milligrams)/i);
      if (matchStrength) {
        const mgPerDose = parseInt(matchStrength[1], 10);
        let dailyMultiplier = 1;
        const normFreq = med.frequency.toLowerCase();
        if (normFreq.includes('tds') || normFreq.includes('thrice') || normFreq.includes('3 times') || normFreq.includes('1-1-1')) {
          dailyMultiplier = 3;
        } else if (normFreq.includes('bd') || normFreq.includes('twice') || normFreq.includes('2 times') || normFreq.includes('1-0-1')) {
          dailyMultiplier = 2;
        } else if (normFreq.includes('qid') || normFreq.includes('4 times')) {
          dailyMultiplier = 4;
        }

        const estimatedDailyMg = mgPerDose * dailyMultiplier;
        if (estimatedDailyMg > info.standardMaxDailyDoseMg) {
          alerts.push({
            id: generateId(),
            type: 'dosage_inconsistency',
            severity: 'high',
            medicinesInvolved: [med.name],
            title: `Potential Dosage Exceeded: ${med.name}`,
            description: `The calculated daily dose of ${estimatedDailyMg} mg exceeds the typical maximum recommended adult limit of ${info.standardMaxDailyDoseMg} mg/day.`,
            recommendation: 'Check with your doctor or pharmacist to verify whether this higher dosage was intentionally prescribed for your specific clinical indication.',
            source: 'Prescribing Information & Dosage Reference Limits'
          });
        }
      }
    }
  }

  // 7. Check for unverified medicines
  const unverifiedMeds = medicines.filter(m => !findDrugInfo(m.name, m.brandName));
  if (unverifiedMeds.length > 0) {
    alerts.push({
      id: generateId(),
      type: 'check_uncompleted',
      severity: 'unverified',
      medicinesInvolved: unverifiedMeds.map(m => m.name),
      title: `Interaction Check Incomplete for ${unverifiedMeds.length} Medication(s)`,
      description: `Comprehensive interaction data was not available in our verified reference database for: ${unverifiedMeds.map(m => m.name).join(', ')}. This does not mean the medicines are free from interactions.`,
      recommendation: 'Always consult your pharmacist or doctor for an authoritative full medication safety review.',
      source: 'Clinical Prudence & Verification Standard'
    });
  }

  return alerts;
}
