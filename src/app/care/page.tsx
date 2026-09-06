import React from "react";
import { getCareSession, getTodayCareLogs } from "@/app/actions/care";
import CareClientPage from "./care-client-page";

export const dynamic = "force-dynamic";

export default async function CarePage() {
  const [session, todayLogsResult] = await Promise.all([
    getCareSession(),
    getTodayCareLogs("the-angle-house"),
  ]);

  return (
    <CareClientPage
      initialSession={session}
      initialLogs={todayLogsResult.success ? todayLogsResult.logs : []}
    />
  );
}
