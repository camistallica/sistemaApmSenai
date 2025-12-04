import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3001; 

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// --- 1. CONFIGURAÇÃO DO BANCO DE DADOS (Preencha suas credenciais!) ---
const dbConfig = {
    host: 'localhost',
    user: 'root',           
    password: 'Camis1708@',
    database: 'SistemaApmEstoque',
};

const frontendPath = path.join(__dirname, 'dist');
app.use(express.static(frontendPath));


// --- 3. ROTAS DA API ---

// Rota de Login (POST /api/login)
app.post('/api/login', async (req, res) => {
    const { matricula, senha } = req.body;
    
    if (!matricula || !senha) {
        return res.status(400).json({ message: 'Matrícula e senha são obrigatórias.' });
    }
    
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        const [rows] = await connection.execute(
            'SELECT id_usuario, nome, senha_hash FROM Usuarios WHERE matricula = ?', 
            [matricula]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Matrícula não encontrada.' });
        }

        const usuario = rows[0];
        
        // Lógica de verificação de senha simples (Substituir por bcrypt em produção!)
        if (senha === "senai123") { 
            return res.status(200).json({
                success: true,
                userName: usuario.nome,
                message: 'Login bem-sucedido!',
            });
        } else {
             return res.status(401).json({ message: 'Senha incorreta.' });
        }
        
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    } finally {
        if (connection) connection.end();
    }
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em em http://localhost:${PORT}`);
});