'use client';

import { Button } from 'ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui/card';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DangerZoneProps {
  onDeactivate: () => void;
  onDelete: () => void;
}

const DangerZone = ({ onDeactivate, onDelete }: DangerZoneProps) => {
  return (
    <Card className="border-destructive/20 bg-profile-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>These actions cannot be undone</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <div className="space-y-1">
            <h4 className="font-medium text-destructive">Deactivate Account</h4>
            <p className="text-sm text-muted-foreground">Temporarily deactivate your account</p>
          </div>
          <Button
            variant="outline"
            className="text-destructive border-destructive"
            onClick={onDeactivate}
          >
            Deactivate
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <div className="space-y-1">
            <h4 className="font-medium text-destructive">Delete Account</h4>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
          </div>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DangerZone;
