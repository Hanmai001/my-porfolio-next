import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import type { Post } from "../types";

async function DashboardView() {
  // Simple Example for API call in Server Component
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts: Post[] = await res.json();

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <p className="text-xs text-muted-foreground">#{post.id}</p>
              <h2 className="line-clamp-2 text-sm font-medium text-foreground capitalize">
                {post.title}
              </h2>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {post.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { DashboardView };
