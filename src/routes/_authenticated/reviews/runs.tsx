import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/common/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/reviews/runs")({
  head: () => ({
    meta: [
      { title: "Review Runs — NosyAgentic" },
      { name: "description", content: "History of every AI review run and its outcome." },
      { property: "og:title", content: "Review Runs — NosyAgentic" },
      {
        property: "og:description",
        content: "History of every AI review run and its outcome.",
      },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Review Runs"
      subtitle="Every agent run, with status and duration."
      description="No review runs recorded yet."
    />
  ),
});
