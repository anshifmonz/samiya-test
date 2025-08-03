import { ActivityStatsData } from "lib/admin/activity-stats/getActivityStats";
import { IpIntelligenceData } from "lib/services/ipIntelligence";

export interface IpGeoData {
  country?: string;
  city?: string;
  region?: string;
  asn?: string;
  org?: string;
  timezone?: string;
}

export interface IpAnalysisData {
  ip: string;
  totalActions: number;
  failedAttempts: number;
  failureRate: number;
  firstSeen: Date;
  lastSeen: Date;
  activities: ActivityStatsData[];
  geoData: IpGeoData;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'normal';
  intelligence?: IpIntelligenceData;
}

export interface IpFilters {
  dateRange: { from: Date | undefined; to: Date | undefined };
  severity: string;
  minActions: string;
}

export interface IpAnalysisCardsData {
  totalIPs: number;
  highRiskIPs: number;
  totalActions: number;
  failedActions: number;
}

export const defaultIpFilters: IpFilters = {
  dateRange: { from: undefined, to: undefined },
  severity: "all",
  minActions: "0"
};

export interface ActivityTimelineData {
  date: string;
  activities: number;
  failed: number;
}

export interface SeverityDistributionData {
  name: string;
  value: number;
}
