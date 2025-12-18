import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FiPackage, 
  FiShoppingBag, 
  FiUsers, 
  FiDollarSign, 
  FiScissors
} from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout";
import { db } from "../../firebase";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";

const Dashboard: FC = () => {
  const [boutiqueOrders, setBoutiqueOrders] = useState<any[]>([]);
  const [customOrders, setCustomOrders] = useState<any[]>([]);
  const [productsCount, setProductsCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Boutique Orders
    const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setBoutiqueOrders(snapshot.docs.map(doc => ({ id: doc.id, type: 'boutique', ...doc.data() })));
    });

    // 2. Fetch Custom Orders
    const qCustomOrders = query(collection(db, "custom_orders"), orderBy("createdAt", "desc"));
    const unsubCustomOrders = onSnapshot(qCustomOrders, (snapshot) => {
      setCustomOrders(snapshot.docs.map(doc => ({ id: doc.id, type: 'couture', ...doc.data() })));
    });

    // 3. Fetch Products Count
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      setProductsCount(snapshot.size);
    });

    // 4. Fetch Customers Count
    const qUsers = query(collection(db, "users"), where("role", "==", "user"));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setCustomersCount(snapshot.size);
    });

    return () => {
      unsubOrders();
      unsubCustomOrders();
      unsubProducts();
      unsubUsers();
    };
  }, []);

  // Derived State
  const revenue = 
    boutiqueOrders
      .filter(o => o.status === 'completed')
      .reduce((acc, curr) => acc + (curr.total || 0), 0) +
    customOrders
      .reduce((acc, curr) => acc + (curr.deposit || 0), 0);

  const recentOrders = [...boutiqueOrders, ...customOrders]
    .sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  useEffect(() => {
    if (boutiqueOrders.length || customOrders.length || productsCount || customersCount) {
      setLoading(false);
    }
  }, [boutiqueOrders, customOrders, productsCount, customersCount]);

  const statCards = [
    { 
      label: "Revenus (Global)", 
      value: `${revenue.toLocaleString()} FCFA`, 
      icon: FiDollarSign, 
      color: "bg-green-500",
      trend: "Total encaissé"
    },
    { 
      label: "Commandes Totales", 
      value: (boutiqueOrders.length + customOrders.length).toString(), 
      icon: FiShoppingBag, 
      color: "bg-blue-500",
      trend: "Boutique + Couture"
    },
    { 
      label: "Produits", 
      value: productsCount.toString(), 
      icon: FiPackage, 
      color: "bg-purple-500",
      trend: "En catalogue"
    },
    { 
      label: "Clients", 
      value: customersCount.toString(), 
      icon: FiUsers, 
      color: "bg-orange-500",
      trend: "Inscrits"
    },
  ];

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-2 md:p-3 rounded-lg`}>
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <span className="text-[10px] md:text-xs font-medium text-gray-500 flex items-center gap-1">
                    {stat.trend}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 truncate">
                  {loading ? "..." : stat.value}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 truncate">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <Link
              to="/admin/custom-orders"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-pink-100 p-3 rounded-lg group-hover:bg-pink-200 transition-colors">
                  <FiScissors className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Nouvelle Couture</h3>
                  <p className="text-sm text-gray-600">Créer une commande sur mesure</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/orders"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                  <FiShoppingBag className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Commandes Boutique</h3>
                  <p className="text-sm text-gray-600">Gérer les ventes en ligne</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/customers"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <FiUsers className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Nouveau Client</h3>
                  <p className="text-sm text-gray-600">Ajouter un client à la base</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Dernières Commandes</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Montant</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Statut</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-500">Chargement...</td>
                    </tr>
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-500">Aucune commande récente</td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            order.type === 'couture' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.type === 'couture' ? 'Couture' : 'Boutique'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {order.customerName}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {(order.total || order.price || 0).toLocaleString()} FCFA
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              ['completed', 'delivered'].includes(order.status)
                                ? "bg-green-100 text-green-800"
                                : ['cancelled'].includes(order.status)
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status === 'completed' ? 'Terminé' :
                             order.status === 'delivered' ? 'Livré' :
                             order.status === 'cancelled' ? 'Annulé' :
                             order.status === 'pending' ? 'En attente' : 'En cours'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {order.createdAt?.toDate 
                            ? order.createdAt.toDate().toLocaleDateString('fr-FR')
                            : new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
    </AdminLayout>
  );
};

export default Dashboard;
