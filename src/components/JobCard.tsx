import React from 'react';
import type { MatchResult } from '@/lib/types';
import { Tooltip } from './Tooltip';

interface JobCardProps {
    result: MatchResult;
    rank: number;
}

export const JobCard: React.FC<JobCardProps> = ({ result, rank }) => {
    const { job, matchPercentage, aiResponse, detailedScores, totalScore, maxScore } = result;

    const formatSalary = (min: string, max: string) => {
        if (!min && !max) return '応相談';
        const minSal = min ? `${parseInt(min, 10) / 10000}万円` : '';
        const maxSal = max ? `${parseInt(max, 10) / 10000}万円` : '';
        if (min && max) return `${minSal}～${maxSal}`;
        return minSal || maxSal;
    };

    return (
        <div className="border border-gray-200 bg-white rounded-lg p-4 transition-shadow hover:shadow-lg">
            <div className="flex items-start space-x-4">
                <div className="text-3xl font-bold text-morich-red w-12 text-center">{rank}</div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">{job['企業名']}</h3>
                            <p className="text-md text-gray-600">{job['ポジション']}</p>
                            <p className="text-sm text-gray-500 mt-1">{formatSalary(job['年収下限'], job['年収上限'])}</p>
                        </div>
                        <Tooltip
                            score={totalScore}
                            maxScore={maxScore}
                            percentage={matchPercentage}
                            details={detailedScores}
                        >
                            <div className="text-center cursor-pointer">
                                <p className="text-sm text-gray-500">マッチ度</p>
                                <p className="text-2xl font-bold text-morich-red">{matchPercentage.toFixed(0)}%</p>
                            </div>
                        </Tooltip>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-bold text-gray-600 mb-1">AIによるマッチング理由</h4>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{aiResponse.matchReason}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};