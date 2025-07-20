import React from 'react';
import { View } from '../types';
import Icon from './Icon';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { view: View.Dashboard, label: 'Dashboard', icon: 'dashboard' },
  { view: View.ActivityLog, label: 'Registrar Actividad', icon: 'activity' },
  { view: View.InternalComms, label: 'Comunicación Interna', icon: 'comms' },
  { view: View.ExternalComms, label: 'Comunicación Externa', icon: 'newspaper' },
  { view: View.SocialMedia, label: 'Redes Sociales (IA)', icon: 'share' },
  { view: View.Resources, label: 'Recursos y Guías', icon: 'resources' },
  { view: View.Analytics, label: 'Análisis y Métricas', icon: 'analytics' },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, onClose }) => {
  const handleItemClick = (view: View) => {
    setView(view);
    onClose(); // Close sidebar on mobile after selection
  };
  
  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>
      
      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 flex-shrink-0 bg-gray-800 p-4 flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col items-center justify-center pt-2 mb-8">
          <div className="relative bg-red-600 w-[72px] h-[60px] rounded-lg flex items-center justify-center mb-4 shadow-lg">
              <Icon name="cycle" className="w-10 h-10 text-white"/>
              <div className="absolute w-0 h-0" style={{
                  borderLeft: '12px solid transparent',
                  borderRight: '12px solid transparent',
                  borderTop: '12px solid #dc2626',
                  bottom: '-10px',
                  left: '15px',
              }}></div>
          </div>
          <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-100">
                  Conver<span className="text-red-500">GT</span>
              </h1>
              <p className="text-sm font-medium text-red-500 -mt-1 tracking-tight">
                  Comunicación sindical en red
              </p>
          </div>
        </div>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleItemClick(item.view)}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentView === item.view
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon name={item.icon} className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto p-4 bg-gray-900 rounded-lg text-center">
          <h3 className="font-bold text-white">Cohesión para la Acción</h3>
          <p className="text-xs text-gray-400 mt-2">
            Esta herramienta potencia nuestra comunicación para fortalecer la lucha sindical.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;