import { FC, useState, useEffect } from "react";
import { 
  FiDollarSign, 
  FiPlus,
  FiMinus,
  FiPrinter,
  FiCalendar,
  FiCreditCard,
  FiTrendingUp
} from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

interface Transaction {
  id: string;
  type: "entree" | "sortie" | "vente";
  amount: number;
  description: string;
  paymentMethod: "especes" | "mobile" | "carte";
  timestamp: string;
}

const Cash: FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<"entree" | "sortie">("entree");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    paymentMethod: "especes" as "especes" | "mobile" | "carte",
  });

  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      setTransactions(transactionsData);
    });

    return () => unsubscribe();
  }, []);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Calculs
  const todayTransactions = transactions.filter(t => t.timestamp.startsWith(selectedDate));
  const totalVentes = todayTransactions.filter(t => t.type === "vente").reduce((sum, t) => sum + t.amount, 0);
  const totalEntrees = todayTransactions.filter(t => t.type === "entree").reduce((sum, t) => sum + t.amount, 0);
  const totalSorties = todayTransactions.filter(t => t.type === "sortie").reduce((sum, t) => sum + t.amount, 0);
  const soldeJournalier = totalVentes + totalEntrees - totalSorties;

  // Statistiques par mode de paiement
  const especes = todayTransactions.filter(t => t.paymentMethod === "especes" && t.type !== "sortie").reduce((sum, t) => sum + t.amount, 0);
  const mobile = todayTransactions.filter(t => t.paymentMethod === "mobile" && t.type !== "sortie").reduce((sum, t) => sum + t.amount, 0);
  const carte = todayTransactions.filter(t => t.paymentMethod === "carte" && t.type !== "sortie").reduce((sum, t) => sum + t.amount, 0);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "transactions"), {
        type: transactionType,
        amount: parseFloat(formData.amount),
        description: formData.description,
        paymentMethod: formData.paymentMethod,
        timestamp: new Date().toISOString(),
        userId: user?.id
      });
      setShowTransactionModal(false);
      setFormData({ amount: "", description: "", paymentMethod: "especes" });
    } catch (error) {
      console.error("Error adding transaction: ", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AdminLayout>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion de la Caisse</h2>
          <p className="text-gray-600 mt-1">Suivez les mouvements de caisse journaliers</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Imprimer"
            title="Imprimer"
          >
            <FiPrinter className="w-5 h-5" />
          </button>
          <button
                onClick={() => {
                  setTransactionType("entree");
                  setShowTransactionModal(true);
                }}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                Entrée
              </button>
              <button
                onClick={() => {
                  setTransactionType("sortie");
                  setShowTransactionModal(true);
                }}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <FiMinus className="w-5 h-5" />
                Sortie
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Stats and Date */}
            <div className="lg:col-span-1 space-y-6">
              {/* Date Selector */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:hidden">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Période</h3>
                <div className="flex items-center gap-3">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    aria-label="Sélectionner une date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {todayTransactions.length} transaction{todayTransactions.length > 1 ? "s" : ""}
                </p>
              </div>

              {/* Stats Summary */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-sm p-6 text-white print:hidden">
                <h3 className="text-sm font-semibold mb-4 opacity-90">Résumé du jour</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs opacity-75 mb-1">Ventes sur site</p>
                    <p className="text-2xl font-bold">{formatPrice(totalVentes)} FCFA</p>
                  </div>
                  <div className="h-px bg-white/20"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs opacity-75 mb-1">Entrées</p>
                      <p className="text-lg font-semibold text-green-400">+{formatPrice(totalEntrees)}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-75 mb-1">Sorties</p>
                      <p className="text-lg font-semibold text-red-400">-{formatPrice(totalSorties)}</p>
                    </div>
                  </div>
                  <div className="h-px bg-white/20"></div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-xs opacity-75 mb-1">Solde journalier</p>
                    <p className={`text-2xl font-bold ${soldeJournalier >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {formatPrice(soldeJournalier)} FCFA
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:hidden">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Modes de paiement</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FiDollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Espèces</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{formatPrice(especes)} FCFA</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FiCreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Mobile Money</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{formatPrice(mobile)} FCFA</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FiCreditCard className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Carte bancaire</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{formatPrice(carte)} FCFA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Transactions */}
            <div className="lg:col-span-2">
              {/* Transactions List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-0">
            {/* Print Header - Only visible when printing */}
            <div className="hidden print:block print:mb-4">
              <div className="flex justify-between items-start print:mb-3">
                <div>
                  <h1 className="text-xl font-bold">HAR DESIGN</h1>
                  <p className="text-xs text-gray-600">Niamey, Niger</p>
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-bold">RAPPORT DE CAISSE</h2>
                  <p className="text-xs text-gray-600">
                    {new Date(selectedDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500">
                    Imprimé: {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="border-b-2 border-black print:mb-3"></div>
            </div>

            <div className="p-4 md:p-6 border-b border-gray-200 print:hidden">
              <h3 className="text-lg font-bold text-gray-900">Transactions du jour</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] print:text-sm">
                <thead className="bg-gray-50 print:bg-gray-100">
                  <tr>
                    <th className="text-left py-3 px-4 md:px-6 text-sm font-semibold text-gray-900 print:py-2 print:px-3">Heure</th>
                    <th className="text-left py-3 px-4 md:px-6 text-sm font-semibold text-gray-900 print:py-2 print:px-3">Type</th>
                    <th className="text-left py-3 px-4 md:px-6 text-sm font-semibold text-gray-900 print:py-2 print:px-3">Description</th>
                    <th className="text-left py-3 px-4 md:px-6 text-sm font-semibold text-gray-900 print:py-2 print:px-3">Paiement</th>
                    <th className="text-right py-3 px-4 md:px-6 text-sm font-semibold text-gray-900 print:py-2 print:px-3">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {todayTransactions.length > 0 ? (
                    todayTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors print:hover:bg-transparent">
                        <td className="py-4 px-4 md:px-6 text-sm text-gray-600 print:py-1.5 print:px-3">
                          {formatTime(transaction.timestamp)}
                        </td>
                        <td className="py-4 px-4 md:px-6 print:py-1.5 print:px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full print:px-2 print:py-0.5 print:text-xs ${
                              transaction.type === "vente"
                                ? "bg-green-100 text-green-800"
                                : transaction.type === "entree"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.type === "vente" ? (
                              <FiTrendingUp className="w-4 h-4 print:hidden" />
                            ) : transaction.type === "entree" ? (
                              <FiPlus className="w-4 h-4 print:hidden" />
                            ) : (
                              <FiMinus className="w-4 h-4 print:hidden" />
                            )}
                            {transaction.type === "vente" ? "Vente" : transaction.type === "entree" ? "Entrée" : "Sortie"}
                          </span>
                        </td>
                        <td className="py-4 px-4 md:px-6 text-sm text-gray-900 print:py-1.5 print:px-3">
                          {transaction.description}
                        </td>
                        <td className="py-4 px-4 md:px-6 print:py-1.5 print:px-3">
                          <span className="text-sm text-gray-600 capitalize print:text-xs">
                            {transaction.paymentMethod === "especes" ? "Espèces" : transaction.paymentMethod === "mobile" ? "Mobile Money" : "Carte"}
                          </span>
                        </td>
                        <td className="py-4 px-4 md:px-6 text-right print:py-1.5 print:px-3">
                          <span
                            className={`font-semibold print:text-sm ${
                              transaction.type === "sortie" ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {transaction.type === "sortie" ? "-" : "+"}{formatPrice(transaction.amount)} FCFA
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <FiDollarSign className="w-12 h-12 mb-3" />
                          <p className="font-medium">Aucune transaction pour cette date</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Print Footer - Totals - Only visible when printing */}
            <div className="hidden print:block print:mt-4 print:pt-3 border-t-2 border-black">
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Total Ventes:</span>
                  <span className="font-bold text-green-600">{formatPrice(totalVentes)} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Espèces:</span>
                  <span className="font-bold">{formatPrice(especes)} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Entrées:</span>
                  <span className="font-bold text-blue-600">{formatPrice(totalEntrees)} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Mobile Money:</span>
                  <span className="font-bold">{formatPrice(mobile)} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Sorties:</span>
                  <span className="font-bold text-red-600">-{formatPrice(totalSorties)} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Carte bancaire:</span>
                  <span className="font-bold">{formatPrice(carte)} FCFA</span>
                </div>
              </div>
              <div className="border-t border-gray-400 mt-2 pt-2 flex justify-between items-center">
                <span className="text-lg font-bold">SOLDE JOURNALIER:</span>
                <span className={`text-lg font-bold ${soldeJournalier >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatPrice(soldeJournalier)} FCFA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center p-4" onClick={() => setShowTransactionModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Ajouter une {transactionType === "entree" ? "entrée" : "sortie"}
                </h3>
                <button
                  onClick={() => setShowTransactionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiMinus className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-900 mb-2">
                    Montant (FCFA) *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    min="0"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="15000"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder={transactionType === "entree" ? "Ex: Approvisionnement" : "Ex: Achat fournitures"}
                  />
                </div>

                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-900 mb-2">
                    Mode de paiement *
                  </label>
                  <select
                    id="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as "especes" | "mobile" | "carte" })}
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="especes">Espèces</option>
                    <option value="mobile">Mobile Money</option>
                    <option value="carte">Carte bancaire</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTransactionModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 px-4 py-3 rounded-lg font-medium text-white transition-colors ${
                      transactionType === "entree" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Cash;
