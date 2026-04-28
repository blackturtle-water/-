/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import InputForm from './components/InputForm';
import ReportPreview from './components/ReportPreview';
import { RiskAssessmentInput, RiskAssessmentReport } from './types';
import { generateRiskAssessment } from './services/safetyService';
import { ShieldAlert, Info, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [report, setReport] = useState<RiskAssessmentReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (input: RiskAssessmentInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateRiskAssessment(input);
      setReport(result);
    } catch (err) {
      console.error(err);
      setError('초안 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const referenceLaws = [
    { name: '산업안전보건법', id: 'Act', url: 'https://www.law.go.kr/법령/산업안전보건법' },
    { name: '산업안전보건법 시행령', id: 'Decree', url: 'https://www.law.go.kr/법령/산업안전보건법시행령' },
    { name: '산업안전보건법 시행규칙', id: 'Rule', url: 'https://www.law.go.kr/법령/산업안전보건법시행규칙' },
    { name: '산업안전보건기준에 관한 규칙', id: 'SafetyRule', url: 'https://www.law.go.kr/법령/산업안전보건기준에관한규칙' },
    { name: '운반하역 표준안전 작업지침', id: 'Transport', url: 'https://www.law.go.kr/행정규칙/운반하역표준안전작업지침' },
    { name: '철골공사 표준안전 작업지침', id: 'Steel', url: 'https://www.law.go.kr/행정규칙/철골공사표준안전작업지침' },
    { name: '추락재해방지 표준안전 작업지침', id: 'Fall', url: 'https://www.law.go.kr/행정규칙/추락재해방지표준안전작업지침' },
    { name: '콘크리트공사 표준안전 작업지침', id: 'Concrete', url: 'https://www.law.go.kr/행정규칙/콘크리트공사표준안전작업지침' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-unid-navy p-1.5 rounded-lg">
              <ShieldAlert className="text-unid-green w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-unid-navy tracking-tight leading-tight">UNID SAFE</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] -mt-0.5">Industrial Safety Support</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-6 text-sm font-semibold text-slate-500">
              <span className="text-unid-navy border-b-2 border-unid-navy pb-1">위험성평가 생성</span>
              <a href="#laws" className="hover:text-unid-navy transition-colors">관련 법령</a>
            </nav>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
              <div className="w-2 h-2 bg-unid-green rounded-full animate-pulse"></div>
              SYSTEM ACTIVE
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Intro & Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="mb-2">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-3">
                실시간 <span className="text-unid-green">위험성 평가</span> 초안 생성
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                작업 정보를 입력하시면 국가법령정보센터의 최신 데이터를 참고하여 위험성 평가 초안을 생성합니다.
              </p>
            </div>

            <InputForm onSubmit={handleGenerate} isLoading={isLoading} />

            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 flex gap-3">
              <Info className="text-unid-navy w-5 h-5 shrink-0" />
              <p className="text-xs text-slate-600 leading-normal">
                본 시스템은 <strong>산업안전보건법</strong> 및 <strong>표준안전작업지침</strong> 등을 참고하여 답변을 생성하나, 실제와 다를 수 있으므로 참고용으로만 사용하시기 바랍니다.
              </p>
            </div>

            {/* Reference Laws Box */}
            <div id="laws" className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-unid-navy mb-4 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> 참고 법령 정보 (국가법령정보센터)
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {referenceLaws.map((law, idx) => (
                  <a 
                    key={idx}
                    href={law.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex justify-between items-center p-2 rounded hover:bg-slate-50 text-[11px] text-slate-600 border border-transparent hover:border-slate-200 transition-all"
                  >
                    <span className="font-medium">{law.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-30" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-6 text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={report ? 'report' : 'empty'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ReportPreview report={report} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-unid-navy text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8 opacity-90">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/10 p-1 rounded">
                <ShieldAlert className="text-unid-green w-5 h-5" />
              </div>
              <h4 className="text-lg font-black tracking-tight">UNID SAFE</h4>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              본 시스템은 협력업체의 작업 현장 안전을 지원하기 위해 제공되는 참고용 도구입니다. 
              최종 위험성 평가는 반드시 현장 상황을 반영하여 확정하시기 바랍니다.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-slate-200">Legal Reference</h5>
            <ul className="text-sm text-slate-400 space-y-2">
              <li><a href="https://www.law.go.kr" target="_blank" rel="noreferrer" className="hover:text-unid-green">국가법령정보센터</a></li>
              <li><a href="https://www.kosha.or.kr" target="_blank" rel="noreferrer" className="hover:text-unid-green">안전보건공단</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-slate-200">Note</h5>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              모든 안전 조치의 최종 책임은 해당 현장의 안전관리자 및 사업주에게 있습니다. 
              본 시스템에서 제공하는 정보의 정확성이나 최신성을 보증하지 않습니다.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center text-xs text-slate-500">
          © UNID Corp. Safety & Environment Team.
        </div>
      </footer>
    </div>
  );
}
