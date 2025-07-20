import React from 'react';
import Icon from './Icon';

const Card = ({ title, children, iconName }: { title: string; children: React.ReactNode; iconName: string; }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
      <Icon name={iconName} className="w-6 h-6 mr-3 text-red-400" />
      {title}
    </h2>
    <div className="text-gray-300 space-y-2">
      {children}
    </div>
  </div>
);

const ResourcesView: React.FC = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="space-y-6">
        <Card title="Guía de Estilo y Lenguaje" iconName="resources">
          <p><strong>Logotipo y Colores:</strong> Usar siempre el logo oficial en alta resolución. Nuestros colores primarios son el rojo sindical (#ef4444) y el gris neutro (#4b5563).</p>
          <p><strong>Tipografía:</strong> Para documentos oficiales usar 'Inter'. Para comunicación web, usar 'System UI'.</p>
          <p><strong>Lenguaje Inclusivo:</strong> Evitar el masculino genérico. Optar por desdoblamientos (trabajadores y trabajadoras), sustantivos colectivos (el personal, la afiliación) o barras (compañero/a).</p>
          <p><strong>Tono de Voz:</strong> Nuestro tono debe ser claro, directo, crítico pero constructivo, y siempre respetuoso.</p>
          <a href="https://drive.google.com/file/d/13n8KNxUKKU8FCPvLCLRKNgIj-Qic4FIX/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 font-semibold">Descargar guía completa (PDF) &rarr;</a>
        </Card>

        <Card title="Manual de Redes Sociales" iconName="share">
           <p>Este manual ofrece directrices y buenas prácticas para la gestión de las redes sociales del sindicato, asegurando una comunicación coherente, efectiva y alineada con nuestros objetivos estratégicos.</p>
           <ul className="list-disc list-inside text-gray-400 mt-2">
            <li>Estrategia de contenido para cada plataforma.</li>
            <li>Protocolo de interacción y respuesta a comentarios.</li>
            <li>Métricas clave para medir el impacto.</li>
          </ul>
           <a href="https://drive.google.com/file/d/1bpXcs5J3U3G8W9Aj7mtUmMvYjQ7xlYGi/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 font-semibold mt-4 inline-block">Consultar manual de redes (PDF) &rarr;</a>
        </Card>

        <Card title="Protocolo de Crisis de Reputación" iconName="activity">
          <p><strong>Paso 1: Detección y Alerta.</strong> Informar inmediatamente a la Secretaría de Comunicación ante cualquier ataque mediático o crisis de imagen.</p>
          <p><strong>Paso 2: Evaluación.</strong> El comité de crisis evaluará la situación y definirá el portavoz autorizado.</p>
          <p><strong>Paso 3: Respuesta.</strong> Se elaborará un comunicado oficial basado en la transparencia y los hechos. Nunca se debe responder "en caliente".</p>
          <p><strong>Paso 4: Monitoreo.</strong> Seguimiento de la repercusión en medios y redes sociales.</p>
          <a href="#" className="text-red-400 hover:text-red-300 font-semibold">Ver protocolo detallado &rarr;</a>
        </Card>
        
         <Card title="Base de Conocimiento (Wiki Interna)" iconName="dashboard">
          <p>Aquí encontrarás respuestas a preguntas frecuentes, guías de buenas prácticas, y documentos clave del sindicato.</p>
          <ul className="list-disc list-inside text-gray-400 mt-2">
            <li>Guía para organizar una asamblea</li>
            <li>Plantilla para notas de prensa</li>
            <li>Contacto de delegados por sección</li>
          </ul>
           <a href="#" className="text-red-400 hover:text-red-300 font-semibold mt-4 inline-block">Explorar la Wiki &rarr;</a>
        </Card>
      </div>
    </div>
  );
};

export default ResourcesView;