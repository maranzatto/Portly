# PORTLY - Gestão de Visitantes (Frontend)

[![Backend](https://img.shields.io/badge/Backend-Portly%20API-blue.svg)](https://github.com/maranzatto/Portly.API)

## 📋 Descrição
O **PORTLY Frontend** é a interface administrativa do sistema de controle de portaria e condomínios. Desenvolvida para oferecer uma experiência fluida na gestão de visitantes, a aplicação consome a API REST do Portly e foi construída focando em usabilidade, performance e uma arquitetura organizada que reflete as boas práticas do backend.

## 🏗️ Arquitetura Front-end
Seguindo a mentalidade de separação de responsabilidades (Clean Architecture), o frontend está organizado da seguinte forma:

- **Components:** Unidades de UI reutilizáveis (Sidebar, Layout, Modais).
- **Pages:** Views de alto nível que compõem as rotas da aplicação.
- **Services:** Camada de infraestrutura que abstrai as chamadas HTTP via Axios.
- **Types:** Definições de contratos e modelos de dados (Interfaces TypeScript).
- **Styles:** Centralização de temas e variáveis CSS consistentes com o Bootstrap.

## 🛠️ Tecnologias Utilizadas
[![.NET](https://img.shields.io/badge/.NET-8.0-purple.svg)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg)](https://getbootstrap.com/)
[![React Router](https://img.shields.io/badge/React%20Router-6.0-red.svg)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-1.0-green.svg)](https://axios-http.com/)
[![Bootstrap Icons](https://img.shields.io/badge/Bootstrap%20Icons-1.0-purple.svg)](https://icons.getbootstrap.com/)

## 🚀 Funcionalidades
- ✅ **Dashboard de Visitantes** - Listagem completa com busca e filtros.
- ✅ **Gestão de Visitantes (CRUD)** - Cadastro, edição e visualização.
- ✅ **Soft Delete** - Exclusão lógica com modal de confirmação, alinhada à regra de negócio do backend.
- ✅ **Validação de Dados** - Feedback visual para campos como CPF/CNPJ, E-mail e Telefone.
- ✅ **Layout Responsivo** - Interface adaptável para desktops e tablets.

## 📁 Estrutura do Projeto
```text
src/
├── components/         # Componentes reutilizáveis
├── pages/              # Páginas da aplicação (VisitorList, VisitorForm)
├── services/           # Integração com a API (api.ts)
├── types/              # Interfaces TypeScript (IVisitor)
├── styles/             # CSS principal e variáveis de tema
└── App.tsx             # Configuração de rotas e componentes globais

## 🛣️ Integração com o Backend
O frontend está preparado para consumir os endpoints da Portly API.

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/v1/admin/visitor | Listar visitantes ativos |
| POST | /api/v1/admin/visitor | Cadastrar novo visitante |
| PUT | /api/v1/admin/visitor/{id} | Atualizar dados do visitante |
| DELETE | /api/v1/admin/visitor/{id} | Excluir visitante (Soft Delete) |

Nota: O modelo de dados foi atualizado para refletir o backend: fullName, document, phone e email.

## 🚀 Como Começar

### Pré-requisitos
- Node.js 18+
- Gerenciador de pacotes (NPM ou Yarn)
- Backend Portly: Deve estar rodando para plena funcionalidade. [Link do Repositório Backend](https://github.com/maranzatto/Portly.API)

### 1. Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio-front>

# Entre na pasta
cd portly-frontend

# Instale as dependências
npm install
```

### 2. Configuração
Verifique o arquivo `src/services/api.ts` para garantir que a baseURL aponta para a porta correta do seu backend (ex: `https://localhost:5000/api/v1`).

### 3. Execução
```bash
npm start
```

A aplicação abrirá em `http://localhost:3000`.

## 🔗 Links Úteis
- **Repositório do Backend:** [Portly API](https://github.com/maranzatto/Portly.API)
- **Documentação da API:** https://localhost:5000/swagger

## 🤝 Contribuição
1. Fork do projeto
2. Criar branch para sua feature (`git checkout -b feature/nova-interface`)
3. Commit das mudanças (`git commit -m 'Add: Novo layout de lista'`)
4. Push para a branch (`git push origin feature/nova-interface`)
5. Abrir um Pull Request
