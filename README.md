# diff-object

A package get diff object.

[https://tachibana-shin.github.io/diff-object](https://tachibana-shin.github.io/diff-object)

[![Build](https://github.com/tachibana-shin/diff-object/actions/workflows/test.yml/badge.svg)](https://github.com/tachibana-shin/diff-object/actions/workflows/test.yml)
[![NPM](https://badge.fury.io/js/diff-object.svg)](http://badge.fury.io/js/diff-object)
[![Size](https://img.shields.io/bundlephobia/minzip/diff-object/latest)](https://npmjs.org/package/@tachibana-shin/diff-object)
[![Languages](https://img.shields.io/github/languages/top/tachibana-shin/diff-object)](https://npmjs.org/package/@tachibana-shin/diff-object)
[![License](https://img.shields.io/npm/l/diff-object)](https://npmjs.org/package/@tachibana-shin/diff-object)
[![Star](https://img.shields.io/github/stars/tachibana-shin/diff-object)](https://github.com/tachibana-shin/diff-object/stargazers)
[![Download](https://img.shields.io/npm/dm/diff-object)](https://npmjs.org/package/@tachibana-shin/diff-object)

## Installation

NPM / Yarn / Pnpm

```bash
pnpm add diff-object
```

## Usage

Fast, simple, and full diff.

```ts
import { diff } from '@tachibana-shin/diff-object';

console.log(
   diff(
      { a: 1 },
      { b: 2 }
   )
)
```