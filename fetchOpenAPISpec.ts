import { readFileSync } from 'fs'
import { join } from 'path'

function fetchOpenAPISpec (specPath: string): string {
  const fullpath = join(process.cwd(), specPath)
  const specFile: string = readFileSync(fullpath, 'utf8')

  const specBuffer = Buffer.from(specFile, 'utf-8')

  return specBuffer.toString('base64')
}

export { fetchOpenAPISpec }
