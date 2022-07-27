import chalk from "chalk"
import ts from "typescript"
import { Class, Concept, Define, Event, FactorioApiJson } from "./FactorioApiJson"
import { processManualDefinitions } from "./manualDefinitions"

export default class GenerationContext {
  readonly manualDefinitions = processManualDefinitions(this.manualDefinitionsSource)

  builtins = new Set(this.apiDocs.builtin_types.map((e) => e.name))
  defines = new Map<string, Define>()
  events = new Map<string, Event>(this.apiDocs.events.map((e) => [e.name, e]))
  classes = new Map<string, Class>(this.apiDocs.classes.map((e) => [e.name, e]))
  concepts = new Map<string, Concept>(this.apiDocs.concepts.map((e) => [e.name, e]))
  globalObjects = new Set<string>(this.apiDocs.global_objects.map((e) => e.name))

  numericTypes = new Set<string>()
  // This is also a record of which types exist
  typeNames: Record<string, string> = {}

  addBefore = new Map<string, ts.Statement[]>()
  addAfter = new Map<string, ts.Statement[]>()
  addTo = new Map<string, ts.Statement[]>()

  hasWarnings: boolean = false

  constructor(
    readonly apiDocs: FactorioApiJson,
    readonly manualDefinitionsSource: ts.SourceFile,
    readonly checker: ts.TypeChecker
  ) {
    if (apiDocs.application !== "factorio") {
      throw new Error("Unsupported application " + apiDocs.application)
    }
    if (apiDocs.api_version !== 3) {
      throw new Error("Unsupported api version " + apiDocs.api_version)
    }
  }

  tryGetStringEnumType(typeNode: ts.TypeNode): string[] | undefined {
    if (ts.isUnionTypeNode(typeNode)) {
      if (typeNode.types.some((t) => !ts.isLiteralTypeNode(t) || !ts.isStringLiteral(t.literal))) return undefined
      return typeNode.types.map((t) => ((t as ts.LiteralTypeNode).literal as ts.StringLiteral).text)
    }

    let type = this.checker.getTypeFromTypeNode(typeNode)
    while (!type.isUnion() && type.symbol) {
      type = this.checker.getDeclaredTypeOfSymbol(type.symbol)
    }
    if (type.isUnion() && type.types.every((t) => t.isStringLiteral())) {
      return type.types.map((t) => (t as ts.StringLiteralType).value)
    }
    return undefined
  }

  warning(...args: unknown[]) {
    console.log(chalk.yellow(...args))
    this.hasWarnings = true
  }
}
