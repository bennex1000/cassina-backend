export type Accessory = {
  id: string;
  name: string;
  pullrate: number;
  equipped: boolean;
  luck: number;
};

export type Result<T> =
  | {
      ok: true;
      data: T;
    }
  | { ok: false; error: unknown };
