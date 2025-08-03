import { Card, CardContent, CardHeader, CardTitle } from "ui/card";
import { Shield, MapPin, Clock, AlertTriangle } from "lucide-react";
import { IpAnalysisCardsData } from "../types";

interface IpAnalysisCardsProps {
  data: IpAnalysisCardsData;
}

export const IpAnalysisCards = ({ data }: IpAnalysisCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Attempts
          </CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-luxury-black">{data.totalActions}</div>
          <p className="text-xs text-muted-foreground">
            +12% from last period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Unique IPs
          </CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-luxury-black">{data.totalIPs}</div>
          <p className="text-xs text-muted-foreground">
            Unique IP addresses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            High Risk IPs
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-luxury-black">{data.highRiskIPs}</div>
          <p className="text-xs text-muted-foreground">
            Critical & High severity
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Failed Actions
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {data.failedActions}
          </div>
          <p className="text-xs text-muted-foreground">
            Security incidents
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
