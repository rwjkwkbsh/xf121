
import { GoogleGenAI, Type } from "@google/genai";
import { DesignScheme } from "../types";

const SYSTEM_INSTRUCTION = `你是“3D幻境”的专属 AI 设计助理。
目标：将客户需求转化为【可直接 3D 打印】的模型设计方案。

核心限制：
1. 所有模型必须适合 FDM 打印。
2. 喷嘴 0.4mm，层高 0.2mm。
3. 尽量减少支撑，优化悬垂角度（建议不超过45度）。
4. 输出必须结构清晰。

请务必按照以下 JSON 结构输出：
{
  "style": "模型风格描述",
  "dimensions": "建议尺寸",
  "friendlyDesign": "打印友好设计说明（如何减少支撑、优化底座等）",
  "modelingKeys": "建模关键点（倒角、壁厚、容差等具体参数）",
  "printParams": "打印参数建议（温度、填充、速度等）",
  "failureRisks": "失败风险提示"
}`;

export async function generateDesignScheme(prompt: string): Promise<DesignScheme> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `客户需求：${prompt}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            style: { type: Type.STRING },
            dimensions: { type: Type.STRING },
            friendlyDesign: { type: Type.STRING },
            modelingKeys: { type: Type.STRING },
            printParams: { type: Type.STRING },
            failureRisks: { type: Type.STRING }
          },
          required: ["style", "dimensions", "friendlyDesign", "modelingKeys", "printParams", "failureRisks"]
        }
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as DesignScheme;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("生成方案失败，请检查网络或重试。");
  }
}
