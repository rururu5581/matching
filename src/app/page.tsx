"use client";

import React, { useState, useCallback, useTransition } from 'react';
import { Header } from '@/components/Header';
import { SeekerInput } from '@/components/SeekerInput';
import { JobsPanel } from '@/components/JobsPanel';
import { Footer } from '@/components/Footer';
import type { Job, MatchResult } from '@/lib/types';
import { Spinner } from '@/components/Spinner';
import { runMatching } from './actions';

export default function Home() {
    const [seekerInfo, setSeekerInfo] = useState<string>('');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [results, setResults] = useState<MatchResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleMatch = useCallback(() => {
        if (!seekerInfo.trim() || jobs.length === 0) {
            setError('職務経歴書・面談メモと求人情報CSVの両方をアップロードしてください。');
            return;
        }
        setError(null);
        setResults([]);

        startTransition(async () => {
            const result = await runMatching(seekerInfo, jobs);

            if (result.error) {
                setError(result.error);
            } else if (result.data) {
                setResults(result.data);
            }
        });
    }, [seekerInfo, jobs]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SeekerInput onContentChange={setSeekerInfo} onError={setError} />
                    <JobsPanel onJobsChange={setJobs} results={results} onError={setError} />
                </div>

                {isPending && (
                    <div className="fixed inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-50">
                        <Spinner />
                        <p className="mt-4 text-lg font-semibold text-gray-700">AIが最適なマッチングを分析中です...</p>
                        <p className="text-gray-500">しばらくお待ちください</p>
                    </div>
                )}

                {error && (
                     <div className="fixed bottom-10 right-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50" role="alert">
                        <strong className="font-bold">エラー: </strong>
                        <span className="block sm:inline">{error}</span>
                        <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                        </button>
                    </div>
                )}
            </main>
            <Footer 
                onMatch={handleMatch} 
                isReady={!!seekerInfo.trim() && jobs.length > 0} 
                isLoading={isPending} 
            />
        </div>
    );
}