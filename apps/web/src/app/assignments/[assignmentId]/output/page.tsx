import { AppShell } from "../../../../components/layout/app-shell";
import { Card } from "../../../../components/ui/card";

interface OutputPageProps {
  params: {
    assignmentId: string;
  };
}

export default function AssignmentOutputPage({ params }: OutputPageProps) {
  return (
    <AppShell>
      <section>
        <div className="mb-6 rounded-lg bg-dark px-5 py-4 text-white">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm font-medium">
              AI is preparing your customized question paper.
            </p>

            <button className="rounded-full bg-white px-5 py-2 text-sm font-bold text-dark">
              Download as PDF
            </button>
          </div>
        </div>

        <Card className="p-6 lg:p-10">
          <p className="text-sm text-muted">Assignment ID</p>

          <h1 className="mt-2 text-2xl font-extrabold text-text">
            {params.assignmentId}
          </h1>

          <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
            <p className="font-semibold">Question paper preview coming next.</p>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}