/* eslint-disable @typescript-eslint/no-explicit-any */
import isEqual from "lodash.isequal"

export const KEY_SYMBOL_ACTION = Symbol("action")
export const KEY_SYMBOL_VALUEA = Symbol("valueA")
export const KEY_SYMBOL_VALUEB = Symbol("valueB")

export const KEY_ACTION = "#@~!action"
export const KEY_VALUEA = "#@~!valueA"
export const KEY_VALUEB = "#@~!valueB"

interface DiffSymbolObject {
  [KEY_SYMBOL_ACTION]: "ADDED" | "MODIFIED" | "DELETED"
  [KEY_SYMBOL_VALUEA]: unknown
  [KEY_SYMBOL_VALUEB]: unknown
}
interface DiffNormalObject {
  [KEY_ACTION]: "ADDED" | "MODIFIED" | "DELETED"
  [KEY_VALUEA]: unknown
  [KEY_VALUEB]: unknown
}
export type DiffObject<useSymbol extends boolean = true> =
  useSymbol extends true ? DiffSymbolObject : DiffNormalObject
export type Diff<useSymbol extends boolean = true> = Record<
  string,
  useSymbol extends true
    ? DiffSymbolObject | Diff<true>
    : DiffObject | Diff<false>
>
export interface Options<useSymbol extends boolean = true> {
  deep?: false
  symbol?: useSymbol
}
export interface DiffReturn<useSymbol extends boolean = true> {
  diffs: Diff<useSymbol>
  count: number
}

export function isDiffObject(diffObj: any): diffObj is DiffObject {
  return (
    KEY_SYMBOL_ACTION in diffObj &&
    KEY_SYMBOL_VALUEA in diffObj &&
    KEY_SYMBOL_VALUEB in diffObj
  )
}

export function diff<
  A extends object,
  B extends object,
  useSymbol extends boolean = true
>(a: A, b: B, options?: Options<useSymbol>): DiffReturn<useSymbol> {
  const KeyAction = options?.symbol !== false ? KEY_SYMBOL_ACTION : KEY_ACTION
  const KeyValueA = options?.symbol !== false ? KEY_SYMBOL_VALUEA : KEY_VALUEA
  const KeyValueB = options?.symbol !== false ? KEY_SYMBOL_VALUEB : KEY_VALUEB

  const diffs: Diff = {}

  const keys = new Set([...Object.keys(a), ...Object.keys(b)])

  // eslint-disable-next-line functional/no-let
  let countDiffs = 0

  for (const name of keys) {
    // name in a = NO, --> name in b = YES
    if (!(name in a)) {
      // eslint-disable-next-line functional/immutable-data
      diffs[name] = {
        [KeyAction]: "ADDED",
        [KeyValueA]: (a as unknown as any)[name],
        [KeyValueB]: (b as unknown as any)[name]
      }
      countDiffs++
      continue
    }

    // name in b = YES ---> name in a = NO ---> name in a = NOT_EXISTS
    if (!(name in b)) {
      // eslint-disable-next-line functional/immutable-data
      diffs[name] = {
        [KeyAction]: "DELETED",
        [KeyValueA]: (a as unknown as any)[name],
        [KeyValueB]: (b as unknown as any)[name]
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
      const { diffs: diffsChild, count } = diff(
        (a as unknown as any)[name],
        (b as unknown as any)[name],
        options
      )

      // eslint-disable-next-line functional/immutable-data
      diffs[name] = diffsChild
      countDiffs += count

      continue
    }

    // eslint-disable-next-line functional/immutable-data
    diffs[name] = {
      [KeyAction]: "MODIFIED",
      [KeyValueA]: (a as unknown as any)[name],
      [KeyValueB]: (b as unknown as any)[name]
    }
    countDiffs++
  }

  return {
    diffs,
    count: countDiffs
  }
}
