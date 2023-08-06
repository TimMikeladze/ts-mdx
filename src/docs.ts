import { z } from 'zod'
import { getDocsForDirectory, writeDocsToDirectory } from '.'

export const zDocsConfig = z.object({
  input: z.string(),
  output: z.string().default('docs'),
  extension: z.string().default('.md').optional()
})

export const docs = (config: z.infer<typeof zDocsConfig>) => {
  const data = zDocsConfig.parse(config)

  writeDocsToDirectory(
    getDocsForDirectory(data.input),
    data.output,
    data.extension
  )
}
