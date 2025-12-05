// server.js - Versão CommonJS (REQUIRE) e Rotas Corrigidas

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 3001;

// --- Configuração do MySQL ---
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Camis1708@', // Altere para sua senha real
    database: 'SistemaApmEstoque' 
};

// --- Middlewares ---
app.use(cors()); 
app.use(bodyParser.json());

// --- Conexão com o Banco de Dados ---
const getConnection = async () => {
    return await mysql.createConnection(dbConfig);
};

// --- Rotas da API ---

// Rota de Teste Simples 
app.get('/', (req, res) => {
    res.send('API de Estoque (Backend) Rodando!');
});

// server.js - Rota de Login (CORREÇÃO TEMPORÁRIA)
app.post('/api/login', async (req, res) => {
    // const { username, password } = req.body;
    
    // IGNORAR CREDENCIAIS TEMPORARIAMENTE PARA TESTE
    console.log('Login solicitado. Autorização forçada para teste.');
    
    // FORÇAR SUCESSO E CÓDIGO 200
    return res.status(200).json({ success: true, message: 'Login FORÇADO bem-sucedido.' });
    
    /* CÓDIGO ORIGINAL (COMENTADO)
    if (username === 'admin123' && password === 'admin123') { 
        return res.status(200).json({ success: true, message: 'Login bem-sucedido.' });
    } else {
        return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }
    */
});

// 2. Rota de Estoque (Leitura - GET)
app.get('/api/estoque', async (req, res) => {
    try {
        const connection = await getConnection();
        
        // Query adaptada para as colunas do seu DB (id_produto, nome, unidade_medida, valor_medio_compra)
        const [rows] = await connection.execute(`
            SELECT 
                P.id_produto AS id, 
                P.nome AS name, 
                P.unidade_medida AS category,
                P.estoque_minimo AS minimum,
                P.valor_medio_compra AS unitPrice,
                
                -- Cálculo do Estoque Atual (Quantity)
                COALESCE(SUM(CASE WHEN T.tipo_transacao = 'ENTRADA' THEN T.quantidade ELSE -T.quantidade END), 0) AS quantity,
                
                -- Cálculo do Valor Total (totalValue)
                (P.valor_medio_compra * COALESCE(SUM(CASE WHEN T.tipo_transacao = 'ENTRADA' THEN T.quantidade ELSE -T.quantidade END), 0)) AS totalValue,
                
                -- Status (Com base no estoque mínimo)
                CASE
                    WHEN COALESCE(SUM(CASE WHEN T.tipo_transacao = 'ENTRADA' THEN T.quantidade ELSE -T.quantidade END), 0) <= P.estoque_minimo * 0.25 THEN 'critical'
                    WHEN COALESCE(SUM(CASE WHEN T.tipo_transacao = 'ENTRADA' THEN T.quantidade ELSE -T.quantidade END), 0) <= P.estoque_minimo THEN 'warning'
                    ELSE 'ok'
                END AS status
            FROM Produtos P
            LEFT JOIN Transacoes_Estoque T ON P.id_produto = T.id_produto
            GROUP BY P.id_produto
            HAVING quantity >= 0; 
        `);
        connection.end();
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Erro ao buscar dados do estoque:', error);
        res.status(500).json({ success: false, message: 'Erro interno ao buscar estoque.' });
    }
});

// 3. Rotas de KPI (Leitura - GET)

// server.js (Adicione esta nova rota)
app.get('/api/kpis', async (req, res) => {
    // Para simplificar, vamos simular os dados de KPI
    const kpiData = {
        totalItems: 450,
        lowStockItems: 12,
        totalValue: 123456.78, // Use um número para que o toFixed funcione no frontend
        recentActivity: 5,
    };
    
    // Retorna 200 (OK) e os dados
    return res.status(200).json(kpiData);
})

app.get('/api/kpi', async (req, res) => {
    try {
        const connection = await getConnection();

        // 1. Cálculo do Valor Total em Estoque
        const [kpiRows] = await connection.execute(`
            SELECT 
                SUM(P.valor_medio_compra * COALESCE(
                    (SELECT SUM(CASE WHEN tipo_transacao = 'ENTRADA' THEN quantidade ELSE -quantidade END) 
                     FROM Transacoes_Estoque WHERE id_produto = P.id_produto), 0)
                ) AS valorTotalEmEstoque
            FROM Produtos P;
        `);

        // 2. Contagem de Itens Críticos
        const [criticalCountRows] = await connection.execute(`
            SELECT 
                COUNT(*) as criticalCount
            FROM Produtos P
            LEFT JOIN Transacoes_Estoque T ON P.id_produto = T.id_produto
            GROUP BY P.id_produto
            HAVING COALESCE(SUM(CASE WHEN T.tipo_transacao = 'ENTRADA' THEN T.quantidade ELSE -T.quantidade END), 0) <= P.estoque_minimo * 0.25;
        `);

        connection.end();

        const valorTotalEmEstoque = kpiRows[0].valorTotalEmEstoque || 0;
        const criticalItems = criticalCountRows.length;

        res.json({
            success: true,
            data: {
                totalStockValue: valorTotalEmEstoque,
                salesPeriod: 18450.00, // Substituir por cálculo real de Vendas
                expenses: 12320.00,  // Substituir por cálculo real de Gastos
                criticalItems: criticalItems 
            }
        });
    } catch (error) {
        console.error('Erro ao buscar KPIs:', error);
        res.status(500).json({ success: false, message: 'Erro interno ao buscar KPIs.' });
    }
});


// --- Inicialização do Servidor ---
app.listen(port, () => {
    console.log(`🚀 Servidor API (Backend) rodando em http://localhost:${port}`);
    console.log('✅ Use: "npm run dev" (ou "npm run start" configurado) no outro terminal para o Frontend (5173)');
});