import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/common/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/config/repositories")({
  head: () => ({
    meta: [
      { title: "Repositories — NosyAgentic" },
      { name: "description", content: "Connected Bitbucket and GitLab repositories." },
      { property: "og:title", content: "Repositories — NosyAgentic" },
      {
        property: "og:description",
        content: "Connected Bitbucket and GitLab repositories.",
      },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Repositories"
      subtitle="Repositories wired up for automatic review."
      description="No repositories connected yet."
    />
  ),
});
