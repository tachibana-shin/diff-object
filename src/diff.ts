import isEqual from "lodash.isequal"

export const KEY_ACTION = Symbol("action")
export const KEY_VALUEA = Symbol("valueA")
export const KEY_VALUEB = Symbol("valueB")

export interface DiffObject {
  [KEY_ACTION]: "ADDED" | "MODIFIED" | "DELETED"
  [KEY_VALUEA]: unknown
  [KEY_VALUEB]: unknown
}
export interface Diff {
  [name: string]: DiffObject | Diff
}
export interface Options {
  deep?: false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDiffObject(diffObj: any): diffObj is DiffObject {
  return KEY_ACTION in diffObj && KEY_VALUEA in diffObj && KEY_VALUEB in diffObj
}

export function diff<A extends object, B extends object>(
  a: A,
  b: B,
  options?: Options
): {
  diffs: Diff
  count: number
} {
  const diffs: Diff = {}

  const keys = new Set([...Object.keys(a), ...Object.keys(b)])

  let countDiffs = 0

  for (const name of keys) {
    // name in a = NO, --> name in b = YES
    if (!(name in a)) {
      // eslint-disable-next-line functional/immutable-data
      diffs[name] = {
        [KEY_ACTION]: "ADDED",
        [KEY_VALUEA]: (a as unknown as any)[name],
        [KEY_VALUEB]: (b as unknown as any)[name]
      }
      countDiffs++
      continue
    }

    // name in b = YES ---> name in a = NO ---> name in a = NOT_EXISTS
    if (!(name in b)) {
      // eslint-disable-next-line functional/immutable-data
      diffs[name] = {
        [KEY_ACTION]: "DELETED",
        [KEY_VALUEA]: (a as unknown as any)[name],
        [KEY_VALUEB]: (b as unknown as any)[name]
      }
      countDiffs++
      continue
    }

    // name in a = YES and name in b = YES
    if (isEqual((a as unknown as any)[name], (b as unknown as any)[name]))
      continue

    if (
      typeof (a as unknown as any)[name] === "object" &&
      typeof (b as unknown as any)[name] === "object" &&
      options?.deep !== false
    ) {
      // eslint-disable-next-line functional/immutable-data
      const { diffs: diffsChild, count } = diff(
        (a as unknown as any)[name],
        (b as unknown as any)[name]
      )

      diffs[name] = diffsChild
      countDiffs += count

      continue
    }

    // eslint-disable-next-line functional/immutable-data
    diffs[name] = {
      [KEY_ACTION]: "MODIFIED",
      [KEY_VALUEA]: (a as unknown as any)[name],
      [KEY_VALUEB]: (b as unknown as any)[name]
    }
    countDiffs++
  }

  return {
    diffs,
    count: countDiffs
  }
}
