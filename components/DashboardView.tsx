import React, { useState, useCallback } from 'react';
import { Activity } from '../types';
import { analyzeActivitiesForPress } from '../services/geminiService';
import Icon from './Icon';

interface DashboardViewProps {
  activities: Activity[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ activities }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [error, setError] = useState('');

  const handleAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setAnalysisResult('');
    try {
      const result = await analyzeActivitiesForPress(activities);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [activities]);

  const recentActivities = [...activities].slice(0, 5);

  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Icon name="sparkles" className="w-6 h-6 mr-3 text-red-400" />
              Análisis de Oportunidades (IA)
            </h2>
            <p className="text-gray-400 mb-4">
              Usa la IA de Gemini para analizar las actividades registradas e identificar potenciales noticias para la prensa.
            </p>
            <button
              onClick={handleAnalysis}
              disabled={isLoading || activities.length === 0}
              className="flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analizando...
                </>
              ) : "Analizar para Oportunidades de Prensa"}
            </button>
            {activities.length === 0 && <p className="text-sm text-yellow-400 mt-3">No hay actividades para analizar. ¡Registra una primero!</p>}

            {analysisResult && (
              <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <h3 className="font-bold text-red-400 mb-2">Sugerencias de la IA:</h3>
                <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm">{analysisResult}</pre>
              </div>
            )}
            {error && (
              <div className="mt-6 p-4 bg-red-900 border border-red-700 rounded-lg">
                <p className="text-red-300">{error}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Actividad Reciente</h2>
            {recentActivities.length > 0 ? (
              <ul className="space-y-4">
                {recentActivities.map(act => (
                  <li key={act.id} className="p-4 bg-gray-700 rounded-md flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <h3 className="font-semibold text-white">{act.title}</h3>
                      <p className="text-sm text-gray-400">{act.category} / <span className="font-medium text-gray-300">{act.secretaria}</span></p>
                    </div>
                    <span className="text-xs text-gray-500 mt-2 sm:mt-0">{new Date(act.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No se han registrado actividades recientemente.</p>
            )}
          </div>
        </div>

        {/* Columna lateral */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Resumen General</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="text-3xl font-bold text-red-400">{activities.length}</p>
              <p className="text-gray-300">Actividades Totales Registradas</p>
            </div>
             <div className="p-4 bg-gray-700 rounded-lg">
              <p className="text-3xl font-bold text-red-400">5</p>
              <p className="text-gray-300">Comunicados Enviados</p>
            </div>
             <div className="p-4 bg-gray-700 rounded-lg">
              <p className="text-3xl font-bold text-red-400">12</p>
              <p className="text-gray-300">Campañas Activas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;