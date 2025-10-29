import type { Metadata } from 'next';
import ActivityLogs from 'components/admin/activity-logs/ActivityLogs';

export const metadata: Metadata = {
  title: 'Activity Logs - Admin',
  description: 'View and manage all system activity logs.',
  openGraph: {
    title: 'Activity Logs - Admin',
    description: 'View and manage all system activity logs.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Activity Logs - Admin',
    description: 'View and manage all system activity logs.',
    images: ['/opengraph-image.png']
  }
};

const Page = () => {
  return <ActivityLogs />;
};

export default Page;
