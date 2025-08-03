import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "ui/table";
import { Badge } from "ui/badge";
import { Button } from "ui/button";
import { Progress } from "ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "ui/card";
import { ScrollArea } from "ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "ui/dialog";
import { MapPin, Eye, Server, Clock, Shield, Globe, Wifi, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { IpAnalysisData } from "../types";
import { cn } from "lib/utils";
import { useState } from "react";

interface IpAnalysisTableProps {
  logs: IpAnalysisData[];
}

export const IpAnalysisTable = ({ logs }: IpAnalysisTableProps) => {
  const [selectedIp, setSelectedIp] = useState<IpAnalysisData | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 50) return 'text-orange-600';
    if (score >= 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-luxury-black">IP Address Details</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-luxury-black">IP Address</TableHead>
                <TableHead className="text-luxury-black">Total Actions</TableHead>
                <TableHead className="text-luxury-black">Failed Attempts</TableHead>
                <TableHead className="text-luxury-black">Failure Rate</TableHead>
                <TableHead className="text-luxury-black">First Seen</TableHead>
                <TableHead className="text-luxury-black">Last Seen</TableHead>
                <TableHead className="text-luxury-black">Location</TableHead>
                <TableHead className="text-luxury-black">ISP</TableHead>
                <TableHead className="text-luxury-black">Severity</TableHead>
                <TableHead className="text-luxury-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((ip) => (
                <TableRow key={ip.ip} className="border-border">
                  <TableCell className="font-mono text-luxury-black">{ip.ip}</TableCell>
                  <TableCell className="text-luxury-black">{ip.totalActions}</TableCell>
                  <TableCell className="text-luxury-black">{ip.failedAttempts}</TableCell>
                  <TableCell className="text-luxury-black">
                    <div className="flex items-center gap-2">
                      <span>{ip.failureRate.toFixed(1)}%</span>
                      <Progress value={ip.failureRate} className="w-16 h-2" />
                    </div>
                  </TableCell>
                  <TableCell className="text-luxury-black">
                    {format(ip.firstSeen, 'MMM d, HH:mm')}
                  </TableCell>
                  <TableCell className="text-luxury-black">
                    {format(ip.lastSeen, 'MMM d, HH:mm')}
                  </TableCell>
                  <TableCell className="text-luxury-black">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="text-sm">
                        {ip.geoData.city}, {ip.geoData.country}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-luxury-black text-sm max-w-32 truncate" title={ip.intelligence?.isp || ip.geoData.org || 'Unknown'}>
                    {ip.intelligence?.isp || ip.geoData.org || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(ip.severity)}>
                      {ip.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedIp(ip)}
                          className="text-luxury-black"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl max-h-[85vh] bg-card border-border">
                        <DialogHeader>
                          <DialogTitle className="text-luxury-black flex items-center gap-2">
                            <Server className="h-5 w-5" />
                            IP Address Intelligence: {selectedIp?.ip}
                          </DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            Comprehensive analysis with geographic and threat intelligence
                          </DialogDescription>
                        </DialogHeader>

                        {selectedIp && (
                          <ScrollArea className="max-h-[65vh]">
                            <div className="space-y-6">
                              {/* Overview Cards */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-muted/20 rounded-lg">
                                  <div className="text-2xl font-bold text-luxury-black">{selectedIp.totalActions}</div>
                                  <div className="text-sm text-muted-foreground">Total Actions</div>
                                </div>
                                <div className="text-center p-4 bg-muted/20 rounded-lg">
                                  <div className="text-2xl font-bold text-luxury-black">{selectedIp.failedAttempts}</div>
                                  <div className="text-sm text-muted-foreground">Failed Attempts</div>
                                </div>
                                <div className="text-center p-4 bg-muted/20 rounded-lg">
                                  <div className="text-2xl font-bold text-luxury-black">{selectedIp.failureRate.toFixed(1)}%</div>
                                  <div className="text-sm text-muted-foreground">Failure Rate</div>
                                </div>
                                <div className="text-center p-4 bg-muted/20 rounded-lg">
                                  <Badge className={getSeverityColor(selectedIp.severity)}>
                                    {selectedIp.severity}
                                  </Badge>
                                  <div className="text-sm text-muted-foreground mt-1">Severity</div>
                                </div>
                              </div>

                              {/* IP Intelligence Section */}
                              {selectedIp.intelligence && (
                                <div>
                                  <h4 className="text-lg font-semibold text-luxury-black mb-3 flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    IP Intelligence & Risk Assessment
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-muted/20 rounded-lg">
                                      <div className="space-y-3">
                                        <div>
                                          <span className="text-sm text-muted-foreground">Risk Score:</span>
                                          <div className="flex items-center gap-2">
                                            <span className={`text-lg font-bold ${getRiskScoreColor(selectedIp.intelligence.riskScore)}`}>
                                              {selectedIp.intelligence.riskScore}/100
                                            </span>
                                            <Progress value={selectedIp.intelligence.riskScore} className="w-24 h-2" />
                                          </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedIp.intelligence.isProxy && (
                                            <Badge variant="destructive" className="text-xs">
                                              <AlertTriangle className="h-3 w-3 mr-1" />
                                              Proxy
                                            </Badge>
                                          )}
                                          {selectedIp.intelligence.isHosting && (
                                            <Badge variant="secondary" className="text-xs">
                                              <Server className="h-3 w-3 mr-1" />
                                              Hosting
                                            </Badge>
                                          )}
                                          {selectedIp.intelligence.isMobile && (
                                            <Badge variant="outline" className="text-xs">
                                              <Wifi className="h-3 w-3 mr-1" />
                                              Mobile
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="p-4 bg-muted/20 rounded-lg">
                                      <div className="space-y-2">
                                        <div>
                                          <span className="text-sm text-muted-foreground">Last Updated:</span>
                                          <p className="text-luxury-black text-sm">
                                            {format(selectedIp.intelligence.lastUpdated, 'MMM d, yyyy HH:mm')}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-muted-foreground">Coordinates:</span>
                                          <p className="text-luxury-black text-sm">
                                            {selectedIp.intelligence.latitude.toFixed(4)}, {selectedIp.intelligence.longitude.toFixed(4)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Enhanced Geographic Information */}
                              <div>
                                <h4 className="text-lg font-semibold text-luxury-black mb-3 flex items-center gap-2">
                                  <Globe className="h-5 w-5" />
                                  Geographic & Network Information
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
                                  <div>
                                    <span className="text-sm text-muted-foreground">Location:</span>
                                    <p className="text-luxury-black">
                                      {selectedIp.geoData.city}, {selectedIp.geoData.region}, {selectedIp.geoData.country}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-muted-foreground">ISP:</span>
                                    <p className="text-luxury-black">
                                      {selectedIp.intelligence?.isp || 'Unknown'}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-muted-foreground">Organization:</span>
                                    <p className="text-luxury-black">
                                      {selectedIp.intelligence?.org || selectedIp.geoData.org || 'Unknown'}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-muted-foreground">ASN:</span>
                                    <p className="text-luxury-black">
                                      {selectedIp.intelligence?.asn || selectedIp.geoData.asn || 'Unknown'}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-muted-foreground">ASN Name:</span>
                                    <p className="text-luxury-black">
                                      {selectedIp.intelligence?.asnName || 'Unknown'}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-muted-foreground">Timezone:</span>
                                    <p className="text-luxury-black">
                                      {selectedIp.intelligence?.timezone || selectedIp.geoData.timezone || 'Unknown'}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Activity Breakdown */}
                              <div>
                                <h4 className="text-lg font-semibold text-luxury-black mb-3">Activity Breakdown</h4>
                                <div className="space-y-2">
                                  {Object.entries(
                                    selectedIp.activities.reduce((acc, activity) => {
                                      acc[activity.action] = (acc[activity.action] || 0) + 1;
                                      return acc;
                                    }, {} as Record<string, number>)
                                  ).map(([action, count]) => (
                                    <div key={action} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                                      <span className="text-luxury-black">{action}</span>
                                      <Badge variant="outline" className="text-luxury-black border-border">
                                        {count}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Recent Activity Timeline */}
                              <div>
                                <h4 className="text-lg font-semibold text-luxury-black mb-3">Recent Activity Timeline</h4>
                                <ScrollArea className="h-[200px]">
                                  <div className="space-y-2">
                                    {selectedIp.activities
                                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                      .slice(0, 20)
                                      .map((activity, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                                          <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-luxury-black">
                                              {format(new Date(activity.created_at), 'MMM d, HH:mm:ss')}
                                            </span>
                                          </div>
                                          <Badge
                                            className={cn(
                                              "text-xs",
                                              activity.status === 'success'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-red-500 text-white'
                                            )}
                                          >
                                            {activity.status}
                                          </Badge>
                                          <span className="text-sm text-luxury-black">{activity.action}</span>
                                          <span className="text-sm text-muted-foreground">{activity.entity_type}</span>
                                        </div>
                                      ))
                                    }
                                  </div>
                                </ScrollArea>
                              </div>
                            </div>
                          </ScrollArea>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
