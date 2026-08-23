import type { CollectionEntry } from 'astro:content';

export const BLOG_GENRES = [
	{
		id: 'ai',
		label: 'AIの使い方',
		description: 'AIを仕事に取り入れる方法',
	},
	{
		id: 'tools',
		label: '仕事と暮らしの道具',
		description: '実際に使った道具と選び方',
	},
	{
		id: 'management',
		label: '経営と仕事の仕組み',
		description: '経営支援と仕組みづくりの実践',
	},
] as const;

export type BlogGenreId = (typeof BLOG_GENRES)[number]['id'];
export type BlogPost = CollectionEntry<'blog'>;

export function getBlogGenre(category: string): BlogGenreId {
	if (category.includes('AI')) return 'ai';
	if (category.includes('道具')) return 'tools';
	return 'management';
}

export function countPostsByGenre(posts: BlogPost[]): Record<BlogGenreId, number> {
	return posts.reduce<Record<BlogGenreId, number>>(
		(counts, post) => {
			counts[getBlogGenre(post.data.category)] += 1;
			return counts;
		},
		{ ai: 0, tools: 0, management: 0 },
	);
}

export function groupPostsByGenre(posts: BlogPost[]): Record<BlogGenreId, BlogPost[]> {
	return posts.reduce<Record<BlogGenreId, BlogPost[]>>(
		(groups, post) => {
			groups[getBlogGenre(post.data.category)].push(post);
			return groups;
		},
		{ ai: [], tools: [], management: [] },
	);
}
