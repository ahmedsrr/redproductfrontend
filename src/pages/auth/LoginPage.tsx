
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Icons } from '../../components/icons/Icons';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@red.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
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
        <h2 className="text-lg font-bold text-gray-800 text-center mb-2">Connectez-vous en tant que Admin</h2>
        <p className="text-center text-gray-400 text-sm mb-8">Enter your credentials below</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input 
            label="E-mail" 
            type="email" 
            name="email"
            id="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email address"
            required
          />

          <div className="mb-4">
             <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-bold text-gray-400 uppercase tracking-wide">Mot de passe</label>
                <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-gray-600 focus:outline-none hover:underline">Mot de passe oublié?</Link>
             </div>
             <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[#363740] focus:ring-gray-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
              Gardez-moi connecté
            </label>
          </div>

          {error && (
            <div className="p-3 rounded bg-red-50 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} variant="dark" className="h-12 text-base">
            Se connecter
          </Button>
        </form>

        <div className="mt-8 text-center">
             <p className="text-sm text-gray-500">
               Vous n'avez pas de compte?{' '}
               <Link to="/register" className="font-medium text-[#363740] hover:underline">
                 S'inscrire
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
