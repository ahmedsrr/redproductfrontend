

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
  price: string | number;
  image: string;
  description?: string;
  currency?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: 'Active' | 'Out of Stock' | 'Low Stock';
}

// Configuration de l'URL pour la PRODUCTION
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const API_URL = `${API_BASE_URL}/api`;

const getHeaders = () => {
  const token = localStorage.getItem('auth_token');
  const headers: HeadersInit = {
    'Accept': 'application/json',
    // Pas de Content-Type par défaut pour permettre FormData
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper pour gérer les réponses
const handleResponse = async (response: Response) => {
    if (response.status === 404) {
        throw new Error(`Erreur 404: La route '${response.url}' est introuvable sur le serveur.`);
    }

    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
            if (data.errors) {
                const firstErrorKey = Object.keys(data.errors)[0];
                throw new Error(data.errors[firstErrorKey][0]);
            }
            throw new Error(data.message || `Erreur ${response.status}: Une erreur est survenue`);
        }
        return data;
    } else {
        const text = await response.text();
        console.error("Réponse non-JSON du serveur:", text);
        throw new Error(`Erreur serveur (${response.status}). Le serveur a renvoyé du HTML au lieu de JSON.`);
    }
};

const handleNetworkError = (error: any) => {
    console.error("Erreur API:", error);
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
         throw new Error(`Impossible de contacter le serveur à l'adresse ${API_URL}. Vérifiez votre connexion ou la configuration CORS.`);
    }
    throw error;
};

export const api = {
  getMe: async (): Promise<User> => {
    try {
        const response = await fetch(`${API_URL}/user`, {
            method: 'GET',
            headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        });
        return await handleResponse(response);
    } catch (error) {
        throw handleNetworkError(error);
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
        throw handleNetworkError(error);
    }
  },

  register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ name, email, password, password_confirmation: password }),
        });
        return await handleResponse(response);
    } catch (error: any) {
        throw handleNetworkError(error);
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
        throw handleNetworkError(error);
    }
  },

  getProducts: async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'GET',
            headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        });
        if (!response.ok) return []; 
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (e) {
        return [];
    }
  },

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
        return [
            { id: 1, name: "Admin User", email: "admin@red.com", role: "admin" },
            { id: 2, name: "John Doe", email: "john@test.com", role: "user" },
            { id: 3, name: "Jane Smith", email: "jane@test.com", role: "user" },
            { id: 4, name: "Alice Cooper", email: "alice@test.com", role: "user" },
            { id: 5, name: "Bob Marley", email: "bob@test.com", role: "user" }
        ];
    }
  },

  // Récupération des hôtels : Mock + API Réelle
  getHotels: async (search: string = ''): Promise<Hotel[]> => {
    // DONNÉES DE SECOURS (MOCK)
    const mockHotels = [
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

    let combinedHotels = [...mockHotels];

    try {
        const url = search 
            ? `${API_URL}/hotels?search=${encodeURIComponent(search)}` 
            : `${API_URL}/hotels`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        });
        
        // Si l'API marche, on récupère les vraies données
        if (response.ok) {
            const realHotels = await response.json();
            if (Array.isArray(realHotels)) {
                // On fusionne les mocks et les vrais (les vrais en premier ou dernier selon préférence)
                // Ici on met les vrais hôtels APRÈS les mocks pour respecter la demande "8 + le nouveau"
                combinedHotels = [...mockHotels, ...realHotels];
            }
        }
    } catch (error) {
        console.warn("API Hôtels inaccessible, affichage Mock uniquement.", error);
    }

    // Filtrage Local (client-side) sur l'ensemble combiné
    if (search) {
        const lowerSearch = search.toLowerCase();
        return combinedHotels.filter(hotel => 
            hotel.name.toLowerCase().includes(lowerSearch) || 
            hotel.address.toLowerCase().includes(lowerSearch)
        );
    }

    return combinedHotels;
  },

  createHotel: async (formData: FormData): Promise<Hotel> => {
    try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/hotels`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: formData,
        });
        return await handleResponse(response);
    } catch (error: any) {
        throw handleNetworkError(error);
    }
  }
};
