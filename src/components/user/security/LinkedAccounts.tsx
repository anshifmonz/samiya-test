'use client';

import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { Link2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui/card';
import { useSecurityContext } from 'contexts/user/SecurityContext';

const LinkedAccounts = () => {
  const {
    linkedAccounts,
    handleConnectAccount,
    handleDisconnectAccount
  } = useSecurityContext();

  return (
    <Card className="bg-profile-card border-profile-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-primary" />
          Linked Accounts
        </CardTitle>
        <CardDescription>Connect social accounts for easy login</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {linkedAccounts.map(account => (
          <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 ${account.color} rounded-full flex items-center justify-center`}
              >
                <span className="text-white text-sm font-medium">{account.icon}</span>
              </div>
              <div>
                <h4 className="font-medium">{account.provider}</h4>
                <p className="text-sm text-muted-foreground">
                  {account.isConnected ? account.email : 'Not connected'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {account.isConnected ? (
                <>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnectAccount(account.id)}
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConnectAccount(account.id)}
                >
                  Connect
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LinkedAccounts;
