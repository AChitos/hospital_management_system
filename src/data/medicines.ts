// Common medicines available in France
export interface Medicine {
  id: string;
  name: string;
  brandName?: string;
  activeIngredient: string;
  category: string;
  dosageForm: string;
  commonDosages: string[];
  contraindications?: string[];
  sideEffects?: string[];
  therapeuticClass: string;
  prescriptionType: 'OTC' | 'Prescription' | 'Controlled';
}

export const medicines: Medicine[] = [
  // Analgesics & Anti-inflammatories
  {
    id: 'para-500',
    name: 'Paracétamol',
    brandName: 'Doliprane',
    activeIngredient: 'Paracetamol',
    category: 'Analgesique',
    dosageForm: 'Comprimé',
    commonDosages: ['500mg', '1000mg'],
    contraindications: ['Insuffisance hépatique sévère'],
    sideEffects: ['Rares réactions cutanées'],
    therapeuticClass: 'Antalgique non opioïde',
    prescriptionType: 'OTC'
  },
  {
    id: 'ibu-400',
    name: 'Ibuprofène',
    brandName: 'Advil',
    activeIngredient: 'Ibuprofen',
    category: 'Anti-inflammatoire',
    dosageForm: 'Comprimé',
    commonDosages: ['200mg', '400mg', '600mg'],
    contraindications: ['Ulcère gastrique', 'Insuffisance rénale'],
    sideEffects: ['Troubles digestifs', 'Nausées'],
    therapeuticClass: 'AINS',
    prescriptionType: 'OTC'
  },
  {
    id: 'asp-500',
    name: 'Aspirine',
    brandName: 'Aspégic',
    activeIngredient: 'Acide acétylsalicylique',
    category: 'Antiagrégant',
    dosageForm: 'Comprimé',
    commonDosages: ['75mg', '100mg', '500mg'],
    contraindications: ['Allergie aux salicylés', 'Enfants < 16 ans'],
    sideEffects: ['Troubles digestifs', 'Saignements'],
    therapeuticClass: 'Antiagrégant plaquettaire',
    prescriptionType: 'OTC'
  },

  // Antibiotics
  {
    id: 'amox-500',
    name: 'Amoxicilline',
    brandName: 'Clamoxyl',
    activeIngredient: 'Amoxicillin',
    category: 'Antibiotique',
    dosageForm: 'Gélule',
    commonDosages: ['250mg', '500mg', '1g'],
    contraindications: ['Allergie aux pénicillines'],
    sideEffects: ['Diarrhée', 'Nausées', 'Éruptions cutanées'],
    therapeuticClass: 'Pénicilline',
    prescriptionType: 'Prescription'
  },
  {
    id: 'azith-250',
    name: 'Azithromycine',
    brandName: 'Zithromax',
    activeIngredient: 'Azithromycin',
    category: 'Antibiotique',
    dosageForm: 'Comprimé',
    commonDosages: ['250mg', '500mg'],
    contraindications: ['Allergie aux macrolides'],
    sideEffects: ['Troubles digestifs', 'Vertiges'],
    therapeuticClass: 'Macrolide',
    prescriptionType: 'Prescription'
  },
  {
    id: 'cefal-500',
    name: 'Céfalexine',
    brandName: 'Keforal',
    activeIngredient: 'Cefalexin',
    category: 'Antibiotique',
    dosageForm: 'Gélule',
    commonDosages: ['250mg', '500mg'],
    contraindications: ['Allergie aux céphalosporines'],
    sideEffects: ['Diarrhée', 'Nausées'],
    therapeuticClass: 'Céphalosporine',
    prescriptionType: 'Prescription'
  },

  // Cardiovascular
  {
    id: 'lisin-10',
    name: 'Lisinopril',
    brandName: 'Prinivil',
    activeIngredient: 'Lisinopril',
    category: 'Antihypertenseur',
    dosageForm: 'Comprimé',
    commonDosages: ['5mg', '10mg', '20mg'],
    contraindications: ['Grossesse', 'Sténose artère rénale'],
    sideEffects: ['Toux sèche', 'Hypotension'],
    therapeuticClass: 'IEC',
    prescriptionType: 'Prescription'
  },
  {
    id: 'amlo-5',
    name: 'Amlodipine',
    brandName: 'Norvasc',
    activeIngredient: 'Amlodipine',
    category: 'Antihypertenseur',
    dosageForm: 'Comprimé',
    commonDosages: ['5mg', '10mg'],
    contraindications: ['Choc cardiogénique'],
    sideEffects: ['Œdème des chevilles', 'Vertiges'],
    therapeuticClass: 'Inhibiteur calcique',
    prescriptionType: 'Prescription'
  },
  {
    id: 'ator-20',
    name: 'Atorvastatine',
    brandName: 'Tahor',
    activeIngredient: 'Atorvastatin',
    category: 'Hypolipémiant',
    dosageForm: 'Comprimé',
    commonDosages: ['10mg', '20mg', '40mg'],
    contraindications: ['Maladie hépatique active'],
    sideEffects: ['Myalgies', 'Troubles digestifs'],
    therapeuticClass: 'Statine',
    prescriptionType: 'Prescription'
  },

  // Respiratory
  {
    id: 'salbu-100',
    name: 'Salbutamol',
    brandName: 'Ventoline',
    activeIngredient: 'Salbutamol',
    category: 'Bronchodilatateur',
    dosageForm: 'Inhalateur',
    commonDosages: ['100μg/dose'],
    contraindications: ['Hypersensibilité au salbutamol'],
    sideEffects: ['Tremblements', 'Tachycardie'],
    therapeuticClass: 'Bêta-2 agoniste',
    prescriptionType: 'Prescription'
  },
  {
    id: 'mono-10',
    name: 'Montélukast',
    brandName: 'Singulair',
    activeIngredient: 'Montelukast',
    category: 'Antiasthmatique',
    dosageForm: 'Comprimé',
    commonDosages: ['5mg', '10mg'],
    contraindications: ['Hypersensibilité'],
    sideEffects: ['Céphalées', 'Troubles du sommeil'],
    therapeuticClass: 'Antileucotriène',
    prescriptionType: 'Prescription'
  },

  // Gastrointestinal
  {
    id: 'omep-20',
    name: 'Oméprazole',
    brandName: 'Mopral',
    activeIngredient: 'Omeprazole',
    category: 'Antiulcéreux',
    dosageForm: 'Gélule',
    commonDosages: ['10mg', '20mg', '40mg'],
    contraindications: ['Hypersensibilité'],
    sideEffects: ['Céphalées', 'Diarrhée'],
    therapeuticClass: 'IPP',
    prescriptionType: 'Prescription'
  },
  {
    id: 'domi-10',
    name: 'Dompéridone',
    brandName: 'Motilium',
    activeIngredient: 'Domperidone',
    category: 'Antiémétique',
    dosageForm: 'Comprimé',
    commonDosages: ['10mg'],
    contraindications: ['Prolactinome', 'Troubles cardiaques'],
    sideEffects: ['Somnolence', 'Troubles menstruels'],
    therapeuticClass: 'Prokinétique',
    prescriptionType: 'Prescription'
  },

  // Diabetes
  {
    id: 'metf-500',
    name: 'Metformine',
    brandName: 'Glucophage',
    activeIngredient: 'Metformin',
    category: 'Antidiabétique',
    dosageForm: 'Comprimé',
    commonDosages: ['500mg', '850mg', '1000mg'],
    contraindications: ['Insuffisance rénale', 'Acidocétose'],
    sideEffects: ['Troubles digestifs', 'Goût métallique'],
    therapeuticClass: 'Biguanide',
    prescriptionType: 'Prescription'
  },

  // Mental Health
  {
    id: 'sertr-50',
    name: 'Sertraline',
    brandName: 'Zoloft',
    activeIngredient: 'Sertraline',
    category: 'Antidépresseur',
    dosageForm: 'Comprimé',
    commonDosages: ['25mg', '50mg', '100mg'],
    contraindications: ['IMAO', 'Hypersensibilité'],
    sideEffects: ['Nausées', 'Insomnie', 'Troubles sexuels'],
    therapeuticClass: 'ISRS',
    prescriptionType: 'Prescription'
  },
  {
    id: 'alpr-0.5',
    name: 'Alprazolam',
    brandName: 'Xanax',
    activeIngredient: 'Alprazolam',
    category: 'Anxiolytique',
    dosageForm: 'Comprimé',
    commonDosages: ['0.25mg', '0.5mg', '1mg'],
    contraindications: ['Myasthénie', 'Insuffisance respiratoire'],
    sideEffects: ['Somnolence', 'Dépendance'],
    therapeuticClass: 'Benzodiazépine',
    prescriptionType: 'Controlled'
  },

  // Allergy
  {
    id: 'cetir-10',
    name: 'Cétirizine',
    brandName: 'Zyrtec',
    activeIngredient: 'Cetirizine',
    category: 'Antihistaminique',
    dosageForm: 'Comprimé',
    commonDosages: ['10mg'],
    contraindications: ['Insuffisance rénale sévère'],
    sideEffects: ['Somnolence', 'Sécheresse buccale'],
    therapeuticClass: 'Antihistaminique H1',
    prescriptionType: 'OTC'
  },
  {
    id: 'lor-10',
    name: 'Loratadine',
    brandName: 'Clarityne',
    activeIngredient: 'Loratadine',
    category: 'Antihistaminique',
    dosageForm: 'Comprimé',
    commonDosages: ['10mg'],
    contraindications: ['Hypersensibilité'],
    sideEffects: ['Céphalées', 'Fatigue'],
    therapeuticClass: 'Antihistaminique H1',
    prescriptionType: 'OTC'
  },

  // Vitamins & Supplements
  {
    id: 'vitd-1000',
    name: 'Vitamine D3',
    brandName: 'Zyma-D',
    activeIngredient: 'Cholécalciférol',
    category: 'Vitamine',
    dosageForm: 'Gouttes',
    commonDosages: ['1000 UI', '2000 UI'],
    contraindications: ['Hypercalcémie'],
    sideEffects: ['Rares à doses thérapeutiques'],
    therapeuticClass: 'Vitamine liposoluble',
    prescriptionType: 'OTC'
  },
  {
    id: 'vitb-100',
    name: 'Vitamine B12',
    brandName: 'Dodécavit',
    activeIngredient: 'Cyanocobalamine',
    category: 'Vitamine',
    dosageForm: 'Comprimé',
    commonDosages: ['100μg', '250μg'],
    contraindications: ['Hypersensibilité'],
    sideEffects: ['Rares'],
    therapeuticClass: 'Vitamine hydrosoluble',
    prescriptionType: 'OTC'
  },

  // Topical medications
  {
    id: 'hydr-1',
    name: 'Hydrocortisone',
    brandName: 'Cortapred',
    activeIngredient: 'Hydrocortisone',
    category: 'Corticoïde topique',
    dosageForm: 'Crème',
    commonDosages: ['0.5%', '1%'],
    contraindications: ['Infections cutanées non traitées'],
    sideEffects: ['Atrophie cutanée (usage prolongé)'],
    therapeuticClass: 'Corticoïde',
    prescriptionType: 'OTC'
  }
];

export const medicineCategories = [
  'Analgesique',
  'Anti-inflammatoire',
  'Antibiotique',
  'Antihypertenseur',
  'Hypolipémiant',
  'Bronchodilatateur',
  'Antiasthmatique',
  'Antiulcéreux',
  'Antiémétique',
  'Antidiabétique',
  'Antidépresseur',
  'Anxiolytique',
  'Antihistaminique',
  'Vitamine',
  'Corticoïde topique',
  'Antiagrégant'
];

export const therapeuticClasses = [
  'Antalgique non opioïde',
  'AINS',
  'Antiagrégant plaquettaire',
  'Pénicilline',
  'Macrolide',
  'Céphalosporine',
  'IEC',
  'Inhibiteur calcique',
  'Statine',
  'Bêta-2 agoniste',
  'Antileucotriène',
  'IPP',
  'Prokinétique',
  'Biguanide',
  'ISRS',
  'Benzodiazépine',
  'Antihistaminique H1',
  'Vitamine liposoluble',
  'Vitamine hydrosoluble',
  'Corticoïde'
];

// Helper functions
export const searchMedicines = (query: string): Medicine[] => {
  const searchTerm = query.toLowerCase();
  return medicines.filter(medicine => 
    medicine.name.toLowerCase().includes(searchTerm) ||
    medicine.brandName?.toLowerCase().includes(searchTerm) ||
    medicine.activeIngredient.toLowerCase().includes(searchTerm) ||
    medicine.category.toLowerCase().includes(searchTerm) ||
    medicine.therapeuticClass.toLowerCase().includes(searchTerm)
  );
};

export const getMedicinesByCategory = (category: string): Medicine[] => {
  return medicines.filter(medicine => medicine.category === category);
};

export const getMedicineById = (id: string): Medicine | undefined => {
  return medicines.find(medicine => medicine.id === id);
};
