import * as fs from "fs"
import * as path from "path"
import ts from "typescript"
import { DefinitionsFile } from "./DefinitionsFile.js"
import { FactorioRuntimeApiJson } from "./FactorioRuntimeApiJson.js"
import { generateClasses, preprocessClasses } from "./files/classes.js"
import { generateConcepts, preprocessConcepts } from "./files/concepts.js"
import { generateDefines, preprocessDefines } from "./files/defines.js"
import { generateEvents, preprocessEvents } from "./files/events.js"
import { generateIndexTypesFile, preprocessIndexTypes } from "./files/index-types.js"
import {
  generateBuiltins,
  generateGlobalFunctions,
  generateGlobalObjects,
  preprocessBuiltins,
  preprocessGlobalFunctions,
  preprocessGlobalObjects,
} from "./files/others.js"
import { GenerationContext } from "./GenerationContext.js"
import { printer } from "./genUtil.js"
import { checkManualDefinitions, preprocessManualDefinitions } from "./manualDefinitions.js"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const header = "// This is an auto-generated file. Do not edit directly!\n\n"
export function generateDefinitions(
  apiJson: FactorioRuntimeApiJson,
  manualDefinitionsSource: ts.SourceFile,
  checker: ts.TypeChecker
): { files: Map<string, string>; hasWarnings: boolean } {
  const context = new GenerationContext(apiJson, manualDefinitionsSource, checker)
  preprocessAll(context)
  const files = generateAll(context)

  const result = new Map<string, string>()
  for (const { name, statements } of files) {
    let content = header
    for (const statement of statements) {
      content += printer.printNode(ts.EmitHint.Unspecified, statement, context.manualDefinitionsSource)
      content += "\n\n"
    }
    result.set(path.join("runtime/generated", name + ".d.ts"), content)
  }

  const indexFiles = generateIndexFiles(files.map((f) => f.name))
  for (const [fileName, content] of indexFiles) {
    result.set(fileName, content)
  }

  const hasWarnings = context.hasWarnings
  return { files: result, hasWarnings }
}

function preprocessAll(context: GenerationContext) {
  preprocessBuiltins(context)
  preprocessGlobalObjects(context)
  preprocessGlobalFunctions(context)
  preprocessDefines(context)
  preprocessEvents(context)
  preprocessClasses(context)
  preprocessConcepts(context)
  preprocessIndexTypes(context)
  preprocessManualDefinitions(context)
}

function generateAll(context: GenerationContext): DefinitionsFile[] {
  const files = [
    generateBuiltins(context),
    generateGlobalObjects(context),
    generateGlobalFunctions(context),
    generateDefines(context),
    generateEvents(context),
    generateClasses(context),
    generateConcepts(context),
    generateIndexTypesFile(context),
  ]
  checkManualDefinitions(context)
  return files
}

function generateIndexFiles(fileNames: Iterable<string>): Map<string, string> {
  const result = new Map<string, string>()
  const indexTemplateFile = path.resolve(__dirname, "../runtime/index-template.ts")
  let references = ""
  for (const file of fileNames) {
    references += `/// <reference path="./generated/${file}.d.ts" />\n`
  }
  const indexFileContent = fs.readFileSync(indexTemplateFile, "utf8").replace("// generated\n", (m) => m + references)
  result.set("runtime/index.d.ts", indexFileContent)

  return result
}
