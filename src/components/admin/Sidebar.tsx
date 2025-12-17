import { FC, useState, ElementType } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FiPackage, 
  FiShoppingBag, 
  FiUsers, 
  FiTrendingUp,
  FiChevronDown,
  FiChevronRight
} from "react-icons/fi";

interface MenuItem {
  path?: string;
  icon: ElementType;
  label: string;
  exact?: boolean;
  children?: { path: string; label: string; icon?: ElementType }[];
}

const Sidebar: FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Catalogue", "Ventes", "Clients"]);

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const menuItems: MenuItem[] = [
    { path: "/admin", icon: FiTrendingUp, label: "Tableau de bord", exact: true },
    { 
      label: "Catalogue", 
      icon: FiPackage,
      children: [
        { path: "/admin/products", label: "Produits Boutique" },
        { path: "/admin/couture-models", label: "Modèles Couture" }
      ]
    },
    { 
      label: "Ventes", 
      icon: FiShoppingBag,
      children: [
        { path: "/admin/orders", label: "Commandes boutique" },
        { path: "/admin/custom-orders", label: "Commandes couture" },
        { path: "/admin/cash", label: "Caisse" }
      ]
    },
    { 
      label: "Clients", 
      icon: FiUsers,
      children: [
        { path: "/admin/customers", label: "Liste des Clients" },
        { path: "/admin/measurements", label: "Mesures" }
      ]
    }
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const isChildActive = (children: { path: string }[]) => {
    return children.some(child => currentPath.startsWith(child.path));
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto flex-none">
      <nav className="p-4 space-y-1">
        {menuItems.map((item, index) => {
          if (item.children) {
            const isExpanded = expandedMenus.includes(item.label);
            const activeChild = isChildActive(item.children);
            
            return (
              <div key={index} className="space-y-1">
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    activeChild ? "text-gray-900 bg-gray-50 font-medium" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {isExpanded ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
                </button>
                
                {isExpanded && (
                  <div className="pl-11 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                          isActive(child.path)
                            ? "text-black font-medium bg-gray-100"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path!}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path!, item.exact)
                  ? "text-gray-900 bg-gray-100 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
