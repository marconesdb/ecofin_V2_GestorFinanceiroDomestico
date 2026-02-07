
-- Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS ecofin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecofin_db;

-- Tabela de Usuários (para futuras expansões de login)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Categorias (Permite que o usuário crie as suas próprias)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(20),
    color VARCHAR(7) DEFAULT '#10b981',
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de Despesas
CREATE TABLE expenses (
    id VARCHAR(36) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    category_id INT,
    date DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de Metas de Orçamento (Budget Goals)
CREATE TABLE budget_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    monthly_limit DECIMAL(15, 2) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_category (user_id, category_id)
);

-- Inserção de Categorias Padrão
INSERT INTO categories (name, color) VALUES 
('Alimentação', '#ef4444'),
('Transporte', '#3b82f6'),
('Moradia', '#10b981'),
('Lazer', '#f59e0b'),
('Saúde', '#ec4899'),
('Educação', '#8b5cf6');
