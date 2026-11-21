import { NextRequest, NextResponse } from 'next/server';
import { runMedicationSafetyCheck } from '@/lib/safety-engine';
import { Medicine, PatientDetails } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { medicines, patientDetails } = body as {
      medicines: Medicine[];
      patientDetails: PatientDetails;
    };

    if (!medicines || !Array.isArray(medicines)) {
      return NextResponse.json(
        { error: 'Invalid medicines list provided' },
        { status: 400 }
      );
    }

    const safePatientDetails: PatientDetails = patientDetails || {
      name: 'Patient',
      allergies: [],
      existingMedications: []
    };

    const alerts = runMedicationSafetyCheck(medicines, safePatientDetails);

    return NextResponse.json({
      success: true,
      alerts,
      totalAlerts: alerts.length,
      hasCritical: alerts.some(a => a.severity === 'critical'),
      hasHigh: alerts.some(a => a.severity === 'high'),
      evaluatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Safety check API error:', error);
    return NextResponse.json(
      { error: error.message || 'Safety check failed' },
      { status: 500 }
    );
  }
}
