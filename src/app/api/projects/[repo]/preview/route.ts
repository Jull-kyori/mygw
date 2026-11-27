import { NextResponse } from 'next/server';
import { getProjectCodePreview } from '@/lib/github';

export const revalidate = 3600;

export async function GET(_request: Request, context: { params: { repo: string } }) {
  const preview = await getProjectCodePreview(context.params.repo);
  return NextResponse.json(preview, {
    headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' },
  });
}
