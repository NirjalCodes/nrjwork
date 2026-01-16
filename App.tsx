
import React, { useState } from 'react';
import { UserProfile, AnalysisState, PlayStyle } from './types';
import { generatePersonalityReport } from './services/geminiService';
import { InputGroup } from './components/InputGroup';
import { ReportView } from './components/ReportView';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    grade: '',
    games: '',
    hobbies: '',
    playStyle: 'Solo',
  });

  const [analysis, setAnalysis] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    report: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfile(prev => ({ ...prev, [id]: value }));
  };

  const handlePlayStyleToggle = (style: PlayStyle) => {
    setProfile(prev => ({ ...prev, playStyle: style }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalysis({ isLoading: true, error: null, report: null });

    try {
      const result = await generatePersonalityReport(profile);
      setAnalysis({ isLoading: false, error: null, report: result });
      setTimeout(() => {
        const reportEl = document.querySelector('.report-container');
        reportEl?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setAnalysis({ isLoading: false, error: err.message || 'An unexpected error occurred.', report: null });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const resetForm = () => {
    setAnalysis({ isLoading: false, error: null, report: null });
    setProfile({
      name: '',
      grade: '',
      games: '',
      hobbies: '',
      playStyle: 'Solo',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasEnteredGames = profile.games.trim().length > 0;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center mb-12 no-print">
        <div className="inline-flex items-center justify-center p-3 mb-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
          <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622l-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 mono">
          Personality<span className="text-indigo-500">.exe</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">
          Digital Identity Analysis Module // Map your preferences to professional potential.
        </p>
      </header>

      {/* Main Content */}
      <main>
        {!analysis.report ? (
          <form onSubmit={handleSubmit} className="space-y-8 no-print animate-in fade-in duration-500">
            {/* Basic Info Section */}
            <div className="bg-[#121316] border border-[#232428] rounded-2xl shadow-xl p-8 space-y-6">
              <h2 className="text-lg font-bold text-slate-200 border-b border-white/5 pb-4 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                Identification
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  label="Name" 
                  id="name" 
                  placeholder="Full name" 
                  value={profile.name} 
                  onChange={handleInputChange} 
                />
                <InputGroup 
                  label="Grade" 
                  id="grade" 
                  placeholder="e.g. Grade 10" 
                  value={profile.grade} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            {/* Gaming Profile Section */}
            <div className="bg-[#121316] border border-[#232428] rounded-2xl shadow-xl p-8 space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -z-10"></div>
               <h2 className="text-lg font-bold text-slate-200 border-b border-white/5 pb-4 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                Gaming Profile
              </h2>
              <InputGroup 
                label="Favorite Games or Genres" 
                id="games" 
                placeholder="What games dominate your screen time?" 
                value={profile.games} 
                onChange={handleInputChange} 
                textarea
              />

              <div className={`transition-all duration-500 ease-in-out origin-top ${hasEnteredGames ? 'opacity-100 max-h-40 scale-100' : 'opacity-0 max-h-0 scale-95 overflow-hidden'}`}>
                <div className="space-y-3 pt-2">
                  <label className="block text-sm font-medium text-slate-400 ml-1">Preferred Play Style</label>
                  <div className="flex p-1.5 bg-[#1a1b1e] rounded-xl border border-[#2d2e32] w-fit">
                    {(['Solo', 'Team'] as PlayStyle[]).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => handlePlayStyleToggle(style)}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          profile.playStyle === style 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lifestyle & Hobbies Section */}
            <div className="bg-[#121316] border border-[#232428] rounded-2xl shadow-xl p-8 space-y-6 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 blur-3xl -z-10"></div>
              <h2 className="text-lg font-bold text-slate-200 border-b border-white/5 pb-4 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                Hobbies & Interests
              </h2>
              <InputGroup 
                label="Main Hobbies" 
                id="hobbies" 
                placeholder="What do you do when you're not gaming?" 
                value={profile.hobbies} 
                onChange={handleInputChange} 
                textarea
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={analysis.isLoading}
                className={`w-full py-4 rounded-xl text-lg font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-3 ${
                  analysis.isLoading 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]'
                }`}
              >
                {analysis.isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Synthesizing Report...
                  </>
                ) : (
                  <>
                    Run AI Analysis
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </>
                )}
              </button>
              {analysis.error && (
                <p className="mt-4 text-center text-red-400 text-sm bg-red-400/10 py-3 rounded-lg border border-red-400/20">
                  {analysis.error}
                </p>
              )}
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <ReportView report={analysis.report} profile={profile} />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center no-print pb-12">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-200 font-semibold transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Report
              </button>
              <button
                onClick={resetForm}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-600/20 rounded-xl text-indigo-400 font-semibold transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                New Analysis
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-12 text-center text-slate-600 text-xs tracking-widest uppercase mono no-print">
        Neural Processing Module v2.5 // Status: Online
      </footer>
    </div>
  );
};

export default App;
