"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UploadIcon } from './icons';
import * as pdfjsLib from 'pdfjs-dist';

interface SeekerInputProps {
    onContentChange: (content: string) => void;
    onError: (error: string) => void;
}

export const SeekerInput: React.FC<SeekerInputProps> = ({ onContentChange, onError }) => {
    const [text, setText] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }, []);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = event.target.value;
        setText(newText);
        onContentChange(newText);
    };

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            onError('PDFファイルを選択してください。');
            return;
        }

        setIsParsing(true);
        onError('');
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target?.result;
                if (!arrayBuffer) throw new Error("File reading failed.");
                
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const numPages = pdf.numPages;
                
                const pagePromises = Array.from({ length: numPages }, (_, i) => i + 1).map(pageNum =>
                    pdf.getPage(pageNum).then(page => page.getTextContent())
                );
                
                const textContents = await Promise.all(pagePromises);
                const fullText = textContents.map(content => 
                    content.items.map((item: any) => item.str).join(' ')
                ).join('\n\n');

                setText(fullText);
                onContentChange(fullText);
            } catch (err) {
                console.error('Error parsing PDF:', err);
                onError('PDFの解析に失敗しました。ファイルが破損しているか、サポートされていない形式の可能性があります。');
            } finally {
                setIsParsing(false);
                 if(fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.readAsArrayBuffer(file);
    }, [onContentChange, onError]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
            <h2 className="text-xl font-bold mb-1 text-gray-700">1. 求職者情報</h2>
            <p className="text-sm text-gray-500 mb-4">職務経歴書や面談メモを貼り付けるか、PDFファイルをアップロードしてください。</p>
            <div className="flex-grow flex flex-col">
                <textarea
                    value={text}
                    onChange={handleTextChange}
                    placeholder="ここに職務経歴書・面談メモの内容を貼り付け..."
                    className="w-full flex-grow p-4 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-morich-red focus:border-transparent transition"
                    aria-label="職務経歴書・面談メモ"
                />
            </div>
            <div className="mt-4">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                    id="pdf-upload"
                />
                <label
                    htmlFor="pdf-upload"
                    className={`
                        flex items-center justify-center w-full px-4 py-3 text-base font-medium text-white rounded-md
                        transition-colors duration-200 cursor-pointer
                        ${isParsing ? 'bg-gray-400' : 'bg-morich-red hover:bg-red-700'}
                    `}
                >
                    <UploadIcon className="w-5 h-5 mr-2" />
                    {isParsing ? 'PDFを解析中...' : 'PDFファイルをアップロード'}
                </label>
            </div>
        </div>
    );
};