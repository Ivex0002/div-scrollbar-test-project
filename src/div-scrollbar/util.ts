import type { StyleConfig, UserStyleConfig } from "./type";

type PlainObject = Record<string, unknown>;

function isPlainObject(v: unknown): v is PlainObject {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function mergeStyleConfig(
  base: StyleConfig,
  patch?: UserStyleConfig,
): StyleConfig {
  if (!patch) return base;

  const result: PlainObject = { ...base };

  for (const key in patch) {
    const baseValue = base[key as keyof StyleConfig];
    const patchValue = patch[key as keyof UserStyleConfig];

    if (patchValue === undefined) continue;

    if (isPlainObject(baseValue) && isPlainObject(patchValue)) {
      result[key] = deepMergeObject(baseValue, patchValue);
    } else {
      result[key] = patchValue;
    }
  }

  return result as StyleConfig;
}

function deepMergeObject(base: PlainObject, patch: PlainObject): PlainObject {
  const result: PlainObject = { ...base };

  for (const key in patch) {
    if (!Object.prototype.hasOwnProperty.call(patch, key)) continue;

    const baseValue = base[key];
    const patchValue = patch[key];

    if (patchValue === undefined) continue;

    if (isPlainObject(baseValue) && isPlainObject(patchValue)) {
      result[key] = deepMergeObject(baseValue, patchValue);
    } else {
      result[key] = patchValue;
    }
  }

  return result;
}
