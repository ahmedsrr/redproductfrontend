import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './services/api';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';


export const CreateHotelPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    price: '',
    currency: 'XOF',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('address', formData.address);
      
      // Sending raw number for price as requested
      data.append('price', formData.price); 
      // Sending currency as a separate field if supported, or for consistency
      data.append('currency', formData.currency);

      data.append('description', `Email: ${formData.email}, Tél: ${formData.phone}`);
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      await api.createHotel(data);
      navigate('/hotels');
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de l'hôtel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec bouton retour */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-6">
        <button 
            onClick={() => navigate('/hotels')} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
        </button>
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Créer un nouveau hôtel</h2>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            
            {/* Colonne Gauche */}
            <div className="space-y-4">
               <Input 
                 label="Nom de l'hôtel"
                 type="text"
                 name="name"
                 id="hotel-name"
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                 placeholder="CAP Marniane"
                 className="!mb-0"
                 required
               />
               
               <Input 
                 label="E-mail"
                 type="email"
                 name="email"
                 id="hotel-email"
                 value={formData.email}
                 onChange={(e) => setFormData({...formData, email: e.target.value})}
                 placeholder="information@gmail.com"
                 className="!mb-0"
                 required
               />

               <Input 
                 label="Prix par nuit"
                 type="number"
                 name="price"
                 id="hotel-price"
                 value={formData.price}
                 onChange={(e) => setFormData({...formData, price: e.target.value})}
                 placeholder="25000"
                 className="!mb-0"
                 required
               />
            </div>

            {/* Colonne Droite */}
            <div className="space-y-4">
               <Input 
                 label="Adresse"
                 type="text"
                 name="address"
                 id="hotel-address"
                 value={formData.address}
                 onChange={(e) => setFormData({...formData, address: e.target.value})}
                 placeholder="Les îles du saloum, Mar Lodj"
                 className="!mb-0"
                 required
               />

               <Input 
                 label="Numéro de téléphone"
                 type="tel"
                 name="phone"
                 id="hotel-phone"
                 value={formData.phone}
                 onChange={(e) => setFormData({...formData, phone: e.target.value})}
                 placeholder="+221 77 777 77 77"
                 className="!mb-0"
                 required
               />

               <div className="mb-0">
                 <label htmlFor="currency" className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Devise</label>
                 <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors appearance-none"
                 >
                    <option value="XOF">F XOF</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar ($)</option>
                 </select>
               </div>
            </div>
          </div>

          {/* Zone Image */}
          <div className="mt-6">
             <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Ajouter une photo</label>
             <div 
                className={`border-2 border-dashed border-gray-200 rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden ${!imagePreview ? 'bg-white' : ''}`}
                onClick={() => fileInputRef.current?.click()}
             >
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <>
                        <div className="text-gray-300 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-gray-400 text-sm font-medium">Ajouter une photo</span>
                    </>
                )}
                <input 
                    id="hotel-image"
                    name="image"
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                />
             </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}

          <div className="mt-8 flex justify-end">
             <Button type="submit" loading={loading} variant="dark" className="!w-auto px-8 py-3 rounded-lg text-sm font-medium">
                Enregistrer
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
