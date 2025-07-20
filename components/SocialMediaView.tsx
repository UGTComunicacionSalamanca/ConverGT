import React, { useState, useCallback, useMemo } from 'react';
import { Activity } from '../types';
import { generateSocialMediaPost } from '../services/geminiService';
import Icon from './Icon';

const socialPlatforms = [
    { name: 'Twitter', icon: 'comms' },
    { name: 'Facebook', icon: 'comms' },
    { name: 'Instagram', icon: 'comms' },
    { name: 'TikTok', icon: 'comms' },
    { name: 'WhatsApp/Telegram', icon: 'send' },
];

const ActionButtons = ({ platform, content, onCopyToClipboard, copied }) => {
    const handlePublish = () => {
        const encodedText = encodeURIComponent(content);
        let url = '';
        switch(platform) {
            case 'Twitter':
                url = `https://twitter.com/intent/tweet?text=${encodedText}`;
                break;
            case 'Facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://ugt.es/')}&quote=${encodedText}`;
                break;
            case 'WhatsApp/Telegram': // Primarily WhatsApp
                url = `https://api.whatsapp.com/send?text=${encodedText}`;
                break;
        }
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };
    
    const handleTelegramPublish = () => {
        const encodedText = encodeURIComponent(content);
        const url = `https://t.me/share/url?url=_&text=${encodedText}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    if (['Instagram', 'TikTok'].includes(platform)) {
        return (
             <div className="mt-4 p-3 bg-gray-900 rounded-lg flex items-center gap-4">
                 <button onClick={onCopyToClipboard} className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors">
                    <Icon name={copied ? "check" : "copy"} className="w-5 h-5 mr-2" />
                    {copied ? '¡Copiado!' : 'Copiar Texto'}
                 </button>
                 <p className="text-xs text-gray-400 flex-1">Copia el texto y pégalo en la app de {platform}.</p>
             </div>
        );
    }
    
    if (platform === 'WhatsApp/Telegram') {
       return (
         <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <button onClick={handlePublish} className="flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors">
                <Icon name="send" className="w-5 h-5 mr-2" />
                Publicar en WhatsApp
             </button>
             <button onClick={handleTelegramPublish} className="flex items-center justify-center px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-400 transition-colors">
                <Icon name="send" className="w-5 h-5 mr-2" />
                Publicar en Telegram
             </button>
         </div>
       )
    }

    return (
        <div className="mt-4">
            <button onClick={handlePublish} className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors">
                <Icon name="publish" className="w-5 h-5 mr-2" />
                Publicar en {platform}
            </button>
        </div>
    );
};


const SocialMediaView: React.FC<{ activities: Activity[] }> = ({ activities }) => {
    const [selectedActivityId, setSelectedActivityId] = useState<string>('');
    const [additionalContext, setAdditionalContext] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');
    const [error, setError] = useState('');
    const [currentTargetPlatform, setCurrentTargetPlatform] = useState('');
    const [copied, setCopied] = useState(false);

    const selectedActivity = useMemo(() => 
        activities.find(act => act.id === selectedActivityId),
    [activities, selectedActivityId]);

    const handleGenerate = useCallback(async (platform: string) => {
        if (!selectedActivity && !additionalContext) return;

        setIsLoading(true);
        setCurrentTargetPlatform(platform);
        setGeneratedContent('');
        setError('');
        setCopied(false);

        try {
            const result = await generateSocialMediaPost(selectedActivity || null, platform, additionalContext);
            setGeneratedContent(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedActivity, additionalContext]);
    
    const handleCopyToClipboard = () => {
        if (!generatedContent) return;
        navigator.clipboard.writeText(generatedContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const canGenerate = selectedActivityId !== '' || additionalContext.trim() !== '';

    return (
        <div className="p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Selection */}
                <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg self-start">
                    <h2 className="text-xl font-semibold text-white mb-4">1. Elige una Fuente de Contenido</h2>
                    
                    <div>
                        <label htmlFor="activity-selector" className="block text-sm font-medium text-gray-300 mb-2">Opción A: Selecciona una Actividad</label>
                        <select
                            id="activity-selector"
                            value={selectedActivityId}
                            onChange={(e) => {
                                setSelectedActivityId(e.target.value);
                                setGeneratedContent('');
                                setError('');
                            }}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="">-- Ninguna --</option>
                            {activities.map(act => (
                                <option key={act.id} value={act.id}>{act.title}</option>
                            ))}
                        </select>
                    </div>

                    <p className="text-center my-4 text-gray-400 font-semibold">O</p>

                    <div>
                        <label htmlFor="additional-context" className="block text-sm font-medium text-gray-300 mb-2">Opción B: Pega un enlace o texto</label>
                        <textarea
                            id="additional-context"
                            value={additionalContext}
                            onChange={(e) => {
                                setAdditionalContext(e.target.value);
                                setGeneratedContent('');
                                setError('');
                            }}
                            rows={4}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Ej: https://... o 'Gran acuerdo conseguido...'"
                        />
                    </div>
                </div>

                {/* Right Column: Generation & Result */}
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                     <h2 className="text-xl font-semibold text-white mb-4">2. Genera el Contenido</h2>
                     {!canGenerate ? (
                        <div className="flex items-center justify-center h-full min-h-[300px] text-gray-500">
                            <p>Por favor, selecciona una actividad o añade contexto para empezar.</p>
                        </div>
                     ) : (
                        <div>
                            <p className="text-gray-400 mb-4">Elige para qué plataforma quieres crear una publicación:</p>
                            <div className="flex flex-wrap gap-3 mb-6">
                                {socialPlatforms.map(platform => (
                                    <button
                                        key={platform.name}
                                        onClick={() => handleGenerate(platform.name)}
                                        disabled={isLoading}
                                        className="flex items-center px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        {isLoading && currentTargetPlatform === platform.name ? (
                                             <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : <Icon name={platform.icon} className="w-5 h-5 mr-2" />}
                                       
                                        {platform.name}
                                    </button>
                                ))}
                            </div>

                            {error && (
                                <div className="mt-4 p-4 bg-red-900 border border-red-700 rounded-lg">
                                    <p className="text-red-300">{error}</p>
                                </div>
                            )}

                            <div className="mt-4">
                                <label htmlFor="social-output" className="block text-sm font-medium text-gray-300 mb-2">
                                    Contenido Generado para <span className="text-red-400 font-bold">{currentTargetPlatform}</span>
                                </label>
                                <div className="relative">
                                    <textarea
                                        id="social-output"
                                        readOnly
                                        value={generatedContent}
                                        rows={10}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="El contenido generado por la IA aparecerá aquí..."
                                    ></textarea>
                                </div>
                                {generatedContent && <ActionButtons platform={currentTargetPlatform} content={generatedContent} onCopyToClipboard={handleCopyToClipboard} copied={copied} />}
                            </div>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default SocialMediaView;