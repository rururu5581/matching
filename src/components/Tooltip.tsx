import React from 'react';
import type { EvaluationCriterion } from '@/lib/types';

interface TooltipProps {
    children: React.ReactNode;
    score: number;
    maxScore: number;
    percentage: number;
    details: {
        criterion: EvaluationCriterion;
        score: number;
        evaluationPoint: number;
    }[];
}

export const Tooltip: React.FC<TooltipProps> = ({ children, score, maxScore, percentage, details }) => {
    return (
        <div className="relative group">
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80
                bg-gray-800 text-white text-sm rounded-lg shadow-xl p-3
                opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                <div className="font-bold text-base mb-2">【マッチ度 詳細スコア】</div>
                <div className="w-full h-2 bg-gray-600 rounded-full mb-2">
                    <div className="h-2 bg-morich-red rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <table className="w-full text-xs">
                    <thead>
                        <tr className="text-left text-gray-400">
                            <th className="pb-1 font-normal">評価軸</th>
                            <th className="pb-1 font-normal text-center">重要度</th>
                            <th className="pb-1 font-normal text-center">スコア</th>
                            <th className="pb-1 font-normal text-right">評価点</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.map(({ criterion, score, evaluationPoint }) => (
                            <tr key={criterion.key}>
                                <td className="py-0.5">{criterion.label}</td>
                                <td className="py-0.5 text-center">{criterion.importance}</td>
                                <td className="py-0.5 text-center">{score}</td>
                                <td className="py-0.5 text-right font-semibold">{evaluationPoint}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="border-t border-gray-600 mt-2 pt-1 text-right">
                    <span className="font-bold text-base">総合計: {score}/{maxScore}点</span>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-0
                    border-l-8 border-l-transparent
                    border-r-8 border-r-transparent
                    border-t-8 border-t-gray-800 transform translate-y-full">
                </div>
            </div>
        </div>
    );
};