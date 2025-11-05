import type { Page } from "socky/types";

export async function* paginatePages<T>(
	fetchPage: (cursor?: string) => Promise<Page<T>>,
	pageLimit?: number,
): AsyncGenerator<Page<T>, void, unknown> {
	let cursor: string | undefined;
	let pageCount = 0;

	while (true) {
		const page = await fetchPage(cursor);
		yield page;

		cursor = page.nextCursor;
		pageCount++;

		if (!page.hasMore || !cursor || (pageLimit && pageCount >= pageLimit)) {
			break;
		}
	}
}

export async function* paginateItems<T>(
	fetchPage: (cursor?: string) => Promise<Page<T>>,
	pageLimit?: number,
): AsyncGenerator<T, void, unknown> {
	let cursor: string | undefined;
	let pageCount = 0;

	while (true) {
		const page = await fetchPage(cursor);

		for (const item of page.items) {
			yield item;
		}

		cursor = page.nextCursor;
		pageCount++;

		if (!page.hasMore || !cursor || (pageLimit && pageCount >= pageLimit)) {
			break;
		}
	}
}
