import { FC, useState, useEffect } from "react";
import { FiSearch, FiMail, FiPhone, FiUser, FiX, FiPackage, FiCalendar, FiPlus } from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout";
import { db } from "../../firebase";
import { collection, onSnapshot, query, where, orderBy, addDoc } from "firebase/firestore";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: unknown[];
}

const Customers: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "users"), {
        ...newCustomer,
        role: "user",
        createdAt: new Date().toISOString(),
        photoURL: null
      });
      setShowAddModal(false);
      setNewCustomer({ firstName: "", lastName: "", email: "", phone: "" });
    } catch (error) {
      console.error("Error adding customer: ", error);
    }
  };

  useEffect(() => {
    if (selectedCustomer) {
      const q = query(
        collection(db, "orders"), 
        where("userId", "==", selectedCustomer.id),
        orderBy("createdAt", "desc")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setCustomerOrders(ordersData);
      });

      return () => unsubscribe();
    }
  }, [selectedCustomer]);

  useEffect(() => {
    // Query only users with role 'user' (exclude admins if needed, or show all)
    // For now, let's show all users who are not the current admin, or just all users.
    // Usually customers have role 'user'.
    const q = query(collection(db, "users"), where("role", "==", "user"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const customersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];
      setCustomers(customersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.includes(searchTerm)
    );
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
          <p className="text-gray-600 mt-1">Gérez votre base de clients</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Ajouter un client
        </button>
      </div>

      {/* Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un client (nom, email, téléphone)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black sm:text-sm"
              />
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'inscription
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        Chargement...
                      </td>
                    </tr>
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        Aucun client trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <FiUser className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {customer.firstName} {customer.lastName}
                              </div>
                              <div className="text-sm text-gray-500">ID: {customer.id.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center text-sm text-gray-500">
                              <FiMail className="mr-2 h-4 w-4" />
                              {customer.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <FiPhone className="mr-2 h-4 w-4" />
                              {customer.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          - {/* Date d'inscription not stored yet, maybe add later */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => setSelectedCustomer(customer)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Détails
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>


      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Détails du client</h3>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <FiUser className="w-8 h-8 text-gray-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{selectedCustomer.firstName} {selectedCustomer.lastName}</h4>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiMail className="mr-2 h-4 w-4" />
                      {selectedCustomer.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiPhone className="mr-2 h-4 w-4" />
                      {selectedCustomer.phone}
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiPackage className="w-5 h-5" />
                Dernières commandes
              </h4>
              
              <div className="space-y-4">
                {customerOrders.length > 0 ? (
                  customerOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900">Commande #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'completed' ? 'Livré' :
                           order.status === 'cancelled' ? 'Annulé' :
                           order.status === 'processing' ? 'En cours' : 'En attente'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{order.items.length} article(s)</span>
                        <span className="font-bold text-gray-900">{order.total.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Aucune commande passée</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Ajouter un client</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">Prénom *</label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={newCustomer.firstName}
                      onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">Nom *</label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={newCustomer.lastName}
                      onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">Téléphone</label>
                  <input
                    id="phone"
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Ajouter le client
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Customers;
