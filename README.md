# Typed Factorio

Complete and featureful typescript definitions for the Factorio modding lua api. This is intended to be used with [TypescriptToLua](https://typescripttolua.github.io/).

This project aims to provide type definitions for the Factorio lua API that are as complete as possible. This means no `any`s or `unknown`s, correct nullability, and lots of smart type features. The generator integrates both the Factorio JSON api docs and manually defined additions and overrides.

## Installation

To use in your TypescriptToLua project:

1. Install this package

```
npm install typed-factorio

or

yarn add typed-factorio
```

2. Add to your `tsconfig.json`:

```diff
{
  "compilerOptions": {
+    "types": [ "typed-factorio/runtime" ]
  }
}
```

This will add the types for the runtime stage to your entire project.

Note: When types are updated, or released for a new factorio version, you will need update your package version to get the types.

### Settings and data stage

There are also definitions for the settings/data stage.

To avoid type conflicts, the global tables for the settings/data stages have to be declared manually where you need them. These types can be imported from `typed-factorio/data/types` or `typed-factorio/settings/types`.

Example:

```ts
import { Data, Mods } from "typed-factorio/data/types"
// or
import { Data, Mods } from "typed-factorio/settings/types"

declare const data: Data
declare const mods: Mods

data.extend([{ ... }])
```

There are currently full types for settings stage, but only basic types for the data stage.

### Factorio lualib modules

Currently, there are types for the following modules:

- `util`
- `mod-gui`

If you have a need for types to more lualib modules, feel free to open an issue or pull request on GitHub.

### The `global` table

The `global` table is just a lua table which can have any shape the mod desires, so it is not defined in typed-factorio. Instead, you can either:

- add `declare const global: <Your type>` in a `.d.ts` file included in your project, to apply it project-wide, or
- add `declare const global: {...}` to each module/file where needed. This way, you can also only define attributes that each module/file specifically uses.

## Type features

Here is a quick overview of type features:

### Nullability

The types consistently use `undefined` to represent `nil`.

A class attribute is marked as possibly undefined only if the _read_ type is possibly `nil`. For properties where `nil` is not possible on _read_, but possible on _write_, you can write `nil` by using `undefined!` or `myNullableValue!`, e.g. `controlBehavior.parameters = undefined!`.

### Parameter Variants

Parameters with variants (with "additional fields can be specified depending on type ...") are defined as a union of all variants. The type for a specific variant is prefixed with the variant name, or "Other" types variants without extra properties (e.g. `AmmoDamageTechnologyModifier`, `OtherTechnologyModifier`).

### Events

Event IDs (`defines.events`) carry information about their event type and possible filters, which is used by the various methods on `script`.
You can pass a type parameter to `script.generate_event_name<T>()`, and it will return an `EventId` that holds type info of the event data.

### Array-like classes

Classes that have an index operator, a length operator, and have an array-like structure, inherit from `(Readonly)Array`. These are `LuaInventory`, `LuaFluidBox`, `LuaTransportLine`. This allows you to use these classes like arrays, meaning having array methods, and `.length` translating to the lua length operator. However, this also means, like typescript arrays, they are **0-indexed, not 1-indexed**.

### Table-or-array concepts, and "Read" variants

For table-or-array types (e.g. Position), there also are types such as `PositionTable` and `PositionArray` that refer to the table or array form.

Table-or-array types will appear in Table form when known to be in a read position. This also applies to other concepts/types that have table-or-array attributes.

For some concepts, there is also a special form for when it is used in a "read" position, where all table-or-array types are in Table form. These types are suffixed with `Read`, e.g. `ScriptPositionRead`, `BoundingBoxRead`.

### Classes with subclasses

Some classes have attributes that are documented to only work for particular subclasses. For these classes, e.g. `LuaEntity`, there are specific types that you can _optionally_ use:

- a "Base" type, e.g. `BaseEntity`, which only contains members usable by all subclasses
- individual subclass types, e.g. `CraftingMachineEntity`, which extends the base type with members specific to that subclass.

The simple class name, e.g. `LuaEntity`, contains attributes for _all_ subclasses.

For stricter types, use the `Base` type generally, and the specific subclass type when needed.
You can also create your own type-narrowing functions, like so:

```ts
function isCraftingMachineEntity(entity: LuaEntity): entity is CraftingMachineEntity {
  return entity.type === "crafting-machine"
}
```

### LuaGuiElement

`LuaGuiElement` is broken up into a [discriminated union](https://basarat.gitbook.io/typescript/type-system/discriminated-unions), with a separate type for each gui element type. Individual gui element types can be referred to by `<Type>GuiElement`, e.g. `ButtonGuiElement`.

Similarly, the table passed to `LuaGuiElement.add`, referred to as `GuiSpec`, is also broken up into a discriminated union. The type for a specific GuiSpec is `<Type>GuiSpec`, e.g. `ListBoxGuiSpec`. `LuaGuiElement.add` will return the appropriate gui element type corresponding to the gui spec type received.

This is done both to provide more accurate types, and for possible integration with [JSX](https://typescripttolua.github.io/docs/jsx/).

### Strict index types

This is a recommended **opt-in** feature. To opt in, add `"typed-factorio/strict-index-types"` to `compilerOptions > types` in your tsconfig.json (in addition to `"typed-factorio/runtime"`).

Some `uint` types which represent unique indices, e.g. player_index, entity_number, can be "branded" numbers with their own type, e.g. `PlayerIndex` and `EntityNumber`. If opted-in, these index-types will be still assignable to `number`, but a plain `number` is not directly assignable to them. This helps ensure correctness.
You can use these types as keys in an index signature, e.g. `{ [index: PlayerIndex]: "foo" }`.
You can cast "plain" numbers to these types, e.g. `1 as PlayerIndex`, do this with caution.
