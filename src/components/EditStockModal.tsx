// src/components/EditStockModal.tsx

import React, { useState } from 'react';
import type { StockItem } from './StockTable'; // Importar o tipo
import { X, Save } from 'lucide-react';

interface EditStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemToEdit: StockItem | null;
    onSave: (id: number, updatedData: Partial<StockItem>) => void;
}

type EditableFields = Omit<StockItem, 'id' | 'totalValue' | 'status' | 'unitPrice'>;

// Função auxiliar para inicializar os dados
const initializeFormData = (item: StockItem): Partial<EditableFields> => ({
    code: item.code,
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    minimum: item.minimum,
    salePrice: item.salePrice,
});


export function EditStockModal({ isOpen, onClose, itemToEdit, onSave }: EditStockModalProps) {
    
    // Inicializa o estado com base no itemToEdit. 
    // O uso da 'key' no componente pai garante que este estado seja reinicializado quando itemToEdit muda.
    const [formData, setFormData] = useState<Partial<EditableFields>>(
        itemToEdit ? initializeFormData(itemToEdit) : {}
    );
    
    if (!isOpen || !itemToEdit) return null;

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
        onSave(itemToEdit.id, formData);
        onClose(); 
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-semibold text-slate-900">
                        Editar Produto: {itemToEdit.name}
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
                                value={formData.code || ''}
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
                                value={formData.name || ''}
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
                                value={formData.category || ''}
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
                                value={formData.salePrice || 0}
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
                            <span className="text-sm font-medium text-slate-700">Estoque Atual (Qtd)</span>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity || 0}
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
                                value={formData.minimum || 0}
                                onChange={handleChange}
                                min="0"
                                required
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </label>
                    </div>

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
                            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                        >
                            <Save className="w-4 h-4" /> Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}