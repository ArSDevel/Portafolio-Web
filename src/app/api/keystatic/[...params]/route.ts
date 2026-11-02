import { makeRouteHandler } from "@keystatic/next/route-handler";
import { revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/content";
import config from "../../../../../keystatic.config";

const handler = makeRouteHandler({ config });

export const GET = handler.GET;

// Saving in the panel goes through POST: drop the cached content so the next
// page load reads the new files instead of the old cached copy.
export async function POST(request: Request) {
  const response = await handler.POST(request);
  if (response.ok) revalidateTag(CONTENT_TAG, { expire: 0 });
  return response;
}
