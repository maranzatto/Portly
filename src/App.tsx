import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import VisitorList from './pages/PessoaList';
import VisitorForm from './pages/PessoaForm';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/visitors" replace />} />
        <Route path="/visitors" element={<VisitorList />} />
        <Route path="/visitors/novo" element={<VisitorForm />} />
        <Route path="/visitors/editar/:id" element={<VisitorForm />} />
      </Routes>
    </Layout>
  );
}

export default App;
