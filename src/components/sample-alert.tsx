import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";

export function SampleAlert({ compact = false }: { compact?: boolean }) {
  return (
    <Alert>
      <InfoIcon />
      <AlertTitle className="flex items-center gap-2">
        <Badge variant="outline">SAMPLE</Badge>
        Operator fixtures
      </AlertTitle>
      <AlertDescription>
        {compact
          ? "Sample operator data. Not live TikTok Analytics. No TikTok API is connected."
          : "Sample operator data for Ulyses / Influencer Press / TikTok @ulyses. Metrics are SAMPLE fixtures. This app does not call a TikTok API."}
      </AlertDescription>
    </Alert>
  );
}
