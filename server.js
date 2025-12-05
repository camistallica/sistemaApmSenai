// server.js - Versão Simplificada (APENAS API)

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Usando o mysql2/promise para async/await

const app = express();
const port = 3001;

// --- Configuração do MySQL (Ajuste suas credenciais aqui) ---
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password', // Altere para sua senha real
    database: 'estoque_db' // Altere para o nome real do seu banco
};

// --- Middlewares ---
// 1. CORS: Permite que o Frontend (5173) acesse esta API (3001)
app.use(cors()); 
// 2. Body Parser: Processa requisições JSON
app.use(bodyParser.json());

// --- Rotas da API (API Routes) ---

// 1. Conexão com o Banco de Dados
const getConnection = async () => {
    return await mysql.createConnection(dbConfig);
};

// Rota de Teste Simples (para confirmar que o servidor está vivo)
app.get('/', (req, res) => {
    res.send('API de Estoque (Backend) Rodando!');
});

// 2. Rota de Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Simulação de login: use o seu hash/lógica real aqui
    if (username === 'admin123' && password === 'admin123') {
        return res.status(200).json({ success: true, message: 'Login bem-sucedido.' });
    } else {
        return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }
});

// 3. Rota de Dados de Estoque (CRUD - GET)
app.get('/api/estoque', async (req, res) => {
    try {
        const connection = await getConnection();
        // SELECT corrigido: 'P' é a tabela de produtos, 'T' é a tabela de transações.
        const [rows] = await connection.execute(`
            SELECT 
                P.id, 
                P.code, 
                P.name, 
                P.category,
                P.minimum,
                COALESCE(SUM(CASE WHEN T.type = 'entrada' THEN T.quantity ELSE -T.quantity END), 0) AS quantity,
                P.unitPrice, 
                P.salePrice,
                (P.salePrice * COALESCE(SUM(CASE WHEN T.type = 'entrada' THEN T.quantity ELSE -T.quantity END), 0)) AS totalValue,
                CASE
                    WHEN COALESCE(SUM(CASE WHEN T.type = 'entrada' THEN T.quantity ELSE -T.quantity END), 0) <= P.minimum * 0.5 THEN 'critical'
                    WHEN COALESCE(SUM(CASE WHEN T.type = 'entrada' THEN T.quantity ELSE -T.quantity END), 0) <= P.minimum THEN 'warning'
                    ELSE 'ok'
                END AS status
            FROM Produtos P
            LEFT JOIN Transacoes_Estoque T ON P.id = T.product_id
            GROUP BY P.id
            HAVING quantity >= 0; 
        `);
        connection.end();
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Erro ao buscar dados do estoque:', error);
        res.status(500).json({ success: false, message: 'Erro interno ao buscar estoque.' });
    }
});

// 4. Rotas de KPI e Alertas (Exemplo - Você deve implementar a lógica SQL real)
app.get('/api/kpi', async (req, res) => {
    // *Aqui você deve implementar a lógica SQL para buscar os KPIs reais.*
    // Retornando dados mockados para garantir que o Frontend carregue.
    res.json({
        success: true,
        data: {
            totalStockValue: 45280.50, // Exemplo de valor alto
            salesPeriod: 18450.00,
            expenses: 12320.00,
            criticalItems: 8 
        }
    });
});


app.listen(port, () => {
    console.log(`🚀 Servidor API (Backend) rodando em http://localhost:${port}`);
    console.log('✅ Certifique-se de que o Frontend (Vite) está rodando em http://localhost:5173');
});