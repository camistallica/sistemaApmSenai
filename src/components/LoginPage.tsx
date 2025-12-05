// src/components/LoginPage.tsx

import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn } from 'lucide-react';

// 1. CORREÇÃO ESSENCIAL: DEFINIÇÃO DA INTERFACE DA PROP
interface LoginPageProps {
    onLogin: (name: string) => void; 
}

// 2. O COMPONENTE AGORA RECEBE E DESESTRUTURA A PROP TIPADA
export function LoginPage({ onLogin }: LoginPageProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:3001/api/login', {
                username,
                password,
            });

            if (response.status === 200 && response.data.success) {
                // 3. CHAMADA BEM-SUCEDIDA: CHAMA A FUNÇÃO onLogin do App.tsx
                onLogin(username); 
                // A navegação agora é tratada pelo App.tsx (Navigate)
            } else {
                setError('Credenciais inválidas. Tente novamente.');
                setLoading(false); // Volta o loading apenas em caso de falha de credenciais
            }
        } catch (err) {
            console.error('Erro de login:', err);
            // Se o backend retornou 401, o Axios cai aqui. Se for outro erro, exibe a mensagem genérica.
            setError('Falha na comunicação com o servidor. Verifique se o backend está rodando e as credenciais.');
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <div className="text-center">
                    <LogIn className="w-10 h-10 mx-auto text-blue-600" />
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">
                        Sistema de Estoque
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Faça login para acessar o Painel de Controle
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Usuário</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Entrando...' : 'Entrar no Sistema'}
                    </button>
                </form>
            </div>
        </div>
    );
}