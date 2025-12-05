// src/components/CreateStockModal.tsx

import React, { useState } from 'react';
import type { StockItem } from './StockTable'; // Importar o tipo (resolve o erro TS1484)
import { X, PlusCircle } from 'lucide-react';

interface CreateStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    // O tipo de dados esperados pelo onSave na criação
    onSave: (newItemData: Omit<StockItem, 'id' | 'totalValue' | 'status'>) => void; 
}

// Valores iniciais para um novo produto
const initialFormData: Omit<StockItem, 'id' | 'totalValue' | 'status' | 'unitPrice'> = {
    code: '',
    name: '',
    category: '',
    quantity: 0,
    minimum: 0,
    salePrice: 0.01,
};

export function CreateStockModal({ isOpen, onClose, onSave }: CreateStockModalProps) {
    const [formData, setFormData] = useState(initialFormData);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' || name === 'minimum' || name === 'salePrice' 
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        onSave(formData as Omit<StockItem, 'id' | 'totalValue' | 'status'>);
        
        setFormData(initialFormData);
        onClose(); 
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-semibold text-slate-900">
                        Adicionar Novo Produto
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Linha 1: Código e Nome */}
                    <div className="grid grid-cols-3 gap-4">
                        <label className="col-span-1 block">
                            <span className="text-sm font-medium text-slate-700">Código</span>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>
                        <label className="col-span-2 block">
                            <span className="text-sm font-medium text-slate-700">Nome do Produto</span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>
                    </div>

                    {/* Linha 2: Categoria e Preço de Venda */}
                    <div className="grid grid-cols-2 gap-4">
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Categoria</span>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Preço de Venda (R$)</span>
                            <input
                                type="number"
                                name="salePrice"
                                value={formData.salePrice}
                                onChange={handleChange}
                                min="0.01"
                                step="0.01"
                                required
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>
                    </div>
                    
                    {/* Linha 3: Estoque Atual e Estoque Mínimo */}
                    <div className="grid grid-cols-2 gap-4">
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Estoque Inicial (Qtd)</span>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="0"
                                required
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Estoque Mínimo</span>
                            <input
                                type="number"
                                name="minimum"
                                value={formData.minimum}
                                onChange={handleChange}
                                min="0"
                                required
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>
                    </div>
                    
                    <div className="text-sm text-red-600">**Observação:** O 'Valor Médio de Compra' será tratado como R$ 0,00 no cadastro inicial para simplicidade.</div>

                    <div className="flex justify-end pt-4 space-x-2 border-t mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition"
                        >
                            <PlusCircle className="w-4 h-4" /> Adicionar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}