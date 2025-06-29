"use client";

import React, { useState, useCallback, useRef } from 'react';
import type { Job, MatchResult } from '@/lib/types';
import { ResultsDisplay } from './ResultsDisplay';
import { UploadIcon } from './icons';
import Papa from 'papaparse';

interface JobsPanelProps {
    onJobsChange: (jobs: Job[]) => void;
    results: MatchResult[];
    onError: (error: string) => void;
}

export const JobsPanel: React.FC<JobsPanelProps> = ({ onJobsChange, results, onError }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            onError('CSVファイルを選択してください。');
            return;
        }
        
        setFileName(file.name);
        onError('');

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result: any) => {
                onJobsChange(result.data as Job[]);
            },
            error: (err: any) => {
                console.error('CSV Parsing Error:', err);
                onError(`CSVの解析に失敗しました: ${err.message}`);
                setFileName(null);
            }
        });
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [onJobsChange, onError]);

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-1 text-gray-700">2. 求人情報</h2>
                <p className="text-sm text-gray-500 mb-4">求人情報が記載されたCSVファイルをアップロードしてください。</p>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                    id="csv-upload"
                />
                <label
                    htmlFor="csv-upload"
                    className="flex items-center justify-center w-full px-4 py-3 text-base font-medium text-morich-red border-2 border-dashed border-morich-red rounded-md
                        transition-colors duration-200 cursor-pointer hover:bg-red-50"
                >
                    <UploadIcon className="w-5 h-5 mr-2" />
                    {fileName ? `読み込み完了: ${fileName}` : '求人情報CSVをアップロード'}
                </label>
            </div>

            {results.length > 0 && <ResultsDisplay results={results} />}
        </div>
    );
};