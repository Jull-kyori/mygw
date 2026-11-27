import { getGitHubData } from '@/lib/github';
import Portfolio from '@/components/Portfolio';

export const revalidate = 3600;
export default async function Home() {
  const data = await getGitHubData();
  return <Portfolio {...data} />;
}
