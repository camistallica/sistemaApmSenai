CREATE DATABASE SistemaApmEstoque;
USE SistemaApmEstoque;

CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nivel_acesso VARCHAR(10) NOT NULL
);

CREATE TABLE Produtos (
    id_produto INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    unidade_medida VARCHAR(20) NOT NULL,
    estoque_atual INT NOT NULL DEFAULT 0,
    estoque_minimo INT NOT NULL DEFAULT 1,
    valor_medio_compra DECIMAL(10, 2) -- Para cálculo do KPI 'Valor Total em Estoque'
);

CREATE TABLE Transacoes_Estoque (
    id_transacao INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Chaves Estrangeiras
    id_produto INT NOT NULL,
    id_usuario INT,
    
    tipo_transacao VARCHAR(10) NOT NULL,
    quantidade INT NOT NULL,
    data_transacao DATETIME NOT NULL,
    valor_unitario DECIMAL(10, 2),
    observacao TEXT,
    
    FOREIGN KEY (id_produto) REFERENCES Produtos(id_produto),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

INSERT INTO Usuarios (matricula, nome, senha_hash, nivel_acesso) VALUES
('admin123', 'Camilo Administrador', 'hashed_senha_segura', 'Admin');


INSERT INTO Produtos (nome, unidade_medida, estoque_atual, estoque_minimo, valor_medio_compra) VALUES
('Caderno Universitário', 'Unidade', 50, 10, 8.50),
('Material de Limpeza (Kit)', 'Kit', 5, 2, 45.00),
('Caneta Azul', 'Caixa c/ 12', 15, 5, 12.00);

-- Inserir transações de estoque de exemplo (Entrada e Saída)
-- Entrada (Compra de 20 Cadernos)
INSERT INTO Transacoes_Estoque (id_produto, tipo_transacao, quantidade, data_transacao, valor_unitario, id_usuario) VALUES
(1, 'ENTRADA', 20, NOW(), 8.00, 1);

-- Saída (Uso de 5 Kits de Limpeza)
INSERT INTO Transacoes_Estoque (id_produto, tipo_transacao, quantidade, data_transacao, valor_unitario, id_usuario) VALUES
(2, 'SAIDA', 5, NOW(), 45.00, 1);