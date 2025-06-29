import type { EvaluationCriterion } from './types';

export const EVALUATION_CRITERIA: EvaluationCriterion[] = [
    { key: 'workExperience', label: '職務経験・スキル', importance: 5 },
    { key: 'cultureFit', label: 'カルチャーフィット', importance: 5 },
    { key: 'careerGoals', label: '転職理由・志向性', importance: 4 },
    { key: 'salary', label: '希望年収', importance: 4 },
    { key: 'personality', label: 'パーソナリティ', importance: 3 },
    { key: 'growthPotential', label: '学習意欲・成長可能性', importance: 3 },
    { key: 'xFactor', label: 'Xファクター', importance: 2 },
];

export const MAX_SCORE_PER_CRITERION = 5;

export const TOTAL_MAX_SCORE = EVALUATION_CRITERIA.reduce(
    (acc, criterion) => acc + criterion.importance * MAX_SCORE_PER_CRITERION,
    0
);