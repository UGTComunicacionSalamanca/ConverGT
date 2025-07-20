import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, ActivityCategory, Secretaria } from '../types';

interface AnalyticsViewProps {
  activities: Activity[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ activities }) => {
  const categoryData = Object.values(ActivityCategory).map(category => ({
    name: category,
    actividades: activities.filter(act => act.category === category).length,
  }));

  const secretariaData = Object.values(Secretaria).map(secretaria => ({
    name: secretaria,
    actividades: activities.filter(act => act.secretaria === secretaria).length,
  })).sort((a, b) => b.actividades - a.actividades);


  return (
    <div className="p-4 md:p-8">
      <div className="space-y-8">
        <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6">Actividades por Categoría</h2>
          {activities.length > 0 ? (
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <BarChart
                  data={categoryData}
                  margin={{
                    top: 5, right: 20, left: 0, bottom: 90,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                  <XAxis dataKey="name" tick={{ fill: '#a0aec0' }} angle={-45} textAnchor="end" interval={0} />
                  <YAxis allowDecimals={false} tick={{ fill: '#a0aec0' }} />
                  <Tooltip 
                    cursor={{fill: 'rgba(239, 68, 68, 0.1)'}}
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #4b5563', 
                      borderRadius: '0.5rem' 
                    }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Legend wrapperStyle={{ color: '#d1d5db', paddingTop: '20px' }} />
                  <Bar dataKey="actividades" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <p className="text-center text-gray-400 py-16">No hay suficientes datos para generar gráficos. Registra algunas actividades primero.</p>
          )}
        </div>

        <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6">Actividades por Secretaría</h2>
          {activities.length > 0 ? (
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <BarChart
                  data={secretariaData}
                  margin={{
                    top: 5, right: 20, left: 0, bottom: 90,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                  <XAxis dataKey="name" tick={{ fill: '#a0aec0' }} angle={-45} textAnchor="end" interval={0} />
                  <YAxis allowDecimals={false} tick={{ fill: '#a0aec0' }} />
                  <Tooltip 
                    cursor={{fill: 'rgba(239, 68, 68, 0.1)'}}
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #4b5563', 
                      borderRadius: '0.5rem' 
                    }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Legend wrapperStyle={{ color: '#d1d5db', paddingTop: '20px' }} />
                  <Bar dataKey="actividades" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <p className="text-center text-gray-400 py-16">No hay datos de secretarías. Registra algunas actividades primero.</p>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
             <h2 className="text-xl font-semibold text-white mb-4">Canales más Efectivos</h2>
             <p className="text-gray-400">Próximamente: Análisis de rendimiento por canal (redes, web, boletines).</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
             <h2 className="text-xl font-semibold text-white mb-4">Detección de Gaps</h2>
             <p className="text-gray-400">Próximamente: Identificación visual de temas subcomunicados.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;