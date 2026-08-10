import { createFileRoute } from "@tanstack/react-router";

/**
 * Catalog ingestion endpoint (Code Partners + Zid) — called by the scheduler.
 * Authenticated with the project's publishable apikey header.
 */
export const Route = createFileRoute("/api/public/store-sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected =
          process.env["SUPABASE_ANON_KEY"] ?? process.env["SUPABASE_PUBLISHABLE_KEY"];
        const provided = request.headers.get("apikey");
        if (!expected || provided !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { syncAllSuppliers } = await import("@/lib/store/sync.server");
        const results = await syncAllSuppliers();
        return Response.json({ ok: results.every((r) => r.ok), results });
      },
    },
  },
});
