import React from 'react';

export const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m12 3-1.9 3.8-3.8 1.9 3.8 1.9L12 14.4l1.9-3.8 3.8-1.9-3.8-1.9L12 3z" fill="currentColor"/>
        <path d="M5 9.5 3.1 11.4 1.2 9.5l1.9-1.9L5 9.5z" fill="currentColor"/>
        <path d="M19 14.5l1.9-1.9 1.9 1.9-1.9 1.9L19 14.5z" fill="currentColor"/>
    </svg>
);