type PagePropsCommon = {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{
    [key: string]: Promise<string | string[] | undefined>;
  }>;
};

export type { PagePropsCommon };