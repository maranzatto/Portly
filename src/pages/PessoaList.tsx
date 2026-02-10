import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Visitor } from '../types';
import { apiService } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Notification from '../components/Notification';
import { formatDocument, formatPhone } from '../utils/formatting';

const VisitorList: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [visitorToDelete, setVisitorToDelete] = useState<Visitor | null>(null);
  const { notifications, removeNotification, showError, showSuccess } = useNotification();

  useEffect(() => {
    loadVisitors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadVisitors = async () => {
    try {
      setLoading(true);
      const data = await apiService.getVisitors();
      setVisitors(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar visitantes';
      showError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (visitor: Visitor) => {
    setVisitorToDelete(visitor);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!visitorToDelete) return;

    try {
      await apiService.deleteVisitor(visitorToDelete.id);
      setShowDeleteModal(false);
      const visitorName = visitorToDelete.fullName;
      setVisitorToDelete(null);
      showSuccess(`Visitante ${visitorName} inativado com sucesso`);
      loadVisitors();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao inativar visitante';
      showError(errorMessage);
      console.error(err);
    }
  };

  const handleRestoreClick = async (visitor: Visitor) => {
    try {
      await apiService.restoreVisitor(visitor.id);
      showSuccess(`Visitante ${visitor.fullName} reativado com sucesso`);
      loadVisitors();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reativar visitante';
      showError(errorMessage);
      console.error(err);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setVisitorToDelete(null);
  };

  const filteredVisitors = visitors.filter((visitor) =>
    visitor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const reloadData = () => {
    loadVisitors();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-column flex-md-row gap-3">
        <h2 className="mb-0">Lista de Visitantes</h2>
        <div className="d-flex gap-2">
          <Link to="/visitors/novo" className="btn btn-primary flex-md-grow-0">
            <i className="bi bi-plus-circle me-2"></i>
            <span className="d-none d-md-inline">Novo Visitante</span>
            <span className="d-md-none">Novo</span>
          </Link>
          <button 
            className="btn btn-secondary flex-md-grow-0" 
            onClick={reloadData}
            title="Recarregar lista"
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            <span className="d-none d-md-inline">Atualizar</span>
            <span className="d-md-none">Atualizar</span>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {visitors.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox" style={{ fontSize: '48px', color: 'var(--color-gray-400)', marginBottom: '16px' }}></i>
              <h5 className="text-muted">Nenhum visitante cadastrado</h5>
              <p className="text-muted">Comece cadastrando novos visitantes para preencher esta lista.</p>
              <Link to="/visitors/novo" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>
                Cadastrar primeiro visitante
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setSearchTerm('')}
                      style={{ borderLeft: 'none' }}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>
                {searchTerm && (
                  <small className="text-muted d-block mt-2">
                    {filteredVisitors.length} resultado(s)
                  </small>
                )}
              </div>

              {filteredVisitors.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-search" style={{ fontSize: '48px', color: 'var(--color-gray-400)', marginBottom: '16px' }}></i>
                  <h5 className="text-muted">Nenhum resultado encontrado</h5>
                  <p className="text-muted">Tente ajustar seus critérios de busca.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th className="d-none d-lg-table-cell">Nome</th>
                        <th className="d-lg-none">Nome</th>
                        <th className="d-none d-xl-table-cell">Documento</th>
                        <th className="d-none d-lg-table-cell">Telefone</th>
                        <th className="d-none d-md-table-cell">E-mail</th>
                        <th>Status</th>
                        <th className="text-end">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVisitors.map((visitor) => (
                        <tr key={visitor.id} className={visitor.isDeleted ? 'table-light opacity-75' : ''}>
                          <td>
                            <div className="d-flex flex-column">
                              <strong>{visitor.fullName}</strong>
                              <small className="text-muted d-lg-none">{formatDocument(visitor.document)}</small>
                            </div>
                          </td>
                          <td className="d-none d-xl-table-cell">{formatDocument(visitor.document)}</td>
                          <td className="d-none d-lg-table-cell">{formatPhone(visitor.phone)}</td>
                          <td className="d-none d-md-table-cell">{visitor.email}</td>
                          <td>
                            <span className={`badge ${visitor.isDeleted ? 'bg-secondary' : 'bg-success'}`}>
                              {visitor.isDeleted ? 'Inativo' : 'Ativo'}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm" role="group">
                              <Link
                                to={`/visitors/editar/${visitor.id}`}
                                className="btn btn-primary"
                                title="Editar"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              {visitor.isDeleted ? (
                                <button
                                  className="btn btn-success"
                                  onClick={() => handleRestoreClick(visitor)}
                                  title="Reativar"
                                >
                                  <i className="bi bi-arrow-clockwise"></i>
                                </button>
                              ) : (
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleDeleteClick(visitor)}
                                  title="Inativar"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        show={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        visitorName={visitorToDelete?.fullName || ''}
      />
      
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default VisitorList;
