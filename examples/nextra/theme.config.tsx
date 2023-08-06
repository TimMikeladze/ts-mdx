import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <strong>ts-mdx</strong>,
  project: {
    link: 'https://github.com/TimMikeladze/ts-mdx'
  },
  docsRepositoryBase: 'https://github.com/TimMikeladze/ts-mdx',
  footer: {
    text: (
      <span>
        Follow me{' '}
        <strong>
          <a href="https://twitter.com/linesofcode">@linesofcode</a>
        </strong>{' '}
        for more cool projects.
      </span>
    )
  }
}

export default config
