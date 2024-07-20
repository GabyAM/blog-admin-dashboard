export function mapPagesResults(pagesObject, mapFn) {
    return {
        ...pagesObject,
        pages: pagesObject.pages.map((page) => ({
            ...page,
            results: page.results.map((item) => mapFn(item))
        }))
    };
}
