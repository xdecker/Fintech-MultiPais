export const CacheKeys = {
  creditDetail: (id: string) => `credits:detail:${id}`,

  creditList: (version: number) => `credits:list:v${version}`,
};

export const LIST_VERSION_KEY = 'credits:list:version';
