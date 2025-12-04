import { Icons } from '../../components/icons/Icons';

export const DashboardContent = () => {
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
      value: '600', 
      desc: 'Je ne sais pas quoi mettre', 
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
      value: '40', 
      desc: 'Je ne sais pas quoi mettre', 
      icon: Icons.P_Letter, 
      color: 'bg-[#9C27B0]', // Darker Purple
      iconColor: 'text-white'
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
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
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
