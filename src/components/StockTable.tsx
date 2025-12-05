// src/components/StockTable.tsx (VERSÃO FINAL LIMPA)

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ArrowUpDown, Package, Trash2, Edit } from 'lucide-react';
import { EditStockModal } from './EditStockModal'; 
import { CreateStockModal } from './CreateStockModal'; 


// Exporta a interface para que os modais possam importá-la
export interface StockItem {
    id: number;
    code: string;
    name: string;
    category: string;
    quantity: number;
    minimum: number;
    unitPrice: number;
    salePrice: number;
    totalValue: number;
    status: 'ok' | 'warning' | 'critical';
}

// Tipo de dados do formulário de criação (o unitPrice e campos gerados são omitidos)
type CreateFormData = Omit<StockItem, 'id' | 'totalValue' | 'status' | 'unitPrice'>;


export function StockTable() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<keyof StockItem>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const [stockData, setStockData] = useState<StockItem[]>([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0); 
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<StockItem | null>(null);

    // --- Lógica de Leitura (R - Read) ---
    const fetchStockData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:3001/api/estoque');
            setStockData(response.data.data);
        } catch (error) {
            console.error('Erro ao buscar dados do estoque:', error);
            setStockData([]); 
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchStockData();
    }, [refreshTrigger]); 
    
    // --- Funções CRUD (C, U, D) ---

    // Função para adicionar um novo item (C - Create)
    const handleCreateItem = async (newItemData: CreateFormData) => {
        const dataToSend = { ...newItemData, unitPrice: 0.00 }; 
        try {
            await axios.post('http://localhost:3001/api/estoque', dataToSend);
            setRefreshTrigger(prev => prev + 1); 
            alert('Produto adicionado com sucesso!');
        } catch (error) {
            alert('Falha ao adicionar produto.');
            console.error('Erro de criação:', error);
        }
    };

    // Função para atualizar um item (U - Update)
    // Tipagem alterada para resolver o aviso `as any`
    const handleUpdateItem = async (itemId: number, updatedData: Partial<StockItem>) => {
        try {
            await axios.put(`http://localhost:3001/api/estoque/${itemId}`, updatedData);
            setRefreshTrigger(prev => prev + 1); 
            alert('Produto atualizado com sucesso!');
        } catch (error) {
            alert('Falha ao atualizar produto.');
            console.error('Erro de atualização:', error);
        }
    };

    const handleDeleteItem = async (itemId: number) => {
        if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
        try {
            await axios.delete(`http://localhost:3001/api/estoque/${itemId}`);
            setRefreshTrigger(prev => prev + 1);
            alert('Produto excluído com sucesso!');
        } catch (error) {
            alert('Falha ao excluir produto.');
            console.error('Erro de exclusão:', error);
        }
    };
    
    // --- Funções de Controle de Modal (permanecem as mesmas) ---
    const openEditModal = (item: StockItem) => {
        setItemToEdit(item);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setItemToEdit(null);
    };
    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };
    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    // --- Lógica de Filtro e Ordenação (permanece a mesma) ---
    const filteredData = stockData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        const modifier = sortDirection === 'asc' ? 1 : -1;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.localeCompare(bValue) * modifier;
        }
        return (aValue as number) > (bValue as number) ? modifier : -modifier;
    });

    const handleSort = (field: keyof StockItem) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            ok: { text: 'Normal', class: 'bg-emerald-100 text-emerald-700' },
            warning: { text: 'Baixo', class: 'bg-amber-100 text-amber-700' },
            critical: { text: 'Crítico', class: 'bg-red-100 text-red-700' }
        };
        const badge = badges[status as keyof typeof badges];
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.class}`}>
                {badge.text}
            </span>
        );
    };

    // --- Renderização JSX ---

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Carregando inventário...</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-slate-900">Inventário de Estoque</h2>
                    </div>
                    <div className="text-sm text-slate-600">
                        Total de itens: <span className="text-slate-900 font-semibold">{stockData.length}</span>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, código ou categoria..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        Adicionar Produto
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs text-slate-600"><button onClick={() => handleSort('code')} className="flex items-center gap-1 hover:text-slate-900">Código <ArrowUpDown className="w-3 h-3" /></button></th>
                            <th className="px-6 py-3 text-left text-xs text-slate-600"><button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-slate-900">Produto <ArrowUpDown className="w-3 h-3" /></button></th>
                            <th className="px-6 py-3 text-left text-xs text-slate-600"><button onClick={() => handleSort('category')} className="flex items-center gap-1 hover:text-slate-900">Categoria <ArrowUpDown className="w-3 h-3" /></button></th>
                            <th className="px-6 py-3 text-right text-xs text-slate-600"><button onClick={() => handleSort('quantity')} className="flex items-center gap-1 hover:text-slate-900 ml-auto">Qtd. em Estoque <ArrowUpDown className="w-3 h-3" /></button></th>
                            <th className="px-6 py-3 text-right text-xs text-slate-600">Estoque Mínimo</th>
                            <th className="px-6 py-3 text-right text-xs text-slate-600"><button onClick={() => handleSort('salePrice')} className="flex items-center gap-1 hover:text-slate-900 ml-auto">Valor de Venda <ArrowUpDown className="w-3 h-3" /></button></th>
                            <th className="px-6 py-3 text-right text-xs text-slate-600"><button onClick={() => handleSort('totalValue')} className="flex items-center gap-1 hover:text-slate-900 ml-auto">Valor Total <ArrowUpDown className="w-3 h-3" /></button></th>
                            <th className="px-6 py-3 text-center text-xs text-slate-600">Status</th>
                            <th className="px-6 py-3 text-center text-xs text-slate-600">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {sortedData.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-slate-600">{item.code}</td>
                                <td className="px-6 py-4 text-sm text-slate-900">{item.name}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                                <td className="px-6 py-4 text-sm text-slate-900 text-right">{item.quantity}</td>
                                <td className="px-6 py-4 text-sm text-slate-900 text-right">
    {/* CORREÇÃO: Usa o operador || para garantir que o valor seja 0 se for null/undefined */}
    R$ {(item.salePrice || 0).toFixed(2)}
</td>
                                <td className="px-6 py-4 text-sm text-slate-900 text-right">
    {/* CORREÇÃO: Usa o operador || para garantir que o valor seja 0 se for null/undefined */}
    R$ {(item.totalValue || 0).toFixed(2)}
</td>
                                <td className="px-6 py-4 text-sm text-slate-900 text-right">R$ {item.totalValue.toFixed(2)}</td>
                                <td className="px-6 py-4 text-center">{getStatusBadge(item.status)}</td>
                                <td className="px-6 py-4 text-center text-sm">
                                    <div className="flex justify-center gap-2">
                                        <button 
                                            onClick={() => openEditModal(item)}
                                            className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-slate-200 transition"
                                            title="Editar"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-slate-200 transition"
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {sortedData.length === 0 && !isLoading && (
                <div className="p-8 text-center">
                    <p className="text-slate-600">Nenhum item encontrado no estoque ou que corresponda à busca.</p>
                </div>
            )}
            
            <CreateStockModal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                onSave={handleCreateItem} 
            />

            <EditStockModal
                key={itemToEdit?.id || 'new'} 
                isOpen={isEditModalOpen} 
                onClose={closeEditModal}
                itemToEdit={itemToEdit}
                onSave={handleUpdateItem} // CORRIGIDO: Agora a função tem a tipagem correta
            />
        </div>
    );
}