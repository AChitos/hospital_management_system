"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeftIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/utils/apiClient";
import { 
  medicines, 
  medicineCategories, 
  searchMedicines, 
  getMedicinesByCategory, 
  getMedicineById,
  type Medicine 
} from "@/data/medicines";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}

interface PrescriptionFormData {
  patientId: string;
  medicineId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  expiryDate?: string;
}

export default function NewPrescriptionPage() {
  const router = useRouter();
  
  // Use useState and useEffect instead of useSearchParams for SSR compatibility
  const [patientIdFromUrl, setPatientIdFromUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  
  // Medicine search and selection state
  const [medicineSearchQuery, setMedicineSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>(medicines);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [showMedicineDropdown, setShowMedicineDropdown] = useState(false);
  
  // Get URL parameters on client-side
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setPatientIdFromUrl(searchParams.get("patientId"));
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PrescriptionFormData>();
  
  // Update the form value when the URL param is loaded
  useEffect(() => {
    if (patientIdFromUrl) {
      setValue("patientId", patientIdFromUrl);
    }
  }, [patientIdFromUrl, setValue]);

  // Fetch patients for selection
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get<Patient[]>('/api/patients');
        
        if (response.error) {
          console.error("Error fetching patients:", response.error);
          return;
        }
        
        if (response.data) {
          setPatients(response.data);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  // Filter medicines based on search query and category
  useEffect(() => {
    let filtered = medicines;
    
    if (medicineSearchQuery) {
      filtered = searchMedicines(medicineSearchQuery);
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(medicine => medicine.category === selectedCategory);
    }
    
    setFilteredMedicines(filtered);
  }, [medicineSearchQuery, selectedCategory]);

  // Handle medicine selection
  const handleMedicineSelect = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setValue("medicineId", medicine.id);
    setValue("medication", `${medicine.name} (${medicine.brandName || medicine.activeIngredient})`);
    setShowMedicineDropdown(false);
    setMedicineSearchQuery("");
  };

  // Clear medicine selection
  const clearMedicineSelection = () => {
    setSelectedMedicine(null);
    setValue("medicineId", "");
    setValue("medication", "");
    setMedicineSearchQuery("");
    setSelectedCategory("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.medicine-dropdown')) {
        setShowMedicineDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onSubmit = async (data: PrescriptionFormData) => {
    setIsLoading(true);
    
    try {
      // Send the data to our API
      const response = await api.post<PrescriptionFormData>(`/api/patients/${data.patientId}/prescriptions`, data);
      
      if (response.error) {
        console.error("Error creating prescription:", response.error);
        setIsLoading(false);
        return;
      }
      
      // Redirect to prescriptions page on success
      router.push("/prescriptions");
    } catch (error) {
      console.error("Error creating prescription:", error);
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center">
            <Link href="/prescriptions" className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Créer une nouvelle ordonnance</h1>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Détails de l'ordonnance</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
                <div>
                <Label htmlFor="patientId">Patient</Label>
                <select
                  id="patientId"
                  className="w-full p-2 border rounded-md"
                  {...register("patientId", { required: "Veuillez sélectionner un patient" })}
                >
                  <option value="">Sélectionner un patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="text-red-500 text-sm mt-1">{errors.patientId.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="medication">Médicament</Label>
                {selectedMedicine ? (
                  <div className="border rounded-md p-3 bg-blue-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900">
                          {selectedMedicine.name}
                          {selectedMedicine.brandName && (
                            <span className="text-blue-600 ml-2">({selectedMedicine.brandName})</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <strong>Principe actif:</strong> {selectedMedicine.activeIngredient}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Forme:</strong> {selectedMedicine.dosageForm}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Classe thérapeutique:</strong> {selectedMedicine.therapeuticClass}
                        </p>
                        {selectedMedicine.contraindications && selectedMedicine.contraindications.length > 0 && (
                          <p className="text-sm text-red-600 mt-1">
                            <strong>⚠️ Contre-indications:</strong> {selectedMedicine.contraindications.join(", ")}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearMedicineSelection}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Rechercher un médicament..."
                          value={medicineSearchQuery}
                          onChange={(e) => {
                            setMedicineSearchQuery(e.target.value);
                            setShowMedicineDropdown(true);
                          }}
                          onFocus={() => setShowMedicineDropdown(true)}
                        />
                        <MagnifyingGlassIcon className="h-4 w-4 absolute right-3 top-3 text-gray-400" />
                      </div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-white"
                      >
                        <option value="">Toutes catégories</option>
                        {medicineCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {showMedicineDropdown && (
                      <div className="medicine-dropdown border rounded-md max-h-60 overflow-y-auto bg-white shadow-lg">
                        {filteredMedicines.length > 0 ? (
                          filteredMedicines.map((medicine) => (
                            <div
                              key={medicine.id}
                              className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleMedicineSelect(medicine)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">
                                    {medicine.name}
                                    {medicine.brandName && (
                                      <span className="text-blue-600 ml-2">({medicine.brandName})</span>
                                    )}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {medicine.activeIngredient} • {medicine.dosageForm}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {medicine.category} • {medicine.therapeuticClass}
                                  </p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  medicine.prescriptionType === 'Prescription' 
                                    ? 'bg-red-100 text-red-700' 
                                    : medicine.prescriptionType === 'Controlled'
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                  {medicine.prescriptionType}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-gray-500">
                            Aucun médicament trouvé
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <input
                  type="hidden"
                  {...register("medicineId", { required: "Veuillez sélectionner un médicament" })}
                />
                <input
                  type="hidden"
                  {...register("medication", { required: "Veuillez sélectionner un médicament" })}
                />
                {errors.medicineId && (
                  <p className="text-red-500 text-sm mt-1">{errors.medicineId.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dosage">Dosage</Label>
                  {selectedMedicine && selectedMedicine.commonDosages.length > 0 ? (
                    <select
                      id="dosage"
                      className="w-full p-2 border rounded-md"
                      {...register("dosage", { required: "Le dosage est requis" })}
                    >
                      <option value="">Sélectionner un dosage</option>
                      {selectedMedicine.commonDosages.map((dosage) => (
                        <option key={dosage} value={dosage}>
                          {dosage}
                        </option>
                      ))}
                      <option value="custom">Autre (saisir manuellement)</option>
                    </select>
                  ) : (
                    <Input
                      id="dosage"
                      placeholder="e.g., 10mg/ml"
                      {...register("dosage", { required: "Le dosage est requis" })}
                    />
                  )}
                  {errors.dosage && (
                    <p className="text-red-500 text-sm mt-1">{errors.dosage.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="frequency">Fréquence</Label>
                  <select
                    id="frequency"
                    className="w-full p-2 border rounded-md"
                    {...register("frequency", { required: "La fréquence est requise" })}
                  >
                    <option value="">Sélectionner fréquence</option>
                    <option value="1 fois par jour">1 fois par jour</option>
                    <option value="2 fois par jour">2 fois par jour</option>
                    <option value="3 fois par jour">3 fois par jour</option>
                    <option value="4 fois par jour">4 fois par jour</option>
                    <option value="Matin">Le matin</option>
                    <option value="Soir">Le soir</option>
                    <option value="Matin et soir">Matin et soir</option>
                    <option value="Avant repas">Avant les repas</option>
                    <option value="Après repas">Après les repas</option>
                    <option value="Si besoin">Si besoin (SOS)</option>
                  </select>
                  {errors.frequency && (
                    <p className="text-red-500 text-sm mt-1">{errors.frequency.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Durée du traitement</Label>
                  <select
                    id="duration"
                    className="w-full p-2 border rounded-md"
                    {...register("duration", { required: "La durée est requise" })}
                  >
                    <option value="">Sélectionner durée</option>
                    <option value="1 jour">1 jour</option>
                    <option value="3 jours">3 jours</option>
                    <option value="5 jours">5 jours</option>
                    <option value="7 jours">7 jours (1 semaine)</option>
                    <option value="10 jours">10 jours</option>
                    <option value="14 jours">14 jours (2 semaines)</option>
                    <option value="21 jours">21 jours (3 semaines)</option>
                    <option value="1 mois">1 mois</option>
                    <option value="2 mois">2 mois</option>
                    <option value="3 mois">3 mois</option>
                    <option value="6 mois">6 mois</option>
                    <option value="Traitement chronique">Traitement chronique</option>
                  </select>
                  {errors.duration && (
                    <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="expiryDate">Date d'expiration (optionnel)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    {...register("expiryDate")}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes et instructions (optionnel)</Label>
                <textarea
                  id="notes"
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  placeholder="Ajouter des instructions particulières, conseils d'administration, précautions, etc."
                  {...register("notes")}
                ></textarea>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-4">
              <Link href="/prescriptions">
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Création..." : "Créer l'ordonnance"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AuthLayout>
  );
}
