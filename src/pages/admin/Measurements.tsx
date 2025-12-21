import { FC, useState, useEffect } from "react";
import { FiSearch, FiSave, FiUser } from "react-icons/fi";
import { TbRuler } from "react-icons/tb";
import AdminLayout from "../../components/admin/AdminLayout";
import { db } from "../../firebase";
import { collection, onSnapshot, query, where, doc, setDoc, getDoc } from "firebase/firestore";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Measurements {
  cou: string;
  epaule: string;
  poitrine: string;
  taille: string;
  hanche: string;
  longueurBras: string;
  longueurJambe: string;
  longueurTotale: string;
  tourBras: string;
  poignet: string;
}

const defaultMeasurements: Measurements = {
  cou: "",
  epaule: "",
  poitrine: "",
  taille: "",
  hanche: "",
  longueurBras: "",
  longueurJambe: "",
  longueurTotale: "",
  tourBras: "",
  poignet: ""
};

const MeasurementsPage: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [measurements, setMeasurements] = useState<Measurements>(defaultMeasurements);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "user"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const customersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];
      setCustomers(customersData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMeasurements = async () => {
      if (selectedCustomer) {
        setLoading(true);
        try {
          const docRef = doc(db, "measurements", selectedCustomer.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setMeasurements(docSnap.data() as Measurements);
          } else {
            setMeasurements(defaultMeasurements);
          }
        } catch (error) {
          console.error("Error fetching measurements:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMeasurements();
  }, [selectedCustomer]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    setSaving(true);
    try {
      await setDoc(doc(db, "measurements", selectedCustomer.id), measurements);
      alert("Mesures enregistrées avec succès !");
    } catch (error) {
      console.error("Error saving measurements:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mesures Couture</h2>
          <p className="text-gray-600 mt-1">Gérez les mesures de vos clients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 h-[300px] lg:h-[calc(100vh-200px)] flex flex-col">
              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                />
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {filteredCustomers.map(customer => (
                  <button
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`w-full text-left p-2 md:p-3 rounded-lg flex items-center gap-3 transition-colors ${
                      selectedCustomer?.id === customer.id
                        ? "bg-black text-white"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      selectedCustomer?.id === customer.id ? "bg-gray-800" : "bg-gray-100"
                    }`}>
                      <FiUser className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">{customer.firstName} {customer.lastName}</p>
                      <p className={`text-xs truncate ${selectedCustomer?.id === customer.id ? "text-gray-400" : "text-gray-500"}`}>
                        {customer.phone}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Measurements Form */}
            <div className="lg:col-span-2">
              {selectedCustomer ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                      <TbRuler className="w-5 h-5 md:w-6 md:h-6" />
                      Mesures de {selectedCustomer.firstName}
                    </h3>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 w-full sm:w-auto text-sm md:text-base font-medium"
                    >
                      <FiSave className="w-4 h-4 md:w-5 md:h-5" />
                      {saving ? "Enregistrement..." : "Enregistrer"}
                    </button>
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 md:gap-6">
                      {Object.keys(defaultMeasurements).map((key) => (
                        <div key={key}>
                          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 capitalize truncate">
                            {key.replace(/([A-Z])/g, ' $1').trim()} (cm)
                          </label>
                          <input
                            type="number"
                            value={measurements[key as keyof Measurements]}
                            onChange={(e) => setMeasurements({
                              ...measurements,
                              [key]: e.target.value
                            })}
                            className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                            placeholder="0.0"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center h-full flex flex-col items-center justify-center text-gray-500">
                  <TbRuler className="w-16 h-16 mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Sélectionnez un client pour voir ou modifier ses mesures</p>
                </div>
              )}
            </div>
          </div>
    </AdminLayout>
  );
};

export default MeasurementsPage;
