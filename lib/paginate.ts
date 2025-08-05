import type { PaginatedResponse } from "socky/types";

export async function* paginate<T>(
  fetchPage: (cursor?: string, limit?: number) => Promise<PaginatedResponse<T>>,
  pageLimit?: number,
): AsyncGenerator<T[], void, unknown> {
  let cursor: string | undefined;
  const limit: number | undefined = 20;
  let pageCount = 0;

  while (true) {
    const page = await fetchPage(cursor, limit);
    yield page.data;

    cursor = page.next_cursor;
    pageCount++;

    if (!cursor || (pageLimit && pageCount >= pageLimit)) {
      break;
    }
  }
}
