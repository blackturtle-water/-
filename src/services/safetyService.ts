/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { RiskAssessmentInput, RiskAssessmentReport } from "../types";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyD9Y6GYM1SZm5B3FJgKHxJ12jMx5Y9x6Qs" 
});

export async function generateRiskAssessment(input: RiskAssessmentInput): Promise<RiskAssessmentReport> {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        text: `당신은 대한민국 산업안전 전문가입니다. 협력업체가 입력한 정보를 바탕으로 '위험성 평가 초안'을 작성하세요.

[입력 정보]
- 작업명: ${input.taskName}
- 작업장소: ${input.location}
- 사용장비: ${input.equipment}
- 사용물질: ${input.materials}
- 작업유형: ${input.taskType}

[수행 지침 및 순서]
1. 적용 법령 식별: 입력된 정보를 바탕으로 아래 참고 법령 중 해당 작업에 반드시 적용되어야 하는 법령과 고시를 우선적으로 선별하세요.
   * 참고 법령: 산업안전보건법, 산업안전보건법 시행령, 산업안전보건법 시행규칙, 산업안전보건기준에 관한 규칙, 운반하역 표준안전 작업지침, 철골공사 표준안전 작업지침, 추락재해방지 표준안전 작업지침, 콘크리트공사 표준안전 작업지침
2. 상세 근거 검색: 선별된 법령에서 해당 작업의 위험요인 및 조치사항과 직접적으로 연관된 '구체적 조항(예: 제~조)'을 Google 검색을 통해 정확히 확인하세요.
3. 평가 초안 작성: 확인된 법적 근거를 바탕으로 작업 단계를 3~5단계로 구성하고, 각 단계별 위험요인과 '법적 조치 사항'을 작성하세요.

[주의사항]
- 모든 조치사항은 반드시 구체적인 '법령 근거 조항'을 포함해야 합니다.
- 시스템의 한계로 인해 생성된 내용이 실제 법령의 전문이나 최신 개정 사항과 다를 수 있습니다. 따라서 반드시 참고용으로만 활용하고 현장 안전관리자의 최종 검토를 거쳐야 함을 명심하세요.

[출력 형식]
반드시 다음 JSON 구조로 응답하세요.
{
  "department": "안전환경팀",
  "taskName": "${input.taskName}",
  "steps": [
    {
      "step": "작업 단계 설명",
      "riskFactors": ["위험요인 1", "위험요인 2"],
      "measures": ["조치사항 1 (법령 제~조 근거)", "조치사항 2 (법령 제~조 근거)"]
    }
  ]
}`
      }
    ],
    config: {
      tools: [{ googleSearch: {} }],
      toolConfig: { includeServerSideToolInvocations: true },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          department: { type: Type.STRING },
          taskName: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING },
                riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
                measures: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["step", "riskFactors", "measures"]
            }
          }
        },
        required: ["department", "taskName", "steps"]
      }
    }
  });

  const response = await model;
  const result = JSON.parse(response.text || "{}");
  return result as RiskAssessmentReport;
}
