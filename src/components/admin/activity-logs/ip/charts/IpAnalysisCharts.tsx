import { ActivityTimelineChart } from "./ActivityTimelineChart";
import { SeverityDistributionChart } from "./SeverityDistributionChart";
import { ActivityTimelineData, SeverityDistributionData } from "../types";

interface IpAnalysisChartsProps {
  timelineData: ActivityTimelineData[];
  severityData: SeverityDistributionData[];
}

export const IpAnalysisCharts = ({ timelineData, severityData }: IpAnalysisChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ActivityTimelineChart data={timelineData} />
      <SeverityDistributionChart data={severityData} />
    </div>
  );
};
