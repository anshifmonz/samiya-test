'use client';

import { Button } from 'ui/button';
import { Shield, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui/card';
import { useSecurityContext } from 'contexts/user/SecurityContext';

const SessionManagement = () => {
  const {
    sessionInfo,
    handleViewSessions,
    handleLogoutAll
  } = useSecurityContext();

  return (
    <Card className="bg-profile-card border-profile-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Session Management
        </CardTitle>
        <CardDescription>Manage your active sessions and devices</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <h4 className="font-medium">Active Sessions</h4>
            <p className="text-sm text-muted-foreground">
              You're currently logged in on {sessionInfo.activeSessions} devices
            </p>
          </div>
          <Button variant="outline" onClick={handleViewSessions}>
            View All Sessions
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <h4 className="font-medium">Logout from All Devices</h4>
            <p className="text-sm text-muted-foreground">Sign out from all devices except this one</p>
          </div>
          <Button
            variant="outline"
            className="text-destructive"
            onClick={handleLogoutAll}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionManagement;
