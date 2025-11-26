import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiPackage, 
  FiShoppingBag, 
  FiUsers, 
  FiDollarSign, 
  FiTrendingUp,
  FiLogOut,
  FiSettings
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const Dashboard: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const stats = [
    { 
      label: "Revenus du mois", 
      value: "1 250 000 FCFA", 
      icon: FiDollarSign, 
      color: "bg-green-500",
      trend: "+12.5%"
    },
    { 
      label: "Commandes", 
      value: "156", 
      icon: FiShoppingBag, 
      color: "bg-blue-500",
      trend: "+8.2%"
    },
    { 
      label: "Produits", 
      value: "89", 
      icon: FiPackage, 
      color: "bg-purple-500",
      trend: "+3"
    },
    { 
      label: "Clients", 
      value: "342", 
      icon: FiUsers, 
      color: "bg-orange-500",
      trend: "+23"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HAR DESIGN</h1>
              <p className="text-sm text-gray-600">Dashboard Administrateur</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Déconnexion"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-1">
            <Link
              to="/admin"
              className="flex items-center gap-3 px-4 py-3 text-gray-900 bg-gray-100 rounded-lg font-medium"
            >
              <FiTrendingUp className="w-5 h-5" />
              <span>Tableau de bord</span>
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FiPackage className="w-5 h-5" />
              <span>Produits</span>
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FiShoppingBag className="w-5 h-5" />
              <span>Commandes</span>
            </Link>
            <Link
              to="/admin/customers"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FiUsers className="w-5 h-5" />
              <span>Clients</span>
            </Link>
            <Link
              to="/admin/measurements"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FiSettings className="w-5 h-5" />
              <span>Mesures Couture</span>
            </Link>
            <Link
              to="/admin/cash"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FiDollarSign className="w-5 h-5" />
              <span>Caisse</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <FiTrendingUp className="w-4 h-4" />
                    {stat.trend}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link
              to="/admin/products/new"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FiPackage className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ajouter un produit</h3>
                  <p className="text-sm text-gray-600">Nouveau produit au catalogue</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/orders"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                  <FiShoppingBag className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Voir les commandes</h3>
                  <p className="text-sm text-gray-600">Gérer les commandes en cours</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/measurements"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <FiSettings className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mesures clients</h3>
                  <p className="text-sm text-gray-600">Enregistrer les mesures</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Commandes récentes</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      N° Commande
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Client
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Montant
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Statut
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "#001", client: "Jean Dupont", amount: "45 000", status: "En cours", date: "24/11/2025" },
                    { id: "#002", client: "Marie Martin", amount: "78 000", status: "Livrée", date: "23/11/2025" },
                    { id: "#003", client: "Ahmed Ibrahim", amount: "125 000", status: "En cours", date: "23/11/2025" },
                    { id: "#004", client: "Fatima Moussa", amount: "32 000", status: "En attente", date: "22/11/2025" },
                  ].map((order, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{order.client}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{order.amount} FCFA</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            order.status === "Livrée"
                              ? "bg-green-100 text-green-800"
                              : order.status === "En cours"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
