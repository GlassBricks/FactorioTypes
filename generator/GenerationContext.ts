import chalk from "chalk"
import ts from "typescript"
import { DeclarationType, OutputFile, OutputFileBuilder, OutputFileBuilderImpl } from "./OutputFile.js"
import { checkManualDefinitions, preprocessManualDefinitions, processManualDefinitions } from "./manualDefinitions.js"
import { fileURLToPath } from "url"
import path from "path"
import { printer } from "./genUtil.js"
import fs from "fs"
import * as runtime from "./FactorioRuntimeApiJson.js"
import * as prototype from "./FactorioPrototypeApiJson.js"

export interface AnyApiJson {
  application: "factorio"
  stage: string
  api_version: 4
  application_version: string
}

export interface GenerationResult {
  files: Map<string, string>
  hasWarnings: boolean
}

export abstract class GenerationContext<A extends AnyApiJson = AnyApiJson> {
  // This is also a record of which types exist
  references = new Map<string, string>()

  addBefore = new Map<string, ts.Statement[]>()
  addAfter = new Map<string, ts.Statement[]>()
  addTo = new Map<string, ts.Statement[]>()

  hasWarnings = false

  public readonly manualDefs = processManualDefinitions(this.manualDefinitionsSource)

  constructor(
    public readonly apiDocs: A,
    public readonly manualDefinitionsSource: ts.SourceFile,
    public readonly checker: ts.TypeChecker
  ) {}

  abstract get stageName(): string

  private _currentFile: OutputFileBuilder | undefined
  get currentFile(): OutputFileBuilder {
    if (!this._currentFile) throw new Error("No current file")
    return this._currentFile
  }

  private allFiles: OutputFile[] = []

  warning(...args: unknown[]): void {
    console.log(chalk.yellow(...args))
    this.hasWarnings = true
  }

  addFile(fileName: string, decType: DeclarationType, fn: () => void): void {
    if (this._currentFile) throw new Error("Nested addFile")
    const builder = new OutputFileBuilderImpl(this, fileName, decType)
    this._currentFile = builder
    fn()
    this._currentFile = undefined
    this.allFiles.push(builder.build())
  }

  getAllFiles(): OutputFile[] {
    return this.allFiles
  }

  abstract tryGetTypeOfReference(reference: string): runtime.Type | prototype.Type | undefined

  abstract getOnlineDocUrl(reference: string): string

  docUrlBase(): string {
    return `https://lua-api.factorio.com/${this.apiDocs.application_version}/`
  }

  protected abstract preprocessAll(): void
  protected abstract generateAll(): void

  private checkApiDocs() {
    for (const [k, v] of Object.entries({
      application: "factorio",
      api_version: 4,
      stage: this.stageName,
    })) {
      if (this.apiDocs[k as keyof AnyApiJson] !== v) {
        throw new Error(`Expected ${k}=${v}, got ${this.apiDocs[k as keyof AnyApiJson]}`)
      }
    }
  }

  generate(): GenerationResult {
    this.checkApiDocs()
    this.preprocessAll()
    preprocessManualDefinitions(this)
    this.generateAll()
    checkManualDefinitions(this)
    return getGenerationResult(this)
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const header = "// This is an auto-generated file. Do not edit directly!\n\n"

export function getGenerationResult(context: GenerationContext): {
  files: Map<string, string>
  hasWarnings: boolean
} {
  const result = new Map<string, string>()

  const outFiles = context.getAllFiles()

  for (const { name, statements } of outFiles) {
    let content = header
    for (const statement of statements) {
      content += printer.printNode(ts.EmitHint.Unspecified, statement, context.manualDefinitionsSource)
      content += "\n\n"
    }
    result.set(`${context.stageName}/generated/${name}.d.ts`, content)
  }

  const indexFiles = generateIndexFiles(context, outFiles)
  for (const [fileName, content] of indexFiles) {
    result.set(fileName, content)
  }

  return { files: result, hasWarnings: context.hasWarnings }
}

function generateIndexFiles(context: GenerationContext, outFiles: OutputFile[]): Map<string, string> {
  const result = new Map<string, string>()

  let globalReferences = ""
  for (const file of outFiles) {
    if (file.moduleType === "global") {
      globalReferences += `/// <reference path="./generated/${file.name}.d.ts" />\n`
    }
  }

  const globalIndexTemplate = fs.readFileSync(
    path.resolve(__dirname, `../${context.stageName}/index-template.ts`),
    "utf8"
  )
  result.set(
    `${context.stageName}/index.d.ts`,
    globalIndexTemplate.replace("// globals\n", (m) => m + globalReferences)
  )

  let namespaceReferences = ""
  for (const file of outFiles) {
    if (file.moduleType === "namespace") {
      namespaceReferences += `/// <reference path="./${context.stageName}/generated/${file.name}.d.ts" />\n`
    }
  }

  const namespaceIndexTemplate = fs.readFileSync(path.resolve(__dirname, `../index-template.ts`), "utf8")
  result.set(
    "index.d.ts",
    namespaceIndexTemplate.replace(`// ${context.stageName}\n`, (m) => m + namespaceReferences)
  )

  return result
}
