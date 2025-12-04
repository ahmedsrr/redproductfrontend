
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Icons } from '../../components/icons/Icons';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        await register(name, email, password);
        navigate('/dashboard');
    } catch (err: any) {
        setError(err.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#363740] p-4">
      <div className="flex items-center gap-3 mb-8">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full p-2 flex items-center justify-center">
               <Icons.Logo className="w-full h-full text-[#363740]" /> 
            </div>
            <span className="text-xl font-bold text-white tracking-wider opacity-90">RED PRODUCT</span>
         </div>
      </div>

      <div className="w-full max-w-[380px] bg-white rounded-lg px-8 py-10 shadow-2xl">
        <h2 className="text-lg font-bold text-gray-800 text-center mb-2">S'inscrire</h2>
        <p className="text-center text-gray-400 text-sm mb-8">Créez votre nouveau compte</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input 
            label="Nom" 
            type="text" 
            name="name"
            id="name"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Votre nom" 
            required
          />
          <Input 
            label="E-mail" 
            type="email" 
            name="email"
            id="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="votre@email.com" 
            required
          />
          <Input 
            label="Mot de passe" 
            type="password" 
            name="password"
            id="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••" 
            required
          />
          
          <div className="flex items-center mt-4">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-[#363740] focus:ring-gray-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 cursor-pointer">
              J'accepte les termes et conditions
            </label>
          </div>

          {error && (
            <div className="p-3 rounded bg-red-50 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} variant="dark" className="h-12 text-base">
            S'inscrire
          </Button>
        </form>

        <div className="mt-8 text-center">
             <p className="text-sm text-gray-500">
               Vous avez déjà un compte?{' '}
               <Link to="/login" className="font-medium text-[#363740] hover:underline">
                 Se connecter
               </Link>
             </p>
        </div>
      </div>
      
      <div className="mt-8 text-gray-500 text-sm">
        &copy; 2023 Red Product. All rights reserved.
      </div>
    </div>
  );
};
