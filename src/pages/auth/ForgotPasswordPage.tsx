import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Icons } from '../../components/icons/Icons';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call
    await api.forgotPassword(email);
    setLoading(false);
    setSubmitted(true);
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
        <h2 className="text-lg font-bold text-gray-800 text-center mb-2">Mot de passe oublié?</h2>
        <p className="text-center text-gray-400 text-sm mb-8">
            {!submitted 
              ? "Entrez votre adresse e-mail pour réinitialiser votre mot de passe." 
              : "Si un compte existe avec cet e-mail, vous recevrez un lien de réinitialisation."}
        </p>

        {!submitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
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

            <Button type="submit" loading={loading} variant="dark" className="h-12 text-base">
                Envoyer
            </Button>
            </form>
        ) : (
             <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>
             </div>
        )}

        <div className="mt-8 text-center">
             <Link to="/login" className="text-sm font-medium text-[#363740] hover:underline flex items-center justify-center w-full gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
               </svg>
               Retour à la connexion
             </Link>
        </div>
      </div>
      
      <div className="mt-8 text-gray-500 text-sm">
        &copy; 2023 Red Product. All rights reserved.
      </div>
    </div>
  );
};