import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/common/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/reviews/pull-requests")({
  head: () => ({
    meta: [
      { title: "Pull Requests — NosyAgentic" },
      { name: "description", content: "Pull requests queued for AI code review." },
      { property: "og:title", content: "Pull Requests — NosyAgentic" },
      { property: "og:description", content: "Pull requests queued for AI code review." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Pull Requests"
      subtitle="Incoming pull requests from Bitbucket and GitLab."
      description="No pull requests synced yet."
    />
  ),
});
