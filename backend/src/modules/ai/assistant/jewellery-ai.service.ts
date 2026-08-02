import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';
import { SYSTEM_PROMPT } from './prompts/system-prompt';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

@Injectable()
export class JewelleryAiService {
  private readonly logger = new Logger(JewelleryAiService.name);
  private sessionStore: Map<string, Message[]> = new Map();
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  /**
   * Processes a user chat message dynamically using the AI model and maintaining complete conversation history.
   * Includes automatic retry and model fallback logic for API resiliency.
   */
  async processChat(message: string, sessionId: string = 'default-session'): Promise<{ reply: string; sessionId: string }> {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return {
        reply: 'Please ask any question regarding jewellery or gift recommendations.',
        sessionId,
      };
    }

    // 1. Fetch complete conversation context history for this session
    const history: Message[] = this.sessionStore.get(sessionId) || [];

    let aiReply = '';

    // 2. Dynamic Reasoning Execution using Gemini AI Model with full history context & retries
    if (this.genAI) {
      const candidateModels = Array.from(
        new Set([
          process.env.AI_MODEL_NAME || 'gemini-flash-latest',
          'gemini-flash-latest',
          'gemini-2.0-flash-lite',
          'gemini-2.0-flash',
          'gemini-3.6-flash',
        ])
      );

      for (const modelName of candidateModels) {
        if (aiReply) break;

        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const model = this.genAI.getGenerativeModel({
              model: modelName,
              systemInstruction: SYSTEM_PROMPT,
            });

            // Pass multi-turn history
            const chat: ChatSession = model.startChat({
              history: history,
            });

            const result = await chat.sendMessage(trimmedMessage);
            const responseText = result.response.text();

            if (responseText && responseText.trim().length > 0) {
              aiReply = responseText.trim();
              break;
            }
          } catch (err: any) {
            this.logger.warn(
              `Attempt ${attempt} for model ${modelName} failed: ${err.message}`
            );
            if (attempt < 2) {
              await new Promise((resolve) => setTimeout(resolve, 800));
            }
          }
        }
      }
    }

    // 3. Fallback message if connection issues persist
    if (!aiReply) {
      aiReply = 'I am currently experiencing a temporary connection delay with the AI service. Please try asking your question again in a moment.';
    }

    // 4. Update Conversation History in Memory with both user prompt & model response
    history.push({ role: 'user', parts: [{ text: trimmedMessage }] });
    history.push({ role: 'model', parts: [{ text: aiReply }] });

    // Retain up to 40 turns for deep context memory
    if (history.length > 40) {
      history.splice(0, history.length - 40);
    }

    this.sessionStore.set(sessionId, history);

    return {
      reply: aiReply,
      sessionId,
    };
  }

  /**
   * Resets the conversation session history for a given session ID.
   */
  clearSession(sessionId: string): void {
    this.sessionStore.delete(sessionId);
    this.logger.log(`Cleared conversation history for session: ${sessionId}`);
  }
}
