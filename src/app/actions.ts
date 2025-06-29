"use server";

import { getMatchingResults } from "@/services/geminiService";
import type { Job, MatchResult } from "@/lib/types";

interface ActionResult {
    data: MatchResult[] | null;
    error: string | null;
}

export async function runMatching(seekerInfo: string, jobs: Job[]): Promise<ActionResult> {
    try {
        const matchResults = await getMatchingResults(seekerInfo, jobs);
        // Sort results by total score in descending order
        const sortedResults = matchResults.sort((a, b) => b.totalScore - a.totalScore);
        return { data: sortedResults, error: null };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'Unknown server error.';
        return { data: null, error: `An error occurred on the server during matching: ${errorMessage}` };
    }
}