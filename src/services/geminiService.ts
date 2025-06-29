import { GoogleGenAI } from "@google/genai";
import type { Job, AiMatchResponse, MatchResult } from '@/lib/types';
import { EVALUATION_CRITERIA, TOTAL_MAX_SCORE } from '@/lib/constants';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set. Please create a .env.local file and add your key.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const buildPrompt = (seekerInfo: string, jobs: Job[]): string => {
    const evaluationCriteriaText = EVALUATION_CRITERIA.map(c => `- **${c.label}**: ${c.key}`).join('\n');
    const jobFieldsToInclude = [
        'JOB ID', '企業名', 'ポジション', '業務内容', '応募資格', 
        '年収下限', '年収上限', '求める人材', '企業風土', '募集背景', '事業フェーズ'
    ];
    
    const simplifiedJobs = jobs.map(job => {
        const simpleJob: {[key: string]: any} = {};
        for(const field of jobFieldsToInclude) {
            if(job[field]) {
                simpleJob[field] = job[field];
            }
        }
        return simpleJob;
    });

    return `
You are an expert career matching AI for a top-tier Japanese recruitment agency, (株)morich.
Your task is to analyze a job seeker's resume and interview memo, and then evaluate a list of job openings to find the best matches.
For each job, you must provide a detailed evaluation based on a specific set of criteria, score each criterion, and write a compelling summary explaining why it's a good match.
Respond ONLY with a valid JSON object containing a key "matches" which is an array of match objects. Do not include any other text or markdown fences like \`\`\`json.

--- JOB SEEKER'S INFORMATION ---
${seekerInfo}
--- END JOB SEEKER'S INFORMATION ---

--- JOB LISTINGS (JSON) ---
${JSON.stringify(simplifiedJobs)}
--- END JOB LISTINGS ---

Please evaluate each job listing against the job seeker's information based on the following criteria. For each criterion, provide a score from 1 (poor match) to 5 (excellent match).

Evaluation Criteria:
${evaluationCriteriaText}

For each job, provide your analysis in the following JSON format. The final output must be a single JSON object with a "matches" key, which holds an array of these objects. Each object in the array must conform to this structure:
{
  "jobId": "The 'JOB ID' from the input job listing.",
  "matchReason": "A 3-4 sentence summary of why this is a good match. Refer to the evaluation criteria using Japanese brackets, for example: 【職務経験・スキル】.",
  "scores": {
    "workExperience": <score_1_to_5>,
    "salary": <score_1_to_5>,
    "cultureFit": <score_1_to_5>,
    "careerGoals": <score_1_to_5>,
    "personality": <score_1_to_5>,
    "growthPotential": <score_1_to_5>,
    "xFactor": <score_1_to_5>
  }
}
`;
};

const processAiResponse = (response: { matches: AiMatchResponse[] }, jobs: Job[]): MatchResult[] => {
    const jobsById = new Map(jobs.map(job => [job['JOB ID'], job]));
    
    if (!response.matches || !Array.isArray(response.matches)) {
        console.error("Invalid AI response: 'matches' key is not an array or is missing.", response);
        throw new Error("Invalid AI response format: 'matches' array not found.");
    }

    return response.matches.map(aiResponse => {
        const job = jobsById.get(aiResponse.jobId);
        if (!job) return null;

        let totalScore = 0;
        const detailedScores = EVALUATION_CRITERIA.map(criterion => {
            const score = aiResponse.scores[criterion.key] || 0;
            const evaluationPoint = score * criterion.importance;
            totalScore += evaluationPoint;
            return { criterion, score, evaluationPoint };
        });

        return {
            job,
            aiResponse,
            detailedScores,
            totalScore,
            maxScore: TOTAL_MAX_SCORE,
            matchPercentage: (totalScore / TOTAL_MAX_SCORE) * 100,
        };
    }).filter((result): result is MatchResult => result !== null);
};

export const getMatchingResults = async (seekerInfo: string, jobs: Job[]): Promise<MatchResult[]> => {
    if (jobs.length === 0) return [];
    
    const prompt = buildPrompt(seekerInfo, jobs);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.2,
        }
    });
    
    let jsonText = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonText.match(fenceRegex);
    if (match && match[2]) {
      jsonText = match[2].trim();
    }
    
    try {
        const parsedData = JSON.parse(jsonText);
        return processAiResponse(parsedData, jobs);
    } catch (e) {
        console.error("Failed to parse JSON response from AI:", jsonText);
        throw new Error("Could not parse the response from the AI. The format might be incorrect.");
    }
};