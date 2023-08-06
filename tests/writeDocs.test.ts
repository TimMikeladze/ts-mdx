import { it, expect, afterEach, beforeEach } from 'vitest'
import { getDocsForDirectory } from '../src/getDocs'
import { writeDocsToDirectory } from '../src/writeDocs'
import { readFileSync, rmdirSync, statSync } from 'fs'

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

  const contents = readFileSync('tests/docs/Example.md', 'utf8')

  expect(contents).toMatchSnapshot()

  expect(statSync('tests/docs/Example.md').isFile()).toBe(true)
})
