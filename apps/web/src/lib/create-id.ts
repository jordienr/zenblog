import { customAlphabet } from "nanoid";

type Type = "blog";

export const nanoid = customAlphabet(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
);

const PREFIXES: Record<Type, string> = {
  blog: "blog",
};

const LENGTHS: Record<Type, number> = {
  blog: 64,
};

export function createId({ secret, type }: { secret: boolean; type: Type }) {
  const key = nanoid(LENGTHS[type]);

  const keyWithPrefix = `${PREFIXES[type]}_${key}`;

  if (secret) {
    return `sk_${keyWithPrefix}`;
  }

  return `pk_${keyWithPrefix}`;
}
