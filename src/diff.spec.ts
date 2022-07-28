import { describe, expect, test } from "vitest"

import type { DiffObject } from "./diff"
import {
  diff, KEY_ACTION,
  KEY_SYMBOL_ACTION,
  KEY_SYMBOL_VALUEA,
  KEY_SYMBOL_VALUEB,
  KEY_VALUEA,
  KEY_VALUEB
} from "./diff"

describe("diff", () => {
  test("normal object no deep", () => {
    const a = { a: 1, b: 2, c: 3 }
    const b = { a: 1, b: 2, c: 3 }
    const { diffs, count } = diff(a, b, {
      deep: false
    })
    expect(diffs).toEqual({})
    expect(count).toEqual(0)
  })
  test("normal object deep", () => {
    const a = { a: 1, b: 2, c: 3 }
    const b = { a: 1, b: 2, c: 3 }
    const { diffs, count } = diff(a, b)
    expect(diffs).toEqual({})
    expect(count).toEqual(0)
  })
  test("exists deep diff", () => {
    const a = { a: 1, b: 2, c: 3 }
    const b = { a: 1, b: 2, c: 3, d: 4 }
    const { diffs, count } = diff(a, b)

    expect((diffs.d as DiffObject)[KEY_SYMBOL_ACTION]).toEqual("ADDED")
    expect((diffs.d as DiffObject)[KEY_SYMBOL_VALUEA]).toEqual(undefined)
    expect((diffs.d as DiffObject)[KEY_SYMBOL_VALUEB]).toEqual(4)
    expect(count).toEqual(1)
  })

  test("remove prop diffs", () => {
    const a = { a: 1, b: 2, c: 3 }
    const b = { a: 1, c: 3 }
    const { diffs, count } = diff(a, b)

    expect((diffs.b as DiffObject)[KEY_SYMBOL_ACTION]).toEqual("DELETED")
    expect((diffs.b as DiffObject)[KEY_SYMBOL_VALUEA]).toEqual(2)
    expect((diffs.b as DiffObject)[KEY_SYMBOL_VALUEB]).toEqual(undefined)
    expect(count).toEqual(1)
  })
  test("modify prop diffs", () => {
    const a = { a: 1, b: 2, c: 3 }
    const b = { a: 1, b: 4, c: 3 }
    const { diffs, count } = diff(a, b)

    expect(diffs).toEqual({
      b: {
        [KEY_SYMBOL_ACTION]: "MODIFIED",
        [KEY_SYMBOL_VALUEA]: 2,
        [KEY_SYMBOL_VALUEB]: 4
      }
    })
    expect(count).toEqual(1)
  })
  test("modify prop diffs other type", () => {
    const a = { a: 1, b: 2, c: 3 }
    const b = { a: 1, b: "4", c: 3 }
    const { diffs, count } = diff(a, b)
    expect(diffs).toEqual({
      b: {
        [KEY_SYMBOL_ACTION]: "MODIFIED",
        [KEY_SYMBOL_VALUEA]: 2,
        [KEY_SYMBOL_VALUEB]: "4"
      }
    })
    expect(count).toEqual(1)
  })
  test("modify object deep", () => {
    const a = { a: 1, b: 2, c: { d: 3, e: 4 } }
    const b = { a: 1, b: 2, c: { d: 3, e: 5 } }
    const { diffs, count } = diff(a, b)
    expect(diffs).toEqual({
      c: {
        e: {
          [KEY_SYMBOL_ACTION]: "MODIFIED",
          [KEY_SYMBOL_VALUEA]: 4,
          [KEY_SYMBOL_VALUEB]: 5
        }
      }
    })
    expect(count).toEqual(1)
  })
  test("multiple diffs", () => {
    const a = { a: 1, b: 2, c: { d: 3, e: 4 } }
    const b = { a: 2, b: 2, c: { d: 3, e: 5 } }
    const { diffs, count } = diff(a, b)
    expect(diffs).toEqual({
      a: {
        [KEY_SYMBOL_ACTION]: "MODIFIED",
        [KEY_SYMBOL_VALUEA]: 1,
        [KEY_SYMBOL_VALUEB]: 2
      },
      c: {
        e: {
          [KEY_SYMBOL_ACTION]: "MODIFIED",
          [KEY_SYMBOL_VALUEA]: 4,
          [KEY_SYMBOL_VALUEB]: 5
        }
      }
    })
    expect(count).toEqual(2)
  })

  test("no use symbol", () => {
    const a = { a: 1, b: 2, c: { d: 3, e: 4 } }
    const b = { a: 2, b: 2, c: { d: 3, e: 5 } }
    const { diffs, count } = diff(a, b, {
      symbol: false
    })
    expect(diffs).toEqual({
      a: {
        [KEY_ACTION]: "MODIFIED",
        [KEY_VALUEA]: 1,
        [KEY_VALUEB]: 2
      },
      c: {
        e: {
          [KEY_ACTION]: "MODIFIED",
          [KEY_VALUEA]: 4,
          [KEY_VALUEB]: 5
        }
      }
    })
    expect(count).toEqual(2)
  })
})
