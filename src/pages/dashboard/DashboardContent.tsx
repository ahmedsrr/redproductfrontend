import { Icons } from '../../components/icons/Icons';

export const DashboardContent = () => {
  const navigate = useNavigate();
  // Initialiser avec les valeurs Mock par défaut pour éviter un "0" temporaire disgracieux
  // si le chargement est instantané ou en cas d'erreur.
  const [counts, setCounts] = useState({ hotels: 8, users: 5 }); 

  useEffect(() => {
    const fetchData = async () => {
        try {
            // On récupère en parallèle pour être efficace
            const [hotelsData, usersData] = await Promise.all([
                api.getHotels(),
                api.getUsers()
            ]);
            
            setCounts({
                hotels: Array.isArray(hotelsData) ? hotelsData.length : 8,
                users: Array.isArray(usersData) ? usersData.length : 5
            });
        } catch (error) {
            console.error("Erreur de chargement des données dashboard:", error);
            // On garde les valeurs par défaut (Mock) en cas d'erreur
        }
    };

    fetchData();
  }, []);

  const cards = [
    { 
      label: 'Formulaires', 
      value: '125', 
      desc: 'Je ne sais pas quoi mettre', 
      icon: Icons.Envelope, 
      color: 'bg-[#A88ADD]', // Purple
      iconColor: 'text-white'
    },
    { 
      label: 'Messages', 
      value: '40', 
      desc: 'Je ne sais pas quoi mettre', 
      icon: Icons.P_Letter, 
      color: 'bg-[#00C4B4]', // Teal
      iconColor: 'text-white'
    },
    { 
      label: 'Utilisateurs', 
      value: counts.users.toString(), 
      desc: 'Utilisateurs inscrits', 
      icon: Icons.UsersGroup, 
      color: 'bg-[#FFBE00]', // Yellow
      iconColor: 'text-white'
    },
    { 
      label: 'E-mails', 
      value: '25', 
      desc: 'Je ne sais pas quoi mettre', 
      icon: Icons.Envelope, 
      color: 'bg-[#F20000]', // Red
      iconColor: 'text-white'
    },
    { 
      label: 'Hôtels', 
      value: counts.hotels.toString(), 
      desc: 'Hôtels enregistrés', 
      icon: Icons.P_Letter, 
      color: 'bg-[#9C27B0]', // Darker Purple
      iconColor: 'text-white',
      path: '/hotels'
    },
    { 
      label: 'Entités', 
      value: '02', 
      desc: 'Je ne sais pas quoi mettre', 
      icon: Icons.UsersGroup, 
      color: 'bg-[#1565D8]', // Blue
      iconColor: 'text-white'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
        <h1 className="text-2xl font-light text-gray-800 mb-1">Bienvenue sur RED Product</h1>
        <p className="text-gray-400 text-sm">Lorem ipsum dolor sit amet consectetur</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div 
            key={i} 
            className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-105 ${card.path ? 'cursor-pointer' : ''}`}
            onClick={() => card.path ? navigate(card.path) : null}
          >
             <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${card.color} ${card.iconColor}`}>
                <card.icon />
             </div>
             <div>
                <div className="flex items-baseline gap-2">
                   <span className="text-2xl font-bold text-gray-800">{card.value}</span>
                   <span className="text-sm text-gray-500 font-medium">{card.label}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{card.desc}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

