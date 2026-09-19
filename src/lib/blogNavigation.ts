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

export function comparePostsByRecency(a: BlogPost, b: BlogPost): number {
	const dateDifference = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
	return dateDifference || a.id.localeCompare(b.id, 'en');
}

export function sortPostsByRecency(posts: BlogPost[]): BlogPost[] {
	return [...posts].sort(comparePostsByRecency);
}

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

export function orderPostsForDiscovery(posts: BlogPost[]): BlogPost[] {
	const queues = groupPostsByGenre(sortPostsByRecency(posts));
	const orderedPosts: BlogPost[] = [];
	let previousGenre: BlogGenreId | undefined;

	while (orderedPosts.length < posts.length) {
		const availableGenres = BLOG_GENRES.map((genre) => genre.id).filter(
			(genre) => queues[genre].length > 0,
		);
		const genresWithoutRepeat = availableGenres.filter((genre) => genre !== previousGenre);
		const candidateGenres = genresWithoutRepeat.length > 0 ? genresWithoutRepeat : availableGenres;
		const nextPost = candidateGenres
			.map((genre) => queues[genre][0])
			.filter((post): post is BlogPost => Boolean(post))
			.sort(comparePostsByRecency)[0];

		if (!nextPost) break;

		const nextGenre = getBlogGenre(nextPost.data.category);
		queues[nextGenre].shift();
		orderedPosts.push(nextPost);
		previousGenre = nextGenre;
	}

	return orderedPosts;
}

export function getRecommendedPosts(
	posts: BlogPost[],
	currentPostId: string,
	currentCategory: string,
	limit = 6,
): BlogPost[] {
	const currentGenre = getBlogGenre(currentCategory);
	const otherPosts = sortPostsByRecency(posts).filter((post) => post.id !== currentPostId);
	const sameGenrePosts = otherPosts.filter(
		(post) => getBlogGenre(post.data.category) === currentGenre,
	);
	const otherGenrePosts = otherPosts.filter(
		(post) => getBlogGenre(post.data.category) !== currentGenre,
	);

	return [
		...sameGenrePosts.slice(0, 2),
		...orderPostsForDiscovery(otherGenrePosts),
		...sameGenrePosts.slice(2),
	].slice(0, limit);
}
