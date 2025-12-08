import { useState,useEffect } from 'react';
import { api, Hotel } from '../../services/api';
import { Icons } from '../../components/icons/Icons';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';



export const HotelsContent = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  
  // 'allHotels' stocke la totalité des données récupérées une seule fois
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  // 'hotels' stocke la liste filtrée affichée à l'écran
  const [hotels, setHotels] = useState<Hotel[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupération du terme de recherche depuis l'URL
  const searchTerm = searchParams.get('search') || '';

  // 1. Chargement initial de TOUS les hôtels (une seule fois)
  useEffect(() => {
    setLoading(true);
    api.getHotels() // Appel sans paramètre de recherche pour tout récupérer
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];
        setAllHotels(safeData);
        setHotels(safeData); // Au départ, on affiche tout
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load hotels", err);
        setError(err.message);
        setAllHotels([]);
        setHotels([]);
        setLoading(false);
      });
  }, []); // Tableau de dépendances vide = exécution unique au montage

  // 2. Filtrage local à chaque changement du terme de recherche
  useEffect(() => {
    if (!searchTerm) {
        setHotels(allHotels);
    } else {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = allHotels.filter(hotel => 
            hotel.name.toLowerCase().includes(lowerTerm) || 
            hotel.address.toLowerCase().includes(lowerTerm)
        );
        setHotels(filtered);
    }
  }, [searchTerm, allHotels]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    if (term) {
        setSearchParams({ search: term });
    } else {
        setSearchParams({});
    }
  };

  return (
    <div className="space-y-6">
      {/* Affichage de l'erreur réseau si présente */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-red-700 font-bold">Erreur de connexion au serveur</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
            </div>
        </div>
      )}

      {/* En-tête de la liste avec compteur, recherche et bouton d'action */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white px-6 py-4 rounded shadow-sm border border-gray-100 gap-4">
         <div className="flex items-baseline gap-2 w-full md:w-auto">
            <h2 className="text-xl font-normal text-gray-800">Hôtels</h2>
            <span className="text-gray-300 text-xl font-light">{hotels?.length || 0}</span>
         </div>
         
         <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
             {/* Barre de recherche */}
             <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Icons.Search />
                </div>
                <input 
                    type="text"
                    placeholder="Rechercher par nom ou adresse..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 w-full"
                    value={searchTerm}
                    onChange={handleSearch}
                />
             </div>

             <Button 
                variant="secondary" 
                className="!w-full sm:!w-auto border border-gray-200 !text-gray-700 hover:!bg-gray-50 !py-2 !px-4 !rounded-md shadow-sm"
                onClick={() => navigate('/hotels/create')}
             >
                <div className="flex items-center justify-center gap-2">
                    <Icons.Plus />
                    <span className="font-medium">Créer un nouveau hôtel</span>
                </div>
             </Button>
         </div>
      </div>

      {/* Grille des hôtels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
             // Skeletons de chargement pour un effet visuel fluide
             [1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 animate-pulse h-[280px]">
                   <div className="h-40 bg-gray-200"></div>
                   <div className="p-4 space-y-3">
                      <div className="h-3 bg-gray-200 w-1/2 rounded"></div>
                      <div className="h-5 bg-gray-200 w-3/4 rounded"></div>
                      <div className="h-3 bg-gray-200 w-1/3 rounded"></div>
                   </div>
                </div>
             ))
        ) : (
            // Validation finale avant le map pour éviter le crash
            Array.isArray(hotels) && hotels.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group cursor-pointer">
                    {/* Image de l'hôtel */}
                    <div className="relative h-44 overflow-hidden">
                        <img 
                            src={hotel.image} 
                            alt={hotel.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            onError={(e) => {
                                // Fallback si l'image ne charge pas
                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                            }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300"></div>
                    </div>
                    
                    {/* Contenu de la carte */}
                    <div className="p-4 flex flex-col gap-1">
                        <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider truncate">
                            {hotel.address}
                        </p>
                        <h3 className="text-base font-bold text-gray-800 leading-tight group-hover:text-red-600 transition-colors">
                            {hotel.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-light mt-1">
                            {/* Affichage conditionnel selon si le prix est un nombre ou une chaîne déjà formatée */}
                            {typeof hotel.price === 'number' || !isNaN(Number(hotel.price)) 
                                ? `${hotel.price} ${hotel.currency || 'XOF'} par nuit` 
                                : hotel.price}
                        </p>
                    </div>
                </div>
            ))
        )}
        
        {!loading && hotels.length === 0 && !error && (
            <div className="col-span-full py-12 text-center text-gray-400">
                <p>{searchTerm ? `Aucun résultat pour "${searchTerm}"` : "Aucun hôtel trouvé. Commencez par en créer un !"}</p>
            </div>
        )}
      </div>
    </div>
  );
};
