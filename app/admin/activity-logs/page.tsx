import { generateBaseMetadata } from 'lib/utils/generateMetadata';
import ActivityLogs from 'components/admin/activity-logs/ActivityLogs';

export const metadata = generateBaseMetadata({
  title: 'Activity Logs',
  description: 'View and manage all system activity logs.',
  noIndex: true
});

const Page = () => {
  return <ActivityLogs />;
};

export default Page;
