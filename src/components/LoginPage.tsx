
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';


interface LoginPageProps {
    onLogin: (name: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
    const navigate = useNavigate(); 
    
   
    const [matricula, setMatricula] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/api/login', {
                matricula,
                senha
            });

            if (response.data.success) {
                onLogin(response.data.userName);
                navigate('/dashboard', { replace: true }); 
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || 'Falha na autenticação.');
            } else {
                setError('Não foi possível conectar ao servidor. O Backend está rodando?');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-200">
                <h2 className="text-2xl font-bold text-center text-gray-900">
                    APM SENAI - Acesso Restrito
                </h2>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    
                    {/* Input Matrícula */}
                    <div>
                        <label htmlFor="matricula" className="block text-sm font-medium text-gray-700">
                            Matrícula
                        </label>
                        <input
                            id="matricula"
                            type="text"
                            required
                            value={matricula}
                            onChange={(e) => setMatricula(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Input Senha */}
                    <div>
                        <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                            Senha
                        </label>
                        <input
                            id="senha"
                            type="password"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Exibição de Erro */}
                    {error && (
                        <p className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded-md border border-red-200 text-center">
                            {error}
                        </p>
                    )}

                    {/* Botão de Submissão */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    >
                        {isLoading ? (
                            'Acessando...'
                        ) : (
                            <>
                                <LogIn className="w-4 h-4" />
                                Entrar no Sistema
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}