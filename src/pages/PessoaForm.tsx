import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateVisitorRequest, UpdateVisitorRequest } from '../types';
import { apiService } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/Notification';
import { 
  formatDocument, 
  formatPhone, 
  removeFormatting, 
  isValidEmail, 
  isValidDocument, 
  isValidPhone 
} from '../utils/formatting';

const VisitorForm: React.FC = () => {
  const [visitor, setVisitor] = useState<CreateVisitorRequest>({
    fullName: '',
    document: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const { notifications, removeNotification, showError, showSuccess } = useNotification();

  useEffect(() => {
    if (isEditing && id) {
      loadVisitor(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  const loadVisitor = async (visitorId: string) => {
    try {
      setLoading(true);
      const data = await apiService.getVisitorById(visitorId);
      setVisitor({
        fullName: data.fullName,
        document: data.document,
        phone: data.phone,
        email: data.email,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar visitante';
      showError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!visitor.fullName || !visitor.document || !visitor.phone || !visitor.email) {
      showError('Todos os campos são obrigatórios');
      return;
    }

    if (visitor.fullName.length < 3) {
      showError('O nome completo deve ter pelo menos 3 caracteres');
      return;
    }

    if (!isValidDocument(visitor.document)) {
      showError('Documento deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos) válido');
      return;
    }

    if (!isValidPhone(visitor.phone)) {
      showError('Telefone deve ter entre 10 e 11 dígitos');
      return;
    }

    if (!isValidEmail(visitor.email)) {
      showError('E-mail informado é inválido');
      return;
    }

    try {
      setLoading(true);

      const cleanedData = {
        fullName: visitor.fullName.trim(),
        document: removeFormatting(visitor.document),
        phone: removeFormatting(visitor.phone),
        email: visitor.email.trim(),
      };

      if (isEditing && id) {
        const updateData: UpdateVisitorRequest = {
          ...cleanedData,
          id,
        };
        await apiService.updateVisitor(updateData);
        showSuccess('Visitante atualizado com sucesso');
      navigate('/visitors');
      } else {
        await apiService.createVisitor(cleanedData);
        showSuccess('Visitante criado com sucesso');
        navigate('/visitors');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar visitante';
      showError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'document') {
      formattedValue = formatDocument(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    }

    setVisitor(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  if (loading && isEditing) {
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
      <div className="d-flex justify-content-between align-items-center mb-4 flex-column flex-md-row gap-2">
        <h2 className="mb-0">{isEditing ? 'Editar Visitante' : 'Novo Visitante'}</h2>
        <button
          type="button"
          className="btn btn-outline-secondary flex-md-grow-0"
          onClick={() => navigate('/visitors')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          <span className="d-md-inline">Voltar</span>
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Nome Completo *
              </label>
              <input
                type="text"
                className={`form-control ${visitor.fullName && visitor.fullName.length < 3 ? 'is-invalid' : ''}`}
                id="fullName"
                name="fullName"
                value={visitor.fullName}
                onChange={handleChange}
                placeholder="Digite o nome completo"
                required
                disabled={loading}
              />
              {visitor.fullName && visitor.fullName.length < 3 && (
                <small className="text-danger d-block mt-1">
                  Mínimo 3 caracteres
                </small>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="document" className="form-label">
                Documento (CPF/CNPJ) *
              </label>
              <input
                type="text"
                className={`form-control ${visitor.document && !isValidDocument(visitor.document) ? 'is-invalid' : ''}`}
                id="document"
                name="document"
                value={visitor.document}
                onChange={handleChange}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                maxLength={18}
                required
                disabled={loading}
              />
              {visitor.document && !isValidDocument(visitor.document) && (
                <small className="text-danger d-block mt-1">
                  CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos
                </small>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Telefone *
              </label>
              <input
                type="text"
                className={`form-control ${visitor.phone && !isValidPhone(visitor.phone) ? 'is-invalid' : ''}`}
                id="phone"
                name="phone"
                value={visitor.phone}
                onChange={handleChange}
                placeholder="(00) 0000-0000 ou (00) 00000-0000"
                maxLength={15}
                required
                disabled={loading}
              />
              {visitor.phone && !isValidPhone(visitor.phone) && (
                <small className="text-danger d-block mt-1">
                  Telefone deve ter entre 10 e 11 dígitos
                </small>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                E-mail *
              </label>
              <input
                type="text"
                className={`form-control ${visitor.email && !isValidEmail(visitor.email) ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={visitor.email}
                onChange={handleChange}
                placeholder="seu.email@exemplo.com"
                required
                disabled={loading}
              />
              {visitor.email && !isValidEmail(visitor.email) && (
                <small className="text-danger d-block mt-1">
                  E-mail inválido
                </small>
              )}
            </div>

            <div className="d-flex gap-2 flex-column flex-md-row">
              <button
                type="submit"
                className="btn btn-primary flex-md-grow-0"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    <span className="d-md-inline">Salvando...</span>
                    <span className="d-md-none">Salv.</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    <span className="d-none d-md-inline">{isEditing ? 'Atualizar' : 'Cadastrar'}</span>
                    <span className="d-md-none">{isEditing ? 'Atualiz.' : 'Cadastr.'}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary flex-md-grow-0"
                onClick={() => navigate('/visitors')}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

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

export default VisitorForm;
