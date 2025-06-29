import React from 'react';
import { SparklesIcon } from './icons';

export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <SparklesIcon className="w-8 h-8 text-morich-red" />
                    <h1 className="text-2xl font-bold text-gray-800">
                        morich <span className="text-morich-red">Optimal Matcher</span>
                    </h1>
                </div>
                <div className="text-sm text-gray-500">
                    for morich consultants
                </div>
            </div>
        </header>
    );
};