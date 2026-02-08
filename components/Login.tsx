import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const { signInWithGoogle, loading } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            setError(null);
            await signInWithGoogle();
        } catch (err) {
            setError('Falha ao iniciar login com Google.');
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">Acesso Restrito ao QG</h2>
            <p className="mb-8 text-slate-400 max-w-sm">
                Identifique-se, soldado. O acesso ao histórico e novas missões requer credenciais de nível superior.
            </p>

            {error && (
                <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm border border-red-500/20">
                    {error}
                </div>
            )}

            <button
                onClick={handleLogin}
                disabled={loading}
                className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" className="w-5 h-5" />
                {loading ? 'Validando Credenciais...' : 'Entrar com Google'}
            </button>

            <p className="mt-8 text-xs text-slate-600">
                Protocolo de Segurança Tática v2.4
            </p>
        </div>
    );
}
