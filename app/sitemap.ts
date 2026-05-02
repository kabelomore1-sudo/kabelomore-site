import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { sectorChecklistList } from "@/lib/sector-checklists";
import { newsletterIssues } from "@/lib/newsletter-issues";
import { leaderboardEntries } from "@/lib/leaderboard";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${site.url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/foundation`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/how-we-work`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/process`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/scan`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/resources`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${site.url}/leaderboard`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${site.url}/watch`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/newsletter`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/case-studies`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/case-studies/oms-lifting-solutions`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Dynamically include every published blog post
  const blogPosts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.updated ?? post.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Each sector checklist is a high-priority resource page (full + quick wins)
  const resourcePages: MetadataRoute.Sitemap = sectorChecklistList.flatMap(
    (cl) => [
      {
        url: `${site.url}/resources/${cl.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
      {
        url: `${site.url}/resources/quick-wins/${cl.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.75,
      },
    ],
  );

  // Reference leaderboardEntries to ensure the file is part of the build
  // graph (any future per-entry public profile pages would be enumerated here)
  void leaderboardEntries;

  // Each newsletter issue is its own indexed page (compounds AI citations)
  const newsletterPages: MetadataRoute.Sitemap = newsletterIssues.map(
    (issue) => ({
      url: `${site.url}/newsletter/${issue.slug}`,
      lastModified: new Date(issue.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }),
  );

  return [
    ...staticRoutes,
    ...blogPosts,
    ...resourcePages,
    ...newsletterPages,
  ];
}
