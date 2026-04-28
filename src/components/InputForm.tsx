/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RiskAssessmentInput } from '../types';
import { Shield, Hammer, Beaker, MapPin, ClipboardList } from 'lucide-react';

interface Props {
  onSubmit: (input: RiskAssessmentInput) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: Props) {
  const [formData, setFormData] = useState<RiskAssessmentInput>({
    taskName: '',
    location: '',
    equipment: '',
    materials: '',
    taskType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="text-unid-navy w-5 h-5" />
        <h2 className="text-lg font-bold text-unid-navy">작업 정보 입력</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            작업명
          </label>
          <div className="relative">
            <ClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              name="taskName"
              required
              placeholder="예: 공장동 배관 용접 작업"
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-unid-green/30 focus:border-unid-green transition-all"
              value={formData.taskName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            작업장소
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              name="location"
              required
              placeholder="예: C동 2층 기계실"
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-unid-green/30 focus:border-unid-green transition-all"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              사용장비
            </label>
            <div className="relative">
              <Hammer className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                name="equipment"
                placeholder="예: 아크 용접기, 그라인더"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-unid-green/30 focus:border-unid-green transition-all"
                value={formData.equipment}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              사용물질
            </label>
            <div className="relative">
              <Beaker className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                name="materials"
                placeholder="예: 용접봉, 아르곤 가스"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-unid-green/30 focus:border-unid-green transition-all"
                value={formData.materials}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            작업유형
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              name="taskType"
              placeholder="예: 화기작업, 고소작업"
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-unid-green/30 focus:border-unid-green transition-all"
              value={formData.taskType}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-unid-navy hover:bg-unid-navy/90 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            초안 생성 중...
          </>
        ) : (
          <>
            <Shield className="w-5 h-5" />
            위험성 평가 초안 생성
          </>
        )}
      </button>
    </form>
  );
}
