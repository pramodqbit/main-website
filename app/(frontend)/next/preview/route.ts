import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path") ?? "";
  const secret = searchParams.get("secret");

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET) {
    return new Response("Invalid preview token", { status: 403 });
  }
  if (!path.startsWith("/") || path.startsWith("//")) {
    return new Response("Preview path must be a relative URL starting with /", { status: 400 });
  }

  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) {
    return new Response("You must be logged in to the CMS to preview drafts", { status: 403 });
  }

  (await draftMode()).enable();
  redirect(path);
}
