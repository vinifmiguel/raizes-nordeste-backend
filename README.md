# API Back-end - Raízes do Nordeste

Sistema de retaguarda desenvolvido em Node.js para suporte ao modelo de negócios multicanal da rede de lanchonetes "Raízes do Nordeste", implementando autenticação segura, gestão de pedidos e processamento de pagamentos simulados.

## 🚀 Pré-requisitos
Para executar o projeto localmente, certifique-se de ter instalado no seu computador:
* **Node.js** (versão 18 ou superior)
* **Gerenciador de pacotes npm** (já incluso na instalação do Node.js)
* **Banco de dados SQLite** (embutido via dependência do projeto)

## 📦 Como Instalar e Executar o Projeto

1. **Clone o repositório para o seu computador:**
   ```bash
   git clone https://github.com/vinifmiguel/raizes-nordeste-backend.git
   cd raizes-nordeste-backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz baseado no modelo `.env.example` fornecido.

4. **Inicie o servidor em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```
   O servidor estará ativo em `http://localhost:3000`.

## 🧪 Testes Automatizados (Postman)
A coleção completa contendo os cenários de teste descritos na Seção 8 deste relatório encontra-se disponível no arquivo **`postman_collection.json`** na raiz deste repositório, pronta para importação direta no Postman ou Insomnia.