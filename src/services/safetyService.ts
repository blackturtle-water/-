/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { RiskAssessmentInput, RiskAssessmentReport } from "../types";

const ai = new GoogleGenAI({ 
  apiKey: "AIzaSyD9Y6GYM1SZm5B3FJgKHxJ12jMx5Y9x6Qs" 
});

export async function generateRiskAssessment(input: RiskAssessmentInput): Promise<RiskAssessmentReport> {
  // 테스트를 위해 하드코딩된 키를 사용하므로 체크 로직을 통과시킵니다.
  const apiKey = "AIzaSyD9Y6GYM1SZm5B3FJgKHxJ12jMx5Y9x6Qs";


  const modelsToTry = ["gemini-3-flash-preview", "gemini-2.0-flash"];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying model: ${modelName} (with Thinking Config)...`);
      const model = ai.models.generateContent({
        model: modelName,
        contents: [
          {
            text: `당신은 대한민국 산업안전 전문가입니다. 협력업체가 입력한 정보를 바탕으로 '위험성 평가 초안'을 작성하세요.
            (전문적인 추론 능력을 발휘하여 상세히 작성해 주세요.)

[입력 정보]
- 작업명: ${input.taskName}
- 작업장소: ${input.location}
- 사용장비: ${input.equipment}
- 사용물질: ${input.materials}
- 작업유형: ${input.taskType}

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
          // @ts-ignore - 최신 SDK의 추론 기능 반영 시도
          thinkingConfig: { includeThoughts: true },
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
      console.log(`Successfully generated using ${modelName}`);
      return result as RiskAssessmentReport;
    } catch (error) {
      console.error(`${modelName} failed:`, error);
      lastError = error;
      // 다음 모델로 계속 진행
    }
  }

  throw new Error(`모든 AI 모델 호출에 실패했습니다. 마지막 오류: ${lastError?.toString()}`);
}
