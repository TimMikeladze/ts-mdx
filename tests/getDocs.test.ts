import { expect, it } from 'vitest'
import { getDocsForDirectory } from '../src/getDocs'

it('getDocsForDirectory', () => {
  const res = getDocsForDirectory('tests/assets')

  expect(res).toMatchSnapshot()
})
