import { FC, useState, useEffect } from "react";
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiX,
  FiScissors,
  FiUpload,
  FiSearch
} from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout";
import { db } from "../../firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { uploadToCloudinary } from "../../utils/cloudinary";

interface CoutureModel {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const CoutureModels: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [models, setModels] = useState<CoutureModel[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingModel, setEditingModel] = useState<CoutureModel | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: ""
  });

  useEffect(() => {
    const q = query(collection(db, "couture_models"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const modelsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CoutureModel[];
      setModels(modelsData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.image;

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const modelData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: imageUrl
      };

      if (editingModel) {
        await updateDoc(doc(db, "couture_models", editingModel.id), modelData);
      } else {
        await addDoc(collection(db, "couture_models"), modelData);
      }

      setShowModal(false);
      setEditingModel(null);
      setFormData({ name: "", description: "", price: "", image: "" });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error saving model:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (model: CoutureModel) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      description: model.description,
      price: model.price.toString(),
      image: model.image
    });
    setImagePreview(model.image);
    setShowModal(true);
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

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce modèle ?")) {
      try {
        await deleteDoc(doc(db, "couture_models", id));
      } catch (error) {
        console.error("Error deleting model:", error);
      }
    }
  };

  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Modèles de Couture</h2>
          <p className="text-gray-600 mt-1">Gérez votre catalogue de modèles</p>
        </div>
        <button
          onClick={() => {
            setEditingModel(null);
            setFormData({ name: "", description: "", price: "", image: "" });
            setImageFile(null);
            setImagePreview(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Nouveau Modèle
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredModels.map((model) => (
              <div key={model.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
                <div className="relative h-48 bg-gray-100">
                  {model.image ? (
                    <img src={model.image} alt={model.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FiScissors className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(model)}
                      className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100"
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(model.id)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">{model.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{model.description}</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">{model.price.toLocaleString()} FCFA</p>
                </div>
              </div>
            ))}
          </div>


      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingModel ? "Modifier le modèle" : "Nouveau modèle"}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-1">Nom du modèle</label>
                  <input
                    id="modelName"
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="modelPrice" className="block text-sm font-medium text-gray-700 mb-1">Prix de base (FCFA)</label>
                  <input
                    id="modelPrice"
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="modelDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="modelDescription"
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image du modèle</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-black transition-colors cursor-pointer relative">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageFile(null);
                              setImagePreview(null);
                              setFormData({ ...formData, image: "" });
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700 focus-within:outline-none"
                            >
                              <span>Télécharger une image</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? "Enregistrement..." : (editingModel ? "Mettre à jour" : "Créer le modèle")}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CoutureModels;
