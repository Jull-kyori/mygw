import { NextResponse } from 'next/server';
import { getProjectDetails } from '@/lib/github';

export async function GET(_request: Request, context: { params: { repo: string } }) {
  return NextResponse.json(await getProjectDetails(context.params.repo));
}
