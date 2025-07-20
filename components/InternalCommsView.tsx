import React, { useState, useMemo, useRef, useEffect } from 'react';
import Icon from './Icon';
import { Secretaria, Channel, Message } from '../types';

interface InternalCommsViewProps {
    actingSecretaria: Secretaria;
}

const initialChannels: Channel[] = [
    { id: '1', name: '#anuncios-generales', description: 'Comunicados y directrices oficiales.', icon: 'comms' },
    { id: '2', name: '#proyecto-congreso24', description: 'Organización del próximo congreso.', icon: 'dashboard' },
    { id: '3', name: '#sec-igualdad', description: 'Espacio de trabajo de la Secretaría de Igualdad.', icon: 'comms' },
    { id: '4', name: '#colaborador-prensa', description: 'Contacto externo vía WhatsApp', icon: 'send', isExternal: true, externalContactPhone: '34000000000' },
];

const initialMessages: Record<string, Message[]> = {
    '1': [
        { id: 'm1-1', text: 'Recordatorio: La próxima asamblea general será el viernes a las 18:00h.', author: Secretaria.General, timestamp: '10:30' },
    ],
    '2': [
        { id: 'm2-1', text: '¿Tenemos ya la lista definitiva de ponentes?', author: Secretaria.Organizacion, timestamp: '09:15' },
    ],
    '3': [],
    '4': [
        { id: 'm4-1', text: 'Te paso el borrador del comunicado para que le eches un vistazo antes de enviar a medios.', author: Secretaria.Comunicacion, timestamp: '11:45' }
    ],
};

const availableIcons = ['comms', 'dashboard', 'analytics', 'resources', 'newspaper', 'share', 'sparkles', 'activity', 'send', 'users'];

// NOTE: Components are defined outside the main view to prevent re-rendering on every keystroke.
const ChannelModal = ({ isOpen, onClose, onSave, channel }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('comms');
    const [isExternal, setIsExternal] = useState(false);
    const [externalContactPhone, setExternalContactPhone] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (channel) {
                setName(channel.name);
                setDescription(channel.description);
                setIcon(channel.icon);
                setIsExternal(channel.isExternal || false);
                setExternalContactPhone(channel.externalContactPhone || '');
            } else {
                setName('');
                setDescription('');
                setIcon('comms');
                setIsExternal(false);
                setExternalContactPhone('');
            }
        }
    }, [channel, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...channel, name, description, icon, isExternal, externalContactPhone: isExternal ? externalContactPhone : '' });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                <h2 className="text-xl font-bold text-white mb-4">{channel ? 'Editar Canal' : 'Crear Nuevo Canal'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input id="channel-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="#nombre-del-canal" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500" required />
                    <input id="channel-desc" type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Propósito del canal" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500" required />
                    <select id="channel-icon" value={icon} onChange={e => setIcon(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500">
                       {availableIcons.map(iconName => <option key={iconName} value={iconName}>{iconName}</option>)}
                    </select>
                     <div className="flex items-center space-x-3 bg-gray-900 p-3 rounded-lg">
                        <input type="checkbox" id="isExternal" name="isExternal" checked={isExternal} onChange={e => setIsExternal(e.target.checked)} className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-red-600 focus:ring-red-500" />
                        <label htmlFor="isExternal" className="text-sm font-medium text-gray-300">Canal externo (Puente WhatsApp)</label>
                     </div>
                     {isExternal && (
                        <input type="tel" value={externalContactPhone} onChange={e => setExternalContactPhone(e.target.value)} placeholder="Nº de teléfono (ej: 34600123456)" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500" required />
                     )}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500">{channel ? 'Guardar Cambios' : 'Crear Canal'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ChannelList = ({ channels, activeChannelId, onSelectChannel, onAddChannel, onEditChannel, onDeleteChannel }) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-xl font-semibold text-white">Canales</h2>
            <button onClick={onAddChannel} className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            </button>
        </div>
        <nav className="flex flex-col space-y-1 overflow-y-auto">
            {channels.map(channel => (
                <div key={channel.id} className="group relative">
                    <button
                        onClick={() => onSelectChannel(channel.id)}
                        className={`flex items-center w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${activeChannelId === channel.id ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                    >
                       <Icon name={channel.icon} className="w-5 h-5 mr-3 flex-shrink-0" />
                       <span className="truncate flex-1">{channel.name}</span>
                       {channel.isExternal && <Icon name="send" className="w-4 h-4 text-green-400 flex-shrink-0" />}
                    </button>
                    <div className="absolute top-1/2 right-2 -translate-y-1/2 hidden group-hover:flex items-center bg-gray-700 rounded-full">
                        <button onClick={(e) => { e.stopPropagation(); onEditChannel(channel); }} className="p-1.5 text-gray-300 hover:text-white"><Icon name="edit" className="w-4 h-4"/></button>
                        <button onClick={(e) => { e.stopPropagation(); onDeleteChannel(channel.id); }} className="p-1.5 text-gray-300 hover:text-white"><Icon name="trash" className="w-4 h-4"/></button>
                    </div>
                </div>
            ))}
        </nav>
    </div>
);

const ChatArea = ({ channel, messages, actingSecretaria, onSendMessage, onBack }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [messages]);
    
    const submitMessage = () => {
        if (newMessage.trim() === '') return;
        onSendMessage(newMessage.trim());
        setNewMessage('');
    };

    const handleFormSubmit = (e: React.FormEvent) => { e.preventDefault(); submitMessage(); };
    const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitMessage(); } };
    
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg flex flex-col h-full">
            {channel ? (
                <>
                    <div className="p-4 border-b border-gray-700 flex items-center">
                        <button onClick={onBack} className="lg:hidden mr-4 text-gray-400 hover:text-white"><Icon name="arrow-left" className="w-6 h-6" /></button>
                        <div>
                            <h3 className="font-bold text-white flex items-center gap-2">{channel.name} {channel.isExternal && <Icon name="send" className="w-4 h-4 text-green-400"/>}</h3>
                            <p className="text-sm text-gray-400">{channel.description}</p>
                        </div>
                    </div>
                    <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                        {channel.isExternal && <p className="text-center text-xs text-yellow-300 bg-yellow-900/50 p-2 rounded-md">Esto es un registro de los mensajes enviados por WhatsApp. No es un chat en tiempo real.</p>}
                        {messages.map(msg => {
                            const isOwnMessage = msg.author === actingSecretaria;
                            return (
                            <div key={msg.id} className={`flex items-end gap-3 ${isOwnMessage ? 'justify-end' : ''}`}>
                                <div className={`flex flex-col max-w-lg ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                                    <div className={`px-4 py-2 rounded-xl ${isOwnMessage ? 'bg-red-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500">
                                        {!isOwnMessage && <span className="font-semibold">{msg.author}</span>}
                                        {isOwnMessage && <span className="font-semibold">Tú</span>}
                                        {' • '}
                                        <span>{msg.timestamp}</span>
                                    </div>
                                </div>
                            </div>
                            )}
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t border-gray-700">
                        <form onSubmit={handleFormSubmit} className="flex items-center space-x-3">
                            <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={handleTextareaKeyDown} placeholder={channel.isExternal ? `Enviar a ${channel.externalContactPhone} por WhatsApp...` : `Enviar un mensaje a ${channel.name}...`} className="flex-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" rows={1} />
                            <button type="submit" className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500 disabled:bg-gray-600 flex items-center gap-2" disabled={!newMessage.trim()}>
                               <Icon name="send" className="w-5 h-5"/>
                               {channel.isExternal && <span className="text-xs font-bold">WhatsApp</span>}
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <div className="flex justify-center items-center h-full text-center p-4">
                    <p className="text-gray-500">Selecciona un canal para empezar a chatear.</p>
                </div>
            )}
        </div>
    );
}

const InternalCommsView: React.FC<InternalCommsViewProps> = ({ actingSecretaria }) => {
    const [channels, setChannels] = useState<Channel[]>(initialChannels);
    const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
    const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
    
    // Select first channel on desktop
    useEffect(() => {
        if(window.innerWidth >= 1024 && !activeChannelId && channels.length > 0) {
            setActiveChannelId(channels[0].id);
        } else if (channels.length === 0) {
            setActiveChannelId(null);
        }
    }, [channels, activeChannelId]);

    const selectedChannel = useMemo(() => channels.find(c => c.id === activeChannelId), [channels, activeChannelId]);
    const channelMessages = useMemo(() => activeChannelId ? messages[activeChannelId] || [] : [], [messages, activeChannelId]);

    const handleSaveChannel = (channelData) => {
        if (channelData.id) { // Editing existing channel
            setChannels(prev => prev.map(c => c.id === channelData.id ? { ...c, ...channelData } : c));
        } else { // Creating new channel
            const newChannel = { ...channelData, id: new Date().toISOString() };
            setChannels(prev => [...prev, newChannel]);
            setMessages(prev => ({ ...prev, [newChannel.id]: [] }));
            setActiveChannelId(newChannel.id);
        }
    };

    const handleDeleteChannel = (channelId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este canal? Todos los mensajes se perderán.')) {
            setChannels(prev => prev.filter(c => c.id !== channelId));
            setMessages(prev => {
                const newMessages = { ...prev };
                delete newMessages[channelId];
                return newMessages;
            });
            if (activeChannelId === channelId) {
                setActiveChannelId(channels.length > 1 ? channels.find(c => c.id !== channelId)!.id : null);
            }
        }
    };
    
    const handleSendMessage = (text: string) => {
        if (!activeChannelId || !selectedChannel) return;
        const message: Message = {
            id: new Date().toISOString(),
            text,
            author: actingSecretaria,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => ({ ...prev, [activeChannelId]: [...(prev[activeChannelId] || []), message] }));
        
        if (selectedChannel.isExternal && selectedChannel.externalContactPhone) {
            const phone = selectedChannel.externalContactPhone.replace(/\D/g, ''); // Sanitize phone
            const encodedText = encodeURIComponent(text);
            window.open(`https://wa.me/${phone}?text=${encodedText}`, '_blank', 'noopener,noreferrer');
        }
    };
    
    return (
        <div className="p-4 md:p-8 h-full flex flex-col">
            <ChannelModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveChannel} 
                channel={editingChannel} 
            />
            <div className="lg:hidden">
                {!activeChannelId && (
                  <>
                    <h1 className="text-2xl font-bold text-white mb-1">Comunicación Interna</h1>
                    <p className="text-gray-400 mb-4">Selecciona o crea un canal para chatear.</p>
                  </>
                )}
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                {/* Mobile View */}
                <div className={`lg:hidden ${activeChannelId ? 'hidden' : 'block'} h-full`}>
                    <ChannelList 
                        channels={channels}
                        activeChannelId={activeChannelId}
                        onSelectChannel={setActiveChannelId}
                        onAddChannel={() => { setEditingChannel(null); setIsModalOpen(true); }}
                        onEditChannel={(channel) => { setEditingChannel(channel); setIsModalOpen(true); }}
                        onDeleteChannel={handleDeleteChannel}
                    />
                </div>
                <div className={`lg:hidden ${activeChannelId ? 'block' : 'hidden'} h-full`}>
                    <ChatArea 
                        channel={selectedChannel}
                        messages={channelMessages}
                        actingSecretaria={actingSecretaria}
                        onSendMessage={handleSendMessage}
                        onBack={() => setActiveChannelId(null)}
                    />
                </div>
                
                {/* Desktop View */}
                <div className="hidden lg:block h-full">
                    <ChannelList 
                         channels={channels}
                         activeChannelId={activeChannelId}
                         onSelectChannel={setActiveChannelId}
                         onAddChannel={() => { setEditingChannel(null); setIsModalOpen(true); }}
                         onEditChannel={(channel) => { setEditingChannel(channel); setIsModalOpen(true); }}
                         onDeleteChannel={handleDeleteChannel}
                    />
                </div>
                <div className="hidden lg:col-span-3 lg:block h-full">
                     <ChatArea 
                        channel={selectedChannel}
                        messages={channelMessages}
                        actingSecretaria={actingSecretaria}
                        onSendMessage={handleSendMessage}
                        onBack={() => {}} // Not used on desktop
                    />
                </div>
            </div>
        </div>
    );
};

export default InternalCommsView;