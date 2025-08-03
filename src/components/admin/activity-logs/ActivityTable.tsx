import { useState } from "react";
import { format } from "date-fns";
import { Eye, EyeOff, User, Globe, Monitor } from "lucide-react";
import { Badge } from "ui/badge";
import { Button } from "ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "ui/tooltip";
import { ScrollArea } from "ui/scroll-area";
import { ActivityDetection } from "./ActivityDetection";
import { cn } from "lib/utils";
import { useActivityLogsContext } from "contexts/ActivityLogsContext";

const getActionBadgeVariant = (action: string) => {
  switch (action) {
    case 'create':
      return 'bg-create text-create-foreground';
    case 'update':
      return 'bg-update text-update-foreground';
    case 'delete':
      return 'bg-delete text-delete-foreground';
    case 'login':
      return 'bg-login text-login-foreground';
    case 'logout':
      return 'bg-logout text-logout-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-success text-success-foreground';
    case 'failed':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-warning text-warning-foreground';
  }
};

const truncateText = (text: string, maxLength: number = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const EntityIdDisplay = ({ entityId }: { entityId: string | null }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!entityId || entityId === 'N/A') {
    return <span className="text-luxury-black font-mono">N/A</span>;
  }

  const lastFourChars = entityId.slice(-4);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRevealed(!isRevealed);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-luxury-black font-mono">
        {isRevealed ? entityId : `...${lastFourChars}`}
      </span>
      <button
        onClick={handleToggle}
        className="h-7 w-7 p-1 text-[#6e6e6e] hover:text-luxury-black hover:bg-gray-100 rounded flex items-center justify-center transition-colors"
        type="button"
        title={isRevealed ? "Hide entity ID" : "Show full entity ID"}
      >
        {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
};

export const ActivityTable = () => {
  const { filteredActivities, activityData } = useActivityLogsContext();
  const activities = filteredActivities;
  const allActivities = activityData.allActivities;

  return (
    <Card className="bg-admin-card border-admin-muted">
      <CardHeader>
        <CardTitle className="text-luxury-black flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Activity Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow className="border-admin-muted hover:bg-admin-muted/50">
                <TableHead className="text-luxury-black font-semibold">Date</TableHead>
                <TableHead className="text-luxury-black font-semibold">Admin</TableHead>
                <TableHead className="text-luxury-black font-semibold">Action</TableHead>
                <TableHead className="text-luxury-black font-semibold">Entity Type</TableHead>
                <TableHead className="text-luxury-black font-semibold">Table</TableHead>
                <TableHead className="text-luxury-black font-semibold">Status</TableHead>
                <TableHead className="text-luxury-black font-semibold">Request Path</TableHead>
                <TableHead className="text-luxury-black font-semibold">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-admin-muted-foreground py-8">
                    {activityData.allActivities.length === 0
                      ? "Loading activity data..."
                      : "No activities match your current filters"}
                  </TableCell>
                </TableRow>
              ) : (
                activities.map(activity => (
                  <TableRow
                    key={activity.id}
                    className="border-admin-muted hover:bg-admin-muted/30 transition-colors"
                  >
                  <TableCell className="text-luxury-black font-mono text-sm">
                    {format(new Date(activity.created_at), 'MMM dd hh:mm a')}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-[#6e6e6e]" />
                              <span className="text-luxury-black font-medium">
                                {activity.admin_username}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-admin-card border-admin-muted">
                            <div className="space-y-1 text-xs">
                              <p className="text-luxury-black">Admin ID: {activity.admin_id}</p>
                              {activity.ip_address && (
                                <div className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  <span>IP: {activity.ip_address}</span>
                                </div>
                              )}
                              {activity.user_agent && (
                                <div className="flex items-center gap-1">
                                  <Monitor className="h-3 w-3" />
                                  <span>UA: {truncateText(activity.user_agent, 30)}</span>
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <ActivityDetection activity={activity} allActivities={allActivities} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs font-medium hover:bg-", getActionBadgeVariant(activity.action))}>
                      {activity.action.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-luxury-black capitalize">
                    {activity.entity_type}
                  </TableCell>
                  <TableCell className="text-[#6e6e6e] text-sm font-mono">
                    {activity.table_name || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs font-medium hover:bg-", getStatusBadgeVariant(activity.status))}>
                      {activity.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#6e6e6e] text-sm font-mono">
                    {activity.request_path ? truncateText(activity.request_path, 30) : '-'}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#6e6e6e] hover:text-luxury-black"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] bg-admin-card border-admin-muted flex flex-col bg-[#fefefe]">
                        <DialogHeader className="flex-shrink-0">
                          <DialogTitle className="text-luxury-black">
                            Activity Details
                          </DialogTitle>
                          <DialogDescription className="text-[#6e6e6e]">
                            Full details for activity {activity.id}
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="flex-1 pr-2">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-luxury-black">Basic Info</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-[#6e6e6e]">Timestamp:</span>
                                    <span className="text-luxury-black font-mono">
                                      {format(new Date(activity.created_at), 'dd MMM yyyy hh:mm a')}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-[#6e6e6e]">Admin:</span>
                                    <span className="text-luxury-black">{activity.admin_username}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-[#6e6e6e]">Entity ID:</span>
                                    <EntityIdDisplay entityId={activity.entity_id} />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-luxury-black">Technical Info</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-[#6e6e6e]">IP Address:</span>
                                    <span className="text-luxury-black font-mono">
                                      {activity.ip_address || 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-[#6e6e6e]">Request Path:</span>
                                    <span className="text-luxury-black font-mono text-xs">
                                      {activity.request_path || 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-luxury-black">Message</h4>
                              <p className="bg-[#e8e8e8] text-sm text-[#6e6e6e] bg-admin-muted/30 p-3 rounded-md">
                                {activity.message}
                              </p>
                            </div>

                            {activity.metadata && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-luxury-black">Metadata</h4>
                                <ScrollArea className="h-auto bg-[#e8e8e8] rounded-md">
                                  <pre className="text-xs text-[#6e6e6e] bg-admin-muted/30 p-3 rounded-md overflow-x-auto">
                                    {JSON.stringify(activity.metadata, null, 2)}
                                  </pre>
                                </ScrollArea>
                              </div>
                            )}

                            {activity.error && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-luxury-black">Error</h4>
                                <ScrollArea className="h-auto bg-[#e8e8e8] rounded-md">
                                  <pre className="text-xs text-[#6e6e6e] bg-admin-muted/30 p-3 rounded-md overflow-x-auto">
                                    {JSON.stringify(activity.error, null, 2)}
                                  </pre>
                                </ScrollArea>
                              </div>
                            )}

                            {activity.user_agent && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-luxury-black">User Agent</h4>
                                <p className="bg-[#e8e8e8] text-xs text-[#6e6e6e] bg-admin-muted/30 p-3 rounded-md break-all">
                                  {activity.user_agent}
                                </p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
