import React from 'react';
import Icon from './Icon';
import { Secretaria } from '../types';

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
    actingSecretaria: Secretaria;
    setActingSecretaria: (secretaria: Secretaria) => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick, actingSecretaria, setActingSecretaria }) => {
    return (
        <header className="bg-gray-800 shadow-md lg:bg-gray-900 z-10">
            <div className="flex items-center justify-between p-4 h-auto md:h-16 flex-wrap md:flex-nowrap gap-4">
                <div className="flex items-center">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden text-gray-400 hover:text-white"
                        aria-label="Open sidebar"
                    >
                        <Icon name="menu" className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg md:text-xl font-bold text-white ml-2 md:ml-0">
                        {title}
                    </h1>
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto order-last md:order-none">
                     <label htmlFor="secretaria-selector" className="text-sm font-medium text-gray-400 whitespace-nowrap">
                        Actuando como:
                    </label>
                    <select
                        id="secretaria-selector"
                        value={actingSecretaria}
                        onChange={(e) => setActingSecretaria(e.target.value as Secretaria)}
                        className="w-full md:w-auto bg-gray-700 border border-gray-600 rounded-md shadow-sm py-1.5 px-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        {Object.values(Secretaria).map(sec => (
                            <option key={sec} value={sec}>{sec}</option>
                        ))}
                    </select>
                </div>
            </div>
        </header>
    );
};

export default Header;