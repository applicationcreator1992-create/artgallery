// Collections configuration for deployment

export function getCollectionsConfig() {
  return {
    enabled: true,
    homepage: {
      pagination: {
        pageSize: 12,
      },
      maxCollections: 50,
    },
    collections: [],
  };
}
