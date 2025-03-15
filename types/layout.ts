import { Model } from "@prisma/client";

type AppNavProps = {
  models: (Partial<Model> & Pick<Model, 'displayName' | 'description'>)[];
};

export type { AppNavProps };
