interface IpApiResponse {
  query: string;
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  asname: string;
  mobile: boolean;
  proxy: boolean;
  hosting: boolean;
}

export interface IpIntelligenceData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timezone: string;
  isp: string;
  org: string;
  asn: string;
  asnName: string;
  latitude: number;
  longitude: number;
  isProxy: boolean;
  isHosting: boolean;
  isMobile: boolean;
  riskScore: number;
  lastUpdated: Date;
}

class IpIntelligenceService {
  private cache = new Map<string, { data: IpIntelligenceData; timestamp: number }>();
  private readonly cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
  private readonly apiBaseUrl = 'http://ip-api.com/json';
  private readonly batchSize = 100; // ip-api.com allows up to 100 IPs per batch

  // Fetch IP intelligence data for a single IP
  async getIpData(ip: string): Promise<IpIntelligenceData | null> {
    // Check cache first
    const cached = this.cache.get(ip);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout)
      return cached.data;

    if (this.isPrivateIp(ip)) return this.createLocalIpData(ip);

    try {
      const response = await fetch(`${this.apiBaseUrl}/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,asname,mobile,proxy,hosting,query`);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: IpApiResponse = await response.json();

      if (data.status === 'fail') {
        console.warn(`IP API failed for ${ip}:`, data);
        return null;
      }

      const enrichedData = this.transformApiResponse(data);

      // Cache the result
      this.cache.set(ip, {
        data: enrichedData,
        timestamp: Date.now()
      });

      return enrichedData;
    } catch (error) {
      console.error(`Error fetching IP data for ${ip}:`, error);
      return null;
    }
  }

  async getBatchIpData(ips: string[]): Promise<Map<string, IpIntelligenceData>> {
    const results = new Map<string, IpIntelligenceData>();
    const uncachedIps: string[] = [];

    // Check cache for each IP
    for (const ip of ips) {
      const cached = this.cache.get(ip);
      if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
        results.set(ip, cached.data);
      } else if (this.isPrivateIp(ip)) {
        const localData = this.createLocalIpData(ip);
        results.set(ip, localData);
        this.cache.set(ip, { data: localData, timestamp: Date.now() });
      } else {
        uncachedIps.push(ip);
      }
    }

    // fetch uncached IPs in batches
    for (let i = 0; i < uncachedIps.length; i += this.batchSize) {
      const batch = uncachedIps.slice(i, i + this.batchSize);
      await this.fetchBatch(batch, results);

      if (i + this.batchSize < uncachedIps.length) await this.delay(500);
    }

    return results;
  }

  private async fetchBatch(ips: string[], results: Map<string, IpIntelligenceData>) {
    try {
      const batchUrl = `${this.apiBaseUrl}/${ips.join(',')}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,asname,mobile,proxy,hosting,query`;

      const response = await fetch(batchUrl);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const batchData: IpApiResponse[] = await response.json();

      for (const data of batchData) {
        if (data.status === 'success') {
          const enrichedData = this.transformApiResponse(data);
          results.set(data.query, enrichedData);

          this.cache.set(data.query, {
            data: enrichedData,
            timestamp: Date.now()
          });
        }
      }
    } catch (error) {
      console.error('Error fetching batch IP data:', error);

      for (const ip of ips) {
        const data = await this.getIpData(ip);
        if (data) results.set(ip, data);
      }
    }
  }

  private transformApiResponse(data: IpApiResponse): IpIntelligenceData {
    const riskScore = this.calculateRiskScore({
      isProxy: data.proxy,
      isHosting: data.hosting,
      isMobile: data.mobile,
      country: data.country
    });

    return {
      ip: data.query,
      country: data.country || 'Unknown',
      countryCode: data.countryCode || '',
      region: data.regionName || data.region || 'Unknown',
      city: data.city || 'Unknown',
      timezone: data.timezone || 'Unknown',
      isp: data.isp || 'Unknown',
      org: data.org || 'Unknown',
      asn: data.as || 'Unknown',
      asnName: data.asname || 'Unknown',
      latitude: data.lat || 0,
      longitude: data.lon || 0,
      isProxy: data.proxy || false,
      isHosting: data.hosting || false,
      isMobile: data.mobile || false,
      riskScore,
      lastUpdated: new Date()
    };
  }

  private calculateRiskScore(factors: {
    isProxy: boolean;
    isHosting: boolean;
    isMobile: boolean;
    country: string;
  }): number {
    let score = 0;

    if (factors.isProxy) score += 40;
    if (factors.isHosting) score += 30;
    if (factors.isMobile) score -= 10;

    const highRiskCountries = ['CN', 'RU', 'KP', 'IR'];
    const mediumRiskCountries = ['VN', 'IN', 'BR'];

    const countryCode = factors.country;
    if (highRiskCountries.includes(countryCode)) {
      score += 20;
    } else if (mediumRiskCountries.includes(countryCode)) {
      score += 10;
    }

    return Math.min(Math.max(score, 0), 100); // Clamp between 0-100
  }

  private createLocalIpData(ip: string): IpIntelligenceData {
    return {
      ip,
      country: 'Local Network',
      countryCode: 'LO',
      region: 'Private',
      city: 'Local',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isp: 'Local Network',
      org: 'Private Network',
      asn: 'Private',
      asnName: 'Private Network',
      latitude: 0,
      longitude: 0,
      isProxy: false,
      isHosting: false,
      isMobile: false,
      riskScore: 0,
      lastUpdated: new Date()
    };
  }

  private isPrivateIp(ip: string): boolean {
    const parts = ip.split('.').map(Number);

    if (parts.length !== 4 || parts.some(part => isNaN(part) || part < 0 || part > 255))
      return false;

    // Check for private IP ranges
    return (
      // 10.0.0.0/8
      parts[0] === 10 ||
      // 172.16.0.0/12
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      // 192.168.0.0/16
      (parts[0] === 192 && parts[1] === 168) ||
      // 127.0.0.0/8 (localhost)
      parts[0] === 127
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Clear expired cache entries
  public clearExpiredCache(): void {
    const now = Date.now();
    const entriesToDelete: string[] = [];

    this.cache.forEach((cached, ip) => {
      if (now - cached.timestamp > this.cacheTimeout)
        entriesToDelete.push(ip);
    });

    entriesToDelete.forEach(ip => this.cache.delete(ip));
  }

  // Get cache statistics
  public getCacheStats() {
    const entries: string[] = [];
    this.cache.forEach((_, ip) => entries.push(ip));

    return {
      size: this.cache.size,
      entries
    };
  }
}

// Export singleton instance
export const ipIntelligenceService = new IpIntelligenceService();

// Export types
export type { IpApiResponse };
