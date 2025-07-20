import React, { useState, useEffect } from 'react';
import { Activity, ActivityCategory, Secretaria } from '../types';
import Icon from './Icon';

interface ActivityLogViewProps {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'date'>) => void;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
  actingSecretaria: Secretaria;
}

const emptyFormState = {
  title: '',
  category: ActivityCategory.InternalMeeting,
  description: '',
  relevanceTags: '',
  observations: '',
};

const ActivityLogView: React.FC<ActivityLogViewProps> = ({ activities, addActivity, updateActivity, deleteActivity, actingSecretaria }) => {
  const [formState, setFormState] = useState(emptyFormState);
  const [secretaria, setSecretaria] = useState<Secretaria>(actingSecretaria);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState('');

  useEffect(() => {
    if (!editingId) {
        setSecretaria(actingSecretaria);
    }
  }, [actingSecretaria, editingId]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'secretaria') {
        setSecretaria(value as Secretaria);
    } else {
        setFormState(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleEditClick = (activity: Activity) => {
    setEditingId(activity.id);
    setFormState({
        title: activity.title,
        category: activity.category,
        description: activity.description,
        relevanceTags: activity.relevanceTags.join(', '),
        observations: activity.observations,
    });
    setSecretaria(activity.secretaria);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta actividad? Esta acción no se puede deshacer.')) {
        deleteActivity(id);
        setShowSuccess('Actividad eliminada correctamente.');
        setTimeout(() => setShowSuccess(''), 3000);
    }
  };
  
  const resetForm = () => {
    setEditingId(null);
    setFormState(emptyFormState);
    setSecretaria(actingSecretaria);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.description || !secretaria) {
      alert('Por favor, complete todos los campos obligatorios: título, secretaría y descripción.');
      return;
    }

    const activityData = {
        ...formState,
        secretaria,
        relevanceTags: formState.relevanceTags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    if (editingId) {
        updateActivity({ ...activityData, id: editingId, date: activities.find(a => a.id === editingId)?.date || new Date().toISOString() });
        setShowSuccess('Actividad actualizada con éxito.');
    } else {
        addActivity(activityData);
        setShowSuccess('Actividad registrada con éxito.');
    }
    
    resetForm();
    setTimeout(() => setShowSuccess(''), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {showSuccess && (
        <div className="bg-green-800 border-l-4 border-green-400 text-green-100 p-4 mb-6 rounded-r-lg" role="alert">
          <p className="font-bold">{showSuccess}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{editingId ? 'Editando Actividad' : 'Registrar Nueva Actividad'}</h2>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Título de la Actividad
          </label>
          <input type="text" id="title" name="title" value={formState.title} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ej: Reunión de planificación campaña 'Salario Justo'" required />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="secretaria" className="block text-sm font-medium text-gray-300 mb-2">Secretaría Responsable</label>
            <select id="secretaria" name="secretaria" value={secretaria} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500" required>
              {Object.values(Secretaria).map((sec) => (<option key={sec} value={sec}>{sec}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
            <select id="category" name="category" value={formState.category} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500">
              {Object.values(ActivityCategory).map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Descripción Breve</label>
          <textarea id="description" name="description" value={formState.description} onChange={handleInputChange} rows={4} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="¿Qué se hizo? ¿Cuál fue el objetivo?" required></textarea>
        </div>

        <div>
          <label htmlFor="relevanceTags" className="block text-sm font-medium text-gray-300 mb-2">Etiquetas de Relevancia (separadas por comas)</label>
          <input type="text" id="relevanceTags" name="relevanceTags" value={formState.relevanceTags} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="potencial para prensa, comunicación interna clave, sensibilización" />
        </div>
        
        <div>
          <label htmlFor="observations" className="block text-sm font-medium text-gray-300 mb-2">Resultados y Observaciones</label>
          <textarea id="observations" name="observations" value={formState.observations} onChange={handleInputChange} rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="¿Qué impacto tuvo? ¿Hay alguna sugerencia o necesidad detectada?"></textarea>
        </div>

        <div className="flex justify-end space-x-4">
          {editingId && <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors">Cancelar Edición</button>}
          <button type="submit" className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors">
            {editingId ? 'Actualizar Actividad' : 'Registrar Actividad'}
          </button>
        </div>
      </form>
      
      <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Historial de Actividades</h2>
        <div className="space-y-4">
            {activities.length > 0 ? activities.map(act => (
                <div key={act.id} className="bg-gray-700 p-4 rounded-lg flex flex-col md:flex-row justify-between md:items-center">
                    <div className="flex-1 mb-4 md:mb-0">
                        <p className="text-xs text-red-400 font-bold">{act.secretaria}</p>
                        <h3 className="font-semibold text-lg text-white">{act.title}</h3>
                        <p className="text-sm text-gray-300">{act.description}</p>
                        <p className="text-xs text-gray-400 mt-2">
                           {new Date(act.date).toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })} - {act.category}
                        </p>
                    </div>
                    <div className="flex-shrink-0 flex space-x-2">
                        <button onClick={() => handleEditClick(act)} className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-full transition-colors" aria-label="Editar">
                            <Icon name="edit" className="w-5 h-5"/>
                        </button>
                        <button onClick={() => handleDeleteClick(act.id)} className="p-2 text-gray-300 hover:text-white hover:bg-red-800 rounded-full transition-colors" aria-label="Eliminar">
                            <Icon name="trash" className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            )) : <p className="text-gray-400">No hay actividades registradas.</p>}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogView;