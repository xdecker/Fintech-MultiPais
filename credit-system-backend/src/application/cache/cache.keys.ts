export const CacheKeys = {
  creditDetail: (id: string) => `credits:detail:${id}`,

  creditList: (version: number, page: number, limit: number) =>
    `credit:list:v${version}:p${page}:l${limit}`,
};

export const LIST_VERSION_KEY = 'credits:list:version';
