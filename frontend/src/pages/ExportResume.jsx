import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ExportResume = () => {
    const [originalText, setOriginalText] = useState(localStorage.getItem('lastResumeText') || '');
    const [finalText, setFinalText] = useState(localStorage.getItem('lastResumeText') || '');
    const [isGenerating, setIsGenerating] = useState(false);
    const resumeRef = useRef(null);

    const handleDownloadPDF = async () => {
        if (!resumeRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(resumeRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Optimized_Resume.pdf');
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-display font-bold">Export Workspace</h1>
                        <p className="text-slate-400">Finalize and download your optimized resume.</p>
                    </div>
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isGenerating || !finalText}
                        className={`btn-primary px-8 py-3 flex items-center gap-2 ${isGenerating ? 'opacity-50' : ''}`}
                    >
                        {isGenerating ? '⏳ Generating...' : '📥 Download PDF'}
                    </button>
                </header>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Editor Section */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 rounded-2xl flex flex-col h-[700px]">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                ✍️ Edit & Refine
                            </h3>
                            <textarea
                                className="flex-1 w-full bg-slate-900/50 border border-white/10 rounded-xl p-6 text-slate-300 focus:outline-none focus:border-primary-500 transition-colors resize-none font-mono text-sm leading-relaxed"
                                value={finalText}
                                onChange={(e) => setFinalText(e.target.value)}
                                placeholder="Paste your optimized text here..."
                            ></textarea>
                            <div className="mt-4 p-4 bg-primary-500/5 rounded-xl border border-primary-500/10">
                                <p className="text-xs text-primary-400">
                                    💡 Tip: You can copy rewritten bullets from the Job Match page and paste them here to build your final version.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            📄 Live PDF Preview
                        </h3>
                        <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-transform hover:scale-[1.01]">
                            {/* The actual element captured for PDF */}
                            <div
                                ref={resumeRef}
                                className="w-full aspect-[1/1.41] bg-white p-12 text-slate-900 overflow-y-auto"
                                style={{ fontSize: '12px' }}
                            >
                                <div className="max-w-2xl mx-auto whitespace-pre-wrap font-serif">
                                    {finalText || "Your resume content will appear here..."}
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-xs text-slate-500">
                            A4 Standard Format • 600 DPI High Resolution
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ExportResume;
