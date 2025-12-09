


            
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;   // 'admin' | 'user'
  avatar?: string;
  created_at?: string;
}

export interface Hotel {
  id: number;
  name: string;
  address: string;
  price: string;
  image: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: 'Active' | 'Out of Stock' | 'Low Stock';
}

// Configuration de l'URL du Backend Laravel
const API_URL = import.meta.env.VITE_APP_API_URL;

const getHeaders = () => {
  const token = localStorage.getItem('auth_token');
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper pour gérer les réponses
const handleResponse = async (response: Response) => {
    // Vérification spécifique pour l'erreur 404 (Route non définie côté Laravel)
    if (response.status === 404) {
        throw new Error(`Erreur 404: La route '${response.url}' n'existe pas sur le serveur Laravel. Exécutez 'php artisan route:list' pour vérifier vos routes. Assurez-vous d'avoir exécuté 'php artisan install:api' (Laravel 11) et 'php artisan route:clear'.`);
    }

    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
            // Gestion fine des erreurs de validation Laravel (422)
            if (data.errors) {
                const firstErrorKey = Object.keys(data.errors)[0];
                throw new Error(data.errors[firstErrorKey][0]);
            }
            throw new Error(data.message || 'Une erreur est survenue');
        }
        return data;
    } else {
        // Fallback si le serveur renvoie du HTML (ex: erreur 500 Laravel par défaut)
        const text = await response.text();
        console.error("Réponse non-JSON du serveur:", text);
        if (!response.ok) {
            throw new Error(`Erreur serveur (${response.status}). Le serveur a renvoyé une page HTML au lieu de JSON. Vérifiez les logs Laravel.`);
        }
        return null; 
    }
};


export const api = {
  // Récupère l'utilisateur courant via le Token JWT
  getMe: async (): Promise<User> => {
    try {
        const response = await fetch(`${API_URL}/user`, {
            headers: getHeaders(),
        });
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
  },

  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return await handleResponse(response);
    } catch (error: any) {
        console.error("Erreur Login:", error);
        throw new Error(error.message || "Erreur de connexion au serveur");
    }
  },

  register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
        // Note: On envoie password_confirmation = password pour satisfaire la validation Laravel 'confirmed'
        // sans obliger l'utilisateur à le saisir deux fois.
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ name, email, password, password_confirmation: password }),
        });
        return await handleResponse(response);
    } catch (error: any) {
        console.error("Erreur Register:", error);
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
             throw new Error("Impossible de contacter le serveur Laravel. Vérifiez qu'il est lancé (php artisan serve).");
        }
        throw error;
    }
  },

  logout: async () => {
    try {
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: getHeaders(),
        });
    } catch (e) {
        console.error("Erreur logout api", e);
    }
  },

  forgotPassword: async (email: string) => {
    try {
        const response = await fetch(`${API_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ email }),
        });
        return await handleResponse(response);
    } catch (error: any) {
        throw new Error(error.message || "Erreur serveur");
    }
  },

  getProducts: async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}/products`, {
            headers: getHeaders(),
        });
        if (!response.ok) return []; 
        return await response.json();
    } catch (e) {
        console.error("Erreur getProducts", e);
        return [];
    }
  },

  getHotels: async (): Promise<Hotel[]> => {
    try {
        const response = await fetch(`${API_URL}/hotels`, {
            headers: getHeaders(),
        });
        // Si le backend répond correctement, on retourne les données
        const data = await handleResponse(response);
        // Si le tableau est vide (base de données vierge), on retourne les donnees locales
        if (Array.isArray(data) && data.length === 0) throw new Error("Empty DB");
        return data;
    } catch (error: any) {
        console.warn("API Hôtels inaccessible ou vide, utilisation des données locales (Mock).", error);
        
        // DONNÉES DE SECOURS (MOCK AVEC IMAGES LOCALES). Ces donnees ne sont plus utilisees car le backend fonctionne
        // Les images doivent être placées dans le dossier 'public/images/hotels/'
        return [
          {
            id: 1,
            name: "Hôtel Terrou-Bi",
            address: "Boulevard Martin Luther King Dakar, 11500",
            price: "25.000 XOF par nuit",
            image: "/images/hotels/terrou-bi.jpg",
            description: "Luxe et confort au bord de l'océan."
          },
          {
            id: 2,
            name: "King Fahd Palace",
            address: "Rte des Almadies, Dakar",
            price: "20.000 XOF par nuit",
            image: "/images/hotels/king-fahd.jpg",
            description: "Un palais moderne pour vos séjours."
          },
          {
            id: 3,
            name: "Radisson Blu Hotel",
            address: "Rte de la Corniche O, Dakar 16868",
            price: "22.000 XOF par nuit",
            image: "/images/hotels/radisson.jpg",
            description: "Design contemporain et vue imprenable."
          },
          {
            id: 4,
            name: "Pullman Dakar Teranga",
            address: "Place de l'Independance, 10 Rue PL 29, Dakar",
            price: "30.000 XOF par nuit",
            image: "/images/hotels/pullman.jpg",
            description: "Au cœur du quartier des affaires."
          },
          {
            id: 5,
            name: "Hôtel Lac Rose",
            address: "Lac Rose, Dakar",
            price: "25.000 XOF par nuit",
            image: "/images/hotels/lac-rose.jpg",
            description: "Sérénité au bord du lac."
          },
          {
            id: 6,
            name: "Hôtel Saly",
            address: "Mbour, Sénégal",
            price: "20.000 XOF par nuit",
            image: "/images/hotels/saly.jpg",
            description: "Détente assurée sur la petite côte."
          },
          {
            id: 7,
            name: "Palm Beach Resort & Spa",
            address: "BP64, Saly 23000",
            price: "22.000 XOF par nuit",
            image: "/images/hotels/palm-beach.jpg",
            description: "Luxe et spa à Saly."
          },
          {
            id: 8,
            name: "Pullman Dakar Teranga",
            address: "Place de l'Independance, 10 Rue PL 29, Dakar",
            price: "30.000 XOF par nuit",
            image: "/images/hotels/pullman-2.jpg",
            description: "L'excellence au centre-ville."
          }
        ];
    }
  },

            // Récupération des utilisateurs (pour le dashboard)
  getUsers: async (): Promise<User[]> => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'GET',
            headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        });
        const data = await handleResponse(response);
        if (Array.isArray(data) && data.length === 0) throw new Error("Empty DB");
        return data;
    } catch (error) {
        console.warn("API Users inaccessible ou vide, utilisation mock.", error);
        // Fallback Mock Data si l'API n'a pas la route /users
        return [
            { id: 1, name: "Admin User", email: "admin@red.com", role: "admin" },
            { id: 2, name: "John Doe", email: "john@test.com", role: "user" },
            { id: 3, name: "Jane Smith", email: "jane@test.com", role: "user" },
            { id: 4, name: "Alice Cooper", email: "alice@test.com", role: "user" },
            { id: 5, name: "Bob Marley", email: "bob@test.com", role: "user" }
        ];
    }
  },

 

  createHotel: async (formData: FormData): Promise<Hotel> => {
    try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/hotels`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                // Important: ne pas définir Content-Type pour FormData, le navigateur le fait automatiquement avec les boundary
            },
            body: formData,
        });
        return await handleResponse(response);
    } catch (error: any) {
        console.error("Erreur createHotel", error);
        throw error;
    }
  }
};
