import React from 'react';
import { SparklesIcon } from './icons';

interface FooterProps {
    onMatch: () => void;
    isReady: boolean;
    isLoading: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onMatch, isReady, isLoading }) => {
    return (
        <footer className="bg-white shadow-up sticky bottom-0 z-10">
            <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center">
                <button
                    onClick={onMatch}
                    disabled={!isReady || isLoading}
                    className={`
                        flex items-center justify-center space-x-3 px-12 py-4 text-lg font-bold text-white 
                        rounded-full transition-all duration-300 ease-in-out
                        focus:outline-none focus:ring-4 focus:ring-red-300
                        ${isLoading ? 'bg-gray-400 cursor-wait' : ''}
                        ${!isLoading && isReady ? 'bg-morich-red hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1' : ''}
                        ${!isReady && !isLoading ? 'bg-gray-300 cursor-not-allowed' : ''}
                    `}
                >
                    {isLoading ? (
                        <span>分析中...</span>
                    ) : (
                        <>
                            <SparklesIcon className="w-6 h-6" />
                            <span>最適マッチングを実行</span>
                        </>
                    )}
                </button>
            </div>
        </footer>
    );
};