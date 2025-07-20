import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ActivityLogView from './components/ActivityLogView';
import AnalyticsView from './components/AnalyticsView';
import ResourcesView from './components/ResourcesView';
import InternalCommsView from './components/InternalCommsView';
import ExternalCommsView from './components/ExternalCommsView';
import SocialMediaView from './components/SocialMediaView';
import { View, Activity, ActivityCategory, Secretaria, PressRelease } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [actingSecretaria, setActingSecretaria] = useState<Secretaria>(Secretaria.General);
  const [activities, setActivities] = useState<Activity[]>([
        {
            id: '1',
            title: 'Rueda de prensa sobre la nueva ley laboral',
            category: ActivityCategory.PressPotential,
            secretaria: Secretaria.General,
            description: 'Se convocó a los principales medios para explicar la postura del sindicato sobre la reforma laboral. Hubo buena asistencia.',
            relevanceTags: ['prensa', 'reforma laboral', 'posicionamiento público'],
            observations: 'Gran repercusión en medios digitales. La SER y El País publicaron la noticia.',
            date: '2023-10-26T10:00:00Z',
        },
        {
            id: '2',
            title: 'Taller de comunicación no violenta',
            category: ActivityCategory.Training,
            secretaria: Secretaria.Formacion,
            description: 'Taller impartido para delegados y delegadas para mejorar la gestión de conflictos.',
            relevanceTags: ['formación interna', 'habilidades blandas'],
            observations: 'Muy valorado por los asistentes. Se propone una segunda edición.',
            date: '2023-10-25T15:00:00Z',
        },
        {
            id: '3',
            title: 'Campaña en redes por el 8M',
            category: ActivityCategory.SocialMedia,
            secretaria: Secretaria.Comunicacion,
            description: 'Lanzamiento de la campaña #SindicalismoFeminista con vídeos y testimonios.',
            relevanceTags: ['8M', 'feminismo', 'sensibilización'],
            observations: 'Alto engagement en Twitter e Instagram. Se llegó a un público más joven.',
            date: '2023-03-01T09:00:00Z',
        },
         {
            id: '4',
            title: 'Acuerdo en el sector sanitario',
            category: ActivityCategory.MemberSupport,
            secretaria: Secretaria.Sanidad,
            description: 'Se ha firmado un acuerdo para la mejora de las condiciones laborales del personal de enfermería.',
            relevanceTags: ['acuerdo', 'sanidad', 'negociación'],
            observations: 'Satisfacción generalizada entre la afiliación del sector.',
            date: '2023-11-05T12:00:00Z',
        }
  ]);
  
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([
     {
        id: 'pr1',
        secretaria: Secretaria.General,
        preheadline: "NEGOCIACIÓN COLECTIVA",
        headline: "UGT Firma un Preacuerdo Histórico para el Sector del Metal",
        subheadline: "El acuerdo contempla una subida salarial del 5% y mejoras en la conciliación.",
        lead: "La Unión General de Trabajadoras y Trabajadores (UGT) ha alcanzado un preacuerdo con la patronal del sector del metal que beneficiará a más de 20.000 trabajadores en la provincia, sentando un precedente en la negociación colectiva.",
        body: "Tras semanas de intensas negociaciones, el equipo negociador de UGT ha conseguido arrancar un compromiso firme de la patronal para mejorar sustancialmente las condiciones laborales. El punto clave del acuerdo es una subida salarial del 5% para el presente año, con una cláusula de revisión conforme al IPC para garantizar que no se pierda poder adquisitivo.\n\nAdemás, se han incluido importantes avances en materia de conciliación, como la ampliación del permiso de paternidad y la creación de una bolsa de horas para asuntos propios.",
        contact: "Secretaría de Comunicación\ncomunicacion@ugtsalamanca.es\n923 21 21 21",
        date: "2023-11-10T11:00:00Z"
    }
  ]);

  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'date'>) => {
    const newActivity: Activity = {
      ...activity,
      id: new Date().toISOString() + Math.random(),
      date: new Date().toISOString(),
    };
    setActivities(prevActivities => [newActivity, ...prevActivities]);
  }, []);

  const updateActivity = useCallback((updatedActivity: Activity) => {
    setActivities(prevActivities => 
        prevActivities.map(act => act.id === updatedActivity.id ? updatedActivity : act)
    );
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setActivities(prevActivities => prevActivities.filter(act => act.id !== id));
  }, []);

  const addPressRelease = useCallback((release: Omit<PressRelease, 'id' | 'date'>) => {
    const newRelease: PressRelease = {
      ...release,
      id: new Date().toISOString() + Math.random(),
      date: new Date().toISOString(),
    };
    setPressReleases(prev => [newRelease, ...prev]);
  }, []);

  const updatePressRelease = useCallback((updatedRelease: PressRelease) => {
    setPressReleases(prev => 
      prev.map(pr => pr.id === updatedRelease.id ? { ...updatedRelease, date: new Date().toISOString() } : pr)
    );
  }, []);

  const deletePressRelease = useCallback((id: string) => {
    setPressReleases(prev => prev.filter(pr => pr.id !== id));
  }, []);
  
  const viewTitles: Record<View, string> = {
    [View.Dashboard]: 'Dashboard Estratégico',
    [View.ActivityLog]: 'Gestión de Actividades',
    [View.Analytics]: 'Análisis y Métricas',
    [View.ExternalComms]: 'Comunicación Externa',
    [View.SocialMedia]: 'Generador para Redes Sociales',
    [View.InternalComms]: 'Comunicación Interna',
    [View.Resources]: 'Recursos y Guías',
  }

  const renderView = () => {
    switch (currentView) {
      case View.Dashboard:
        return <DashboardView activities={activities} />;
      case View.ActivityLog:
        return <ActivityLogView 
                    activities={activities}
                    addActivity={addActivity}
                    updateActivity={updateActivity}
                    deleteActivity={deleteActivity}
                    actingSecretaria={actingSecretaria}
                />;
      case View.Analytics:
        return <AnalyticsView activities={activities} />;
       case View.ExternalComms:
        return <ExternalCommsView 
                    actingSecretaria={actingSecretaria} 
                    pressReleases={pressReleases}
                    addPressRelease={addPressRelease}
                    updatePressRelease={updatePressRelease}
                    deletePressRelease={deletePressRelease}
               />;
      case View.SocialMedia:
        return <SocialMediaView activities={activities} />;
      case View.Resources:
        return <ResourcesView />;
      case View.InternalComms:
          return <InternalCommsView actingSecretaria={actingSecretaria} />;
      default:
        return <DashboardView activities={activities} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
         <Header
            title={viewTitles[currentView]}
            onMenuClick={() => setSidebarOpen(true)}
            actingSecretaria={actingSecretaria}
            setActingSecretaria={setActingSecretaria}
        />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;