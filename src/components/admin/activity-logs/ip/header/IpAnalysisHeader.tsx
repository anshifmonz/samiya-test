import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "ui/button";

export const IpAnalysisHeader = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col items-start gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/activity-logs')}
          className="text-muted-foreground hover:text-luxury-black"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Activity Logs
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-luxury-black">IP Address Analysis</h1>
          <p className="text-muted-foreground">Detailed security analysis and geo intelligence</p>
        </div>
      </div>
    </div>
  );
};
