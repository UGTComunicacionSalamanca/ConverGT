import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Icon from './Icon';
import { Secretaria, JournalistContact, PressRelease } from '../types';

interface ExternalCommsViewProps {
    actingSecretaria: Secretaria;
    pressReleases: PressRelease[];
    addPressRelease: (release: Omit<PressRelease, 'id'|'date'>) => void;
    updatePressRelease: (release: PressRelease) => void;
    deletePressRelease: (id: string) => void;
}

const initialContacts: JournalistContact[] = [
    { id: 'j1', name: 'Ana García', media: 'El País', phone: '600111222', email: 'agarcia@elpais.es', role: 'Corresponsal de política', isFrequent: true },
    { id: 'j2', name: 'Carlos Sánchez', media: 'Cadena SER', phone: '600333444', email: 'csanchez@cadenaser.es', role: 'Jefe de sección de laboral', isFrequent: true },
    { id: 'j3', name: 'Laura Martinez', media: 'eldiario.es', phone: '600555666', email: 'lmartinez@eldiario.es', role: 'Periodista de investigación', isFrequent: false },
];

const emptyFormState: Omit<PressRelease, 'id' | 'date'> = {
    secretaria: Secretaria.General,
    preheadline: '',
    headline: '',
    subheadline: '',
    lead: '',
    body: '',
    contact: ''
};

const emptyContactFormState = { name: '', media: '', phone: '', email: '', role: '', isFrequent: false };


const PressReleaseCreator = ({ actingSecretaria, onSave, pressReleases, editingReleaseId, addPressRelease, updatePressRelease }) => {
    const [formState, setFormState] = useState<Omit<PressRelease, 'id' | 'date'> | PressRelease>(emptyFormState);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (editingReleaseId) {
            const releaseToEdit = pressReleases.find(pr => pr.id === editingReleaseId);
            if (releaseToEdit) {
                setFormState(releaseToEdit);
            }
        } else {
            setFormState({...emptyFormState, secretaria: actingSecretaria });
        }
    }, [editingReleaseId, pressReleases, actingSecretaria]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({...prev, [name]: value}));
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        // Type guard to ensure formState has all properties before calling handlers
        if (!('headline' in formState) || !formState.headline || !formState.body) {
            alert("Por favor, rellene todos los campos requeridos.");
            return;
        }

        setIsSaving(true);
        
        if ('id' in formState) {
            // When editing, formState is a full PressRelease object.
            updatePressRelease(formState);
        } else {
            // When creating, formState lacks id and date, matching Omit type.
            addPressRelease(formState);
        }
        
        setTimeout(() => {
            setIsSaving(false);
            setFormState({...emptyFormState, secretaria: actingSecretaria });
            onSave();
        }, 500);
    };
    
    const isFormEmpty = !('headline' in formState) || !formState.headline || !formState.lead || !formState.body || !formState.contact;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6">{editingReleaseId ? 'Editando Comunicado' : 'Crear Nuevo Comunicado'}</h2>
              <form onSubmit={handleSave} className="space-y-6">
                 <div>
                     <label htmlFor="secretaria" className="block text-sm font-medium text-gray-300 mb-2">Secretaría Emisora</label>
                     <select id="secretaria" name="secretaria" value={formState.secretaria} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500" required>
                         {Object.values(Secretaria).map((sec) => ( <option key={sec} value={sec}>{sec}</option> ))}
                     </select>
                 </div>
                  <input type="text" name="preheadline" value={formState.preheadline} onChange={handleInputChange} placeholder="Antetítulo" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500" />
                  <input type="text" name="headline" value={formState.headline} onChange={handleInputChange} placeholder="Titular Principal (requerido)" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500" required />
                  <input type="text" name="subheadline" value={formState.subheadline} onChange={handleInputChange} placeholder="Subtítulo (opcional)" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500" />
                  <textarea name="lead" value={formState.lead} onChange={handleInputChange} placeholder="Entradilla (lead) (requerido)" rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500" required />
                  <textarea name="body" value={formState.body} onChange={handleInputChange} placeholder="Cuerpo del Comunicado (requerido)" rows={8} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500" required />
                  <textarea name="contact" value={formState.contact} onChange={handleInputChange} placeholder="Información de Contacto (requerido)" rows={2} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500" required />
                  <button type="submit" disabled={isFormEmpty || isSaving} className="w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors disabled:bg-gray-600"><Icon name="newspaper" className="w-5 h-5 mr-2"/>{isSaving ? 'Guardando...' : (editingReleaseId ? 'Actualizar Comunicado' : 'Guardar Comunicado')}</button>
              </form>
          </div>
          <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Vista Previa</h2>
              <div className="bg-white text-black p-6 rounded-md min-h-[500px] overflow-y-auto">
                  <div className="prose max-w-none p-4 font-serif">
                     <p className="text-sm font-bold text-red-700">{formState.secretaria}</p>
                     <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mt-4">{formState.preheadline || 'ANTETÍTULO'}</p>
                     <h1 className="text-3xl font-bold mt-1 mb-2 text-gray-900">{formState.headline || 'Titular del Comunicado'}</h1>
                     <h2 className="text-xl text-gray-700 font-medium mt-1 mb-4">{formState.subheadline || 'Subtítulo que complementa la información'}</h2>
                     <p className="lead font-semibold text-gray-800 my-4 border-l-4 border-gray-300 pl-4">{formState.lead || 'Este es el párrafo de la entradilla (lead)...'}</p>
                     <div className="mt-6 whitespace-pre-wrap text-justify text-gray-800">{formState.body || 'Aquí se desarrolla el cuerpo completo del comunicado...'}</div>
                     <hr className="my-6"/><div className="mt-6 text-sm"><h3 className="font-bold mb-2 text-gray-900">Para más información:</h3><p className="whitespace-pre-wrap text-gray-800">{formState.contact || 'Nombre Apellido\nCargo\nemail@sindicato.org'}</p></div>
                     <p className="text-center font-bold text-2xl mt-8 text-gray-500">###</p>
                  </div>
              </div>
          </div>
      </div>
    );
};

const ContactAgenda = ({ contacts, setContacts }) => {
    const [formState, setFormState] = useState(emptyContactFormState);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormState(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };
    
    const resetForm = () => {
        setEditingId(null);
        setFormState(emptyContactFormState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formState.name || !formState.media || !formState.email) {
            alert('Nombre, medio y email son obligatorios.');
            return;
        }

        if (editingId) {
            setContacts(contacts.map(c => c.id === editingId ? { ...formState, id: editingId } : c));
        } else {
            setContacts([{ ...formState, id: new Date().toISOString() }, ...contacts]);
        }
        resetForm();
    };

    const handleEditClick = (contact: JournalistContact) => {
        setEditingId(contact.id);
        setFormState(contact);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = (id: string) => {
        if (window.confirm('¿Eliminar este contacto?')) {
            setContacts(contacts.filter(c => c.id !== id));
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-6">
            <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                 <h3 className="text-xl font-bold text-white">{editingId ? 'Editando Contacto' : 'Añadir Nuevo Contacto'}</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" value={formState.name} onChange={handleInputChange} placeholder="Nombre del Periodista" className="bg-gray-700 border-gray-600 rounded py-2 px-3 text-white focus:ring-red-500" required />
                    <input name="media" value={formState.media} onChange={handleInputChange} placeholder="Medio de Comunicación" className="bg-gray-700 border-gray-600 rounded py-2 px-3 text-white focus:ring-red-500" required />
                    <input name="phone" value={formState.phone} onChange={handleInputChange} placeholder="Teléfono" className="bg-gray-700 border-gray-600 rounded py-2 px-3 text-white focus:ring-red-500" />
                    <input type="email" name="email" value={formState.email} onChange={handleInputChange} placeholder="Email" className="bg-gray-700 border-gray-600 rounded py-2 px-3 text-white focus:ring-red-500" required />
                    <input name="role" value={formState.role} onChange={handleInputChange} placeholder="Rol del Contacto (Ej: Corresponsal)" className="md:col-span-2 bg-gray-700 border-gray-600 rounded py-2 px-3 text-white focus:ring-red-500" />
                 </div>
                 <div className="flex items-center space-x-3">
                    <input type="checkbox" id="isFrequent" name="isFrequent" checked={formState.isFrequent} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-red-600 focus:ring-red-500" />
                    <label htmlFor="isFrequent" className="text-sm text-gray-300">Marcar como contacto frecuente</label>
                 </div>
                 <div className="flex justify-end space-x-3 pt-2">
                    {editingId && <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500">Cancelar</button>}
                    <button type="submit" className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500">{editingId ? 'Actualizar' : 'Añadir Contacto'}</button>
                 </div>
            </form>

            <div className="space-y-3">
                {contacts.map(contact => (
                    <div key={contact.id} className="bg-gray-800 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                {contact.isFrequent && <Icon name="star" className="w-5 h-5 text-yellow-400 flex-shrink-0" />}
                                <p className="font-bold text-white text-lg">{contact.name}</p>
                            </div>
                            <p className="text-red-400 font-semibold ml-8 md:ml-0">{contact.media}</p>
                             {contact.role && <p className="text-sm text-gray-400 ml-8 md:ml-0">{contact.role}</p>}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-300 mt-2 ml-8 md:ml-0">
                               <span><Icon name="comms" className="w-4 h-4 inline mr-1.5"/>{contact.email}</span>
                               {contact.phone && <span><Icon name="activity" className="w-4 h-4 inline mr-1.5"/>{contact.phone}</span>}
                            </div>
                        </div>
                        <div className="flex-shrink-0 flex space-x-2 mt-3 md:mt-0 self-start md:self-center">
                            <button onClick={() => handleEditClick(contact)} className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-full"><Icon name="edit" className="w-5 h-5"/></button>
                            <button onClick={() => handleDeleteClick(contact.id)} className="p-2 text-gray-300 hover:text-white hover:bg-red-800 rounded-full"><Icon name="trash" className="w-5 h-5"/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PressReleaseHistory = ({ releases, onEdit, onDelete, onSend }) => {
    
    const handleGeneratePdf = async (release) => {
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.width = '210mm'; // A4 width
        tempDiv.style.background = 'white';
        document.body.appendChild(tempDiv);
        
        const content = `
            <div style="font-family: serif; color: #000; padding: 32px;">
                <p style="font-size: 0.875rem; font-weight: bold; color: #b91c1c;">${release.secretaria}</p>
                <p style="font-size: 0.875rem; font-weight: 600; color: #4b5563; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 1rem;">${release.preheadline}</p>
                <h1 style="font-size: 1.875rem; font-weight: bold; margin-top: 0.25rem; margin-bottom: 0.5rem; color: #111827;">${release.headline}</h1>
                <h2 style="font-size: 1.25rem; color: #374151; font-weight: 500; margin-top: 0.25rem; margin-bottom: 1rem;">${release.subheadline}</h2>
                <p style="font-weight: 600; color: #1f2937; margin-top: 1rem; margin-bottom: 1rem; border-left: 4px solid #d1d5db; padding-left: 1rem;">${release.lead}</p>
                <div style="margin-top: 1.5rem; white-space: pre-wrap; text-align: justify; color: #1f2937;">${release.body.replace(/\n/g, '<br/>')}</div>
                <hr style="margin-top: 1.5rem; margin-bottom: 1.5rem;" />
                <div style="margin-top: 1.5rem; font-size: 0.875rem;">
                    <h3 style="font-weight: bold; margin-bottom: 0.5rem; color: #111827;">Para más información:</h3>
                    <p style="white-space: pre-wrap; color: #1f2937;">${release.contact.replace(/\n/g, '<br/>')}</p>
                </div>
                <p style="text-align: center; font-weight: bold; font-size: 1.5rem; margin-top: 2rem; color: #6b7280;">###</p>
            </div>
        `;
        tempDiv.innerHTML = content;
        
        try {
            const canvas = await html2canvas(tempDiv, { scale: 2, backgroundColor: '#ffffff' });
            const data = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgProperties = pdf.getImageProperties(data);
            const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
            pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`comunicado-${release.headline.slice(0, 20).replace(/ /g, '_')}.pdf`);
        } catch(error) {
            console.error("Error generating PDF:", error);
            alert("Hubo un error al generar el PDF.");
        } finally {
            document.body.removeChild(tempDiv);
        }
    };
    
    return (
         <div className="max-w-4xl mx-auto mt-6">
             <div className="space-y-4">
                {releases.length > 0 ? releases.map(release => (
                    <div key={release.id} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="flex-1 mb-4 md:mb-0">
                                <p className="text-xs text-red-400 font-bold">{release.secretaria}</p>
                                <h3 className="font-semibold text-lg text-white">{release.headline}</h3>
                                <p className="text-sm text-gray-400 mt-1">{release.lead.substring(0, 100)}...</p>
                                <p className="text-xs text-gray-500 mt-2">
                                   Guardado: {new Date(release.date).toLocaleString('es-ES')}
                                </p>
                            </div>
                            <div className="flex-shrink-0 flex items-center space-x-2">
                                <button onClick={() => onSend(release)} className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-full" aria-label="Enviar a contactos">
                                    <Icon name="send" className="w-5 h-5"/>
                                </button>
                                <button onClick={() => handleGeneratePdf(release)} className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-full" aria-label="Descargar PDF">
                                    <Icon name="newspaper" className="w-5 h-5"/>
                                </button>
                                <button onClick={() => onEdit(release.id)} className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-full" aria-label="Editar">
                                    <Icon name="edit" className="w-5 h-5"/>
                                </button>
                                <button onClick={() => onDelete(release.id)} className="p-2 text-gray-300 hover:text-white hover:bg-red-800 rounded-full" aria-label="Eliminar">
                                    <Icon name="trash" className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    </div>
                )) : <p className="text-center text-gray-500 py-16">No hay comunicados guardados en el historial.</p>}
            </div>
         </div>
    );
};

const SendToContactsModal = ({ isOpen, onClose, release, contacts }) => {
    const [selectedContactIds, setSelectedContactIds] = useState(new Set<string>());

    useEffect(() => {
        if (isOpen) {
            // Reset selection on open
            setSelectedContactIds(new Set());
        }
    }, [isOpen]);

    if (!isOpen || !release) return null;

    const handleToggleContact = (contactId: string) => {
        setSelectedContactIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(contactId)) {
                newSet.delete(contactId);
            } else {
                newSet.add(contactId);
            }
            return newSet;
        });
    };

    const handleSendEmail = () => {
        const selectedContacts = contacts.filter(c => selectedContactIds.has(c.id));
        if (selectedContacts.length === 0) {
            alert("Por favor, selecciona al menos un contacto.");
            return;
        }

        const recipients = selectedContacts.map(c => c.email).join(',');
        const subject = encodeURIComponent(release.headline);
        
        const bodyText = `
${release.preheadline ? release.preheadline.toUpperCase() + '\n' : ''}
${release.headline}
${release.subheadline ? release.subheadline + '\n' : ''}
------------------------------------

${release.lead}

${release.body}

------------------------------------
Para más información:
${release.contact}

###
        `.trim();
        
        const body = encodeURIComponent(bodyText);
        
        window.location.href = `mailto:${recipients}?subject=${subject}&body=${body}`;
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 flex flex-col max-h-[90vh]">
                <h2 className="text-xl font-bold text-white mb-2">Enviar Comunicado a Contactos</h2>
                <p className="text-sm text-gray-400 mb-4 truncate">Enviando: <span className="font-semibold text-gray-300">{release.headline}</span></p>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2 -mr-2">
                    {contacts.map(contact => (
                        <div key={contact.id} className="flex items-center bg-gray-700 p-3 rounded-lg">
                            <input
                                id={`contact-${contact.id}`}
                                type="checkbox"
                                checked={selectedContactIds.has(contact.id)}
                                onChange={() => handleToggleContact(contact.id)}
                                className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-red-600 focus:ring-red-500"
                            />
                            <label htmlFor={`contact-${contact.id}`} className="ml-3 flex-1 cursor-pointer">
                                <p className="font-semibold text-white">{contact.name} {contact.isFrequent && <Icon name="star" className="w-4 h-4 inline text-yellow-400"/>}</p>
                                <p className="text-sm text-gray-400">{contact.media} - {contact.email}</p>
                            </label>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700 mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancelar</button>
                    <button onClick={handleSendEmail} disabled={selectedContactIds.size === 0} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 disabled:bg-gray-500 flex items-center gap-2">
                       <Icon name="send" className="w-5 h-5" />
                       Enviar Email ({selectedContactIds.size})
                    </button>
                </div>
            </div>
        </div>
    );
};


const ExternalCommsView: React.FC<ExternalCommsViewProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'creator' | 'agenda' | 'history'>('creator');
    const [editingReleaseId, setEditingReleaseId] = useState<string | null>(null);
    const [contacts, setContacts] = useState<JournalistContact[]>(initialContacts);
    
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [releaseToSend, setReleaseToSend] = useState<PressRelease | null>(null);

    const handleEditRelease = (releaseId: string) => {
        setEditingReleaseId(releaseId);
        setActiveTab('creator');
    };

    const handleSaveAndSwitch = () => {
        setEditingReleaseId(null);
        setActiveTab('history');
    };
    
    const handleOpenSendModal = (release: PressRelease) => {
        setReleaseToSend(release);
        setIsSendModalOpen(true);
    };

    return (
        <div className="p-4 md:p-8">
            <SendToContactsModal
                isOpen={isSendModalOpen}
                onClose={() => setIsSendModalOpen(false)}
                release={releaseToSend}
                contacts={contacts}
            />

            <div className="border-b border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-6">
                    <button
                        onClick={() => setActiveTab('creator')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'creator' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                    >
                        <Icon name="edit" className="w-5 h-5 inline mr-2"/>
                        {editingReleaseId ? 'Editando Comunicado' : 'Crear Comunicado'}
                    </button>
                    <button
                        onClick={() => setActiveTab('agenda')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'agenda' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                    >
                        <Icon name="users" className="w-5 h-5 inline mr-2"/>
                        Agenda de Contactos
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'history' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                    >
                        <Icon name="activity" className="w-5 h-5 inline mr-2"/>
                        Historial de Comunicados
                    </button>
                </nav>
            </div>

            {activeTab === 'creator' && <PressReleaseCreator {...props} onSave={handleSaveAndSwitch} editingReleaseId={editingReleaseId} />}
            {activeTab === 'agenda' && <ContactAgenda contacts={contacts} setContacts={setContacts} />}
            {activeTab === 'history' && <PressReleaseHistory releases={props.pressReleases} onEdit={handleEditRelease} onDelete={props.deletePressRelease} onSend={handleOpenSendModal} />}
        </div>
    );
};

export default ExternalCommsView;