'use client';

import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { useActivityLogsContext } from 'contexts/admin/activity-logs/ActivityLogsContext';
import {
  IpAnalysisHeader,
  IpAnalysisFilters,
  IpAnalysisCards,
  IpAnalysisTable,
  IpAnalysisCharts,
  IpFilters,
  defaultIpFilters,
  IpGeoData
} from './index';
import { ActivityStatsData } from 'lib/admin/activity-stats/getActivityStats';
import { ipIntelligenceService, IpIntelligenceData } from 'lib/services/ipIntelligence';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from 'ui/alert';

const IpAnalysisContent = () => {
  const { activityData } = useActivityLogsContext();
  const [filters, setFilters] = useState<IpFilters>(defaultIpFilters);
  const [ipIntelligence, setIpIntelligence] = useState<Map<string, IpIntelligenceData>>(new Map());
  const [isLoadingIntelligence, setIsLoadingIntelligence] = useState(false);
  const [intelligenceError, setIntelligenceError] = useState<string | null>(null);

  // Extract unique IPs from activity data
  const uniqueIps = useMemo(() => {
    return Array.from(
      new Set(activityData.allActivities.map(activity => activity.ip_address).filter(Boolean))
    );
  }, [activityData.allActivities]);

  // Fetch IP intelligence data
  useEffect(() => {
    const fetchIpIntelligence = async () => {
      if (uniqueIps.length === 0) return;

      setIsLoadingIntelligence(true);
      setIntelligenceError(null);

      try {
        const intelligenceData = await ipIntelligenceService.getBatchIpData(uniqueIps);
        setIpIntelligence(intelligenceData);
      } catch (error) {
        console.error('Failed to fetch IP intelligence:', error);
        setIntelligenceError('Failed to load IP intelligence data. Using fallback data.');

        // Create fallback data using mock enrichment
        const fallbackData = new Map<string, IpIntelligenceData>();
        uniqueIps.forEach(ip => {
          const mockData = mockGeoEnrichment(ip);
          fallbackData.set(ip, {
            ip,
            country: mockData.country || 'Unknown',
            countryCode: '',
            region: mockData.region || 'Unknown',
            city: mockData.city || 'Unknown',
            timezone: mockData.timezone || 'Unknown',
            isp: 'Unknown',
            org: mockData.org || 'Unknown',
            asn: mockData.asn || 'Unknown',
            asnName: 'Unknown',
            latitude: 0,
            longitude: 0,
            isProxy: false,
            isHosting: false,
            isMobile: false,
            riskScore: 0,
            lastUpdated: new Date()
          });
        });
        setIpIntelligence(fallbackData);
      } finally {
        setIsLoadingIntelligence(false);
      }
    };

    fetchIpIntelligence();
  }, [uniqueIps]);

  // Transform activity data to fit IP analysis structure
  const ipAnalysisData = useMemo(() => {
    const ipMap = new Map<
      string,
      {
        activities: ActivityStatsData[];
        failedAttempts: number;
        totalActions: number;
        firstSeen: Date;
        lastSeen: Date;
      }
    >();

    activityData.allActivities.forEach(activity => {
      if (!activity.ip_address) return;

      const existing = ipMap.get(activity.ip_address) || {
        activities: [],
        failedAttempts: 0,
        totalActions: 0,
        firstSeen: new Date(activity.created_at),
        lastSeen: new Date(activity.created_at)
      };

      existing.activities.push(activity);
      existing.totalActions += 1;
      if (activity.status === 'failed') existing.failedAttempts += 1;

      const activityDate = new Date(activity.created_at);
      if (activityDate < existing.firstSeen) existing.firstSeen = activityDate;
      if (activityDate > existing.lastSeen) existing.lastSeen = activityDate;

      ipMap.set(activity.ip_address, existing);
    });

    return Array.from(ipMap.entries()).map(([ip, stats]) => {
      const failureRate =
        stats.totalActions > 0 ? (stats.failedAttempts / stats.totalActions) * 100 : 0;
      const intelligenceData = ipIntelligence.get(ip);
      const severity = getSeverityLevel(
        failureRate,
        stats.totalActions,
        intelligenceData?.riskScore || 0
      );

      // Convert intelligence data to geoData format for compatibility
      const geoData: IpGeoData = intelligenceData
        ? {
            country: intelligenceData.country,
            city: intelligenceData.city,
            region: intelligenceData.region,
            asn: intelligenceData.asn,
            org: intelligenceData.org,
            timezone: intelligenceData.timezone
          }
        : mockGeoEnrichment(ip);

      return {
        ip,
        totalActions: stats.totalActions,
        failedAttempts: stats.failedAttempts,
        failureRate,
        firstSeen: stats.firstSeen,
        lastSeen: stats.lastSeen,
        activities: stats.activities,
        geoData,
        severity,
        intelligence: intelligenceData // Add intelligence data for detailed view
      };
    });
  }, [activityData.allActivities, ipIntelligence]);

  const filteredData = useMemo(() => {
    return ipAnalysisData.filter(item => {
      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const itemDate = item.lastSeen;
        if (filters.dateRange.from && itemDate < filters.dateRange.from) return false;
        if (filters.dateRange.to && itemDate > filters.dateRange.to) return false;
      }

      // Severity filter
      if (filters.severity !== 'all' && item.severity !== filters.severity) return false;

      // Min actions filter
      const minActions = parseInt(filters.minActions) || 0;
      if (item.totalActions < minActions) return false;

      return true;
    });
  }, [ipAnalysisData, filters]);

  const chartData = useMemo(() => {
    const dailyStats = new Map<string, { date: string; activities: number; failed: number }>();

    filteredData.forEach(ip => {
      ip.activities.forEach(activity => {
        const date = format(new Date(activity.created_at), 'yyyy-MM-dd');
        const existing = dailyStats.get(date) || { date, activities: 0, failed: 0 };
        existing.activities += 1;
        if (activity.status === 'failed') existing.failed += 1;
        dailyStats.set(date, existing);
      });
    });

    return Array.from(dailyStats.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredData]);

  const severityDistribution = useMemo(() => {
    const dist = { critical: 0, high: 0, medium: 0, low: 0, normal: 0 };
    filteredData.forEach(item => dist[item.severity]++);
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-admin-background to-muted p-6 pt-24">
      <div className="mx-auto max-w-7xl space-y-6">
        <IpAnalysisHeader />

        {/* Loading Intelligence Data */}
        {isLoadingIntelligence && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>Loading IP intelligence data...</AlertDescription>
          </Alert>
        )}

        {/* Intelligence Error */}
        {intelligenceError && (
          <Alert variant="destructive">
            <AlertDescription>{intelligenceError}</AlertDescription>
          </Alert>
        )}

        <IpAnalysisFilters filters={filters} onFiltersChange={setFilters} />

        <IpAnalysisCards
          data={{
            totalIPs: filteredData.length,
            highRiskIPs: filteredData.filter(ip => ['critical', 'high'].includes(ip.severity))
              .length,
            totalActions: filteredData.reduce((sum, ip) => sum + ip.totalActions, 0),
            failedActions: filteredData.reduce((sum, ip) => sum + ip.failedAttempts, 0)
          }}
        />

        <IpAnalysisCharts timelineData={chartData} severityData={severityDistribution} />
        <IpAnalysisTable logs={filteredData} />
      </div>
    </div>
  );
};

// Mock geo enrichment function (in real app, this would call an IP intelligence API)
const mockGeoEnrichment = (ip: string): IpGeoData => {
  const geoMocks: Record<string, IpGeoData> = {
    '192.168.1.100': {
      country: 'United States',
      city: 'New York',
      region: 'NY',
      asn: 'AS15169',
      org: 'Google LLC',
      timezone: 'America/New_York'
    },
    '10.0.0.50': {
      country: 'Canada',
      city: 'Toronto',
      region: 'ON',
      asn: 'AS6453',
      org: 'TATA Communications',
      timezone: 'America/Toronto'
    },
    '172.16.0.25': {
      country: 'United Kingdom',
      city: 'London',
      region: 'England',
      asn: 'AS8075',
      org: 'Microsoft Corporation',
      timezone: 'Europe/London'
    },
    '203.0.113.45': {
      country: 'Australia',
      city: 'Sydney',
      region: 'NSW',
      asn: 'AS13335',
      org: 'Cloudflare',
      timezone: 'Australia/Sydney'
    },
    '198.51.100.30': {
      country: 'Germany',
      city: 'Berlin',
      region: 'Berlin',
      asn: 'AS3320',
      org: 'Deutsche Telekom AG',
      timezone: 'Europe/Berlin'
    }
  };

  return geoMocks[ip] || { country: 'Unknown', city: 'Unknown', asn: 'Unknown', org: 'Unknown' };
};

const getSeverityLevel = (
  failureRate: number,
  totalActions: number,
  riskScore = 0
): 'critical' | 'high' | 'medium' | 'low' | 'normal' => {
  // Factor in IP intelligence risk score
  let baseScore = 0;

  // Activity-based scoring
  if (failureRate > 80) baseScore += 40;
  else if (failureRate > 50) baseScore += 30;
  else if (failureRate > 30) baseScore += 20;
  else if (failureRate > 10) baseScore += 10;

  if (totalActions > 50) baseScore += 30;
  else if (totalActions > 30) baseScore += 20;
  else if (totalActions > 15) baseScore += 15;
  else if (totalActions > 5) baseScore += 10;

  // Add IP intelligence risk score (weighted)
  const combinedScore = baseScore + riskScore * 0.3;

  if (combinedScore >= 70) return 'critical';
  if (combinedScore >= 50) return 'high';
  if (combinedScore >= 30) return 'medium';
  if (combinedScore >= 15) return 'low';
  return 'normal';
};

import { ActivityLogsProvider } from 'contexts/admin/activity-logs/ActivityLogsContext';
const IpAnalysis = () => {
  return (
    <ActivityLogsProvider>
      <IpAnalysisContent />
    </ActivityLogsProvider>
  );
};
export default IpAnalysis;
