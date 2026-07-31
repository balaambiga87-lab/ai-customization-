import { StructuredDesign } from '../types/interpreter.types';

export class ResponseCleanerParser {
  /**
   * Cleans output text from LLMs, extracts JSON block, and parses it.
   */
  static cleanAndParse(text: string): StructuredDesign {
    let cleanText = text.trim();

    // 1. Remove markdown wrapping codes
    if (cleanText.startsWith('```')) {
      const lines = cleanText.split('\n');
      if (lines[0].startsWith('```')) {
        lines.shift();
      }
      if (lines[lines.length - 1].startsWith('```')) {
        lines.pop();
      }
      cleanText = lines.join('\n').trim();
    }

    // 2. Extract JSON block boundaries
    const startIndex = cleanText.indexOf('{');
    const endIndex = cleanText.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      cleanText = cleanText.substring(startIndex, endIndex + 1);
    }

    try {
      return JSON.parse(cleanText) as StructuredDesign;
    } catch (error) {
      throw new Error(`Failed to parse AI response into structured JSON. Source: ${text}`);
    }
  }
}
