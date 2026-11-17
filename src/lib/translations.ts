import type { DossierLanguage } from './types';

type TranslationKey = keyof typeof translations.en;

const translations = {
  en: {
    // App
    app_name: 'ProofDesk',
    app_tagline: 'Clarity before commitment.',
    demo_banner: 'Demonstration Mode — All data shown is fictional and illustrative.',

    // Language names
    lang_en: 'English',
    lang_hi: 'हिंदी',
    lang_te: 'తెలుగు',

    // Nav
    nav_dashboard: 'Dashboard',
    nav_leads: 'Leads',
    nav_evidence: 'Evidence Library',
    nav_volunteers: 'Peer Volunteers',
    nav_analytics: 'Analytics',

    // Dashboard
    dash_title: 'Growth Operations',
    dash_stalled: 'Stalled Leads',
    dash_dossiers_generated: 'Dossiers Generated',
    dash_dossiers_delivered: 'Dossiers Delivered',
    dash_peer_calls_requested: 'Peer Calls Requested',
    dash_peer_calls_booked: 'Peer Calls Booked',
    dash_seat_block: 'Seat-Block Payments',
    dash_verification_issues: 'Verification Issues',
    dash_funnel_title: 'Conversion Funnel',
    dash_recent_activity: 'Recent Activity',

    // Leads
    leads_title: 'Lead Management',
    leads_search: 'Search leads…',
    leads_student: 'Student',
    leads_parent: 'Parent',
    leads_university: 'University',
    leads_city: 'City',
    leads_language: 'Language',
    leads_status: 'Status',
    leads_days_since: 'Days Since Counselling',
    leads_seat_block: 'Seat-Block',
    leads_dossier: 'Dossier',
    leads_last_interaction: 'Last Interaction',
    leads_generate_dossier: 'Generate Dossier',
    leads_view_dossier: 'View Dossier',
    leads_share_dossier: 'Share Dossier',

    // Lead Status Labels
    status_new: 'New',
    status_counselling_scheduled: 'Counselling Scheduled',
    status_counselling_completed: 'Counselling Completed',
    status_stalled: 'Stalled',
    status_dossier_generated: 'Dossier Generated',
    status_dossier_delivered: 'Dossier Delivered',
    status_peer_call_requested: 'Peer Call Requested',
    status_peer_call_booked: 'Peer Call Booked',
    status_seat_block_paid: 'Seat-Block Paid',
    status_enrolled: 'Enrolled',
    status_opted_out: 'Opted Out',

    // Evidence
    evidence_title: 'University Evidence Library',
    evidence_subtitle: 'Source-linked verification records for Noida International University',
    evidence_category: 'Category',
    evidence_claim: 'Claim',
    evidence_source: 'Source',
    evidence_status: 'Status',
    evidence_checked: 'Last Checked',
    evidence_explanation: 'Explanation',

    // Evidence Status
    ev_verified: 'Verified',
    ev_not_verified: 'Not Yet Verified',
    ev_not_proven: 'Not Yet Proven',
    ev_conflicting: 'Conflicting Evidence',

    // Evidence Categories
    cat_identity: 'University Identity & Establishment',
    cat_ugc: 'UGC Recognition',
    cat_naac: 'NAAC Accreditation',
    cat_statutory: 'Statutory Approvals',
    cat_niat: 'NIAT–University Collaboration',
    cat_degree: 'Degree-Awarding Institution',
    cat_program: 'Academic Program & Curriculum',
    cat_fees: 'Fee Structure',
    cat_payment: 'Payment Responsibilities',
    cat_refund: 'Refund & Cancellation',
    cat_outcomes: 'Student Outcomes & Placements',

    // Dossier
    dossier_title: "Your University's Facts, Verified.",
    dossier_generated: 'Dossier generated on',
    dossier_verified: 'Last verification on',
    dossier_intro: 'This report brings together official information about the university, its degree-awarding authority, applicable approvals, financial responsibilities and available student outcomes. It separates verified facts from information that still needs confirmation.',
    dossier_coverage: 'Evidence Coverage',

    dossier_s1_title: 'Who Awards the Degree?',
    dossier_s2_title: 'University Recognition & Approvals',
    dossier_s3_title: 'Who Gets Paid What?',
    dossier_s3_refund: 'Refund & Cancellation Conditions',
    dossier_s3_unavailable: 'Not yet verified. Please obtain the official written fee and refund schedule before making payment.',
    dossier_s4_title: 'Proven vs. Not Yet Proven',
    dossier_s4_proven: 'Proven',
    dossier_s4_not_proven: 'Not Yet Proven',
    dossier_s5_title: 'Questions Every Parent Should Ask',
    dossier_s6_title: 'Speak to a Current Parent or Student',
    dossier_s6_description: 'Connect with someone familiar with this university and the NIAT program. All volunteer profiles are verified and have given their explicit consent.',
    dossier_request_call: 'Request a Conversation',
    dossier_call_requested: 'Conversation Requested',

    // Financial table headers
    fin_item: 'Item',
    fin_institution: 'Responsible Institution',
    fin_amount: 'Amount',
    fin_evidence: 'Evidence',

    // Sharing
    share_whatsapp: 'Share on WhatsApp',
    share_copy_link: 'Copy Dossier Link',
    share_copy_message: 'Copy WhatsApp Message',
    share_preview: 'Preview Dossier',
    share_message_template: 'Namaste {parentName} ji, we have prepared a detailed university verification report for {studentName}\'s admission to {universityName}. This report contains verified facts, fee information, and answers to important questions. Please review it here: {dossierUrl}',

    // Peer
    peer_volunteer: 'Volunteer',
    peer_role: 'Role',
    peer_university: 'University',
    peer_language: 'Language',
    peer_city: 'City',
    peer_available: 'Available',
    peer_unavailable: 'Unavailable',
    peer_demo_label: '(Simulated demonstration profile)',

    // Analytics
    analytics_title: 'Growth Analytics',
    analytics_experiment: 'A/B Experiment',
    analytics_control: 'Control Group',
    analytics_test: 'Test Group (ProofDesk)',
    analytics_awaiting: 'Awaiting experiment data.',
    analytics_call_booking: 'Call-Booking Rate',
    analytics_seat_block: 'Seat-Block Conversion',
    analytics_opt_out: 'Opt-Out Rate',
    analytics_complaint: 'Complaint Rate',
    analytics_pp_diff: 'pp difference',

    // Actions
    action_generate: 'Generate',
    action_generating: 'Generating…',
    action_view: 'View',
    action_share: 'Share',
    action_close: 'Close',
    action_back: 'Back',
    action_retry: 'Retry',

    // Errors
    error_api_unavailable: 'The AI service is temporarily unavailable. Please try again.',
    error_no_evidence: 'No evidence records found for this university.',
    error_generation_failed: 'Dossier generation failed. Please retry or contact support.',
    error_supabase_not_configured: 'Database connection is not configured. Running in demo mode with sample data.',

    // Parent questions
    question_1: 'Which institution will issue my child\'s degree, and what will the degree certificate state?',
    question_2: 'Can I obtain the complete fee breakdown — university tuition, NIAT upskilling fee, registration and all other charges — in writing before making any payment?',
    question_3: 'What are the exact refund conditions if my child decides to withdraw, and are these conditions documented in the admission agreement?',
    question_4: 'Which placement statistics relate specifically to NIAT students at this university, and how can I verify them?',
    question_5: 'What happens if the university\'s arrangement with NIAT changes or is discontinued during my child\'s degree?',
  },

  hi: {
    app_name: 'ProofDesk',
    app_tagline: 'प्रतिबद्धता से पहले स्पष्टता।',
    demo_banner: 'प्रदर्शन मोड — दिखाया गया सभी डेटा काल्पनिक और उदाहरणात्मक है।',

    lang_en: 'English',
    lang_hi: 'हिंदी',
    lang_te: 'తెలుగు',

    nav_dashboard: 'डैशबोर्ड',
    nav_leads: 'लीड्स',
    nav_evidence: 'साक्ष्य लाइब्रेरी',
    nav_volunteers: 'पीयर वॉलंटियर',
    nav_analytics: 'एनालिटिक्स',

    dash_title: 'ग्रोथ ऑपरेशन्स',
    dash_stalled: 'रुकी हुई लीड्स',
    dash_dossiers_generated: 'डोज़ियर बनाए गए',
    dash_dossiers_delivered: 'डोज़ियर भेजे गए',
    dash_peer_calls_requested: 'पीयर कॉल अनुरोध',
    dash_peer_calls_booked: 'पीयर कॉल बुक',
    dash_seat_block: 'सीट-ब्लॉक भुगतान',
    dash_verification_issues: 'सत्यापन समस्याएं',
    dash_funnel_title: 'कन्वर्शन फ़नल',
    dash_recent_activity: 'हालिया गतिविधि',

    leads_title: 'लीड प्रबंधन',
    leads_search: 'लीड खोजें…',
    leads_student: 'छात्र',
    leads_parent: 'अभिभावक',
    leads_university: 'विश्वविद्यालय',
    leads_city: 'शहर',
    leads_language: 'भाषा',
    leads_status: 'स्थिति',
    leads_days_since: 'काउंसलिंग के बाद दिन',
    leads_seat_block: 'सीट-ब्लॉक',
    leads_dossier: 'डोज़ियर',
    leads_last_interaction: 'अंतिम संपर्क',
    leads_generate_dossier: 'डोज़ियर बनाएं',
    leads_view_dossier: 'डोज़ियर देखें',
    leads_share_dossier: 'डोज़ियर शेयर करें',

    status_new: 'नया',
    status_counselling_scheduled: 'काउंसलिंग शेड्यूल',
    status_counselling_completed: 'काउंसलिंग पूर्ण',
    status_stalled: 'रुका हुआ',
    status_dossier_generated: 'डोज़ियर बनाया गया',
    status_dossier_delivered: 'डोज़ियर भेजा गया',
    status_peer_call_requested: 'पीयर कॉल अनुरोध',
    status_peer_call_booked: 'पीयर कॉल बुक',
    status_seat_block_paid: 'सीट-ब्लॉक भुगतान',
    status_enrolled: 'नामांकित',
    status_opted_out: 'ऑप्ट आउट',

    evidence_title: 'विश्वविद्यालय साक्ष्य लाइब्रेरी',
    evidence_subtitle: 'नोएडा इंटरनेशनल यूनिवर्सिटी के लिए स्रोत-सम्बद्ध सत्यापन रिकॉर्ड',
    evidence_category: 'श्रेणी',
    evidence_claim: 'दावा',
    evidence_source: 'स्रोत',
    evidence_status: 'स्थिति',
    evidence_checked: 'अंतिम जांच',
    evidence_explanation: 'स्पष्टीकरण',

    ev_verified: 'सत्यापित',
    ev_not_verified: 'अभी सत्यापित नहीं',
    ev_not_proven: 'अभी प्रमाणित नहीं',
    ev_conflicting: 'विरोधाभासी साक्ष्य',

    cat_identity: 'विश्वविद्यालय पहचान और स्थापना',
    cat_ugc: 'UGC मान्यता',
    cat_naac: 'NAAC मान्यांकन',
    cat_statutory: 'वैधानिक अनुमोदन',
    cat_niat: 'NIAT-विश्वविद्यालय सहयोग',
    cat_degree: 'डिग्री प्रदाता संस्थान',
    cat_program: 'शैक्षणिक कार्यक्रम और पाठ्यक्रम',
    cat_fees: 'शुल्क संरचना',
    cat_payment: 'भुगतान दायित्व',
    cat_refund: 'रिफ़ंड और रद्दीकरण',
    cat_outcomes: 'छात्र परिणाम और प्लेसमेंट',

    dossier_title: 'आपके विश्वविद्यालय के तथ्य, सत्यापित।',
    dossier_generated: 'डोज़ियर बनाने की तिथि',
    dossier_verified: 'अंतिम सत्यापन तिथि',
    dossier_intro: 'यह रिपोर्ट विश्वविद्यालय, उसकी डिग्री-प्रदान करने की शक्ति, लागू अनुमोदनों, वित्तीय दायित्वों और उपलब्ध छात्र परिणामों के बारे में आधिकारिक जानकारी एकत्र करती है। यह सत्यापित तथ्यों को उन सूचनाओं से अलग करती है जिनकी अभी पुष्टि होनी बाकी है।',
    dossier_coverage: 'साक्ष्य कवरेज',

    dossier_s1_title: 'डिग्री कौन देता है?',
    dossier_s2_title: 'विश्वविद्यालय मान्यता और अनुमोदन',
    dossier_s3_title: 'किसे कितना भुगतान होता है?',
    dossier_s3_refund: 'रिफ़ंड और रद्दीकरण शर्तें',
    dossier_s3_unavailable: 'अभी सत्यापित नहीं। कृपया भुगतान करने से पहले आधिकारिक लिखित शुल्क और रिफ़ंड अनुसूची प्राप्त करें।',
    dossier_s4_title: 'प्रमाणित बनाम अभी प्रमाणित नहीं',
    dossier_s4_proven: 'प्रमाणित',
    dossier_s4_not_proven: 'अभी प्रमाणित नहीं',
    dossier_s5_title: 'हर अभिभावक को ये सवाल पूछने चाहिए',
    dossier_s6_title: 'वर्तमान अभिभावक या छात्र से बात करें',
    dossier_s6_description: 'इस विश्वविद्यालय और NIAT कार्यक्रम से परिचित किसी व्यक्ति से जुड़ें। सभी वॉलंटियर प्रोफ़ाइल सत्यापित हैं और उन्होंने स्पष्ट सहमति दी है।',
    dossier_request_call: 'बातचीत का अनुरोध करें',
    dossier_call_requested: 'बातचीत का अनुरोध किया गया',

    fin_item: 'मद',
    fin_institution: 'ज़िम्मेदार संस्थान',
    fin_amount: 'राशि',
    fin_evidence: 'साक्ष्य',

    share_whatsapp: 'WhatsApp पर शेयर करें',
    share_copy_link: 'डोज़ियर लिंक कॉपी करें',
    share_copy_message: 'WhatsApp संदेश कॉपी करें',
    share_preview: 'डोज़ियर प्रीव्यू',
    share_message_template: 'नमस्ते {parentName} जी, हमने {studentName} के {universityName} में प्रवेश के लिए एक विस्तृत विश्वविद्यालय सत्यापन रिपोर्ट तैयार की है। इस रिपोर्ट में सत्यापित तथ्य, शुल्क जानकारी और महत्वपूर्ण प्रश्नों के उत्तर हैं। कृपया यहाँ देखें: {dossierUrl}',

    peer_volunteer: 'वॉलंटियर',
    peer_role: 'भूमिका',
    peer_university: 'विश्वविद्यालय',
    peer_language: 'भाषा',
    peer_city: 'शहर',
    peer_available: 'उपलब्ध',
    peer_unavailable: 'अनुपलब्ध',
    peer_demo_label: '(सिम्युलेटेड प्रदर्शन प्रोफ़ाइल)',

    analytics_title: 'ग्रोथ एनालिटिक्स',
    analytics_experiment: 'A/B प्रयोग',
    analytics_control: 'कंट्रोल ग्रुप',
    analytics_test: 'टेस्ट ग्रुप (ProofDesk)',
    analytics_awaiting: 'प्रयोग डेटा की प्रतीक्षा है।',
    analytics_call_booking: 'कॉल-बुकिंग दर',
    analytics_seat_block: 'सीट-ब्लॉक कन्वर्शन',
    analytics_opt_out: 'ऑप्ट-आउट दर',
    analytics_complaint: 'शिकायत दर',
    analytics_pp_diff: 'pp अंतर',

    action_generate: 'बनाएं',
    action_generating: 'बन रहा है…',
    action_view: 'देखें',
    action_share: 'शेयर करें',
    action_close: 'बंद करें',
    action_back: 'वापस',
    action_retry: 'पुनः प्रयास',

    error_api_unavailable: 'AI सेवा अस्थायी रूप से अनुपलब्ध है। कृपया पुनः प्रयास करें।',
    error_no_evidence: 'इस विश्वविद्यालय के लिए कोई साक्ष्य रिकॉर्ड नहीं मिला।',
    error_generation_failed: 'डोज़ियर बनाने में विफल। कृपया पुनः प्रयास करें या सहायता से संपर्क करें।',
    error_supabase_not_configured: 'डेटाबेस कनेक्शन कॉन्फ़िगर नहीं है। नमूना डेटा के साथ डेमो मोड में चल रहा है।',

    question_1: 'मेरे बच्चे की डिग्री कौन सा संस्थान जारी करेगा, और डिग्री प्रमाणपत्र पर क्या लिखा होगा?',
    question_2: 'क्या मैं भुगतान करने से पहले पूरा शुल्क विवरण — विश्वविद्यालय ट्यूशन, NIAT अपस्किलिंग शुल्क, पंजीकरण और अन्य सभी शुल्क — लिखित में प्राप्त कर सकता/सकती हूँ?',
    question_3: 'यदि मेरा बच्चा वापस लेने का निर्णय करता है तो सटीक रिफ़ंड शर्तें क्या हैं, और क्या ये शर्तें प्रवेश समझौते में प्रलेखित हैं?',
    question_4: 'कौन से प्लेसमेंट आंकड़े विशेष रूप से इस विश्वविद्यालय में NIAT छात्रों से संबंधित हैं, और मैं इनकी पुष्टि कैसे कर सकता/सकती हूँ?',
    question_5: 'यदि मेरे बच्चे की डिग्री के दौरान विश्वविद्यालय का NIAT के साथ समझौता बदलता है या बंद होता है तो क्या होगा?',
  },

  te: {
    app_name: 'ProofDesk',
    app_tagline: 'నిబద్ధతకు ముందు స్పష్టత.',
    demo_banner: 'ప్రదర్శన మోడ్ — చూపించిన డేటా అంతా కల్పితం మరియు ఉదాహరణాత్మకం.',

    lang_en: 'English',
    lang_hi: 'हिंदी',
    lang_te: 'తెలుగు',

    nav_dashboard: 'డాష్‌బోర్డ్',
    nav_leads: 'లీడ్స్',
    nav_evidence: 'సాక్ష్యం లైబ్రరీ',
    nav_volunteers: 'పీర్ వాలంటీర్లు',
    nav_analytics: 'అనలిటిక్స్',

    dash_title: 'గ్రోత్ ఆపరేషన్స్',
    dash_stalled: 'ఆగిపోయిన లీడ్స్',
    dash_dossiers_generated: 'డోసియర్లు రూపొందించబడ్డాయి',
    dash_dossiers_delivered: 'డోసియర్లు పంపబడ్డాయి',
    dash_peer_calls_requested: 'పీర్ కాల్ అభ్యర్థనలు',
    dash_peer_calls_booked: 'పీర్ కాల్స్ బుక్',
    dash_seat_block: 'సీట్-బ్లాక్ చెల్లింపులు',
    dash_verification_issues: 'ధృవీకరణ సమస్యలు',
    dash_funnel_title: 'కన్వర్షన్ ఫన్నెల్',
    dash_recent_activity: 'ఇటీవలి కార్యాచరణ',

    leads_title: 'లీడ్ నిర్వహణ',
    leads_search: 'లీడ్స్ శోధించండి…',
    leads_student: 'విద్యార్థి',
    leads_parent: 'తల్లిదండ్రి',
    leads_university: 'విశ్వవిద్యాలయం',
    leads_city: 'నగరం',
    leads_language: 'భాష',
    leads_status: 'స్థితి',
    leads_days_since: 'కౌన్సెలింగ్ తర్వాత రోజులు',
    leads_seat_block: 'సీట్-బ్లాక్',
    leads_dossier: 'డోసియర్',
    leads_last_interaction: 'చివరి ఇంటరాక్షన్',
    leads_generate_dossier: 'డోసియర్ రూపొందించండి',
    leads_view_dossier: 'డోసియర్ చూడండి',
    leads_share_dossier: 'డోసియర్ షేర్ చేయండి',

    status_new: 'కొత్తది',
    status_counselling_scheduled: 'కౌన్సెలింగ్ షెడ్యూల్',
    status_counselling_completed: 'కౌన్సెలింగ్ పూర్తయింది',
    status_stalled: 'ఆగిపోయింది',
    status_dossier_generated: 'డోసియర్ రూపొందించబడింది',
    status_dossier_delivered: 'డోసియర్ పంపబడింది',
    status_peer_call_requested: 'పీర్ కాల్ అభ్యర్థన',
    status_peer_call_booked: 'పీర్ కాల్ బుక్',
    status_seat_block_paid: 'సీట్-బ్లాక్ చెల్లింపు',
    status_enrolled: 'నమోదైంది',
    status_opted_out: 'ఆప్ట్ ఔట్',

    evidence_title: 'విశ్వవిద్యాలయ సాక్ష్యం లైబ్రరీ',
    evidence_subtitle: 'నోయిడా ఇంటర్నేషనల్ యూనివర్సిటీ కోసం మూలం-లింక్ చేయబడిన ధృవీకరణ రికార్డులు',
    evidence_category: 'వర్గం',
    evidence_claim: 'దావా',
    evidence_source: 'మూలం',
    evidence_status: 'స్థితి',
    evidence_checked: 'చివరిగా తనిఖీ',
    evidence_explanation: 'వివరణ',

    ev_verified: 'ధృవీకరించబడింది',
    ev_not_verified: 'ఇంకా ధృవీకరించబడలేదు',
    ev_not_proven: 'ఇంకా నిరూపించబడలేదు',
    ev_conflicting: 'వైరుధ్య సాక్ష్యం',

    cat_identity: 'విశ్వవిద్యాలయ గుర్తింపు & స్థాపన',
    cat_ugc: 'UGC గుర్తింపు',
    cat_naac: 'NAAC అక్రెడిటేషన్',
    cat_statutory: 'చట్టబద్ధ ఆమోదాలు',
    cat_niat: 'NIAT–విశ్వవిద్యాలయ సహకారం',
    cat_degree: 'డిగ్రీ ప్రదానం చేసే సంస్థ',
    cat_program: 'అకడమిక్ ప్రోగ్రామ్ & పాఠ్యాంశం',
    cat_fees: 'ఫీజు నిర్మాణం',
    cat_payment: 'చెల్లింపు బాధ్యతలు',
    cat_refund: 'రీఫండ్ & రద్దు',
    cat_outcomes: 'విద్యార్థి ఫలితాలు & ప్లేస్‌మెంట్లు',

    dossier_title: 'మీ విశ్వవిద్యాలయ వాస్తవాలు, ధృవీకరించబడ్డాయి.',
    dossier_generated: 'డోసియర్ రూపొందించిన తేదీ',
    dossier_verified: 'చివరి ధృవీకరణ తేదీ',
    dossier_intro: 'ఈ నివేదిక విశ్వవిద్యాలయం, దాని డిగ్రీ-ప్రదానం చేసే అధికారం, వర్తించే ఆమోదాలు, ఆర్థిక బాధ్యతలు మరియు అందుబాటులో ఉన్న విద్యార్థి ఫలితాల గురించి అధికారిక సమాచారాన్ని ఒకచోట చేరుస్తుంది. ఇది ధృవీకరించబడిన వాస్తవాలను ఇంకా నిర్ధారించవలసిన సమాచారం నుండి వేరు చేస్తుంది.',
    dossier_coverage: 'సాక్ష్యం కవరేజ్',

    dossier_s1_title: 'డిగ్రీ ఎవరు ఇస్తారు?',
    dossier_s2_title: 'విశ్వవిద్యాలయ గుర్తింపు & ఆమోదాలు',
    dossier_s3_title: 'ఎవరికి ఎంత చెల్లించాలి?',
    dossier_s3_refund: 'రీఫండ్ & రద్దు నిబంధనలు',
    dossier_s3_unavailable: 'ఇంకా ధృవీకరించబడలేదు. దయచేసి చెల్లింపు చేయడానికి ముందు అధికారిక రాతపూర్వక ఫీజు మరియు రీఫండ్ షెడ్యూల్ పొందండి.',
    dossier_s4_title: 'నిరూపించబడినవి vs ఇంకా నిరూపించబడనివి',
    dossier_s4_proven: 'నిరూపించబడినవి',
    dossier_s4_not_proven: 'ఇంకా నిరూపించబడలేదు',
    dossier_s5_title: 'ప్రతి తల్లిదండ్రి అడగవలసిన ప్రశ్నలు',
    dossier_s6_title: 'ప్రస్తుత తల్లిదండ్రి లేదా విద్యార్థితో మాట్లాడండి',
    dossier_s6_description: 'ఈ విశ్వవిద్యాలయం మరియు NIAT ప్రోగ్రామ్‌తో పరిచయం ఉన్న వ్యక్తితో అనుసంధానం అవ్వండి. అన్ని వాలంటీర్ ప్రొఫైల్‌లు ధృవీకరించబడ్డాయి మరియు వారి స్పష్టమైన అనుమతి ఇచ్చారు.',
    dossier_request_call: 'సంభాషణ అభ్యర్థించండి',
    dossier_call_requested: 'సంభాషణ అభ్యర్థించబడింది',

    fin_item: 'అంశం',
    fin_institution: 'బాధ్యతాయుత సంస్థ',
    fin_amount: 'మొత్తం',
    fin_evidence: 'సాక్ష్యం',

    share_whatsapp: 'WhatsApp లో షేర్ చేయండి',
    share_copy_link: 'డోసియర్ లింక్ కాపీ చేయండి',
    share_copy_message: 'WhatsApp సందేశం కాపీ చేయండి',
    share_preview: 'డోసియర్ ప్రివ్యూ',
    share_message_template: 'నమస్కారం {parentName} గారు, {studentName} {universityName}లో ప్రవేశం కోసం వివరమైన విశ్వవిద్యాలయ ధృవీకరణ నివేదిక సిద్ధం చేసాము. ఈ నివేదికలో ధృవీకరించబడిన వాస్తవాలు, ఫీజు సమాచారం మరియు ముఖ్యమైన ప్రశ్నలకు సమాధానాలు ఉన్నాయి. దయచేసి ఇక్కడ చూడండి: {dossierUrl}',

    peer_volunteer: 'వాలంటీర్',
    peer_role: 'పాత్ర',
    peer_university: 'విశ్వవిద్యాలయం',
    peer_language: 'భాష',
    peer_city: 'నగరం',
    peer_available: 'అందుబాటులో',
    peer_unavailable: 'అందుబాటులో లేదు',
    peer_demo_label: '(సిమ్యులేటెడ్ ప్రదర్శన ప్రొఫైల్)',

    analytics_title: 'గ్రోత్ అనలిటిక్స్',
    analytics_experiment: 'A/B ప్రయోగం',
    analytics_control: 'కంట్రోల్ గ్రూప్',
    analytics_test: 'టెస్ట్ గ్రూప్ (ProofDesk)',
    analytics_awaiting: 'ప్రయోగ డేటా కోసం వేచి ఉంది.',
    analytics_call_booking: 'కాల్-బుకింగ్ రేటు',
    analytics_seat_block: 'సీట్-బ్లాక్ కన్వర్షన్',
    analytics_opt_out: 'ఆప్ట్-ఔట్ రేటు',
    analytics_complaint: 'ఫిర్యాదు రేటు',
    analytics_pp_diff: 'pp తేడా',

    action_generate: 'రూపొందించు',
    action_generating: 'రూపొందిస్తోంది…',
    action_view: 'చూడండి',
    action_share: 'షేర్',
    action_close: 'మూసివేయండి',
    action_back: 'వెనుకకు',
    action_retry: 'మళ్ళీ ప్రయత్నించు',

    error_api_unavailable: 'AI సేవ తాత్కాలికంగా అందుబాటులో లేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.',
    error_no_evidence: 'ఈ విశ్వవిద్యాలయం కోసం సాక్ష్యం రికార్డులు కనుగొనబడలేదు.',
    error_generation_failed: 'డోసియర్ రూపొందించడం విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి లేదా సపోర్ట్‌ను సంప్రదించండి.',
    error_supabase_not_configured: 'డేటాబేస్ కనెక్షన్ కాన్ఫిగర్ చేయబడలేదు. నమూనా డేటాతో డెమో మోడ్‌లో నడుస్తోంది.',

    question_1: 'నా పిల్లల డిగ్రీ ఏ సంస్థ జారీ చేస్తుంది, మరియు డిగ్రీ సర్టిఫికేట్‌లో ఏమి ఉంటుంది?',
    question_2: 'ఏదైనా చెల్లింపు చేయడానికి ముందు పూర్తి ఫీజు వివరాలు — విశ్వవిద్యాలయ ట్యూషన్, NIAT అప్‌స్కిల్లింగ్ ఫీజు, రిజిస్ట్రేషన్ మరియు అన్ని ఇతర ఛార్జీలు — రాతపూర్వకంగా పొందగలనా?',
    question_3: 'నా పిల్లవాడు ఉపసంహరించుకోవాలని నిర్ణయించుకుంటే ఖచ్చితమైన రీఫండ్ నిబంధనలు ఏమిటి, మరియు ఈ నిబంధనలు ప్రవేశ ఒప్పందంలో డాక్యుమెంట్ చేయబడ్డాయా?',
    question_4: 'ఈ విశ్వవిద్యాలయంలో NIAT విద్యార్థులకు ప్రత్యేకంగా ఏ ప్లేస్‌మెంట్ గణాంకాలు సంబంధించినవి, మరియు నేను వాటిని ఎలా ధృవీకరించగలను?',
    question_5: 'నా పిల్లల డిగ్రీ సమయంలో విశ్వవిద్యాలయం NIAT తో ఏర్పాటు మారితే లేదా నిలిపివేయబడితే ఏమి జరుగుతుంది?',
  },
};

export type Translations = Record<TranslationKey, string>;

export function t(key: TranslationKey, lang: DossierLanguage = 'en'): string {
  return (translations[lang] as Record<string, string>)?.[key] ?? translations.en[key] ?? key;
}

export function getTranslations(lang: DossierLanguage): Translations {
  return (translations[lang] ?? translations.en) as unknown as Translations;
}

export function formatShareMessage(
  lang: DossierLanguage,
  parentName: string,
  studentName: string,
  universityName: string,
  dossierUrl: string
): string {
  const template = t('share_message_template', lang);
  return template
    .replace('{parentName}', parentName)
    .replace('{studentName}', studentName)
    .replace('{universityName}', universityName)
    .replace('{dossierUrl}', dossierUrl);
}
