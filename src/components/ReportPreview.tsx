/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RiskAssessmentReport } from '../types';
import { Download, Copy, Check, FileText, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface Props {
  report: RiskAssessmentReport | null;
}

export default function ReportPreview({ report }: Props) {
  const [copied, setCopied] = useState(false);

  if (!report) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-slate-400">
        <FileText className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-center font-medium">
          작업 정보를 입력하고<br />위험성 평가 초안을 생성하세요.
        </p>
      </div>
    );
  }

  const handleCopy = (mode: 'standard' | 'excel') => {
    let fullText = "";
    
    if (mode === 'standard') {
      const tableHeader = "| 작업단계 | 위험요인 | 조치사항 |\n|---|---|---|\n";
      const tableBody = report.steps.map((s, i) => 
        `| ${i + 1}. ${s.step} | ${s.riskFactors.join(', ')} | ${s.measures.join(', ')} |`
      ).join('\n');
      
      const warning = "\n\n(주의) 본 내용은 AI가 생성한 위험성 평가 초안입니다. 실제 작업 환경의 특수성이 반영되지 않았을 수 있으므로, 반드시 현장 안전관리자가 내용을 검토 및 수정하여 최종 확정 후 사용하시기 바랍니다.";
      
      fullText = `[위험성 평가 초안]\n부서: ${report.department}\n작업명: ${report.taskName}\n\n${tableHeader}${tableBody}${warning}`;
    } else {
      // Excel-friendly TSV format
      const header = "작업단계\t위험요인\t조치사항\n";
      const body = report.steps.map((s, i) => 
        `${i + 1}. ${s.step}\t${s.riskFactors.join(', ')}\t${s.measures.join(', ')}`
      ).join('\n');
      const footer = `\n\n비고\t(주의) 본 내용은 AI가 생성한 위험성 평가 초안입니다. 실제 작업 환경의 특수성이 반영되지 않았을 수 있으므로, 반드시 현장 안전관리자가 내용을 검토 및 수정하여 최종 확정 후 사용하시기 바랍니다.`;
      
      fullText = `부서\t${report.department}\n작업명\t${report.taskName}\n\n${header}${body}${footer}`;
    }
    
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden ring-1 ring-slate-200">
      {/* Header */}
      <div className="unid-gradient p-6 text-white flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Draft</span>
            <h3 className="text-xl font-black tracking-tight">{report.taskName}</h3>
          </div>
          <p className="text-unid-blue/80 text-sm font-medium">{report.department}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleCopy('standard')}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold"
            title="텍스트로 복사"
          >
            {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
            기본 복사
          </button>
          <button 
            onClick={() => handleCopy('excel')}
            className="bg-unid-green/20 hover:bg-unid-green/30 text-white p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold"
            title="엑셀용 데이터 복사"
          >
            <Download className="w-4 h-4" />
            엑셀용 추출
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full report-table border-collapse">
            <thead>
              <tr>
                <th className="w-1/4">작업단계 (Job Steps)</th>
                <th className="w-1/4 text-red-600">위험요인 (Hazards)</th>
                <th className="w-2/4 text-emerald-700">조치사항 (Control Measures)</th>
              </tr>
            </thead>
            <tbody>
              {report.steps.map((step, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="font-bold text-slate-700">{idx + 1}. {step.step}</td>
                  <td>
                    <ul className="list-disc list-inside space-y-1">
                      {step.riskFactors.map((rf, ridx) => (
                        <li key={ridx} className="text-slate-600">{rf}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <ul className="list-disc list-inside space-y-1">
                      {step.measures.map((m, midx) => (
                        <li key={midx} className="text-slate-700 leading-relaxed">{m}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Warning Section */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-4">
          <AlertTriangle className="text-amber-500 w-6 h-6 shrink-0" />
          <div>
            <h4 className="text-amber-800 font-bold text-sm mb-1">AI 생성 초안 안내 및 주의사항</h4>
            <p className="text-amber-700 text-xs leading-relaxed">
              본 내용은 AI가 생성한 위험성 평가 초안입니다. 실제 작업 환경의 특수성이 반영되지 않았을 수 있으므로, 
              <strong> 반드시 현장 안전관리자가 내용을 검토 및 수정하여 최종 확정 후 사용하시기 바랍니다.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-medium">
        <span>© UNID Safety Experts System</span>
        <span>Generated per Industrial Safety & Health Act of Korea</span>
      </div>
    </div>
  );
}
