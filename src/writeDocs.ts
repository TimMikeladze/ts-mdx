import { basename, dirname, extname, join } from 'path'
import { DocsForDirectory, DocsForFile } from './getDocs'
import { mkdirSync, writeFileSync } from 'fs'

const convertToMarkdown = (docs: DocsForFile): string => {
  return `# Classes
${docs.classes.info
  .map((cls) => `## ${cls.className}\n${cls.documentation}`)
  .join('\n\n')}

# Enums
${docs.enums
  .map((enumInfo) => `## ${enumInfo.enumName}\n${enumInfo.documentation}`)
  .join('\n\n')}

# Interfaces
${docs.interfaces
  .map(
    (interfaceInfo) =>
      `## ${interfaceInfo.interfaceName}\n${interfaceInfo.documentation}`
  )
  .join('\n\n')}

# Types
${docs.types
  .map((typeInfo) => `## ${typeInfo.typeName}\n${typeInfo.documentation}`)
  .join('\n\n')}`
}

export const writeDocsToFile = (
  docs: DocsForFile,
  filePath: string,
  extension: string = '.md'
) => {
  const markdownContent = convertToMarkdown(docs)
  const outputFileName = basename(filePath, extname(filePath)) + extension
  const outputPath = join(dirname(filePath), outputFileName)

  mkdirSync(dirname(outputPath), { recursive: true })

  writeFileSync(outputPath, markdownContent, 'utf8')
}

export const writeDocsToDirectory = (
  docsForDirectory: DocsForDirectory,
  directoryPath: string,
  extension: string = '.md'
) => {
  mkdirSync(directoryPath, { recursive: true })

  docsForDirectory.forEach((docsForFile, filePath) => {
    writeDocsToFile(
      docsForFile,
      filePath.replace('tests/assets', directoryPath),
      extension
    )
  })
}
