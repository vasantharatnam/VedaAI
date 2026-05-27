import { AppShell } from "../../../components/layout/app-shell";
import { Card } from "../../../components/ui/card";

export default function CreateAssignmentPage() {
  return (
    <AppShell>
      <section>
        <div className="mb-6">
          <h1 className="text-[28px] font-extrabold leading-none text-text">
            Create Assignment
          </h1>

          <p className="mt-2 text-base text-muted">
            Set up a new assignment for your students.
          </p>
        </div>

        <Card className="rounded-xl p-6 lg:p-8">
          <h2 className="text-xl font-bold text-text">Assignment Details</h2>

          <p className="mt-2 text-sm text-muted">
            Basic information about your assignment.
          </p>

          <div className="mt-8 rounded-lg border border-dashed border-text/50 p-10 text-center">
            <p className="font-semibold">
              Create form will be implemented next.
            </p>

            <p className="mt-2 text-sm text-muted">
              File upload, due date, question types, marks, and instructions.
            </p>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}