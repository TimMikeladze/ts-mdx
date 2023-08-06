import { it, expect, afterEach, beforeEach } from 'vitest'
import { getDocsForDirectory } from '../src/getDocs'
import { writeDocsToDirectory } from '../src/writeDocs'
import { rmdirSync, statSync } from 'fs'

beforeEach(() => {
  try {
    rmdirSync('tests/docs', { recursive: true })
  } catch (e) {}
})

afterEach(() => {
  rmdirSync('tests/docs', { recursive: true })
})

it('writeDocsToDirectory', () => {
  writeDocsToDirectory(getDocsForDirectory('tests/assets'), 'tests/docs')

  expect(statSync('tests/docs/Example.md').isFile()).toBe(true)
})
