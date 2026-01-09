import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateAIOutputs } from '@/lib/llm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, review } = body;

    // ---------- Validation ----------
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const safeReview =
      typeof review === 'string' && review.trim().length > 0
        ? review.slice(0, 1000)
        : null;

    // ---------- AI Generation ----------
    let aiResponse: string;
    let aiSummary: string;
    let aiRecommendedAction: string;

    try {
      const ai = await generateAIOutputs(rating, safeReview);
      aiResponse = ai.user_response;
      aiSummary = ai.summary;
      aiRecommendedAction = ai.recommended_action;
    } catch (error) {
      console.error('LLM error:', error);
      aiResponse =
        'Thank you for your feedback! Our team will review it shortly.';
      aiSummary = 'AI unavailable.';
      aiRecommendedAction = 'Manual review required.';
    }

    // ---------- Database Insert ----------
    const { error } = await supabase.from('feedback').insert({
      rating,
      review: safeReview,
      ai_response: aiResponse,
      ai_summary: aiSummary,
      ai_recommended_action: aiRecommendedAction,
    });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Database insert failed' },
        { status: 500 }
      );
    }

    // ---------- Success Response ----------
    return NextResponse.json({
      status: 'success',
      ai_response: aiResponse,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Invalid request or server error' },
      { status: 500 }
    );
  }
}
