import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * File-based blog. Posts live in /content/blog/*.mdx as plain Markdown
 * with front-matter at the top. To publish a new post:
 *   1. Create /content/blog/your-slug.mdx
 *   2. Add front-matter (title, description, date, tags, etc.)
 *   3. Write the post in Markdown below
 *   4. Commit + push — Vercel deploys in 60s
 *
 * No CMS yet. Editing happens via GitHub web UI or local editor.
 */

export type PostFrontmatter = {
  title: string;
  description: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  /** Optional update timestamp */
  updated?: string;
  /** Author display name — defaults to "Kabelo More" */
  author?: string;
  /** For SEO category — drives the schema 'articleSection' */
  category?: string;
  /** Lowercase tags for filtering */
  tags?: string[];
  /** Optional cover image path under /public */
  cover?: string;
  /** "draft: true" hides the post from the index but the page still renders if you know the URL */
  draft?: boolean;
  /** Optional reading time override; defaults to computed */
  readingMinutes?: number;
};

export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingMinutes: number;
};

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

/** Read all .mdx files in /content/blog and return parsed posts. */
export function getAllPosts(opts: { includeDrafts?: boolean } = {}): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files
    .map((file) => readPostFile(file))
    .filter((p): p is Post => p !== null)
    .filter((p) => opts.includeDrafts || !p.frontmatter.draft);

  // Newest first
  return posts.sort((a, b) =>
    a.frontmatter.date < b.frontmatter.date ? 1 : -1,
  );
}

export function getPostBySlug(slug: string): Post | null {
  const candidates = [`${slug}.mdx`, `${slug}.md`];
  for (const file of candidates) {
    const post = readPostFile(file);
    if (post) return post;
  }
  return null;
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.(mdx|md)$/, ""));
}

function readPostFile(file: string): Post | null {
  try {
    const filePath = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);

    // Validate minimum required fields — if missing, skip the post rather than crash
    if (!data.title || !data.date) {
      console.warn(
        `[blog] Skipping ${file}: missing required front-matter (title, date)`,
      );
      return null;
    }

    const slug = file.replace(/\.(mdx|md)$/, "");
    const fm = data as PostFrontmatter;
    const readingMinutes = fm.readingMinutes ?? estimateReadingMinutes(content);

    return {
      slug,
      frontmatter: fm,
      content,
      readingMinutes,
    };
  } catch (err) {
    console.error(`[blog] Failed to read ${file}:`, err);
    return null;
  }
}

function estimateReadingMinutes(text: string): number {
  // Strip code fences and links from word-count for a more honest estimate
  const stripped = text.replace(/```[\s\S]*?```/g, "").replace(/\[.*?\]\(.*?\)/g, "");
  const words = stripped.split(/\s+/).filter(Boolean).length;
  // ~200 wpm reading speed, rounded up, minimum 1
  return Math.max(1, Math.ceil(words / 200));
}
