// frontend/src/ClientesTable.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = '/api/clientes/';


// --- Componente Modal ---
const ClienteFormModal = ({ clienteData, onClose, onSave, isEditing }) => {
    const [formData, setFormData] = useState(clienteData || {
        cliente: '',
        tipo_factura: '',
        precios: 0.00
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{isEditing ? '🖊️ Editar Cliente' : '➕ Añadir Nuevo Cliente'}</h3>
                <form onSubmit={handleSubmit} className="login-form">
                    <label>Cliente:</label>
                    <input type="text" name="cliente" value={formData.cliente} onChange={handleChange} required className="input-field" />
                    
                    <label>Tipo Factura:</label>
                    <select name="tipo_factura" value={formData.tipo_factura} onChange={handleChange} required className="input-field">
                        <option value="">-- Selecciona una opción --</option>
                        <option value="Internet">Internet</option>
                        <option value="Agua">Agua</option>
                        <option value="Electricidad">Electricidad</option>
                        <option value="Telefono">Teléfono</option>
                        <option value="Gas">Gas</option>
                    </select>
                    
                    <label>Precios:</label>
                    <input type="number" name="precios" value={formData.precios} onChange={handleChange} required step="0.01" className="input-field" />
                    
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="action-btn btn-delete" style={{ marginRight: '0' }}>
                            Cancelar
                        </button>
                        <button type="submit" className="action-btn btn-primary" style={{ backgroundColor: '#333' }}>
                            {isEditing ? 'Guardar Cambios' : 'Añadir'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
// --- Fin Componente Modal ---


function ClientesTable() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editClient, setEditClient] = useState(null); 

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => { /* (Lógica sin cambios) */
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}`, { timeout: 15000 });
      console.log("URL llamada:", API_URL);
      setClientes(response.data);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      setError("No se pudo conectar al Backend en Render. Intenta recargar o verificar disponibilidad.");
    } finally {
      setLoading(false);
    }
  };

  // DELETE (Lógica sin cambios)
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
        try {
            await axios.delete(`${API_URL}${id}`, { timeout: 15000 });
            fetchClientes();
        } catch {
            alert('Error al eliminar el cliente.');
        }
    }
  };

  // CREATE (Añadir) (Lógica sin cambios)
  const handleCreate = async (newClienteData) => {
      try {
          await axios.post(API_URL, newClienteData, { timeout: 15000 });
          setShowCreateModal(false);
          fetchClientes();
      } catch {
          alert('Error al crear el cliente.');
      }
  };

  // UPDATE (Editar) (Lógica sin cambios)
  const handleUpdate = async (updatedData) => {
      const id = updatedData.id;
      try {
          const dataToSend = { ...updatedData };
          delete dataToSend.id; 
          
          await axios.patch(`${API_URL}${id}`, dataToSend, { timeout: 15000 });
          setEditClient(null); 
          fetchClientes(); 
      } catch {
          alert('Error al actualizar el cliente. Revisa el valor ingresado.');
      }
  };


  if (loading) return <div style={{textAlign: 'center', padding: '40px'}}>Cargando datos...</div>;
  if (error) return <div style={{color: '#dc3545', textAlign: 'center', padding: '40px'}}>{error}</div>;

  return (
    <div className="table-dashboard">
      <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        📈 Panel de Clientes
      </h2>
      
      <button 
        onClick={() => setShowCreateModal(true)} 
        className="add-button"
      >
        ➕ Añadir Nuevo Cliente
      </button>

      {/* Tabla de Clientes */}
      <table className="clientes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Tipo Factura</th>
            <th>Precios</th>
            <th style={{textAlign: 'center'}}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.cliente}</td>
              <td>{c.tipo_factura}</td>
              <td>{c.precios}</td>
              <td style={{textAlign: 'center'}}>
                
                {/* Botón Editar */}
                <button 
                  onClick={() => setEditClient(c)} 
                  className="action-btn btn-edit"
                >
                  Editar
                </button>
                
                {/* Botón Eliminar */}
                <button 
                  onClick={() => handleDelete(c.id)} 
                  className="action-btn btn-delete"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODALES */}
      {showCreateModal && (
        <ClienteFormModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
          isEditing={false}
        />
      )}

      {editClient && (
        <ClienteFormModal
          clienteData={editClient}
          onClose={() => setEditClient(null)}
          onSave={handleUpdate}
          isEditing={true}
        />
      )}
    </div>
  );
}

export default ClientesTable;
