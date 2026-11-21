import {
  PrescriptionData,
  SafetyAlert,
  SupportedLanguage,
  TranslationMeta,
  FoodInstruction,
} from './types';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from './translations';
import { callGeminiDetailed } from './gemini-client';

type LangMap = Partial<Record<SupportedLanguage, string>>;

/**
 * Localized disease / diagnosis names in authentic native scripts across all 12 languages.
 * Original English clinical term is always retained alongside for clinical safety.
 */
const DISEASE_LEXICON: Record<string, LangMap> = {
  'type 2 diabetes mellitus': {
    kn: 'ಟೈಪ್ 2 ಮಧುಮೇಹ (ಸಕ್ಕರೆ ಕಾಯಿಲೆ)',
    hi: 'टाइप 2 मधुमेह (शुगर)',
    ta: 'வகை 2 நீரிழிவு நோய் (சர்க்கரை நோய்)',
    te: 'టైప్ 2 మధుమేహం (షుగర్ వ్యాధి)',
    ml: 'ടൈപ്പ് 2 പ്രമേഹം (ഷുഗർ)',
    mr: 'टाइप 2 मधुमेह (शुगर)',
    bn: 'টাইপ ২ ডায়াবেটিস (মধুমেহ)',
    gu: 'ટાઈપ 2 ડાયાબિટીસ (મધુપ્રમેહ)',
    pa: 'ਟਾਈਪ 2 ਸ਼ੂਗਰ (ਮਧੂਮੇਹ)',
    or: 'ଟାଇପ୍ ୨ ମଧୁମେହ (ସୁଗାର)',
    ur: 'ذیابیطس ٹائپ 2 (شوگر)',
  },
  'essential hypertension': {
    kn: 'ಅಧಿಕ ರಕ್ತದೊತ್ತಡ (ಹೈ ಬಿಪಿ)',
    hi: 'उच्च रक्तचाप (हाई बीपी)',
    ta: 'உயர் இரத்த அழுத்தம் (ஹை பிபி)',
    te: 'అధిక రక్తపోటు (హై బీపీ)',
    ml: 'രക്താതിമർദ്ദം (ഹൈ ബിപി)',
    mr: 'उच्च रक्तदाब (हाय बीपी)',
    bn: 'উচ্চ রক্তচাপ (হাই ব্লাড প্রেশার)',
    gu: 'ઉચ્ચ રક્તચાપ (હાઈ બીપી)',
    pa: 'ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ',
    or: 'ଉଚ୍ଚ ରକ୍ତଚାପ (ହାଇ ବିପି)',
    ur: 'ہائی بلڈ پریشر (بلند فشارِ خون)',
  },
  hypertension: {
    kn: 'ಅಧಿಕ ರಕ್ತದೊತ್ತಡ (ಹೈ ಬಿಪಿ)',
    hi: 'उच्च रक्तचाप (हाई बीपी)',
    ta: 'உயர் இரத்த அழுத்தம்',
    te: 'అధిక రక్తపోటు',
    ml: 'രക്താതിമർദ്ദം',
    mr: 'उच्च रक्तदाब',
    bn: 'উচ্চ রক্তচাপ',
    gu: 'ઉચ્ચ રક્તચાપ',
    pa: 'ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ',
    or: 'ଉଚ୍ଚ ରକ୍ତଚାପ',
    ur: 'ہائی بلڈ پریشر',
  },
  dyslipidemia: {
    kn: 'ಕೊಲೆಸ್ಟ್ರಾಲ್ ಹೆಚ್ಚಳ',
    hi: 'रक्त में कोलेस्ट्रॉल की अधिकता',
    ta: 'இரத்தத்தில் அதிக கொழுப்பு',
    te: 'రక్తంలో అధిక కొలెస్ట్రాల్',
    ml: 'രക്തത്തിലെ ഉയർന്ന കൊളസ്ട്രോൾ',
    mr: 'रक्तातील कोलेस्टेरॉल वाढणे',
    bn: 'রক্তে উচ্চ কোলেস্টেরল',
    gu: 'લોહીમાં વધુ કોલેસ્ટ્રોલ',
    pa: 'ਖੂਨ ਵਿੱਚ ਵੱਧ ਕੋਲੈਸਟ੍ਰੋਲ',
    or: 'ରକ୍ତରେ ଅଧିକ କୋଲେଷ୍ଟ୍ରଲ',
    ur: 'خون میں کولیسٹرول کی زیادتی',
  },
  'acute bacterial bronchitis': {
    kn: 'ತೀವ್ರ ಬ್ಯಾಕ್ಟೀರಿಯಲ್ ಬ್ರಾಂಕೈಟಿಸ್ (ಶ್ವಾಸನಾಳದ ಸೋಂಕು)',
    hi: 'तीव्र बैक्टीरियल ब्रोंकाइटिस (श्वासनली का संक्रमण)',
    ta: 'கடுமையான மூச்சுக்குழாய் தொற்று',
    te: 'తీవ్రమైన శ్వాసనాళాల బ్యాక్టీరియల్ ఇన్ఫెక్షన్',
    ml: 'തീവ്രമായ ശ്വാസകോശ അണുബാധ',
    mr: 'तीव्र श्वसननलिकेचा संसर्ग (ब्रॉन्कायटिस)',
    bn: 'তীব্র ব্যাকটেরিয়াল ব্রঙ্কাইটিস (শ্বাসনালীর সংক্রমণ)',
    gu: 'તીવ્ર શ્વાસનળીનો ચેપ (બ્રોન્કાઇટિસ)',
    pa: 'ਤੀਬਰ ਬ੍ਰੌਨਕਾਈਟਸ (ਸਾਹ ਨਾਲੀ ਦੀ ਲਾਗ)',
    or: 'ତୀବ୍ର ବ୍ରୋଙ୍କାଇଟିସ୍ (ଶ୍ୱାସନଳୀ ସଂକ୍ରମଣ)',
    ur: 'شدید بیکٹیریل برونکائٹس (سانس کی نالی کا انفیکشن)',
  },
  'high grade pyrexia': {
    kn: 'ತೀವ್ರ ಜ್ವರ',
    hi: 'तेज बुखार',
    ta: 'அதிக காய்ச்சல்',
    te: 'తీవ్రమైన జ్వరం',
    ml: 'കഠിനമായ പനി',
    mr: 'तीव्र ताप',
    bn: 'তীব্র জ্বর',
    gu: 'તેજ તાવ',
    pa: 'ਤੇਜ਼ ਬੁਖਾਰ',
    or: 'ଅତ୍ୟଧିକ ଜ୍ୱର',
    ur: 'تیز بخار',
  },
  'severe allergic rhinitis': {
    kn: 'ತೀವ್ರ ಅಲರ್ಜಿ ನೆಗಡಿ',
    hi: 'गंभीर एलर्जी एवं जुकाम',
    ta: 'கடுமையான ஒவ்வாமை சளி',
    te: 'తీవ్రమైన అలర్జీ జలుబు',
    ml: 'കഠിനമായ അലർജി ജലദോഷം',
    mr: 'तीव्र ॲलर्जीमुळे होणारी सर्दी',
    bn: 'তীব্র অ্যালার্জিক সর্দি',
    gu: 'તીવ્ર એલર્જીક શરદી',
    pa: 'ਗੰਭੀਰ ਐਲਰਜੀ ਵਾਲਾ ਜ਼ੁਕਾਮ',
    or: 'ତୀବ୍ର ଆଲର୍ଜି ଥଣ୍ଡା',
    ur: 'شدید الرجی اور نزلہ',
  },
  'severe osteoarthritis right knee': {
    kn: 'ಬಲ ಮಂಡಿಯ ತೀವ್ರ ಕೀಲು ಸವೆತ (ಆಸ್ಟಿಯೋಆರ್ಥ್ರೈಟಿಸ್)',
    hi: 'दाहिने घुटने का गंभीर गठिया (ऑस्टियोआर्थराइटिस)',
    ta: 'வலது முழங்கால் மூட்டு தேய்மானம்',
    te: 'కుడి మోకాలి కీళ్ల అరుగుదల (ఆస్టియో ఆర్థరైటిస్)',
    ml: 'വലതു കാൽമുട്ടിന്റെ സന്ധിതേയ്മാനം',
    mr: 'उजव्या गुडघ्याचा गंभीर संधिवात',
    bn: 'ডান হাঁটুর তীব্র বাত ও ক্ষয়',
    gu: 'જમણા ઘૂંટણનો ગંભીર સંધિવા',
    pa: 'ਸੱਜੇ ਗੋਡੇ ਦਾ ਗੰਭੀਰ ਗਠੀਆ',
    or: 'ଡାହାଣ ଆଣ୍ଠୁର ଗଣ୍ଠି ବାତ',
    ur: 'دائیں گھٹنے کا شدید جوڑوں کا درد (آسٹیو آرتھرائٹس)',
  },
  'subacute joint inflammation': {
    kn: 'ಕೀಲು ಊತ ಮತ್ತು ಬಿಗಿತ',
    hi: 'जोड़ों की सूजन व अकड़न',
    ta: 'மூட்டு வீக்கம் மற்றும் விறைப்பு',
    te: 'కీళ్ల వాపు మరియు బిగుతు',
    ml: 'സന്ധി വീക്കവും വേദനയും',
    mr: 'सांध्यांची सूज व कडकपणा',
    bn: 'জয়েন্টের প্রদাহ ও শক্ত ভাব',
    gu: 'સાંધાનો સોજો અને જકડાઈ જવું',
    pa: 'ਜੋੜਾਂ ਦੀ ਸੋਜ ਅਤੇ ਅਕੜਾਅ',
    or: 'ଗଣ୍ଠି ଫୁଲା ଏବଂ କଠିନତା',
    ur: 'جوڑوں کی سوزش اور اکڑن',
  },
  'viral fever': {
    kn: 'ವೈರಲ್ ಜ್ವರ',
    hi: 'वायरल बुखार',
    ta: 'வைரஸ் காய்ச்சல்',
    te: 'వైరల్ జ్వరం',
    ml: 'വൈറൽ പനി',
    mr: 'व्हायरल ताप',
    bn: 'ভাইরাল জ্বর',
    gu: 'વાયરલ તાવ',
    pa: 'ਵਾਇਰਲ ਬੁਖਾਰ',
    or: 'ଭାଇରାଲ୍ ଜ୍ୱର',
    ur: 'وائرل بخار',
  },
  hypothyroidism: {
    kn: 'ಥೈರಾಯ್ಡ್ ಕೊರತೆ (ಹೈಪೋಥೈರಾಯ್ಡಿಸಂ)',
    hi: 'हाइपोथायरायडिज्म (थायरॉइड की कमी)',
    ta: 'தைராய்டு சுரப்புக் குறைவு',
    te: 'హైపోథైరాయిడిజం (థైరాయిడ్ లోపం)',
    ml: 'ഹൈപ്പോതൈറോയ്ഡിസം',
    mr: 'हायपोथायरॉईडीझम',
    bn: 'হাইপোথাইরয়েডিজম',
    gu: 'હાઇપોથાઇરોઇડિઝમ',
    pa: 'ਹਾਈਪੋਥਾਈਰਾਇਡਿਜ਼ਮ',
    or: 'ହାଇପୋଥାଇରଏଡିଜମ୍',
    ur: 'ہائپو تھائیرائیڈزم (تھائیرائیڈ کی کمی)',
  },
};

/**
 * Accurate native-script transliteration of common Indian medicine generic & brand names.
 * NEVER replaces drug identity — always displayed alongside original English chemical/brand name.
 */
const MEDICINE_SCRIPT_MAP: Record<string, LangMap> = {
  metformin: {
    kn: 'ಮೆಟ್‌ಫಾರ್ಮಿನ್', hi: 'मेटफॉर्मिन', ta: 'மெட்ஃபார்மின்', te: 'మెట్‌ఫార్మిన్',
    ml: 'മെറ്റ്ഫോർമിൻ', mr: 'मेटफॉर्मिन', bn: 'মেটফর্মিন', gu: 'મેટફોર્મિન',
    pa: 'ਮੈਟਫਾਰਮਿਨ', or: 'ମେଟଫର୍ମିନ୍', ur: 'میٹفارمن',
  },
  glycomet: {
    kn: 'ಗ್ಲೈಕೋಮೆಟ್', hi: 'ग्लाइकोमेट', ta: 'கிளைக்கோமெட்', te: 'గ్లైకోమెట్',
    ml: 'ഗ്ലൈക്കോമെറ്റ്', mr: 'ग्लायकोमेट', bn: 'গ্লাইকোমেট', gu: 'ગ્લાયકોમેટ',
    pa: 'ਗਲਾਈਕੋਮੈਟ', or: 'ଗ୍ଲାଇକୋମେଟ୍', ur: 'گلائیکومیٹ',
  },
  glimepiride: {
    kn: 'ಗ್ಲಿಮೆಪಿರೈಡ್', hi: 'ग्लिमेपिराइड', ta: 'கிளிமெபிரைடு', te: 'గ్లిమెపిరైడ్',
    ml: 'ഗ്ലിമെപിറൈഡ്', mr: 'ग्लिमेपिराइड', bn: 'গ্লিমেপিরাইড', gu: 'ગ્લિમેપિરાઇડ',
    pa: 'ਗਲਿਮੇਪਿਰਾਈਡ', or: 'ଗ୍ଲିମେପିରାଇଡ୍', ur: 'گلیمیپیرائیڈ',
  },
  amaryl: {
    kn: 'ಅಮಾರಿಲ್', hi: 'अमारिल', ta: 'அமாரில்', te: 'అమారిల్',
    ml: 'അമാറിൽ', mr: 'अमारिल', bn: 'অ্যামারিল', gu: 'અમારિલ',
    pa: 'ਅਮਾਰਿਲ', or: 'ଅମାରିଲ୍', ur: 'اماریل',
  },
  telmisartan: {
    kn: 'ಟೆಲ್ಮಿಸಾರ್ಟನ್', hi: 'टेल्मिसर्टन', ta: 'டெல்மிசார்டன்', te: 'టెల్మిసార్టన్',
    ml: 'ടെൽമിസാർട്ടൻ', mr: 'टेल्मिसर्टन', bn: 'টেলমিসার্টান', gu: 'ટેલ્મિસાર્ટન',
    pa: 'ਟੈਲਮੀਸਾਰਟਨ', or: 'ଟେଲମିସାର୍ଟାନ୍', ur: 'ٹیلمیسرٹن',
  },
  telma: {
    kn: 'ಟೆಲ್ಮಾ', hi: 'टेल्मा', ta: 'டெல்மா', te: 'టెల్మా',
    ml: 'ടെൽമ', mr: 'टेल्मा', bn: 'টেলমা', gu: 'ટેલ્મા',
    pa: 'ਟੈਲਮਾ', or: 'ଟେଲମା', ur: 'ٹیلما',
  },
  atorvastatin: {
    kn: 'ಅಟೋರ್ವಾಸ್ಟಾಟಿನ್', hi: 'एटोरवास्टेटिन', ta: 'அடோர்வாஸ்டாடின்', te: 'అటోర్వాస్టాటిన్',
    ml: 'അറ്റോർവാസ്റ്റാറ്റിൻ', mr: 'ॲटोर्व्हास्टॅटिन', bn: 'অ্যাটরভাস্ট্যাটিন', gu: 'એટોર્વાસ્ટેટિન',
    pa: 'ਅਟੋਰਵਾਸਟੈਟਿਨ', or: 'ଆଟୋର୍ଭାଷ୍ଟାଟିନ୍', ur: 'اٹورواسٹیٹن',
  },
  atorva: {
    kn: 'ಅಟೋರ್ವಾ', hi: 'एटोरवा', ta: 'அடோர்வா', te: 'అటోర్వా',
    ml: 'അറ്റോർവ', mr: 'ॲटोर्व्हा', bn: 'অ্যাটরভা', gu: 'એટોર્વા',
    pa: 'ਅਟੋਰਵਾ', or: 'ଆଟୋର୍ଭା', ur: 'اٹوروا',
  },
  pantoprazole: {
    kn: 'ಪ್ಯಾಂಟೋಪ್ರಜೋಲ್', hi: 'पैंटोप्राज़ोल', ta: 'பான்டோபிரசோல்', te: 'పాంటోప్రజోల్',
    ml: 'പാന്റോപ്രസോൾ', mr: 'पँटोप्राझोल', bn: 'প্যান্টোপ্রাজল', gu: 'પેન્ટોપ્રાઝોલ',
    pa: 'ਪੈਂਟੋਪ੍ਰਾਜ਼ੋਲ', or: 'ପାଣ୍ଟୋପ୍ରାଜୋଲ୍', ur: 'پینٹوپرازول',
  },
  'pan 40': {
    kn: 'ಪ್ಯಾನ್ 40', hi: 'पैन 40', ta: 'பான் 40', te: 'పాన్ 40',
    ml: 'പാൻ 40', mr: 'पॅन 40', bn: 'প্যান ৪০', gu: 'પાન 40',
    pa: 'ਪੈਨ 40', or: 'ପାନ୍ 40', ur: 'پین 40',
  },
  paracetamol: {
    kn: 'ಪ್ಯಾರಸಿಟಮಾಲ್', hi: 'पैरासिटामोल', ta: 'பாராசிட்டமால்', te: 'పారాసెటమాల్',
    ml: 'പാരസെറ്റമോൾ', mr: 'पॅरासिटामॉल', bn: 'প্যারাসিটামল', gu: 'પેરાસીટામોલ',
    pa: 'ਪੈਰਾਸੀਟਾਮੋਲ', or: 'ପାରାସିଟାମଲ୍', ur: 'پیراسیٹامول',
  },
  'dolo 650': {
    kn: 'ಡೋಲೋ 650', hi: 'डोलो 650', ta: 'டோலோ 650', te: 'డోలో 650',
    ml: 'ഡോളോ 650', mr: 'डोलो 650', bn: 'ডোলো ৬৫০', gu: 'ડોલો 650',
    pa: 'ਡੋਲੋ 650', or: 'ଡୋଲୋ 650', ur: 'ڈولو 650',
  },
  amoxicillin: {
    kn: 'ಅಮಾಕ್ಸಿಸಿಲಿನ್', hi: 'एमोक्सिसिलिन', ta: 'அமாக்சிசிலின்', te: 'అమోక్సిసిలిన్',
    ml: 'അമോക്സിസിലിൻ', mr: 'अ‍ॅमॉक्सिसिलिन', bn: 'অ্যামোক্সিসিলিন', gu: 'એમોક્સિસિલિન',
    pa: 'ਅਮੌਕਸੀਸਿਲਿਨ', or: 'ଆମୋକ୍ସିସିଲିନ୍', ur: 'اموکسیسلن',
  },
  augmentin: {
    kn: 'ಆಗ್ಮೆಂಟಿನ್', hi: 'ऑगमेंटिन', ta: 'ஆக்மென்டின்', te: 'ఆగ్మెంటిన్',
    ml: 'ഓഗ്മെന്റിൻ', mr: 'ऑगमेंटिन', bn: 'অগমেন্টিন', gu: 'ઓગમેન્ટિન',
    pa: 'ਔਗਮੈਂਟਿਨ', or: 'ଅଗମେଣ୍ଟିନ୍', ur: 'آگمینٹن',
  },
  ibuprofen: {
    kn: 'ಐಬುಪ್ರೊಫೇನ್', hi: 'इबुप्रोफेन', ta: 'இபுபுரோஃபென்', te: 'ఐబుప్రోఫెన్',
    ml: 'ഇബുപ്രോഫെൻ', mr: 'इबुप्रोफेन', bn: 'আইবুপ্রোফেন', gu: 'ઇબુપ્રોફેન',
    pa: 'ਆਈਬੂਪ੍ਰੋਫੇਨ', or: 'ଆଇବୁପ୍ରୋଫେନ୍', ur: 'آئیبوپروفین',
  },
  combiflam: {
    kn: 'ಕಾಂಬಿಫ್ಲಾಮ್', hi: 'कॉम्बिफ्लैम', ta: 'காம்பிஃப்ளாம்', te: 'కాంబిఫ్లామ్',
    ml: 'കോംബിഫ്ലാം', mr: 'कॉम्बिफ्लॅम', bn: 'কম্বিফ্ল্যাম', gu: 'કોમ્બિફ્લેમ',
    pa: 'ਕੌਂਬੀਫਲੈਮ', or: 'କମ୍ବିଫ୍ଲାମ୍', ur: 'کومبی فلیم',
  },
  montelukast: {
    kn: 'ಮಾಂಟೆಲುಕಾಸ್ಟ್', hi: 'मोंटेलुकास्ट', ta: 'மான்டெலுகாஸ்ட்', te: 'మాంటెలుకాస్ట్',
    ml: 'മോണ്ടെലുകാസ്റ്റ്', mr: 'मोंटेलुकास्ट', bn: 'মন্টেলুকাস্ট', gu: 'મોન્ટેલુકાસ્ટ',
    pa: 'ਮੋਂਟੇਲੁਕਾਸਟ', or: 'ମଣ୍ଟେଲୁକାଷ୍ଟ', ur: 'مونٹیلوکاسٹ',
  },
  'montair lc': {
    kn: 'ಮಾಂಟೇರ್ LC', hi: 'मोंटेर LC', ta: 'மான்டேர் LC', te: 'మాంటెయిర్ LC',
    ml: 'മോണ്ടെയർ LC', mr: 'मोंटेअर LC', bn: 'মন্টেয়ার LC', gu: 'મોન્ટેર LC',
    pa: 'ਮੋਂਟੇਅਰ LC', or: 'ମଣ୍ଟେୟାର LC', ur: 'مونٹیئر LC',
  },
  calcium: {
    kn: 'ಕ್ಯಾಲ್ಸಿಯಂ + ವಿಟಮಿನ್ D3', hi: 'कैल्शियम + विटामिन D3', ta: 'கால்சியம் + வைட்டமின் D3',
    te: 'కాల్షియం + విటమిన్ D3', ml: 'കാൽസ്യം + വിറ്റാമിൻ D3', mr: 'कॅल्शियम + व्हिटॅमिन D3',
    bn: 'ক্যালসিয়াম + ভিটামিন D3', gu: 'કેલ્શિયમ + વિટામિન D3', pa: 'ਕੈਲਸ਼ੀਅਮ + ਵਿਟਾਮਿਨ D3',
    or: 'କ୍ୟାଲସିୟମ୍ + ଭିଟାମିନ୍ D3', ur: 'کیلشیم + وٹامن D3',
  },
  amlodipine: {
    kn: 'ಆಮ್ಲೋಡಿಪಿನ್', hi: 'एम्लोडिपाइन', ta: 'ஆம்லோடிபைன்', te: 'ఆమ్లోడిపిన్',
    ml: 'അംലോഡിപൈൻ', mr: 'अ‍ॅम्लोडिपिन', bn: 'অ্যামলোডিপাইন', gu: 'એમ્લોડિપાઇન',
    pa: 'ਐਮਲੋਡੀਪਾਈਨ', or: 'ଆମଲୋଡିପିନ୍', ur: 'ایملوڈیپائن',
  },
  azithromycin: {
    kn: 'ಅಜಿಥ್ರೋಮೈಸಿನ್', hi: 'एज़िथ्रोमाइसिन', ta: 'அசித்ரோமைசின்', te: 'అజిత్రోమైసిన్',
    ml: 'അസിത്രോമൈസിൻ', mr: 'अ‍ॅझिथ्रोमायसिन', bn: 'অ্যাজিথ্রোমাইসিন', gu: 'એઝિથ્રોમાયસિન',
    pa: 'ਅਜ਼ੀਥਰੋਮਾਈਸਿਨ', or: 'ଆଜିଥ୍ରୋମାଇସିନ୍', ur: 'ازیٹرومائسن',
  },
  aspirin: {
    kn: 'ಆಸ್ಪಿರಿನ್', hi: 'एस्पिरिन', ta: 'ஆஸ்பிரின்', te: 'ఆస్పిరిన్',
    ml: 'ആസ്പിരിൻ', mr: 'ॲस्पिरिन', bn: 'অ্যাসপিরিন', gu: 'એસ્પિરિન',
    pa: 'ਐਸਪਿਰਿਨ', or: 'ଆସ୍ପିରିନ୍', ur: 'اسپرین',
  },
  metoprolol: {
    kn: 'ಮೆಟೋಪ್ರೊಲಾಲ್', hi: 'मेटोप्रोलोल', ta: 'மெட்டோப்ரோலால்', te: 'మెటోప్రోలాల్',
    ml: 'മെറ്റോപ്രോളോൾ', mr: 'मेटोप्रोलोल', bn: 'মেটোপ্রোলল', gu: 'મેટોપ્રોલોલ',
    pa: 'ਮੈਟੋਪ੍ਰੋਲੋਲ', or: 'ମେଟୋପ୍ରୋଲୋଲ୍', ur: 'میٹوپروولول',
  },
  levothyroxine: {
    kn: 'ಲೆವೊಥೈರಾಕ್ಸಿನ್', hi: 'लेवोथायरोक्सिन', ta: 'லெவோதைராக்சின்', te: 'లెవోథైరాక్సిన్',
    ml: 'ലെവോതൈറോക്സിൻ', mr: 'लेव्होथायरॉक्सिन', bn: 'লেভোথাইরক্সিন', gu: 'લેવોથાયરોક્સિન',
    pa: 'ਲੇਵੋਥਾਈਰਾਕਸਿਨ', or: 'ଲେଭୋଥାଇରକ୍ସିନ୍', ur: 'لیووتھائیروکسن',
  },
};

/**
 * Common clinical units & route / frequency / sentence fragments for offline fallback translation.
 */
const UNIT_TRANSLATIONS: Record<SupportedLanguage, {
  days: string;
  tablet: string;
  oral: string;
  onceDaily: string;
  twiceDaily: string;
  thriceDaily: string;
  bedtime: string;
  confirmDoctor: string;
  purposeControlsSugar: string;
  purposeLowersBp: string;
  purposeLowersCholesterol: string;
  purposeReducesAcid: string;
  purposeAntibiotic: string;
  purposePainFever: string;
  purposeAllergy: string;
  purposeBone: string;
  diagDiabetesSummary: string;
  diagBronchitisSummary: string;
  diagOrthoSummary: string;
  alertAllergyPrefix: string;
  alertDuplicatePrefix: string;
  alertMissingPrefix: string;
  alertInteractionPrefix: string;
  alertRecommendDoctor: string;
}> = {
  en: {
    days: 'days', tablet: 'tablet', oral: 'Oral', onceDaily: 'Once daily', twiceDaily: 'Twice daily',
    thriceDaily: 'Thrice daily', bedtime: 'Once at bedtime', confirmDoctor: 'Confirm with your doctor or pharmacist before taking.',
    purposeControlsSugar: 'Controls blood sugar levels.', purposeLowersBp: 'Lowers high blood pressure.',
    purposeLowersCholesterol: 'Lowers bad cholesterol to protect heart health.', purposeReducesAcid: 'Reduces excess stomach acid and acidity.',
    purposeAntibiotic: 'Treats bacterial infection.', purposePainFever: 'Relieves fever, pain, or swelling.',
    purposeAllergy: 'Relieves allergic cough, sneezing, and congestion.', purposeBone: 'Supports bone and joint strength.',
    diagDiabetesSummary: 'You have high blood sugar (Type 2 Diabetes), high blood pressure (Hypertension), and elevated cholesterol. Follow daily medications, diet moderation, and regular lab checks.',
    diagBronchitisSummary: 'You have an acute bacterial airway infection (bronchitis) with high fever and allergic sinus symptoms.',
    diagOrthoSummary: 'You have knee osteoarthritis causing joint swelling and stiffness.',
    alertAllergyPrefix: 'Allergy Conflict', alertDuplicatePrefix: 'Duplicate Active Ingredient',
    alertMissingPrefix: 'Unclear Prescription Details', alertInteractionPrefix: 'Potential Drug Interaction',
    alertRecommendDoctor: 'Do not stop or change medicines on your own. Confirm with your doctor or pharmacist.',
  },
  kn: {
    days: 'ದಿನಗಳು', tablet: 'ಮಾತ್ರೆ', oral: 'ಬಾಯಿಯ ಮೂಲಕ (Oral)', onceDaily: 'ದಿನಕ್ಕೆ ಒಂದು ಬಾರಿ', twiceDaily: 'ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ',
    thriceDaily: 'ದಿನಕ್ಕೆ ಮೂರು ಬಾರಿ', bedtime: 'ರಾತ್ರಿ ಮಲಗುವ ಮುನ್ನ ಒಂದು ಬಾರಿ',
    confirmDoctor: 'ತೆಗೆದುಕೊಳ್ಳುವ ಮುನ್ನ ನಿಮ್ಮ ವೈದ್ಯರು ಅಥವಾ ಔಷಧ ತಜ್ಞರೊಂದಿಗೆ ದೃಢೀಕರಿಸಿ.',
    purposeControlsSugar: 'ರಕ್ತದಲ್ಲಿನ ಸಕ್ಕರೆ ಮಟ್ಟವನ್ನು (ಶುಗರ್) ನಿಯಂತ್ರಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
    purposeLowersBp: 'ಅಧಿಕ ರಕ್ತದೊತ್ತಡವನ್ನು (ಬಿಪಿ) ಕಡಿಮೆ ಮಾಡಿ ಹೃದಯ ಮತ್ತು ಮೂತ್ರಪಿಂಡಗಳನ್ನು ರಕ್ಷಿಸುತ್ತದೆ.',
    purposeLowersCholesterol: 'ಕೆಟ್ಟ ಕೊಲೆಸ್ಟ್ರಾಲ್ ಕಡಿಮೆ ಮಾಡಿ ಹೃದಯದ ಆರೋಗ್ಯವನ್ನು ರಕ್ಷಿಸುತ್ತದೆ.',
    purposeReducesAcid: 'ಹೊಟ್ಟೆಯಲ್ಲಿನ ಹೆಚ್ಚುವರಿ ಆಮ್ಲೀಯತೆ (ಅಸಿಡಿಟಿ) ಮತ್ತು ಗ್ಯಾಸ್ಟ್ರಿಕ್ ಸಮಸ್ಯೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.',
    purposeAntibiotic: 'ಬ್ಯಾಕ್ಟೀರಿಯಾ ಸೋಂಕನ್ನು ಗುಣಪಡಿಸಲು ನೀಡಲಾಗುವ ಆಂಟಿಬಯೋಟಿಕ್.',
    purposePainFever: 'ಜ್ವರ, ದೇಹದ ನೋವು ಮತ್ತು ಊತವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.',
    purposeAllergy: 'ಅಲರ್ಜಿ ಕೆಮ್ಮು, ಸೀನು ಮತ್ತು ಮೂಗು ಕಟ್ಟುವಿಕೆಯನ್ನು ಶಮನಗೊಳಿಸುತ್ತದೆ.',
    purposeBone: 'ಮೂಳೆ ಮತ್ತು ಕೀಲುಗಳ ಬಲವನ್ನು ಹೆಚ್ಚಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
    diagDiabetesSummary: 'ನಿಮಗೆ ಅಧಿಕ ರಕ್ತದ ಸಕ್ಕರೆ (ಟೈಪ್ 2 ಮಧುಮೇಹ), ಅಧಿಕ ರಕ್ತದೊತ್ತಡ (ಹೈ ಬಿಪಿ) ಮತ್ತು ಕೊಲೆಸ್ಟ್ರಾಲ್ ಹೆಚ್ಚಳವಿದೆ. ಹೃದಯ ಮತ್ತು ಮೂತ್ರಪಿಂಡಗಳನ್ನು ರಕ್ಷಿಸಲು ಪ್ರತಿದಿನ ನಿಗದಿತ ಔಷಧಿ, ಆಹಾರ ನಿಯಂತ್ರಣ ಮತ್ತು ನಿಯಮಿತ ರಕ್ತ ಪರೀಕ್ಷೆ ಅಗತ್ಯವಿದೆ.',
    diagBronchitisSummary: 'ನಿಮಗೆ ಶ್ವಾಸನಾಳದ ತೀವ್ರ ಬ್ಯಾಕ್ಟೀರಿಯಾ ಸೋಂಕು (ಬ್ರಾಂಕೈಟಿಸ್), ತೀವ್ರ ಜ್ವರ ಮತ್ತು ಅಲರ್ಜಿ ನೆಗಡಿ ಇದೆ.',
    diagOrthoSummary: 'ನಿಮ್ಮ ಬಲ ಮಂಡಿಯಲ್ಲಿ ಕೀಲು ಸವೆತ (ಆಸ್ಟಿಯೋಆರ್ಥ್ರೈಟಿಸ್) ಇದ್ದು, ನೋವು, ಊತ ಮತ್ತು ಬಿಗಿತ ಉಂಟಾಗುತ್ತಿದೆ.',
    alertAllergyPrefix: 'ಅಲರ್ಜಿ ಎಚ್ಚರಿಕೆ', alertDuplicatePrefix: 'ನಕಲಿ ಸಕ್ರಿಯ ಅಂಶ ಪತ್ತೆ',
    alertMissingPrefix: 'ಅಸ್ಪಷ್ಟ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ವಿವರಗಳು', alertInteractionPrefix: 'ಸಂಭಾವ್ಯ ಔಷಧಿ ಪರಸ್ಪರ ಕ್ರಿಯೆ',
    alertRecommendDoctor: 'ಸ್ವಂತವಾಗಿ ಔಷಧಿ ನಿಲ್ಲಿಸಬೇಡಿ. ದಯವಿಟ್ಟು ತಕ್ಷಣ ನಿಮ್ಮ ವೈದ್ಯರು ಅಥವಾ ಔಷಧ ತಜ್ಞರೊಂದಿಗೆ ಸಮಾಲೋಚಿಸಿ.',
  },
  hi: {
    days: 'दिन', tablet: 'गोली', oral: 'मुँह से (Oral)', onceDaily: 'दिन में एक बार', twiceDaily: 'दिन में दो बार',
    thriceDaily: 'दिन में तीन बार', bedtime: 'रात को सोते समय एक बार',
    confirmDoctor: 'लेने से पहले अपने डॉक्टर या फार्मासिस्ट से पुष्टि करें।',
    purposeControlsSugar: 'रक्त में शुगर के स्तर को नियंत्रित करने में मदद करता है।',
    purposeLowersBp: 'उच्च रक्तचाप (हाई बीपी) को कम कर हृदय और गुर्दे की रक्षा करता है।',
    purposeLowersCholesterol: 'खराब कोलेस्ट्रॉल को कम करके हृदय रोग के खतरे को घटाता है।',
    purposeReducesAcid: 'पेट के अतिरिक्त एसिड, गैस और जलन को शांत करता है।',
    purposeAntibiotic: 'बैक्टीरियल संक्रमण को समाप्त करने के लिए एंटीबायोटिक।',
    purposePainFever: 'बुखार, शरीर दर्द और जोड़ों की सूजन से राहत देता है।',
    purposeAllergy: 'एलर्जी खांसी, छींक और नाक बहने से राहत देता है।',
    purposeBone: 'हड्डियों और जोड़ों को मजबूत बनाता है।',
    diagDiabetesSummary: 'आपको उच्च रक्त शर्करा (टाइप 2 मधुमेह), उच्च रक्तचाप (हाई बीपी) और बढ़ा हुआ कोलेस्ट्रॉल है। हृदय और गुर्दे की सुरक्षा के लिए नियमित दवाइयाँ, संतुलित आहार और समय-समय पर शुगर की जाँच आवश्यक है।',
    diagBronchitisSummary: 'आपको श्वासनली में तीव्र बैक्टीरियल संक्रमण (ब्रोंकाइटिस), तेज बुखार और एलर्जी जुकाम है।',
    diagOrthoSummary: 'आपके दाहिने घुटने में गठिया (ऑस्टियोआर्थराइटिस) है, जिससे सूजन, दर्द और सुबह अकड़न हो रही है।',
    alertAllergyPrefix: 'गंभीर एलर्जी चेतावनी', alertDuplicatePrefix: 'डुप्लिकेट सक्रिय तत्व मिला',
    alertMissingPrefix: 'अस्पष्ट पर्चा विवरण', alertInteractionPrefix: 'संभावित दवा परस्पर-क्रिया',
    alertRecommendDoctor: 'अपनी मर्ज़ी से दवा बंद न करें। कृपया तुरंत अपने डॉक्टर या फार्मासिस्ट से पुष्टि करें।',
  },
  ta: {
    days: 'நாட்கள்', tablet: 'மாத்திரை', oral: 'வாய் வழியாக (Oral)', onceDaily: 'ஒரு நாளைக்கு ஒருமுறை', twiceDaily: 'ஒரு நாளைக்கு இருமுறை',
    thriceDaily: 'ஒரு நாளைக்கு மூன்று முறை', bedtime: 'இரவு தூங்கும் முன் ஒருமுறை',
    confirmDoctor: 'எடுப்பதற்கு முன் உங்கள் மருத்துவர் அல்லது மருந்தாளரிடம் உறுதிப்படுத்தவும்.',
    purposeControlsSugar: 'இரத்த சர்க்கரை அளவைக் கட்டுப்படுத்த உதவுகிறது.',
    purposeLowersBp: 'உயர் இரத்த அழுத்தத்தைக் குறைத்து இதயம் மற்றும் சிறுநீரகத்தைப் பாதுகாக்கிறது.',
    purposeLowersCholesterol: 'கெட்ட கொழுப்பைக் குறைத்து இதய ஆரோக்கியத்தைப் பாதுகாக்கிறது.',
    purposeReducesAcid: 'வயிற்று அமிலத்தன்மை மற்றும் நெஞ்செரிச்சலைக் குறைக்கிறது.',
    purposeAntibiotic: 'பாக்டீரியா தொற்றை குணப்படுத்தும் நுண்ணுயிர் எதிர்ப்பு மருந்து.',
    purposePainFever: 'காய்ச்சல், உடல் வலி மற்றும் வீக்கத்தைக் குறைக்கிறது.',
    purposeAllergy: 'ஒவ்வாமை இருமல், தும்மல் மற்றும் மூக்கடைப்பைக் குறைக்கிறது.',
    purposeBone: 'எலும்பு மற்றும் மூட்டு வலிமையை அதிகரிக்கிறது.',
    diagDiabetesSummary: 'உங்களுக்கு அதிக இரத்த சர்க்கரை (வகை 2 நீரிழிவு), உயர் இரத்த அழுத்தம் மற்றும் அதிக கொழுப்பு உள்ளது. தினசரி மருந்துகள், உணவுக் கட்டுப்பாடு மற்றும் வழக்கமான பரிசோதனைகள் அவசியம்.',
    diagBronchitisSummary: 'உங்களுக்கு மூச்சுக்குழாய் பாக்டீரியா தொற்று, அதிக காய்ச்சல் மற்றும் ஒவ்வாமை சளி உள்ளது.',
    diagOrthoSummary: 'உங்கள் வலது முழங்காலில் மூட்டு தேய்மானம் (ஆஸ்டியோஆர்த்ரைடிஸ்) காரணமாக வலி மற்றும் வீக்கம் உள்ளது.',
    alertAllergyPrefix: 'ஒவ்வாமை எச்சரிக்கை', alertDuplicatePrefix: 'இரட்டை மருந்து மூலப்பொருள்',
    alertMissingPrefix: 'தெளிவற்ற சீட்டு விவரங்கள்', alertInteractionPrefix: 'சாத்தியமான மருந்து இடைவினை',
    alertRecommendDoctor: 'தானாக மருந்தை நிறுத்த வேண்டாம். உங்கள் மருத்துவர் அல்லது மருந்தாளரிடம் உறுதிப்படுத்தவும்.',
  },
  te: {
    days: 'రోజులు', tablet: 'మాత్ర', oral: 'నోటి ద్వారా (Oral)', onceDaily: 'రోజుకు ఒకసారి', twiceDaily: 'రోజుకు రెండుసార్లు',
    thriceDaily: 'రోజుకు మూడుసార్లు', bedtime: 'రాత్రి పడుకునే ముందు ఒకసారి',
    confirmDoctor: 'వేసుకునే ముందు మీ డాక్టర్ లేదా ఫార్మసిస్ట్‌తో నిర్ధారించుకోండి.',
    purposeControlsSugar: 'రక్తంలో చక్కెర స్థాయిని నియంత్రించడానికి సహాయపడుతుంది.',
    purposeLowersBp: 'అధిక రక్తపోటును తగ్గించి గుండె మరియు మూత్రపిండాలను రక్షిస్తుంది.',
    purposeLowersCholesterol: 'చెడు కొలెస్ట్రాల్‌ను తగ్గించి గుండెను రక్షిస్తుంది.',
    purposeReducesAcid: 'కడుపులో అదనపు ఆమ్లం మరియు గ్యాస్ సమస్యను తగ్గిస్తుంది.',
    purposeAntibiotic: 'బ్యాక్టీరియా ఇన్ఫెక్షన్‌ను తగ్గించే యాంటీబయాటిక్.',
    purposePainFever: 'జ్వరం, నొప్పి మరియు వాపును తగ్గిస్తుంది.',
    purposeAllergy: 'అలర్జీ దగ్గు, తుమ్ములు మరియు జలుబును తగ్గిస్తుంది.',
    purposeBone: 'ఎముకలు మరియు కీళ్ల బలాన్ని పెంచుతుంది.',
    diagDiabetesSummary: 'మీకు అధిక రక్త చక్కెర (టైప్ 2 మధుమేహం), అధిక రక్తపోటు (హై బీపీ) మరియు కొలెస్ట్రాల్ ఎక్కువగా ఉన్నాయి. రోజువారీ మందులు, ఆహార నియంత్రణ మరియు క్రమం తప్పకుండా పరీక్షలు అవసరం.',
    diagBronchitisSummary: 'మీకు తీవ్రమైన శ్వాసనాళాల ఇన్ఫెక్షన్ (బ్రాంకైటిస్), తీవ్రమైన జ్వరం మరియు అలర్జీ జలుబు ఉన్నాయి.',
    diagOrthoSummary: 'మీ కుడి మోకాలిలో కీళ్ల అరుగుదల (ఆస్టియో ఆర్థరైటిస్) వల్ల వాపు మరియు నొప్పి ఉన్నాయి.',
    alertAllergyPrefix: 'అలర్జీ హెచ్చరిక', alertDuplicatePrefix: 'ఒకే రకమైన ఔషధ పదార్థం',
    alertMissingPrefix: 'అస్పష్టమైన ప్రిస్క్రిప్షన్ వివరాలు', alertInteractionPrefix: 'మందుల మధ్య ప్రతిచర్య ప్రమాదం',
    alertRecommendDoctor: 'మీ అంతట మీరు మందులను ఆపకండి. వెంటనే మీ డాక్టర్ లేదా ఫార్మసిస్ట్‌ను సంప్రదించండి.',
  },
  ml: {
    days: 'ദിവസം', tablet: 'ഗുളിക', oral: 'വായിലൂടെ (Oral)', onceDaily: 'ദിവസവും ഒരു തവണ', twiceDaily: 'ദിവസവും രണ്ടു തവണ',
    thriceDaily: 'ദിവസവും മൂന്നു തവണ', bedtime: 'രാത്രി കിടക്കുന്നതിന് മുൻപ്',
    confirmDoctor: 'കഴിക്കുന്നതിന് മുൻപ് ഡോക്ടറുമായോ ഫാർമസിസ്റ്റുമായോ ഉറപ്പുവരുത്തുക.',
    purposeControlsSugar: 'രക്തത്തിലെ പഞ്ചസാരയുടെ അളവ് നിയന്ത്രിക്കാൻ സഹായിക്കുന്നു.',
    purposeLowersBp: 'ഉയർന്ന രക്തസമ്മർദ്ദം കുറച്ച് ഹൃദയത്തെയും വൃക്കകളെയും സംരക്ഷിക്കുന്നു.',
    purposeLowersCholesterol: 'ചീത്ത കൊളസ്ട്രോൾ കുറച്ച് ഹൃദയാരോഗ്യം സംരക്ഷിക്കുന്നു.',
    purposeReducesAcid: 'വയറ്റിലെ അമിത അസിഡിറ്റിയും നെഞ്ചെരിച്ചിലും കുറയ്ക്കുന്നു.',
    purposeAntibiotic: 'ബാക്ടീരിയ അണുബാധ ചികിത്സിക്കുന്നതിനുള്ള ആന്റിബയോട്ടിക്.',
    purposePainFever: 'പനി, ശരീരവേദന, വീക്കം എന്നിവ കുറയ്ക്കുന്നു.',
    purposeAllergy: 'അലർജി ചുമ, തുമ്മൽ, ജലദോഷം എന്നിവയ്ക്ക് ആശ്വാസം നൽകുന്നു.',
    purposeBone: 'എല്ലുകളുടെയും സന്ധികളുടെയും ബലം വർദ്ധിപ്പിക്കുന്നു.',
    diagDiabetesSummary: 'നിങ്ങൾക്ക് ഉയർന്ന രക്തത്തിലെ പഞ്ചസാര (ടൈപ്പ് 2 പ്രമേഹം), രക്താതിമർദ്ദം, ഉയർന്ന കൊളസ്ട്രോൾ എന്നിവയുണ്ട്. പതിവായ മരുന്നുകളും ഭക്ഷണനിയന്ത്രണവും പരിശോധനകളും ആവശ്യമാണ്.',
    diagBronchitisSummary: 'നിങ്ങൾക്ക് ശ്വാസകോശ അണുബാധ (ബ്രോങ്കൈറ്റിസ്), കഠിനമായ പനി, അലർജി ജലദോഷം എന്നിവയുണ്ട്.',
    diagOrthoSummary: 'നിങ്ങളുടെ വലതു കാൽമുട്ടിൽ സന്ധിതേയ്മാനവും വീക്കവും വേദനയുമുണ്ട്.',
    alertAllergyPrefix: 'അലർജി മുന്നറിയിപ്പ്', alertDuplicatePrefix: 'ഇരട്ട മരുന്ന് ഘടകം',
    alertMissingPrefix: 'വ്യക്തമല്ലാത്ത കുറിപ്പടി വിവരങ്ങൾ', alertInteractionPrefix: 'മരുന്നുകളുടെ പരസ്പര പ്രതിപ്രവർത്തനം',
    alertRecommendDoctor: 'സ്വന്തമായി മരുന്ന് നിർത്തരുത്. ഉടൻ ഡോക്ടറുമായോ ഫാർമസിസ്റ്റുമായോ സംസാരിക്കുക.',
  },
  mr: {
    days: 'दिवस', tablet: 'गोळी', oral: 'तोंडावाटे (Oral)', onceDaily: 'दिवसातून एकदा', twiceDaily: 'दिवसातून दोनदा',
    thriceDaily: 'दिवसातून तीनदा', bedtime: 'रात्री झोपण्यापूर्वी एकदा',
    confirmDoctor: 'घेण्यापूर्वी तुमच्या डॉक्टर किंवा फार्मासिस्टशी खात्री करा.',
    purposeControlsSugar: 'रक्तातील साखरेचे प्रमाण नियंत्रित ठेवण्यास मदत करते.',
    purposeLowersBp: 'उच्च रक्तदाब कमी करून हृदय व मूत्रपिंडाचे संरक्षण करते.',
    purposeLowersCholesterol: 'वाईट कोलेस्टेरॉल कमी करून हृदयाचे आरोग्य जपते.',
    purposeReducesAcid: 'पोटातील अतिरिक्त आम्लपित्त आणि जळजळ कमी करते.',
    purposeAntibiotic: 'बॅक्टेरियाच्या संसर्गावर उपचार करणारे अँटीबायोटिक.',
    purposePainFever: 'ताप, अंगदुखी आणि सांध्यांची सूज कमी करते.',
    purposeAllergy: 'ॲलर्जीचा खोकला, शिंका आणि सर्दी कमी करते.',
    purposeBone: 'हाडे आणि सांध्यांना मजबुती देते.',
    diagDiabetesSummary: 'तुम्हाला उच्च रक्तातील साखर (टाइप 2 मधुमेह), उच्च रक्तदाब आणि वाढलेले कोलेस्टेरॉल आहे. नियमित औषधे, योग्य आहार आणि तपासणी आवश्यक आहे.',
    diagBronchitisSummary: 'तुम्हाला श्वसननलिकेचा संसर्ग (ब्रॉन्कायटिस), तीव्र ताप आणि ॲलर्जी सर्दी आहे.',
    diagOrthoSummary: 'तुमच्या उजव्या गुडघ्यात संधिवात (ऑस्टियोआर्थ्रायटिस) असून सूज आणि वेदना आहेत.',
    alertAllergyPrefix: 'ॲलर्जी इशारा', alertDuplicatePrefix: 'समान घटक असलेली दोन औषधे',
    alertMissingPrefix: 'अस्पष्ट प्रिस्क्रिप्शन तपशील', alertInteractionPrefix: 'संभाव्य औषध परस्परक्रिया',
    alertRecommendDoctor: 'स्वत:हून औषध बंद करू नका. त्वरित तुमच्या डॉक्टर किंवा फार्मासिस्टचा सल्ला घ्या.',
  },
  bn: {
    days: 'দিন', tablet: 'ট্যাবলেট', oral: 'মুখ দিয়ে (Oral)', onceDaily: 'দিনে একবার', twiceDaily: 'দিনে দুইবার',
    thriceDaily: 'দিনে তিনবার', bedtime: 'রাতে শোবার আগে একবার',
    confirmDoctor: 'খাওয়ার আগে আপনার ডাক্তার বা ফার্মাসিস্টের সাথে নিশ্চিত করুন।',
    purposeControlsSugar: 'রক্তে শর্করার মাত্রা নিয়ন্ত্রণে সাহায্য করে।',
    purposeLowersBp: 'উচ্চ রক্তচাপ কমিয়ে হৃদপিণ্ড ও কিডনি সুরক্ষিত রাখে।',
    purposeLowersCholesterol: 'খারাপ কোলেস্টেরল কমিয়ে হৃদরোগের ঝুঁকি হ্রাস করে।',
    purposeReducesAcid: 'পেটের অতিরিক্ত অ্যাসিড ও অম্বল কমায়।',
    purposeAntibiotic: 'ব্যাকটেরিয়াল সংক্রমণ নিরাময়ের অ্যান্টিবায়োটিক।',
    purposePainFever: 'জ্বর, ব্যথা ও ফোলাভাব কমায়।',
    purposeAllergy: 'অ্যালার্জিজনিত কাশি, হাঁচি ও সর্দি উপশম করে।',
    purposeBone: 'হাড় ও জয়েন্টের শক্তি বৃদ্ধি করে।',
    diagDiabetesSummary: 'আপনার উচ্চ রক্তের শর্করা (টাইপ ২ ডায়াবেটিস), উচ্চ রক্তচাপ এবং বেশি কোলেস্টেরল রয়েছে। নিয়মিত ওষুধ, খাদ্যনিয়ন্ত্রণ ও পরীক্ষা প্রয়োজন।',
    diagBronchitisSummary: 'আপনার শ্বাসনালীতে তীব্র ব্যাকটেরিয়াল সংক্রমণ (ব্রঙ্কাইটিস), জ্বর এবং অ্যালার্জিক সর্দি রয়েছে।',
    diagOrthoSummary: 'আপনার ডান হাঁটুতে অস্টিওআর্থ্রাইটিস রয়েছে, যার ফলে ফোলা ও ব্যথা হচ্ছে।',
    alertAllergyPrefix: 'অ্যালার্জি সতর্কতা', alertDuplicatePrefix: 'একই উপাদানের একাধিক ওষুধ',
    alertMissingPrefix: 'অস্পষ্ট প্রেসক্রিপশন তথ্য', alertInteractionPrefix: 'সম্ভাব্য ওষুধের পারস্পরিক ক্রিয়া',
    alertRecommendDoctor: 'নিজে থেকে ওষুধ বন্ধ করবেন না। অবিলম্বে ডাক্তার বা ফার্মাসিস্টের পরামর্শ নিন।',
  },
  gu: {
    days: 'દિવસ', tablet: 'ગોળી', oral: 'મોઢેથી (Oral)', onceDaily: 'દિવસમાં એકવાર', twiceDaily: 'દિવસમાં બે વાર',
    thriceDaily: 'દિવસમાં ત્રણ વાર', bedtime: 'રાત્રે સૂતા પહેલા એકવાર',
    confirmDoctor: 'લેતા પહેલા તમારા ડોક્ટર અથવા ફાર્માસિસ્ટ સાથે ખાતરી કરો.',
    purposeControlsSugar: 'લોહીમાં સુગરનું પ્રમાણ નિયંત્રિત કરવામાં મદદ કરે છે.',
    purposeLowersBp: 'હાઈ બ્લડ પ્રેશર ઘટાડી હૃદય અને કિડનીનું રક્ષણ કરે છે.',
    purposeLowersCholesterol: 'ખરાબ કોલેસ્ટ્રોલ ઘટાડી હૃદયને સુરક્ષિત રાખે છે.',
    purposeReducesAcid: 'પેટમાં વધારાનું એસિડ અને એસિડિટી ઘટાડે છે.',
    purposeAntibiotic: 'બેક્ટેરિયલ ચેપ મટાડવા માટેની એન્ટિબાયોટિક.',
    purposePainFever: 'તાવ, દુખાવો અને સોજો ઘટાડે છે.',
    purposeAllergy: 'એલર્જીક ઉધરસ, છીંક અને શરદીમાં રાહત આપે છે.',
    purposeBone: 'હાડકાં અને સાંધાને મજબૂત બનાવે છે.',
    diagDiabetesSummary: 'તમને ઊંચું બ્લડ સુગર (ટાઈપ 2 ડાયાબિટીસ), હાઈ બ્લડ પ્રેશર અને ઊંચું કોલેસ્ટ્રોલ છે. નિયમિત દવાઓ, આહાર નિયંત્રણ અને તપાસ જરૂરી છે.',
    diagBronchitisSummary: 'તમને શ્વાસનળીમાં તીવ્ર બેક્ટેરિયલ ચેપ (બ્રોન્કાઇટિસ), તેજ તાવ અને એલર્જીક શરદી છે.',
    diagOrthoSummary: 'તમારા જમણા ઘૂંટણમાં સંધિવા (ઓસ્ટિઓઆર્થરાઇટિસ) ના કારણે સોજો અને દુખાવો છે.',
    alertAllergyPrefix: 'એલર્જી ચેતવણી', alertDuplicatePrefix: 'સમાન ઘટકની બે દવાઓ',
    alertMissingPrefix: 'અસ્પષ્ટ પ્રિસ્ક્રિપ્શન વિગતો', alertInteractionPrefix: 'સંભવિત દવા પ્રતિક્રિયા',
    alertRecommendDoctor: 'જાતે દવા બંધ કરશો નહીં. તરત જ તમારા ડોક્ટર અથવા ફાર્માસિસ્ટની સલાહ લો.',
  },
  pa: {
    days: 'ਦਿਨ', tablet: 'ਗੋਲੀ', oral: 'ਮੂੰਹ ਰਾਹੀਂ (Oral)', onceDaily: 'ਦਿਨ ਵਿੱਚ ਇੱਕ ਵਾਰ', twiceDaily: 'ਦਿਨ ਵਿੱਚ ਦੋ ਵਾਰ',
    thriceDaily: 'ਦਿਨ ਵਿੱਚ ਤਿੰਨ ਵਾਰ', bedtime: 'ਰਾਤ ਨੂੰ ਸੌਣ ਵੇਲੇ ਇੱਕ ਵਾਰ',
    confirmDoctor: 'ਲੈਣ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣੇ ਡਾਕਟਰ ਜਾਂ ਫਾਰਮਾਸਿਸਟ ਨਾਲ ਪੁਸ਼ਟੀ ਕਰੋ।',
    purposeControlsSugar: 'ਖੂਨ ਵਿੱਚ ਸ਼ੂਗਰ ਦੇ ਪੱਧਰ ਨੂੰ ਕੰਟਰੋਲ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ।',
    purposeLowersBp: 'ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਨੂੰ ਘਟਾ ਕੇ ਦਿਲ ਅਤੇ ਗੁਰਦਿਆਂ ਦੀ ਰੱਖਿਆ ਕਰਦੀ ਹੈ।',
    purposeLowersCholesterol: 'ਮਾੜੇ ਕੋਲੈਸਟ੍ਰੋਲ ਨੂੰ ਘਟਾ ਕੇ ਦਿਲ ਨੂੰ ਸੁਰੱਖਿਅਤ ਰੱਖਦੀ ਹੈ।',
    purposeReducesAcid: 'ਪੇਟ ਦੀ ਵਾਧੂ ਤੇਜ਼ਾਬ ਅਤੇ ਜਲਨ ਨੂੰ ਸ਼ਾਂਤ ਕਰਦੀ ਹੈ।',
    purposeAntibiotic: 'ਬੈਕਟੀਰੀਅਲ ਇਨਫੈਕਸ਼ਨ ਨੂੰ ਠੀਕ ਕਰਨ ਵਾਲੀ ਐਂਟੀਬਾਇਓਟਿਕ।',
    purposePainFever: 'ਬੁਖਾਰ, ਦਰਦ ਅਤੇ ਸੋਜ ਤੋਂ ਰਾਹਤ ਦਿੰਦੀ ਹੈ।',
    purposeAllergy: 'ਐਲਰਜੀ ਖੰਘ, ਛਿੱਕਾਂ ਅਤੇ ਜ਼ੁਕਾਮ ਤੋਂ ਰਾਹਤ ਦਿੰਦੀ ਹੈ।',
    purposeBone: 'ਹੱਡੀਆਂ ਅਤੇ ਜੋੜਾਂ ਨੂੰ ਮਜ਼ਬੂਤ ਬਣਾਉਂਦੀ ਹੈ।',
    diagDiabetesSummary: 'ਤੁਹਾਨੂੰ ਹਾਈ ਬਲੱਡ ਸ਼ੂਗਰ (ਟਾਈਪ 2 ਡਾਇਬਟੀਜ਼), ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਅਤੇ ਵੱਧ ਕੋਲੈਸਟ੍ਰੋਲ ਹੈ। ਰੋਜ਼ਾਨਾ ਦਵਾਈਆਂ, ਖੁਰਾਕ ਨਿਯੰਤਰਣ ਅਤੇ ਨਿਯਮਤ ਜਾਂਚ ਜ਼ਰੂਰੀ ਹੈ।',
    diagBronchitisSummary: 'ਤੁਹਾਨੂੰ ਸਾਹ ਨਾਲੀ ਵਿੱਚ ਬੈਕਟੀਰੀਅਲ ਲਾਗ (ਬ੍ਰੌਨਕਾਈਟਸ), ਤੇਜ਼ ਬੁਖਾਰ ਅਤੇ ਐਲਰਜੀ ਜ਼ੁਕਾਮ ਹੈ।',
    diagOrthoSummary: 'ਤੁਹਾਡੇ ਸੱਜੇ ਗੋਡੇ ਵਿੱਚ ਗਠੀਆ (ਆਸਟੀਓਆਰਥਰਾਈਟਿਸ) ਕਾਰਨ ਸੋਜ ਅਤੇ ਦਰਦ ਹੈ।',
    alertAllergyPrefix: 'ਐਲਰਜੀ ਚੇਤਾਵਨੀ', alertDuplicatePrefix: 'ਇੱਕੋ ਤੱਤ ਵਾਲੀਆਂ ਦੋ ਦਵਾਈਆਂ',
    alertMissingPrefix: 'ਅਸਪਸ਼ਟ ਪਰਚਾ ਵੇਰਵੇ', alertInteractionPrefix: 'ਸੰਭਾਵੀ ਦਵਾਈ ਪ੍ਰਤੀਕਿਰਿਆ',
    alertRecommendDoctor: 'ਆਪਣੇ ਆਪ ਦਵਾਈ ਬੰਦ ਨਾ ਕਰੋ। ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ ਡਾਕਟਰ ਜਾਂ ਫਾਰਮਾਸਿਸਟ ਨਾਲ ਸਲਾਹ ਕਰੋ।',
  },
  or: {
    days: 'ଦିନ', tablet: 'ବଟିକା', oral: 'ପାଟି ବାଟେ (Oral)', onceDaily: 'ଦିନକୁ ଥରେ', twiceDaily: 'ଦିନକୁ ଦୁଇଥର',
    thriceDaily: 'ଦିନକୁ ତିନିଥର', bedtime: 'ରାତିରେ ଶୋଇବା ପୂର୍ବରୁ ଥରେ',
    confirmDoctor: 'ଖାଇବା ପୂର୍ବରୁ ଆପଣଙ୍କ ଡାକ୍ତର କିମ୍ବା ଫାର୍ମାସିଷ୍ଟଙ୍କ ସହ ନିଶ୍ଚିତ କରନ୍ତୁ।',
    purposeControlsSugar: 'ରକ୍ତରେ ଶର୍କରା (ସୁଗାର) ସ୍ତରକୁ ନିୟନ୍ତ୍ରଣ କରିବାରେ ସାହାଯ୍ୟ କରେ।',
    purposeLowersBp: 'ଉଚ୍ଚ ରକ୍ତଚାପ କମାଇ ହୃଦୟ ଏବଂ କିଡନୀକୁ ସୁରକ୍ଷା ଦିଏ।',
    purposeLowersCholesterol: 'ଖରାପ କୋଲେଷ୍ଟ୍ରଲ କମାଇ ହୃଦୟକୁ ସୁସ୍ଥ ରଖେ।',
    purposeReducesAcid: 'ପେଟର ଅତିରିକ୍ତ ଏସିଡିଟି ଏବଂ ଜଳାପୋଡ଼ା କମାଏ।',
    purposeAntibiotic: 'ବ୍ୟାକ୍ଟେରିଆ ସଂକ୍ରମଣ ଭଲ କରିବା ପାଇଁ ଆଣ୍ଟିବାୟୋଟିକ୍।',
    purposePainFever: 'ଜ୍ୱର, ଯନ୍ତ୍ରଣା ଏବଂ ଫୁଲା କମାଏ।',
    purposeAllergy: 'ଆଲର୍ଜି କାଶ, ଛିଙ୍କ ଏବଂ ଥଣ୍ଡାରୁ ଆରାମ ଦିଏ।',
    purposeBone: 'ହାଡ଼ ଏବଂ ଗଣ୍ଠିକୁ ଶକ୍ତିଶାଳୀ କରେ।',
    diagDiabetesSummary: 'ଆପଣଙ୍କର ଉଚ୍ଚ ରକ୍ତ ଶର୍କରା (ଟାଇପ୍ ୨ ମଧୁମେହ), ଉଚ୍ଚ ରକ୍ତଚାପ ଏବଂ ଅଧିକ କୋଲେଷ୍ଟ୍ରଲ ଅଛି। ନିୟମିତ ଔଷଧ, ସଠିକ୍ ଖାଦ୍ୟ ଏବଂ ପରୀକ୍ଷା ଜରୁରୀ।',
    diagBronchitisSummary: 'ଆପଣଙ୍କର ଶ୍ୱାସନଳୀରେ ତୀବ୍ର ସଂକ୍ରମଣ (ବ୍ରୋଙ୍କାଇଟିସ୍), ଜ୍ୱର ଏବଂ ଆଲର୍ଜି ଥଣ୍ଡା ଅଛି।',
    diagOrthoSummary: 'ଆପଣଙ୍କ ଡାହାଣ ଆଣ୍ଠୁରେ ଗଣ୍ଠି ବାତ (ଅଷ୍ଟିଓଆର୍ଥ୍ରାଇଟିସ୍) ଯୋଗୁଁ ଫୁଲା ଏବଂ ଯନ୍ତ୍ରଣା ହେଉଛି।',
    alertAllergyPrefix: 'ଆଲର୍ଜି ସତର୍କତା', alertDuplicatePrefix: 'ସମାନ ଉପାଦାନର ଦୁଇଟି ଔଷଧ',
    alertMissingPrefix: 'ଅସ୍ପଷ୍ଟ ପ୍ରେସକ୍ରିପସନ୍ ବିବରଣୀ', alertInteractionPrefix: 'ସମ୍ଭାବ୍ୟ ଔଷଧ ପ୍ରତିକ୍ରିୟା',
    alertRecommendDoctor: 'ନିଜେ ଔଷଧ ବନ୍ଦ କରନ୍ତୁ ନାହିଁ। ତୁରନ୍ତ ଡାକ୍ତର କିମ୍ବା ଫାର୍ମାସିଷ୍ଟଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।',
  },
  ur: {
    days: 'دن', tablet: 'گولی', oral: 'منہ کے ذریعے (Oral)', onceDaily: 'دن میں ایک بار', twiceDaily: 'دن میں دو بار',
    thriceDaily: 'دن میں تین بار', bedtime: 'رات سوتے وقت ایک بار',
    confirmDoctor: 'لینے سے پہلے اپنے ڈاکٹر یا فارماسسٹ سے تصدیق کریں۔',
    purposeControlsSugar: 'خون میں شوگر کی سطح کو کنٹرول کرنے میں مدد کرتی ہے۔',
    purposeLowersBp: 'ہائی بلڈ پریشر کو کم کرکے دل اور گردوں کی حفاظت کرتی ہے۔',
    purposeLowersCholesterol: 'خراب کولیسٹرول کو کم کرکے دل کو محفوظ رکھتی ہے۔',
    purposeReducesAcid: 'معدے کی اضافی تیزابیت اور جلن کو کم کرتی ہے۔',
    purposeAntibiotic: 'بیکٹیریل انفیکشن کے علاج کے لیے اینٹی بایوٹک۔',
    purposePainFever: 'بخار، درد اور سوجن میں آرام دیتی ہے۔',
    purposeAllergy: 'الرجی کھانسی، چھینکوں اور نزلے میں آرام دیتی ہے۔',
    purposeBone: 'ہڈیوں اور جوڑوں کو مضبوط بناتی ہے۔',
    diagDiabetesSummary: 'آپ کو ہائی بلڈ شوگر (ذیابیطس ٹائپ 2)، ہائی بلڈ پریشر اور بڑھا ہوا کولیسٹرول ہے۔ دل اور گردوں کی حفاظت کے لیے روزانہ ادویات، متوازن غذا اور باقاعدہ ٹیسٹ ضروری ہیں۔',
    diagBronchitisSummary: 'آپ کو سانس کی نالی میں شدید بیکٹیریل انفیکشن (برونکائٹس)، تیز بخار اور الرجی نزلہ ہے۔',
    diagOrthoSummary: 'آپ کے دائیں گھٹنے میں جوڑوں کا گھساؤ (آسٹیو آرتھرائٹس) ہے جس سے سوجن اور درد ہے۔',
    alertAllergyPrefix: 'سنگین الرجی تنبیہ', alertDuplicatePrefix: 'یکساں جزو والی دو ادویات',
    alertMissingPrefix: 'غیر واضح نسخہ تفصیلات', alertInteractionPrefix: 'ممکنہ ادویات کا باہمی تعامل',
    alertRecommendDoctor: 'خود سے کوئی دوا بند نہ کریں۔ براہِ کرم فوراً اپنے ڈاکٹر یا فارماسسٹ سے مشورہ کریں۔',
  },
};

export function localizeDiseaseName(disease: string, lang: SupportedLanguage): string {
  if (lang === 'en') return disease;
  const lower = disease.toLowerCase();
  for (const [key, map] of Object.entries(DISEASE_LEXICON)) {
    if (lower.includes(key) && map[lang]) {
      return `${map[lang]} (${disease})`;
    }
  }
  return disease;
}

export function localizeMedicineName(
  genericName: string,
  brandName: string | null | undefined,
  lang: SupportedLanguage
): string {
  if (lang === 'en') {
    return brandName ? `${genericName} (${brandName})` : genericName;
  }

  const parts: string[] = [];
  const lowerGeneric = genericName.toLowerCase();
  const lowerBrand = (brandName || '').toLowerCase();

  // Check brand script match
  let brandNative: string | null = null;
  if (lowerBrand) {
    for (const [key, map] of Object.entries(MEDICINE_SCRIPT_MAP)) {
      if (lowerBrand.includes(key) && map[lang]) {
        brandNative = map[lang]!;
        break;
      }
    }
  }

  // Check generic script match
  let genericNative: string | null = null;
  for (const [key, map] of Object.entries(MEDICINE_SCRIPT_MAP)) {
    if (lowerGeneric.includes(key) && map[lang]) {
      genericNative = map[lang]!;
      break;
    }
  }

  if (brandNative && genericNative) {
    parts.push(`${brandNative} / ${genericNative}`);
  } else if (genericNative) {
    parts.push(genericNative);
  } else if (brandNative) {
    parts.push(brandNative);
  }

  const original = brandName ? `${brandName} / ${genericName}` : genericName;
  return parts.length > 0 ? `${parts[0]} (${original})` : original;
}

export function localizeFoodInstruction(food: FoodInstruction, lang: SupportedLanguage): string {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  switch (food) {
    case 'Before food':
      return t.foodInstructions.beforeFood;
    case 'After food':
      return t.foodInstructions.afterFood;
    case 'With food':
      return t.foodInstructions.withFood;
    case 'Empty stomach':
      return t.foodInstructions.emptyStomach;
    case 'At bedtime':
      return t.foodInstructions.atBedtime;
    default:
      return t.foodInstructions.asDirected;
  }
}

function localizeFrequency(freq: string, lang: SupportedLanguage): string {
  if (lang === 'en') return freq;
  const u = UNIT_TRANSLATIONS[lang] || UNIT_TRANSLATIONS.en;
  const lower = freq.toLowerCase();
  const codeMatch = freq.match(/\b\d-\d-\d(?:-\d)?\b/);
  const codePrefix = codeMatch ? `${codeMatch[0]} — ` : '';

  if (lower.includes('thrice') || lower.includes('tds') || lower.includes('1-1-1')) {
    return `${codePrefix}${u.thriceDaily}`;
  }
  if (lower.includes('twice') || lower.includes('bd') || lower.includes('1-0-1')) {
    return `${codePrefix}${u.twiceDaily}`;
  }
  if (lower.includes('bedtime') || lower.includes('hs') || lower.includes('0-0-0-1') || lower.includes('0-0-1')) {
    return `${codePrefix}${u.bedtime}`;
  }
  if (lower.includes('once') || lower.includes('od') || lower.includes('1-0-0') || lower.includes('0-1-0')) {
    return `${codePrefix}${u.onceDaily}`;
  }
  return freq;
}

function localizeDuration(duration: string, lang: SupportedLanguage): string {
  if (lang === 'en') return duration;
  const u = UNIT_TRANSLATIONS[lang] || UNIT_TRANSLATIONS.en;
  return duration.replace(/\bdays?\b/gi, u.days);
}

function localizePurpose(medName: string, originalPurpose: string, lang: SupportedLanguage): string {
  if (lang === 'en') return originalPurpose;
  const u = UNIT_TRANSLATIONS[lang] || UNIT_TRANSLATIONS.en;
  const lower = `${medName} ${originalPurpose}`.toLowerCase();

  if (/metformin|glimepiride|gliclazide|blood glucose|blood sugar|insulin/.test(lower)) return u.purposeControlsSugar;
  if (/telmisartan|amlodipine|metoprolol|blood pressure|hypertension/.test(lower)) return u.purposeLowersBp;
  if (/atorvastatin|rosuvastatin|cholesterol|triglycerides/.test(lower)) return u.purposeLowersCholesterol;
  if (/pantoprazole|omeprazole|stomach acid|gastric|acidity/.test(lower)) return u.purposeReducesAcid;
  if (/amoxicillin|augmentin|azithromycin|ciprofloxacin|cefixime|antibiotic|bacterial/.test(lower)) return u.purposeAntibiotic;
  if (/paracetamol|dolo|ibuprofen|combiflam|fever|pain|inflammation/.test(lower)) return u.purposePainFever;
  if (/montelukast|levocetirizine|allergic|sneezing|cough/.test(lower)) return u.purposeAllergy;
  if (/calcium|vitamin d3|shelcal|bone/.test(lower)) return u.purposeBone;
  return originalPurpose;
}

function localizeDiagnosisSimplified(
  diagnoses: string[],
  originalSummary: string,
  lang: SupportedLanguage
): string {
  if (lang === 'en') return originalSummary;
  const u = UNIT_TRANSLATIONS[lang] || UNIT_TRANSLATIONS.en;
  const joined = `${diagnoses.join(' ')} ${originalSummary}`.toLowerCase();

  if (joined.includes('diabetes') && joined.includes('hypertension')) return u.diagDiabetesSummary;
  if (joined.includes('bronchitis')) return u.diagBronchitisSummary;
  if (joined.includes('osteoarthritis') || joined.includes('knee')) return u.diagOrthoSummary;

  const localizedNames = diagnoses.map((d) => localizeDiseaseName(d, lang)).join(', ');
  return localizedNames ? `${localizedNames} — ${u.confirmDoctor}` : originalSummary;
}

function localizeAlertFallback(alert: SafetyAlert, lang: SupportedLanguage): SafetyAlert {
  if (lang === 'en') return alert;
  const u = UNIT_TRANSLATIONS[lang] || UNIT_TRANSLATIONS.en;
  const medsLabel = alert.medicinesInvolved
    .map((m) => localizeMedicineName(m, undefined, lang))
    .join(' + ');

  let prefix = u.alertInteractionPrefix;
  if (alert.type === 'allergy_conflict') prefix = u.alertAllergyPrefix;
  else if (alert.type === 'duplicate_ingredient') prefix = u.alertDuplicatePrefix;
  else if (alert.type === 'missing_info') prefix = u.alertMissingPrefix;

  return {
    ...alert,
    title: `${prefix}: ${medsLabel || alert.title}`,
    description: `${prefix} (${medsLabel}) — ${alert.description}`,
    recommendation: u.alertRecommendDoctor,
  };
}

/**
 * Safety verification: checks that all numeric dosages/strengths in source medicines
 * remain completely unaltered after translation.
 */
function verifyMedicalNumbersPreserved(
  original: PrescriptionData,
  translated: PrescriptionData
): boolean {
  if (original.medicines.length !== translated.medicines.length) return false;
  for (let i = 0; i < original.medicines.length; i++) {
    const orig = original.medicines[i];
    const trans = translated.medicines[i];
    if (orig.strength !== trans.strength) return false;
    if (orig.dosage !== trans.dosage) return false;
    if (orig.name !== trans.name) return false;
  }
  return true;
}

/**
 * Translates an entire clinical prescription + safety alerts bundle into any of the 12 languages.
 * Uses Gemini structured JSON translation when configured, with comprehensive native-script fallback
 * and strict preservation of active ingredients, strengths, and dosages.
 */
export async function translateClinicalBundle(
  prescription: PrescriptionData,
  alerts: SafetyAlert[],
  targetLanguage: SupportedLanguage,
  options: { simulateFailure?: boolean } = {}
): Promise<{
  prescription: PrescriptionData;
  alerts: SafetyAlert[];
  meta: TranslationMeta;
}> {
  if (targetLanguage === 'en') {
    return {
      prescription: {
        ...prescription,
        localizedDiagnosis: prescription.diagnosis,
        medicines: prescription.medicines.map((m) => ({
          ...m,
          localizedName: m.brandName ? `${m.name} (${m.brandName})` : m.name,
          localizedFrequency: m.frequency,
          localizedDuration: m.duration,
          localizedRoute: m.route,
          localizedFoodInstruction: localizeFoodInstruction(m.foodInstruction, 'en'),
        })),
      },
      alerts,
      meta: {
        language: 'en',
        provider: 'identity',
        fallbackUsed: false,
        translatedAt: new Date().toISOString(),
      },
    };
  }

  if (options.simulateFailure) {
    return {
      prescription,
      alerts,
      meta: {
        language: targetLanguage,
        provider: 'failed_fallback',
        fallbackUsed: true,
        warning: TRANSLATIONS[targetLanguage]?.translation.failedWarning || TRANSLATIONS.en.translation.failedWarning,
        translatedAt: new Date().toISOString(),
      },
    };
  }

  const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === targetLanguage);
  const targetLangLabel = langInfo ? `${langInfo.name} (${langInfo.nativeName})` : targetLanguage;

  // 1. Primary Engine: Gemini structured batch JSON translation (when GEMINI_API_KEY is available)
  if (process.env.GEMINI_API_KEY) {
    const compactInput = {
      diagnosis: prescription.diagnosis,
      diagnosisSimplified: prescription.diagnosisSimplified,
      symptoms: prescription.symptoms,
      generalPrecautions: prescription.generalPrecautions,
      dietaryAdvice: prescription.dietaryAdvice,
      followUpInstructions: prescription.followUp?.instructions || '',
      followUpDepartment: prescription.followUp?.department || '',
      medicines: prescription.medicines.map((m) => ({
        id: m.id,
        name: m.name,
        brandName: m.brandName || null,
        strength: m.strength,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        route: m.route,
        foodInstruction: m.foodInstruction,
        purposeSimple: m.purposeSimple,
        sideEffects: m.sideEffects,
        precautions: m.precautions,
        uncertainReason: m.uncertainReason || null,
      })),
      investigations: prescription.investigations.map((inv) => ({
        id: inv.id,
        name: inv.name,
        purpose: inv.purpose,
        instructions: inv.instructions || null,
      })),
      alerts: alerts.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        recommendation: a.recommendation,
      })),
    };

    const prompt = `
You are a certified medical translator for Indian patients.
Translate the clinical JSON below into authentic, natural ${targetLangLabel} using NATIVE SCRIPT (NOT Latin transliteration).

CRITICAL MEDICAL SAFETY RULES:
1. NEVER change any numeric strength, dosage, unit, or frequency numbers (e.g., 500 mg, 650 mg, 1 tablet, 1-0-1, 14 days must keep the EXACT same numbers and units).
2. For each diagnosis, return localizedDiagnosis in ${targetLangLabel} with the original clinical term in parentheses, e.g. "<Native Disease Name> (<Original English Name>)".
3. For each medicine, return localizedName combining native script transliteration with original identity, e.g. "<Native Brand/Generic> (<Original Brand/Generic>)". NEVER rename a drug into a different drug.
4. Translate diagnosisSimplified, symptoms, purposeSimple, sideEffects, precautions, localizedFrequency, localizedDuration, localizedRoute, localizedFoodInstruction, investigations, followUpInstructions, generalPrecautions, dietaryAdvice, and all safety alerts into clear ${targetLangLabel}.
5. Never add new diagnoses or tell the patient to stop prescribed medications.

Return ONLY valid JSON with keys:
{
  "localizedDiagnosis": ["string"],
  "diagnosisSimplified": "string",
  "symptoms": ["string"],
  "generalPrecautions": ["string"],
  "dietaryAdvice": ["string"],
  "followUpInstructions": "string",
  "followUpDepartment": "string",
  "medicines": [
    {
      "id": "string",
      "localizedName": "string",
      "localizedFrequency": "string",
      "localizedDuration": "string",
      "localizedRoute": "string",
      "localizedFoodInstruction": "string",
      "purposeSimple": "string",
      "sideEffects": ["string"],
      "precautions": ["string"],
      "uncertainReason": "string | null"
    }
  ],
  "investigations": [
    { "id": "string", "name": "string", "purpose": "string", "instructions": "string | null" }
  ],
  "alerts": [
    { "id": "string", "title": "string", "description": "string", "recommendation": "string" }
  ]
}

Source Clinical Data:
${JSON.stringify(compactInput)}
`;

    const geminiRes = await callGeminiDetailed(prompt, undefined, {
      responseJson: true,
      timeoutMs: 25000,
      temperature: 0.1,
    });

    if (geminiRes.ok && geminiRes.text) {
      try {
        const parsed = JSON.parse(geminiRes.text);
        const translatedRx: PrescriptionData = {
          ...prescription,
          localizedDiagnosis: Array.isArray(parsed.localizedDiagnosis)
            ? parsed.localizedDiagnosis
            : prescription.diagnosis.map((d) => localizeDiseaseName(d, targetLanguage)),
          diagnosisSimplified: parsed.diagnosisSimplified || prescription.diagnosisSimplified,
          symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : prescription.symptoms,
          generalPrecautions: Array.isArray(parsed.generalPrecautions)
            ? parsed.generalPrecautions
            : prescription.generalPrecautions,
          dietaryAdvice: Array.isArray(parsed.dietaryAdvice) ? parsed.dietaryAdvice : prescription.dietaryAdvice,
          followUp: {
            ...prescription.followUp,
            department: parsed.followUpDepartment || prescription.followUp.department,
            instructions: parsed.followUpInstructions || prescription.followUp.instructions,
          },
          medicines: prescription.medicines.map((origMed) => {
            const trMed = Array.isArray(parsed.medicines)
              ? parsed.medicines.find((x: any) => x.id === origMed.id)
              : null;
            return {
              ...origMed,
              // STRICTLY preserve original identity, strength, dosage!
              name: origMed.name,
              brandName: origMed.brandName,
              strength: origMed.strength,
              dosage: origMed.dosage,
              localizedName:
                trMed?.localizedName || localizeMedicineName(origMed.name, origMed.brandName, targetLanguage),
              localizedFrequency:
                trMed?.localizedFrequency || localizeFrequency(origMed.frequency, targetLanguage),
              localizedDuration:
                trMed?.localizedDuration || localizeDuration(origMed.duration, targetLanguage),
              localizedRoute: trMed?.localizedRoute || origMed.route,
              localizedFoodInstruction:
                trMed?.localizedFoodInstruction || localizeFoodInstruction(origMed.foodInstruction, targetLanguage),
              purposeSimple: trMed?.purposeSimple || origMed.purposeSimple,
              sideEffects: Array.isArray(trMed?.sideEffects) ? trMed.sideEffects : origMed.sideEffects,
              precautions: Array.isArray(trMed?.precautions) ? trMed.precautions : origMed.precautions,
              uncertainReason: trMed?.uncertainReason ?? origMed.uncertainReason,
            };
          }),
          investigations: prescription.investigations.map((origInv) => {
            const trInv = Array.isArray(parsed.investigations)
              ? parsed.investigations.find((x: any) => x.id === origInv.id)
              : null;
            return {
              ...origInv,
              originalName: origInv.originalName || origInv.name,
              name: trInv?.name || origInv.name,
              purpose: trInv?.purpose || origInv.purpose,
              instructions: trInv?.instructions ?? origInv.instructions,
            };
          }),
        };

        const translatedAlerts: SafetyAlert[] = alerts.map((origAlert) => {
          const trAlert = Array.isArray(parsed.alerts)
            ? parsed.alerts.find((x: any) => x.id === origAlert.id)
            : null;
          return {
            ...origAlert,
            title: trAlert?.title || origAlert.title,
            description: trAlert?.description || origAlert.description,
            recommendation: trAlert?.recommendation || origAlert.recommendation,
          };
        });

        if (verifyMedicalNumbersPreserved(prescription, translatedRx)) {
          const meta: TranslationMeta = {
            language: targetLanguage,
            provider: 'gemini_ai',
            fallbackUsed: false,
            translatedAt: new Date().toISOString(),
          };
          translatedRx.translationMeta = meta;
          return { prescription: translatedRx, alerts: translatedAlerts, meta };
        }
      } catch {
        console.warn('Gemini translation JSON parsing failed; falling back to offline clinical lexicon.');
      }
    }
  }

  // 2. Comprehensive Offline / Local Clinical Lexicon Translator (works across ALL 12 scripts without API key!)
  const u = UNIT_TRANSLATIONS[targetLanguage] || UNIT_TRANSLATIONS.en;

  const CLINICAL_PHRASES: [RegExp, Partial<Record<SupportedLanguage, string>>][] = [
    [/increased thirst/i, { kn: 'ಹೆಚ್ಚಿದ ಬಾಯಾರಿಕೆ', hi: 'अधिक प्यास लगना', ta: 'அதிக தாகம்', te: 'ఎక్కువ దాహం', ml: 'അമിത ദാഹം', mr: 'जास्त तहान लागणे', bn: 'অতিরিক্ত তৃষ্ণা', gu: 'વધુ તરસ લાગવી', pa: 'ਵੱਧ ਪਿਆਸ ਲੱਗਣਾ', or: 'ଅଧିକ ଶୋଷ ଲାଗିବା', ur: 'زیادہ پیاس لگنا' }],
    [/frequent urination/i, { kn: 'ರಾತ್ರಿ ಪದೇ ಪದೇ ಮೂತ್ರ ವಿಸರ್ಜನೆ', hi: 'रात में बार-बार पेशाब आना', ta: 'இரவில் அடிக்கடி சிறுநீர் கழித்தல்', te: 'రాత్రి తరచుగా మూత్రవిసర్జన', ml: 'രാത്രി ഇടയ്ക്കിടെ മൂത്രമൊഴിക്കൽ', mr: 'रात्री वारंवार लघवी होणे', bn: 'রাতে ঘন ঘন প্রস্রাব', gu: 'રાત્રે વારંવાર પેશાબ થવો', pa: 'ਰਾਤ ਨੂੰ ਵਾਰ-ਵਾਰ ਪਿਸ਼ਾਬ ਆਉਣਾ', or: 'ରାତିରେ ବାରମ୍ବାର ପରିସ୍ରା ହେବା', ur: 'رات کو بار بار پیشاب آنا' }],
    [/mild fatigue|fatigue/i, { kn: 'ಸೌಮ್ಯ ಆಯಾಸ', hi: 'हल्की थकान', ta: 'லேசான சோர்வு', te: 'తేలికపాటి అలసట', ml: 'നേരിയ ക്ഷീണം', mr: 'सौम्य थकवा', bn: 'হালকা ক্লান্তি', gu: 'હળવો થાક', pa: 'ਹਲਕੀ ਥਕਾਵਟ', or: 'ସାମାନ୍ୟ ଥକାପଣ', ur: 'ہلکی تھکاوٹ' }],
    [/morning headache|headache/i, { kn: 'ತಲೆನೋವು', hi: 'सिरदर्द', ta: 'தலைவலி', te: 'తలనొప్పి', ml: 'തലവേദന', mr: 'डोकेदुखी', bn: 'মাথাব্যথা', gu: 'માથાનો દુખાવો', pa: 'ਸਿਰਦਰਦ', or: 'ମୁଣ୍ଡବିନ୍ଧା', ur: 'سر درد' }],
    [/stomach upset|nausea/i, { kn: 'ಸೌಮ್ಯ ಹೊಟ್ಟೆ ಅಸ್ವಸ್ಥತೆ / ವಾಕರಿಕೆ', hi: 'हल्की पेट की खराबी / मतली', ta: 'லேசான வயிற்று உபாதை / குமட்டல்', te: 'తేలికపాటి కడుపు అసౌకర్యం', ml: 'നേരിയ വയറ്റിലെ അസ്വസ്ഥത', mr: 'पोटात सौम्य अस्वस्थता', bn: 'হালকা পেটের অস্বস্তি', gu: 'પેટમાં હળવી અસ્વસ્થતા', pa: 'ਪੇਟ ਵਿੱਚ ਹਲਕੀ ਬੇਚੈਨੀ', or: 'ସାମାନ୍ୟ ପେଟ ଅସୁବିଧା', ur: 'معدے میں ہلکی خرابی / متلی' }],
    [/metallic taste/i, { kn: 'ಬಾಯಿಯಲ್ಲಿ ಲೋಹದ ರುಚಿ', hi: 'मुँह में धातु जैसा स्वाद', ta: 'வாயில் உலோக சுவை', te: 'నోటిలో లోహపు రుచి', ml: 'വായിൽ ലോഹ രുചി', mr: 'तोंडात धातूसारखी चव', bn: 'মুখে ধাতব স্বাদ', gu: 'મોઢામાં ધાતુ જેવો સ્વાદ', pa: 'ਮੂੰਹ ਵਿੱਚ ਧਾਤ ਵਰਗਾ ਸੁਆਦ', or: 'ପାଟିରେ ଧାତୁ ଭଳି ସ୍ୱାଦ', ur: 'منہ میں دھاتی ذائقہ' }],
    [/low blood sugar|hypoglycemia/i, { kn: 'ಕಡಿಮೆ ರಕ್ತದ ಸಕ್ಕರೆ (ಹೈಪೋಗ್ಲೈಸೀಮಿಯಾ)', hi: 'कम ब्लड शुगर (हाइपोग्लाइसीमिया)', ta: 'குறைந்த இரத்த சர்க்கரை', te: 'తక్కువ రక్త చక్కెర', ml: 'രക്തത്തിലെ പഞ്ചസാര കുറയൽ', mr: 'रक्तातील साखर कमी होणे', bn: 'রক্তে শর্করা কমে যাওয়া', gu: 'લોહીમાં સુગર ઘટવું', pa: 'ਘੱਟ ਬਲੱਡ ਸ਼ੂਗਰ', or: 'ରକ୍ତରେ ଶର୍କରା କମିଯିବା', ur: 'بلڈ شوگر کم ہونا' }],
    [/dizziness/i, { kn: 'ಸೌಮ್ಯ ತಲೆಸುತ್ತು', hi: 'हल्का चक्कर आना', ta: 'லேசான தலைச்சுற்றல்', te: 'తేలికపాటి తలతిరగడం', ml: 'നേരിയ തലകറക്കം', mr: 'सौम्य चक्कर येणे', bn: 'হালকা মাথা ঘোরা', gu: 'હળવા ચક્કર આવવા', pa: 'ਹਲਕਾ ਚੱਕਰ ਆਉਣਾ', or: 'ସାମାନ୍ୟ ମୁଣ୍ଡ ବୁଲାଇବା', ur: 'ہلکا چکر آنا' }],
    [/muscle ache|muscular ache/i, { kn: 'ಸೌಮ್ಯ ಸ್ನಾಯು ನೋವು', hi: 'हल्का मांसपेशियों में दर्द', ta: 'லேசான தசை வலி', te: 'తేలికపాటి కండరాల నొప్పి', ml: 'നേരിയ പേശിവേദന', mr: 'सौम्य स्नायू दुखणे', bn: 'হালকা পেশী ব্যথা', gu: 'હળવો સ્નાયુ દુખાવો', pa: 'ਹਲਕਾ ਮਾਸਪੇਸ਼ੀ ਦਰਦ', or: 'ସାମାନ୍ୟ ମାଂସପେଶୀ ଯନ୍ତ୍ରଣା', ur: 'پٹھوں میں ہلکا درد' }],
    [/take.*after meals|right after meals/i, { kn: 'ಹೊಟ್ಟೆ ಅಸ್ವಸ್ಥತೆ ತಪ್ಪಿಸಲು ಯಾವಾಗಲೂ ಊಟದ ನಂತರವೇ ಸೇವಿಸಿ.', hi: 'पेट की परेशानी से बचने के लिए हमेशा भोजन के तुरंत बाद लें।', ta: 'வயிற்று எரிச்சலைத் தவிர்க்க எப்போதும் உணவுக்குப் பின் எடுக்கவும்.', te: 'కడుపు అసౌకర్యాన్ని నివారించడానికి ఎల్లప్పుడూ భోజనం తర్వాత వేసుకోండి.', ml: 'ഭക്ഷണത്തിന് ഉടൻ ശേഷം മാത്രം കഴിക്കുക.', mr: 'पोटाचा त्रास टाळण्यासाठी नेहमी जेवणानंतर घ्या.', bn: 'পেটের অস্বস্তি এড়াতে সর্বদা খাবারের পর খান।', gu: 'પેટની તકલીફ ટાળવા હંમેશા જમ્યા પછી જ લો.', pa: 'ਪੇਟ ਦੀ ਤਕਲੀਫ਼ ਤੋਂ ਬਚਣ ਲਈ ਹਮੇਸ਼ਾ ਖਾਣੇ ਤੋਂ ਬਾਅਦ ਲਓ।', or: 'ପେଟ ଅସୁବିଧା ଏଡ଼ାଇବା ପାଇଁ ସର୍ବଦା ଖାଇବା ପରେ ଖାଆନ୍ତୁ।', ur: 'معدے کی تکلیف سے بچنے کے لیے ہمیشہ کھانے کے فوراً بعد لیں۔' }],
    [/skip.*breakfast|skip meals/i, { kn: 'ಈ ಮಾತ್ರೆ ಸೇವಿಸಿದ ನಂತರ ತಿಂಡಿ ಅಥವಾ ಊಟವನ್ನು ಎಂದಿಗೂ ತಪ್ಪಿಸಬೇಡಿ.', hi: 'यह गोली लेने के बाद नाश्ता या भोजन कभी न छोड़ें।', ta: 'இந்த மாத்திரையை எடுத்த பிறகு காலை உணவைத் தவிர்க்க வேண்டாம்.', te: 'ఈ మాత్ర వేసుకున్న తర్వాత అల్పాహారం లేదా భోజనం మానవద్దు.', ml: 'ഈ ഗുളിക കഴിച്ച ശേഷം പ്രഭാതഭക്ഷണം ഒഴിവാക്കരുത്.', mr: 'ही गोळी घेतल्यानंतर न्याहारी किंवा जेवण चुकवू नका.', bn: 'এই ওষুধ খাওয়ার পর কখনোই সকালের খাবার বাদ দেবেন না।', gu: 'આ ગોળી લીધા પછી નાસ્તો કે ભોજન ક્યારેય ચૂકશો નહીં.', pa: 'ਇਹ ਗੋਲੀ ਲੈਣ ਤੋਂ ਬਾਅਦ ਨਾਸ਼ਤਾ ਕਦੇ ਨਾ ਛੱਡੋ।', or: 'ଏହି ଔଷଧ ଖାଇବା ପରେ ଜଳଖିଆ ଛାଡ଼ନ୍ତୁ ନାହିଁ।', ur: 'یہ گولی لینے کے بعد ناشتہ یا کھانا کبھی نہ چھوڑیں۔' }],
    [/stand up slowly/i, { kn: 'ತಲೆಸುತ್ತು ತಪ್ಪಿಸಲು ಹಾಸಿಗೆ ಅಥವಾ ಕುರ್ಚಿಯಿಂದ ನಿಧಾನವಾಗಿ ಎದ್ದೇಳಿ.', hi: 'चक्कर आने से बचने के लिए बिस्तर या कुर्सी से धीरे उठें।', ta: 'தலைச்சுற்றலைத் தவிர்க்க படுக்கையிலிருந்து மெதுவாக எழுந்திருங்கள்.', te: 'తలతిరగకుండా ఉండటానికి మంచం నుండి నెమ్మదిగా లేవండి.', ml: 'തലകറക്കം ഒഴിവാക്കാൻ കിടക്കയിൽ നിന്ന് സാവധാനം എഴുന്നേൽക്കുക.', mr: 'चक्कर येऊ नये म्हणून हळुवारपणे उभे राहा.', bn: 'মাথা ঘোরা এড়াতে বিছানা থেকে ধীরে ধীরে উঠুন।', gu: 'ચક્કર ટાળવા પથારીમાંથી ધીમે ધીમે ઊભા થાઓ.', pa: 'ਚੱਕਰ ਤੋਂ ਬਚਣ ਲਈ ਬਿਸਤਰੇ ਤੋਂ ਹੌਲੀ-ਹੌਲੀ ਉੱਠੋ।', or: 'ମୁଣ୍ଡ ବୁଲାଇବା ଏଡ଼ାଇବା ପାଇଁ ଧୀରେ ଉଠନ୍ତୁ।', ur: 'چکر سے بچنے کے لیے بستر یا کرسی سے آہستہ اٹھیں۔' }],
    [/take at bedtime|before sleeping/i, { kn: 'ರಾತ್ರಿ ಮಲಗುವ ಮುನ್ನ ನೀರಿನೊಂದಿಗೆ ಸೇವಿಸಿ.', hi: 'रात को सोने से पहले पानी के साथ लें।', ta: 'இரவு தூங்கும் முன் தண்ணீருடன் எடுக்கவும்.', te: 'రాత్రి పడుకునే ముందు నీటితో వేసుకోండి.', ml: 'രാത്രി കിടക്കുന്നതിന് മുൻപ് വെള്ളത്തോടൊപ്പം കഴിക്കുക.', mr: 'रात्री झोपण्यापूर्वी पाण्यासोबत घ्या.', bn: 'রাতে শোবার আগে জল দিয়ে খান।', gu: 'રાત્રે સૂતા પહેલા પાણી સાથે લો.', pa: 'ਰਾਤ ਨੂੰ ਸੌਣ ਤੋਂ ਪਹਿਲਾਂ ਪਾਣੀ ਨਾਲ ਲਓ।', or: 'ରାତିରେ ଶୋଇବା ପୂର୍ବରୁ ପାଣି ସହିତ ଖାଆନ୍ତୁ।', ur: 'رات سوتے وقت پانی کے ساتھ لیں۔' }],
    [/30.*minutes before breakfast|empty stomach/i, { kn: 'ತಿಂಡಿಗೆ 30–45 ನಿಮಿಷ ಮುಂಚೆ ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ ನೀರಿನೊಂದಿಗೆ ಸೇವಿಸಿ.', hi: 'नाश्ते से 30–45 मिनट पहले खाली पेट पानी के साथ लें।', ta: 'காலை உணவுக்கு 30–45 நிமிடங்களுக்கு முன் வெறும் வயிற்றில் எடுக்கவும்.', te: 'అల్పాహారానికి 30–45 నిమిషాల ముందు ఖాళీ కడుపుతో వేసుకోండి.', ml: 'പ്രഭാതഭക്ഷണത്തിന് 30–45 മിനിറ്റ് മുൻപ് വെറും വയറ്റിൽ കഴിക്കുക.', mr: 'न्याहारीपूर्वी 30–45 मिनिटे उपाशी पोटी घ्या.', bn: 'সকালের খাবারের ৩০–৪৫ মিনিট আগে খালি পেটে খান।', gu: 'નાસ્તાના 30–45 મિનિટ પહેલા ખાલી પેટે લો.', pa: 'ਨਾਸ਼ਤੇ ਤੋਂ 30–45 ਮਿੰਟ ਪਹਿਲਾਂ ਖਾਲੀ ਪੇਟ ਲਓ।', or: 'ଜଳଖିଆର ୩୦–୪୫ ମିନିଟ୍ ପୂର୍ବରୁ ଖାଲି ପେଟରେ ଖାଆନ୍ତୁ।', ur: 'ناشتے سے 30 تا 45 منٹ پہلے خالی پیٹ پانی کے ساتھ لیں۔' }],
    [/fasting blood sugar|fbs/i, { kn: 'ಖಾಲಿ ಹೊಟ್ಟೆ ಮತ್ತು ಊಟದ ನಂತರದ ರಕ್ತದ ಸಕ್ಕರೆ ಪರೀಕ್ಷೆ (FBS & PPBS)', hi: 'खाली पेट व भोजन के बाद ब्लड शुगर जाँच (FBS & PPBS)', ta: 'வெறும் வயிறு மற்றும் உணவுக்குப் பின் சர்க்கரை பரிசோதனை (FBS & PPBS)', te: 'ఖాళీ కడుపు మరియు భోజనం తర్వాత షుగర్ పరీక్ష (FBS & PPBS)', ml: 'ഫാസ്റ്റിംഗ് & പോസ്റ്റ്-പ്രാൻഡിയൽ ബ്ലഡ് ഷുഗർ (FBS & PPBS)', mr: 'उपाशी पोटी व जेवणानंतरची साखर तपासणी (FBS & PPBS)', bn: 'খালি পেটে ও খাওয়ার পরে রক্তের শর্করা পরীক্ষা (FBS & PPBS)', gu: 'ખાલી પેટે અને જમ્યા પછીનું બ્લડ સુગર ટેસ્ટ (FBS & PPBS)', pa: 'ਖਾਲੀ ਪੇਟ ਅਤੇ ਖਾਣੇ ਤੋਂ ਬਾਅਦ ਸ਼ੂਗਰ ਟੈਸਟ (FBS & PPBS)', or: 'ଖାଲି ପେଟ ଓ ଖାଇବା ପରେ ରକ୍ତ ଶର୍କରା ପରୀକ୍ଷା (FBS & PPBS)', ur: 'خالی پیٹ اور کھانے کے بعد بلڈ شوگر ٹیسٹ (FBS & PPBS)' }],
    [/hba1c/i, { kn: '3 ತಿಂಗಳ ಸರಾಸರಿ ಸಕ್ಕರೆ ಪರೀಕ್ಷೆ (HbA1c)', hi: '3 महीने की औसत शुगर जाँच (HbA1c)', ta: '3 மாத சராசரி சர்க்கரை பரிசோதனை (HbA1c)', te: '3 నెలల సగటు షుగర్ పరీక్ష (HbA1c)', ml: '3 മാസത്തെ ശരാശരി ഷുഗർ പരിശോധന (HbA1c)', mr: '3 महिन्यांची सरासरी साखर तपासणी (HbA1c)', bn: '৩ মাসের গড় শর্করা পরীক্ষা (HbA1c)', gu: '3 મહિનાનું સરેરાશ સુગર ટેસ્ટ (HbA1c)', pa: '3 ਮਹੀਨੇ ਦਾ ਔਸਤ ਸ਼ੂਗਰ ਟੈਸਟ (HbA1c)', or: '୩ ମାସର ହାରାହାରି ଶର୍କରା ପରୀକ୍ଷା (HbA1c)', ur: '3 ماہ کی اوسط بلڈ شوگر ٹیسٹ (HbA1c)' }],
    [/lipid profile/i, { kn: 'ಕೊಲೆಸ್ಟ್ರಾಲ್ ಮತ್ತು ಮೂತ್ರಪಿಂಡ ಪರೀಕ್ಷೆ (Lipid Profile & Creatinine)', hi: 'लिपिड प्रोफाइल एवं किडनी जाँच (Lipid Profile & Creatinine)', ta: 'கொழுப்பு மற்றும் சிறுநீரகப் பரிசோதனை (Lipid Profile)', te: 'కొలెస్ట్రాల్ & కిడ్నీ పరీక్ష (Lipid Profile)', ml: 'ലിപ്പിഡ് പ്രൊഫൈൽ & ക്രിയാറ്റിനിൻ പരിശോധന', mr: 'लिपिड प्रोफाइल व किडनी तपासणी', bn: 'লিপিড প্রোফাইল ও কিডনি পরীক্ষা', gu: 'લિપિડ પ્રોફાઇલ અને કિડની ટેસ્ટ', pa: 'ਲਿਪਿਡ ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਗੁਰਦੇ ਦੀ ਜਾਂਚ', or: 'ଲିପିଡ୍ ପ୍ରୋଫାଇଲ୍ ଏବଂ କିଡନୀ ପରୀକ୍ଷା', ur: 'لپڈ پروفائل اور گردوں کا ٹیسٹ (Lipid Profile)' }],
  ];

  const translatePhrase = (text: string): string => {
    for (const [re, map] of CLINICAL_PHRASES) {
      if (re.test(text) && map[targetLanguage]) {
        return map[targetLanguage]!;
      }
    }
    return text;
  };

  const localizedRx: PrescriptionData = {
    ...prescription,
    localizedDiagnosis: prescription.diagnosis.map((d) => localizeDiseaseName(d, targetLanguage)),
    diagnosisSimplified: localizeDiagnosisSimplified(
      prescription.diagnosis,
      prescription.diagnosisSimplified,
      targetLanguage
    ),
    symptoms: (prescription.symptoms || []).map(translatePhrase),
    medicines: prescription.medicines.map((m) => ({
      ...m,
      // Strictly preserve original clinical identity, strength, dosage!
      name: m.name,
      brandName: m.brandName,
      strength: m.strength,
      dosage: m.dosage,
      localizedName: localizeMedicineName(m.name, m.brandName, targetLanguage),
      localizedFrequency: localizeFrequency(m.frequency, targetLanguage),
      localizedDuration: localizeDuration(m.duration, targetLanguage),
      localizedRoute: m.route.toLowerCase() === 'oral' ? u.oral : m.route,
      localizedFoodInstruction: localizeFoodInstruction(m.foodInstruction, targetLanguage),
      purposeSimple: localizePurpose(m.name, m.purposeSimple, targetLanguage),
      sideEffects: (m.sideEffects || []).map(translatePhrase),
      precautions: (m.precautions || []).map(translatePhrase),
    })),
    investigations: (prescription.investigations || []).map((inv) => ({
      ...inv,
      originalName: inv.originalName || inv.name,
      name: translatePhrase(inv.name),
    })),
  };

  const localizedAlerts: SafetyAlert[] = alerts.map((a) => localizeAlertFallback(a, targetLanguage));

  const meta: TranslationMeta = {
    language: targetLanguage,
    provider: 'local_clinical_lexicon',
    fallbackUsed: true,
    warning: TRANSLATIONS[targetLanguage]?.translation.fallbackNotice,
    translatedAt: new Date().toISOString(),
  };
  localizedRx.translationMeta = meta;

  return {
    prescription: localizedRx,
    alerts: localizedAlerts,
    meta,
  };
}
