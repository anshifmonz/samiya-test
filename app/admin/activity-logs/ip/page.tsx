import type { Metadata } from 'next';
import IpAnalysis from 'components/admin/activity-logs/ip/IpAnalysis';

export const metadata: Metadata = {
  title: 'IP Activity Analysis - Admin',
  description: 'Analyze IP activity logs for security and monitoring purposes.',
  openGraph: {
    title: 'IP Activity Analysis - Admin',
    description: 'Analyze IP activity logs for security and monitoring purposes.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'IP Activity Analysis - Admin',
    description: 'Analyze IP activity logs for security and monitoring purposes.',
    images: ['/opengraph-image.png']
  }
};

export default function IpAnalysisPage() {
  return <IpAnalysis />;
}
