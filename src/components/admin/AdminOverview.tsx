import { Card } from 'ui/card';

const AdminOverview = ({ username }: { username: string | null }) => {
  return (
    <Card className="p-8 bg-profile-card border-profile-border shadow-card">
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, {username || 'Admin'}!</h1>
          <p className="text-muted-foreground text-lg">Here you can manage your store.</p>
        </div>
      </div>
    </Card>
  );
};

export default AdminOverview;
