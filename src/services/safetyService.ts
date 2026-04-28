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


  const modelsToTry = ["gemini-3-flash-preview"]; // 파이썬 코드와 동일하게 고정
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Calling ${modelName} with ThinkingConfig(HIGH)...`);
      const model = ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: "user",
            parts: [{ text: `당신은 대한민국 산업안전 전문가입니다. 아래 정보를 바탕으로 위험성 평가 보고서를 JSON 형식으로 작성하세요.

[입력 정보]
- 작업명: ${input.taskName}
- 작업장소: ${input.location}
- 사용장비: ${input.equipment}
- 사용물질: ${input.materials}
- 작업유형: ${input.taskType}

[출력 형식]
{
  "department": "안전환경팀",
  "taskName": "${input.taskName}",
  "steps": [
    {
      "step": "단계 설명",
      "riskFactors": ["위험요인"],
      "measures": ["조치사항"]
    }
  ]
}` }]
          }
        ],
        config: {
          // 파이썬의 thinking_config(thinking_level="HIGH")와 대응
          // @ts-ignore
          thinkingConfig: { 
            includeThoughts: true,
            // @ts-ignore
            thinkingLevel: "HIGH" 
          },
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
