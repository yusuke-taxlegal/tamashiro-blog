import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// ジャンルは3つだけ。名前は src/lib/blogNavigation.ts の BLOG_GENRES と同じ。
			category: z.enum(['AIの使い方', '仕事と暮らしの道具', '経営と仕事の仕組み']),
			accent: z.enum(['olive', 'coral', 'ink']).default('olive'),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

export const collections = { blog };
