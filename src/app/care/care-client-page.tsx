"use client";

import React, { useState } from "react";
import PinPad from "@/components/care/pin-pad";
import CaretakerView from "@/components/care/caretaker-view";
import ChefView from "@/components/care/chef-view";
import AdminView from "@/components/care/admin-view";
import { verifyCarePin, submitCareLog, logoutCareAction, CareSession } from "@/app/actions/care";
import { useRouter } from "next/navigation";

interface CareClientPageProps {
  initialSession: CareSession | null;
  initialLogs: any[];
}

export default function CareClientPage({
  initialSession,
  initialLogs,
}: CareClientPageProps) {
  const router = useRouter();
  const [session, setSession] = useState<CareSession | null>(initialSession);
  const [logs, setLogs] = useState<any[]>(initialLogs);

  const handlePinSuccess = (newSession: CareSession) => {
    setSession(newSession);
    router.refresh();
  };

  const handleLogout = async () => {
    await logoutCareAction();
    setSession(null);
    router.refresh();
  };

  const handleSubmitLog = async (data: {
    category: string;
    notes?: string;
    imageBase64: string;
    villaSlug?: string;
  }) => {
    const res = await submitCareLog(data);
    if (res.success && res.log) {
      setLogs((prev) => [res.log, ...prev]);
    }
    return res;
  };

  if (!session) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <PinPad onSuccess={handlePinSuccess} verifyPinAction={verifyCarePin} />
      </main>
    );
  }

  return (
    <main className="flex-1 py-6 px-3 sm:px-6">
      {session.role === "caretaker" && (
        <CaretakerView
          staffName={session.staffName}
          villaName={session.villaName}
          villaSlug={session.villaSlug}
          onLogout={handleLogout}
          onSubmitLog={handleSubmitLog}
          existingLogs={logs}
        />
      )}

      {session.role === "chef" && (
        <ChefView
          staffName={session.staffName}
          villaName={session.villaName}
          villaSlug={session.villaSlug}
          onLogout={handleLogout}
          onSubmitLog={handleSubmitLog}
          existingLogs={logs}
        />
      )}

      {session.role === "admin" && (
        <AdminView
          staffName={session.staffName}
          villaName={session.villaName}
          villaSlug={session.villaSlug}
          onLogout={handleLogout}
          logs={logs}
        />
      )}
    </main>
  );
}
