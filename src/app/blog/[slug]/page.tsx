// Blog post — /blog/:slug
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  await params
  return <main />
}
