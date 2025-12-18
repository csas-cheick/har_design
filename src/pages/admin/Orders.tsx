import { FC, useState, useEffect } from "react";
import { 
  FiSearch, 
  FiEye, 
  FiCheck, 
  FiX, 
  FiPackage
} from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy, updateDoc, doc, writeBatch, increment } from "firebase/firestore";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
}

const Orders: FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      // Si la commande passe à "completed" (Livré) et qu'elle n'était pas déjà livrée
      if (newStatus === "completed" && order.status !== "completed") {
        const batch = writeBatch(db);
        
        // Mettre à jour le statut de la commande
        const orderRef = doc(db, "orders", orderId);
        batch.update(orderRef, { status: newStatus });

        // Décrémenter le stock pour chaque article
        order.items.forEach(item => {
          const productRef = doc(db, "products", item.id);
          batch.update(productRef, {
            stock: increment(-item.quantity)
          });
        });

        // Enregistrer la transaction dans la caisse
        const transactionRef = doc(collection(db, "transactions"));
        batch.set(transactionRef, {
          type: "vente",
          amount: order.total,
          description: `Commande Web #${order.id.slice(0, 8)} - ${order.customerName}`,
          paymentMethod: "especes", // Par défaut paiement à la livraison
          timestamp: new Date().toISOString(),
          userId: user?.id || "system",
          source: "ecommerce"
        });

        await batch.commit();
      } else {
        // Mise à jour simple pour les autres statuts
        await updateDoc(doc(db, "orders", orderId), {
          status: newStatus
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Une erreur est survenue lors de la mise à jour du statut");
    }
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "En attente";
      case "processing": return "En cours";
      case "completed": return "Livré";
      case "cancelled": return "Annulé";
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Commandes</h2>
          <p className="text-gray-600 mt-1">Gérez les commandes clients</p>
        </div>
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                {["all", "pending", "processing", "completed", "cancelled"].map((status) => (
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

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">ID Commande</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Client</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Total</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Statut</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">Chargement...</td>
                    </tr>
                  ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900">#{order.id.slice(0, 8)}</td>
                        <td className="py-4 px-6">
                          <p className="font-medium text-gray-900">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.customerPhone}</p>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{formatDate(order.createdAt)}</td>
                        <td className="py-4 px-6 font-bold text-gray-900">{formatPrice(order.total)} FCFA</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Voir détails"
                            >
                              <FiEye className="w-5 h-5" />
                            </button>
                            {order.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(order.id, "processing")}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Valider"
                                >
                                  <FiCheck className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(order.id, "cancelled")}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Annuler"
                                >
                                  <FiX className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            {order.status === "processing" && (
                              <button
                                onClick={() => handleStatusUpdate(order.id, "completed")}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Marquer comme livré"
                              >
                                <FiPackage className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-500">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Détails de la commande</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Informations Client</h4>
                  <p className="text-gray-600"><span className="font-medium">Nom:</span> {selectedOrder.customerName}</p>
                  <p className="text-gray-600"><span className="font-medium">Téléphone:</span> {selectedOrder.customerPhone}</p>
                  <p className="text-gray-600"><span className="font-medium">Adresse:</span> {selectedOrder.customerAddress}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Informations Commande</h4>
                  <p className="text-gray-600"><span className="font-medium">ID:</span> #{selectedOrder.id}</p>
                  <p className="text-gray-600"><span className="font-medium">Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                  <p className="text-gray-600 mt-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </p>
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 mb-4">Articles commandés</h4>
              <div className="space-y-4 mb-6">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)} FCFA</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(selectedOrder.total)} FCFA</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Orders;
