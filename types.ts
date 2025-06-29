export interface Job {
    'JOB ID': string;
    '企業名': string;
    'ポジション': string;
    '業務内容': string;
    '応募資格': string;
    '年収下限': string;
    '年収上限': string;
    '求める人材': string;
    '企業風土'?: string;
    '募集背景'?: string;
    '事業フェーズ'?: string;
    [key: string]: any; // Allow other properties from CSV
}

export interface Scores {
    workExperience: number;
    salary: number;
    cultureFit: number;
    careerGoals: number;
    personality: number;
    growthPotential: number;
    xFactor: number;
}

export interface EvaluationCriterion {
    key: keyof Scores;
    label: string;
    importance: number;
}

export interface AiMatchResponse {
    jobId: string;
    matchReason: string;
    scores: Scores;
}

export interface MatchResult {
    job: Job;
    aiResponse: AiMatchResponse;
    detailedScores: {
        criterion: EvaluationCriterion;
        score: number;
        evaluationPoint: number;
    }[];
    totalScore: number;
    maxScore: number;
    matchPercentage: number;
}
