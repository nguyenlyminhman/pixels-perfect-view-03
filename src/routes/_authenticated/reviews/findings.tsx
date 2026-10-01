import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/common/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/reviews/findings")({
  head: () => ({
    meta: [
      { title: "Findings — NosyAgentic" },
      { name: "description", content: "Code review findings grouped by severity." },
      { property: "og:title", content: "Findings — NosyAgentic" },
      { property: "og:description", content: "Code review findings grouped by severity." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Findings"
      subtitle="Issues raised by the review agents."
      description="No findings to triage."
    />
  ),
});
