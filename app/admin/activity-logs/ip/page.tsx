import { generateBaseMetadata } from 'lib/utils/generateMetadata';
import IpAnalysis from 'components/admin/activity-logs/ip/IpAnalysis';

export const metadata = generateBaseMetadata({
  title: 'IP Activity Analysis',
  description: 'Analyze IP activity logs for security and monitoring purposes.',
  noIndex: true
});

export default function IpAnalysisPage() {
  return <IpAnalysis />;
}
