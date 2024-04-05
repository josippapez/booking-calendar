import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();

  if (!data.apartmentId) {
    return NextResponse.json({ status: 400, error: 'apartmentId is required' });
  }

  revalidateTag(`public-calendar-${data.apartmentId}`);

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
