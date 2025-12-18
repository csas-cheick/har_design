import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiUser, FiCalendar, FiDollarSign, FiCheck, FiPlus, FiX, FiEye, FiScissors, FiPackage } from "react-icons/fi";
import { TbRuler } from "react-icons/tb";
import AdminLayout from "../../components/admin/AdminLayout";
import { db } from "../../firebase";
import { collection, onSnapshot, query, where, addDoc, Timestamp, orderBy, updateDoc, doc } from "firebase/firestore";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface CoutureModel {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CustomOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  modelName: string;
  modelImage?: string;
  fabricDetails?: string;
  notes?: string;
  deadline: Timestamp;
  status: "pending" | "in_progress" | "completed" | "delivered" | "cancelled";
  price: number;
  deposit: number;
  createdAt: Timestamp;
}

const CustomOrdersPage: FC = () => {
  // Main List State
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal State
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null);
  
  // Form State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [models, setModels] = useState<CoutureModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<CoutureModel | null>(null);
  
  const [fabricDetails, setFabricDetails] = useState("");
  const [deadline, setDeadline] = useState("");
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // New Customer State
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "users"), {
        ...newCustomer,
        role: "user",
        createdAt: new Date().toISOString(),
        photoURL: null
      });
      
      // Select the new customer
      const newCustomerData = { id: docRef.id, ...newCustomer } as Customer;
      setSelectedCustomer(newCustomerData);
      setSearchTerm(`${newCustomer.firstName} ${newCustomer.lastName}`);
      
      // Close modal and reset form
      setShowAddCustomerModal(false);
      setNewCustomer({ firstName: "", lastName: "", email: "", phone: "" });
    } catch (error) {
      console.error("Error adding customer: ", error);
      alert("Erreur lors de l'ajout du client");
    }
  };

  useEffect(() => {
    // Fetch Orders
    const qOrders = query(collection(db, "custom_orders"), orderBy("createdAt", "desc"));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CustomOrder)));
    });

    // Fetch Customers
    const qUsers = query(collection(db, "users"), where("role", "==", "user"));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)));
    });

    // Fetch Models
    const unsubModels = onSnapshot(collection(db, "couture_models"), (snapshot) => {
      setModels(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CoutureModel)));
    });

    return () => {
      unsubOrders();
      unsubUsers();
      unsubModels();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedModel) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "custom_orders"), {
        customerId: selectedCustomer.id,
        customerName: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
        customerPhone: selectedCustomer.phone,
        modelId: selectedModel.id,
        modelName: selectedModel.name,
        modelImage: selectedModel.image,
        fabricDetails,
        deadline: Timestamp.fromDate(new Date(deadline)),
        price: Number(price),
        deposit: Number(deposit),
        notes,
        status: "pending",
        createdAt: Timestamp.now(),
        measurementsTaken: true
      });

      // Reset form and close modal
      setShowAddModal(false);
      setSelectedCustomer(null);
      setSelectedModel(null);
      setFabricDetails("");
      setDeadline("");
      setPrice("");
      setDeposit("");
      setNotes("");
    } catch (error) {
      console.error("Error creating custom order:", error);
      alert("Erreur lors de la création de la commande");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: CustomOrder["status"]) => {
    try {
      await updateDoc(doc(db, "custom_orders", orderId), {
        status: newStatus
      });
      setSelectedOrder(null); // Close modal after update
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      order.modelName.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      order.customerPhone.includes(orderSearchTerm);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "delivered": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "En attente";
      case "in_progress": return "En cours";
      case "completed": return "Terminé";
      case "delivered": return "Livré";
      case "cancelled": return "Annulé";
      default: return status;
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Commandes Couture</h2>
          <p className="text-gray-600 mt-1">Gérez les commandes sur mesure</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors w-full md:w-auto"
        >
          <FiPlus className="w-5 h-5" />
          Nouvelle Commande
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher une commande..."
                value={orderSearchTerm}
                onChange={(e) => setOrderSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {["all", "pending", "in_progress", "completed", "delivered", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  statusFilter === status
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "all" ? "Toutes" : getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Modèle</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Livraison</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Prix / Avance</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiScissors className="text-gray-400" />
                      <span className="text-gray-900">{order.modelName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiCalendar className="w-4 h-4" />
                      {order.deadline.toDate().toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{order.price.toLocaleString()} FCFA</div>
                    <div className="text-xs text-green-600">Avance: {order.deposit.toLocaleString()} FCFA</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                      {order.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(order.id, "in_progress")}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Valider / Commencer"
                          >
                            <FiCheck className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order.id, "cancelled")}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Annuler"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {order.status === "in_progress" && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "completed")}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Marquer comme Terminé"
                        >
                          <FiCheck className="w-5 h-5" />
                        </button>
                      )}
                      {order.status === "completed" && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "delivered")}
                          className="p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Marquer comme Livré"
                        >
                          <FiPackage className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Aucune commande trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">Détails de la Commande</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 md:p-6 space-y-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {selectedOrder.modelImage && (
                  <div className="w-full md:w-32 h-48 md:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={selectedOrder.modelImage} alt={selectedOrder.modelName} className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="flex-1 w-full">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{selectedOrder.modelName}</h4>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <FiUser className="w-4 h-4" />
                    <span>{selectedOrder.customerName} ({selectedOrder.customerPhone})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Prix Total</p>
                      <p className="font-bold text-gray-900">{selectedOrder.price.toLocaleString()} FCFA</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-green-600 mb-1">Avance Versée</p>
                      <p className="font-bold text-green-700">{selectedOrder.deposit.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Détails du Tissu</h5>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                    {selectedOrder.fabricDetails || "Aucun détail spécifié"}
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                    {selectedOrder.notes || "Aucune note"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiCalendar className="w-5 h-5" />
                  <span className="font-medium">Livraison prévue :</span>
                  <span>{selectedOrder.deadline.toDate().toLocaleDateString('fr-FR')}</span>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 flex flex-col max-h-[90vh]">
            <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between flex-none sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">Nouvelle Commande Couture</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Selection */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher ou ajouter un client..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowCustomerDropdown(true);
                        if (selectedCustomer && e.target.value !== `${selectedCustomer.firstName} ${selectedCustomer.lastName}`) {
                          setSelectedCustomer(null);
                        }
                      }}
                      onFocus={() => setShowCustomerDropdown(true)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  
                  {showCustomerDropdown && searchTerm && !selectedCustomer && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredCustomers.map(customer => (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setSearchTerm(`${customer.firstName} ${customer.lastName}`);
                            setShowCustomerDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span className="font-medium">{customer.firstName} {customer.lastName}</span>
                          <span className="text-sm text-gray-500">{customer.phone}</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddCustomerModal(true);
                          setShowCustomerDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 text-blue-600 font-medium flex items-center gap-2 border-t border-gray-100"
                      >
                        <FiPlus className="w-4 h-4" />
                        Ajouter "{searchTerm}" comme nouveau client
                      </button>
                    </div>
                  )}
                </div>

                {selectedCustomer && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <FiUser className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">Client : {selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                        <p className="text-xs text-blue-700">{selectedCustomer.phone}</p>
                      </div>
                    </div>
                    <Link 
                      to="/admin/measurements" 
                      target="_blank"
                      className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline"
                    >
                      <TbRuler className="w-4 h-4" />
                      Vérifier les mesures
                    </Link>
                  </div>
                )}

                {/* Model Selection */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Choisir le Modèle</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[200px] overflow-y-auto">
                    {models.map(model => (
                      <div 
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model);
                          setPrice(model.price.toString());
                        }}
                        className={`cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
                          selectedModel?.id === model.id ? "border-black ring-2 ring-black ring-offset-2" : "border-transparent hover:border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="h-24 bg-gray-100">
                          <img src={model.image} alt={model.name} className="w-full h-full object-contain p-2" />
                        </div>
                        <div className="p-2 text-center">
                          <p className="font-medium text-xs truncate">{model.name}</p>
                          <p className="text-xs text-gray-500">{model.price.toLocaleString()} FCFA</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fabricDetails" className="block text-sm font-medium text-gray-700 mb-1">Détails du Tissu</label>
                    <textarea
                      id="fabricDetails"
                      value={fabricDetails}
                      onChange={(e) => setFabricDetails(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      rows={2}
                      placeholder="Type de tissu, couleur, métrage fourni..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">Date de Livraison</label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          id="deadline"
                          type="date"
                          required
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Prix Total (FCFA)</label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          id="price"
                          type="number"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="deposit" className="block text-sm font-medium text-gray-700 mb-1">Avance Versée (FCFA)</label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          id="deposit"
                          type="number"
                          value={deposit}
                          onChange={(e) => setDeposit(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes Supplémentaires</label>
                      <input
                        id="notes"
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Modifications spécifiques..."
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting || !selectedCustomer || !selectedModel}
                    className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FiCheck className="w-5 h-5" />
                    {submitting ? "Création en cours..." : "Valider la Commande"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-[60] flex items-center justify-center p-4" onClick={() => setShowAddCustomerModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Ajouter un client</h3>
                <button
                  onClick={() => setShowAddCustomerModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="newCustomerFirstName" className="block text-sm font-medium text-gray-900 mb-2">Prénom *</label>
                    <input
                      id="newCustomerFirstName"
                      type="text"
                      required
                      value={newCustomer.firstName}
                      onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="newCustomerLastName" className="block text-sm font-medium text-gray-900 mb-2">Nom *</label>
                    <input
                      id="newCustomerLastName"
                      type="text"
                      required
                      value={newCustomer.lastName}
                      onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="newCustomerEmail" className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                  <input
                    id="newCustomerEmail"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="newCustomerPhone" className="block text-sm font-medium text-gray-900 mb-2">Téléphone</label>
                  <input
                    id="newCustomerPhone"
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

export default CustomOrdersPage;
