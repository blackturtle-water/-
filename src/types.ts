/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RiskAssessmentInput {
  taskName: string;
  location: string;
  equipment: string;
  materials: string;
  taskType: string;
}

export interface JobStep {
  step: string;
  riskFactors: string[];
  measures: string[];
}

export interface RiskAssessmentReport {
  department: string;
  taskName: string;
  steps: JobStep[];
}

export const UNID_COLORS = {
  NAVY: '#011D44',
  GREEN: '#84C340',
  LIGHT_GRAY: '#F5F7F9',
  DARK_GRAY: '#333333',
};
