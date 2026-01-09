import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select(
        'id, rating, review, ai_summary, ai_recommended_action, created_at'
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
