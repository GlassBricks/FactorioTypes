// This is an auto-generated file. Do not edit directly!

/** @noSelfInFile */


import type { LuaBootstrap, LuaCommandProcessor, LuaGameScript, LuaHelpers, LuaPrototypes, LuaRCON, LuaRemote, LuaRendering } from "factorio:runtime"

declare global {
    /**
     * The main scripting interface through which most of the API is accessed.
     * @see {@link https://lua-api.factorio.com/2.0.12/index-runtime.html Online documentation}
     */
    const game: LuaGameScript;
    /**
     * Provides an interface for registering game event handlers.
     * @see {@link https://lua-api.factorio.com/2.0.12/index-runtime.html Online documentation}
     */
    const script: LuaBootstrap;
    /**
     * Allows registration of custom commands for the in-game console.
     * @see {@link https://lua-api.factorio.com/2.0.12/index-runtime.html Online documentation}
     */
    const commands: LuaCommandProcessor;
    /**
     * Provides access to various helper and utility functions.
     * @see {@link https://lua-api.factorio.com/2.0.12/index-runtime.html Online documentation}
     */
    const helpers: LuaHelpers;
    /**
     * Allows read-only access to prototypes.
     * @see {@link https://lua-api.factorio.com/2.0.12/index-runtime.html Online documentation}
     */
    const prototypes: LuaPrototypes;
    /**
     * Allows printing messages to the calling RCON instance, if any.
     * @see {@link https://lua-api.factorio.com/2.0.12/index-runtime.html Online documentation}
     */
    const rcon: LuaRCON;
    /**
     * Allows registration and use of functions to communicate between mods.
     * @see {@link https://lua-api.factorio.com/2.0.12/index-runtime.html Online documentation}
     */
    const remote: LuaRemote;
    /**
     * Allows rendering of geometric shapes, text and sprites in the game world.
     * @see {@link https://lua-api.factorio.com/2.0.12/index-runtime.html Online documentation}
     */
    const rendering: LuaRendering;
    //The "settings" global is declared in common/settings-global.d.ts; its runtime type is handled below.
    ;
}

