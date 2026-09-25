import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/app/(frontend)/_og/render";
import { populated } from "@/lib/content";
import { getPost } from "@/lib/queries/posts";

export const revalidate = 3600;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Qbitlog insight";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return renderOg({
    label: [
      "Insights",
      post && populated(post.category) ? post.category.title : null,
      post?.readingTime ? `${post.readingTime} min read` : null,
    ],
    title: post?.title ?? "Insights",
    metaImage: post?.meta?.image,
  });
}
