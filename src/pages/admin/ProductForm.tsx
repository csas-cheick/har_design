import { FC, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  FiArrowLeft,
  FiSave,
  FiPackage,
  FiUpload
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { uploadToCloudinary } from "../../utils/cloudinary";

const ProductForm: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Vêtements",
    price: "",
    stock: "",
    description: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (isEditMode && id) {
        try {
          const docRef = doc(db, "products", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              name: data.name,
              category: data.category,
              price: data.price.toString(),
              stock: data.stock.toString(),
              description: data.description,
              image: data.image
            });
            setImagePreview(data.image);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };
    fetchProduct();
  }, [isEditMode, id]);

  const categories = ["Vêtements", "Chaussures", "Accessoires", "Couture"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
        image: imageUrl,
        updatedAt: new Date().toISOString()
      };

      if (isEditMode && id) {
        await updateDoc(doc(db, "products", id), productData);
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: new Date().toISOString()
        });
      }

      navigate("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Une erreur est survenue lors de l'enregistrement du produit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/products"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? "Modifier le produit" : "Nouveau produit"}
                </h1>
                <p className="text-sm text-gray-600">
                  {isEditMode ? "Modifiez les informations du produit" : "Ajoutez un nouveau produit au catalogue"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Image du produit</h2>
            <div className="flex items-start gap-6">
              {/* Preview */}
              <div className="flex-shrink-0">
                <div className="w-40 h-40 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FiPackage className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Upload */}
              <div className="flex-1">
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                    <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Cliquez pour télécharger une image
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG jusqu'à 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, image: "" });
                    }}
                    className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Supprimer l'image
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Informations du produit</h2>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Ex: T-Shirt Classique Premium"
                />
              </div>

              {/* Category & Price */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
                    Catégorie *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-2">
                    Prix (FCFA) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="15000"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-900 mb-2">
                  Quantité en stock *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="50"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Décrivez le produit..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              to="/admin/products"
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-center"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              ) : (
                <FiSave className="w-5 h-5" />
              )}
              {loading ? "Enregistrement..." : (isEditMode ? "Enregistrer les modifications" : "Ajouter le produit")}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProductForm;
