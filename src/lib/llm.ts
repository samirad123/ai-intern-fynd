import OpenAI from 'openai';

console.log('OPENAI KEY EXISTS:', !!process.env.OPENAI_API_KEY);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateAIOutputs(
  rating: number,
  review: string | null
) {
  const reviewText = review ?? 'No written review provided';

  const prompt = `
You are an AI system helping analyze customer feedback.

Rating: ${rating}
Review: ${reviewText}

Return JSON with:
1. user_response (friendly, under 80 words)
2. summary (1 sentence)
3. recommended_action (1 concrete action)
`;

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
  });

  const content = response.choices[0].message.content;

  try {
    return JSON.parse(content || '');
  } catch {
    return {
      user_response:
        'Thank you for your feedback! Our team will review it shortly.',
      summary: 'Could not generate summary.',
      recommended_action: 'Manual review required.',
    };
  }
}
