import Groq from 'groq-sdk';
import { MirrorInsight } from '@seva/contracts';

export class GroqAIService {
  private groq: Groq | null = null;
  private model: string;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey && apiKey !== 'gsk_your_groq_api_key_here') {
      this.groq = new Groq({ apiKey });
    }
    this.model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  }

  /**
   * Structure plain text community need into JSON format
   */
  async structureNeed(rawText: string) {
    if (!this.groq) {
      return this.fallbackNeedStructuring(rawText);
    }

    try {
      const prompt = `
You are an assistant for a dignity-first community Seva platform.
Convert the following plain words need into a structured JSON object.

Need: "${rawText}"

Return JSON matching this exact structure:
{
  "title": "Clear 3-6 word title",
  "requiredContributions": [
    { "label": "skill needed", "count": 1 }
  ],
  "sessions": 2,
  "potentialLearning": ["What participants can learn from community"],
  "empowermentSuggestion": "How this will build community capability so they become self-reliant."
}
Return ONLY valid JSON.
`;

      const response = await this.groq.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      const text = response.choices[0]?.message?.content || '{}';
      return JSON.parse(text);
    } catch (error) {
      console.warn('Groq AI Need structuring failed or unconfigured, using fallback:', error);
      return this.fallbackNeedStructuring(rawText);
    }
  }

  /**
   * AI Mirror: Analyze private reflections to mirror user patterns without scoring/judging.
   */
  async generateMirrorInsight(reflections: Array<{ id: string; text: string; occurredOn: string }>): Promise<MirrorInsight> {
    if (!this.groq || reflections.length === 0) {
      return this.fallbackMirrorInsight(reflections);
    }

    try {
      const systemPrompt = `
You are a mirror, not a judge. You will receive a person's private reflections.
Task: notice patterns in what THEY wrote (themes repeated, changes in tone, things they learned from the people they set out to serve).
Rules:
- NEVER rate, score, rank, compare to others, praise or criticize character.
- NEVER say they are good, humble, kind, hero, top volunteer, etc.
- Use "You mentioned..." and quote short excerpts.
- Offer at most 2 observations, each as something they can recognize or disagree with.
- End with one open question.

Return JSON format:
{
  "observations": [
    {
      "text": "Observation text quoting their words...",
      "evidence": [{"reflectionId": "id", "excerpt": "quoted short phrase"}]
    }
  ],
  "question": "Open reflective question?"
}
`;

      const response = await this.groq.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(reflections) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const text = response.choices[0]?.message?.content || '{}';
      const parsed: MirrorInsight = JSON.parse(text);

      // Enforce post-generation dignity guardrail check
      if (this.passesDignityGuardrail(JSON.stringify(parsed))) {
        return parsed;
      } else {
        console.warn('Groq AI output violated dignity guardrail. Retrying fallback.');
        return this.fallbackMirrorInsight(reflections);
      }
    } catch (error) {
      console.warn('Groq AI Mirror failed, using fallback:', error);
      return this.fallbackMirrorInsight(reflections);
    }
  }

  private passesDignityGuardrail(text: string): boolean {
    const bannedWords = [
      'best', 'top', 'rank', 'score', 'hero', 'beneficiary',
      'needy', 'rating', 'points', 'saved', 'praise', 'superior'
    ];
    const lower = text.toLowerCase();
    return !bannedWords.some(word => lower.includes(word));
  }

  private fallbackNeedStructuring(rawText: string) {
    return {
      title: 'Community Need Request',
      requiredContributions: [
        { label: 'General Assistance & Support', count: 1 }
      ],
      sessions: 2,
      potentialLearning: ['Local community insights', 'Collaborative teamwork'],
      empowermentSuggestion: 'Ensure community members participate in session handover for self-reliance.'
    };
  }

  private fallbackMirrorInsight(reflections: Array<{ id: string; text: string }>): MirrorInsight {
    const firstText = reflections[0]?.text || 'your contributions';
    const excerpt = firstText.slice(0, 30);

    return {
      observations: [
        {
          text: `You mentioned focus on "${excerpt}..." in your recent reflection. Most of what you recorded highlighted what you learned from others during Seva.`,
          evidence: [
            { reflectionId: reflections[0]?.id || 'ref-1', excerpt }
          ]
        }
      ],
      question: 'Does this observation match how your Seva felt in practice?'
    };
  }
}
