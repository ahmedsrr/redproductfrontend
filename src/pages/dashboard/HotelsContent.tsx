import { useState,useEffect } from 'react';
import { api, Hotel } from '../../services/api';
import { Icons } from '../../components/icons/Icons';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';


export const HotelsContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupération des hôtels depuis l'API
    api.getHotels().then((data) => {
      setHotels(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* En-tête de la liste avec compteur et bouton d'action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white px-6 py-4 rounded shadow-sm border border-gray-100 gap-4">
         <div className="flex items-baseline gap-2">
            <h2 className="text-xl font-normal text-gray-800">Hôtels</h2>
            <span className="text-gray-300 text-xl font-light">{hotels.length}</span>
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
            hotels.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group cursor-pointer">
                    {/* Image de l'hôtel */}
                    <div className="relative h-44 overflow-hidden">
                        <img 
                            src={hotel.image} 
                            alt={hotel.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            onError={(e) => {
                                // Log l'erreur pour aider au débogage
                                console.error(`Erreur chargement image pour ${hotel.name}:`, hotel.image);
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
                            {hotel.price}
                        </p>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};
