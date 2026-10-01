import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/common/PlaceholderPage";
import { RoleGuard } from "@/components/common/RoleGuard";

export const Route = createFileRoute("/_authenticated/config/prompts")({
  head: () => ({
    meta: [
      { title: "Prompt Templates — NosyAgentic" },
      { name: "description", content: "Review prompt templates used by the AI agents." },
      { property: "og:title", content: "Prompt Templates — NosyAgentic" },
      {
        property: "og:description",
        content: "Review prompt templates used by the AI agents.",
      },
    ],
  }),
  component: () => (
    <RoleGuard roles={["admin"]}>
      <PlaceholderPage
        title="Prompt Templates"
        subtitle="Instructions that drive each review agent."
        description="No prompt templates defined yet."
      />
    </RoleGuard>
  ),
});
