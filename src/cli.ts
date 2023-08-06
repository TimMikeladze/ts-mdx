import { Command } from 'commander'
import { getDocsForDirectory } from './getDocs'
import { writeDocsToDirectory } from './writeDocs'
;(async () => {
  const program = new Command()

  program.name('ts-md').description('').version('x.x.x')

  program.option('-i --input <inputPath>', 'Path to input directory')

  program.option('-o --output <outputPath>', 'Path to output directory')

  program.option(
    '-e --extension <extension>',
    'File extension to output, defaults to .md'
  )

  program
    .command('docs')
    .description('Generate documentation')
    .action(async () => {
      if (!program.opts().input) {
        console.error('Error: input path is required')
        return
      }
      if (!program.opts().output) {
        console.error('Error: output path is required')
      }
      const extension = program.opts().extension || '.md'
      const inputPath = program.opts().input
      const outputPath = program.opts().output

      writeDocsToDirectory(
        getDocsForDirectory(inputPath),
        outputPath,
        extension
      )
    })

  const defaultCommand = async () => {}

  try {
    await program.parseAsync(process.argv)
    if (process.argv.length === 2) {
      await defaultCommand()
    }
  } catch (err: any) {
    console.error(err.message)
  }
})()
