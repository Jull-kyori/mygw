import { NextResponse } from 'next/server';
import { getProjectDetails } from '@/lib/github';

export const revalidate = 3600;

export async function GET(_request: Request, context: { params: { name: string } }) {
  const result = await getProjectDetails(context.params.name);
  return NextResponse.json(result, { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' } });
}
