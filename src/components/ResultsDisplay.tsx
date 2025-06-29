import React from 'react';
import type { MatchResult } from '@/lib/types';
import { JobCard } from './JobCard';

interface ResultsDisplayProps {
    results: MatchResult[];
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-700">
                <span className="text-morich-red">AI</span> マッチング結果
            </h2>
            <div className="space-y-4">
                {results.map((result, index) => (
                    <JobCard key={result.job['JOB ID']} result={result} rank={index + 1} />
                ))}
            </div>
        </div>
    );
};