import { it, expect, afterEach, beforeEach } from 'vitest'
import { getDocsForDirectory } from '../src/getDocs'
import { writeDocsToDirectory } from '../src/writeDocs'
import { readFileSync, rmdirSync, statSync } from 'fs'

const deletePaths = (paths: string[]) => {
  paths.forEach((path) => {
    try {
      rmdirSync(path, { recursive: true })
    } catch (e) {}
  })
}

beforeEach(() => {
  deletePaths(['tests/docs'])
})

afterEach(() => {
  deletePaths(['tests/docs'])
})

it('writeDocsToDirectory', () => {
  writeDocsToDirectory(getDocsForDirectory('tests/assets'), 'tests/docs')

  const contents = readFileSync('tests/docs/Example.md', 'utf8')

  expect(contents).toMatchSnapshot()

  expect(statSync('tests/docs/Example.md').isFile()).toBe(true)
})
