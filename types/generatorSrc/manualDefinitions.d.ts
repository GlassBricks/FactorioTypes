type uint = number
type double = number
type float = number
type table = LuaTable | Record<any, any>

declare namespace defines {
  const prototypes: {
    readonly [Type in string]?: {
      readonly [Name in string]?: 0 & { _notFalsyBrand: any }
    }
  }

  namespace difficulty_settings {
    enum recipe_difficulty {}

    enum technology_difficulty {}
  }
  enum circuit_connector_id {}
  enum gui_type {}
  enum rail_direction {}
}

// classes
type LuaCustomTable<K extends keyof any, V> = {
  [P in K]: V
}

interface LuaLazyLoadedValue<T> {
  get(): T
}

interface LuaPlayer {}

interface LuaEntity {
  get_driver(): LuaEntity | LuaPlayer | undefined
  get_passenger(): LuaEntity | LuaPlayer | undefined
  initial_amount: uint | undefined

  revive(): LuaMultiReturn<[Record<string, uint>, LuaEntity | undefined, LuaEntity | undefined]>
  silent_revive(): LuaMultiReturn<[Record<string, uint>, LuaEntity | undefined, LuaEntity | undefined]>

  get_rail_segment_end(direction: defines.rail_direction): LuaMultiReturn<[LuaEntity, defines.rail_direction]>
}

interface Fluid {}

interface LuaFluidBox extends Array<Fluid | undefined> {}

type GuiElementType =
  | "choose-elem-button"
  | "drop-down"
  | "empty-widget"
  | "entity-preview"
  | "list-box"
  | "scroll-pane"
  | "sprite-button"
  | "tabbed-pane"
  | "text-box"
  | "button"
  | "camera"
  | "checkbox"
  | "flow"
  | "frame"
  | "label"
  | "line"
  | "minimap"
  | "progressbar"
  | "radiobutton"
  | "slider"
  | "sprite"
  | "switch"
  | "tab"
  | "table"
  | "textfield"

interface BaseGuiSpec {
  readonly type: GuiElementType
}
interface FlowGuiSpec {
  readonly direction?: "horizontal" | "vertical"
}
interface FrameGuiSpec {
  readonly direction?: "horizontal" | "vertical"
}
interface LineGuiSpec {
  readonly direction?: "horizontal" | "vertical"
}

interface SignalID {}

type ChooseElemButtonType =
  | "item"
  | "tile"
  | "entity"
  | "signal"
  | "fluid"
  | "recipe"
  | "decorative"
  | "item-group"
  | "achievement"
  | "equipment"
  | "technology"

interface ChooseElemButtonFilters {
  item: ItemPrototypeFilter[]
  tile: TilePrototypeFilter[]
  entity: EntityPrototypeFilter[]
  signal: never
  fluid: FluidPrototypeFilter[]
  recipe: RecipePrototypeFilter[]
  decorative: DecorativePrototypeFilter[]
  "item-group": never
  achievement: AchievementPrototypeFilter[]
  equipment: EquipmentPrototypeFilter[]
  technology: TechnologyPrototypeFilter[]
}

interface BaseChooseElemButtonSpec extends BaseGuiSpec {
  readonly type: "choose-elem-button"
  /** The type of the button - one of the following values. */
  readonly elem_type: ChooseElemButtonType
  /** Filters describing what to show in the selection window. See {@link LuaGuiElement.elem_filters LuaGuiElement::elem_filters}. */
  readonly filters?: ChooseElemButtonFilters[this["elem_type"]]
}

interface ItemChooseElemButtonSpec extends BaseChooseElemButtonSpec {
  readonly elem_type: "item"
  /** If type is `"item"` - the default value for the button. */
  readonly item?: string
}

interface TileChooseElemButtonSpec extends BaseChooseElemButtonSpec {
  readonly elem_type: "tile"
  /** If type is `"tile"` - the default value for the button. */
  readonly tile?: string
}

interface EntityChooseElemButtonSpec extends BaseChooseElemButtonSpec {
  readonly elem_type: "entity"
  /** If type is `"entity"` - the default value for the button. */
  readonly entity?: string
}

interface SignalChooseElemButtonSpec extends BaseChooseElemButtonSpec {
  readonly elem_type: "signal"
  /** If type is `"signal"` - the default value for the button. */
  readonly signal?: SignalID
}

interface FluidChooseElemButtonSpec extends BaseChooseElemButtonSpec {
  readonly elem_type: "fluid"
  /** If type is `"fluid"` - the default value for the button. */
  readonly fluid?: string
}

interface RecipeChooseElemButtonSpec extends BaseChooseElemButtonSpec {
  readonly elem_type: "recipe"
  /** If type is `"recipe"` - the default value for the button. */
  readonly recipe?: string
}

interface DecorativeChooseElemButtonSpec extends BaseChooseElemButtonSpec {
  readonly elem_type: "decorative"
  /** If type is `"decorative"` - the default value for the button. */
  readonly decorative?: string
}

interface ItemGroupChooseElemButtonSpec extends BaseChooseElemButtonSpec {
  readonly elem_type: "item-group"
  /** If type is `"item-group"` - the default value for the button. */
  readonly "item-group"?: string
}

interface AchievementChooseElemButtonSpec extends BaseChooseElemButtonSpec {
  readonly elem_type: "achievement"
  /** If type is `"achievement"` - the default value for the button. */
  readonly achievement?: string
}

interface EquipmentChooseElemButtonSpec extends BaseChooseElemButtonSpec {
  readonly elem_type: "equipment"
  /** If type is `"equipment"` - the default value for the button. */
  readonly equipment?: string
}

interface TechnologyChooseElemButtonSpec extends BaseChooseElemButtonSpec {
  readonly elem_type: "technology"
  /** If type is `"technology"` - the default value for the button. */
  readonly technology?: string
}

type ChooseElemButtonGuiSpec =
  | ItemChooseElemButtonSpec
  | TileChooseElemButtonSpec
  | EntityChooseElemButtonSpec
  | SignalChooseElemButtonSpec
  | FluidChooseElemButtonSpec
  | RecipeChooseElemButtonSpec
  | DecorativeChooseElemButtonSpec
  | ItemGroupChooseElemButtonSpec
  | AchievementChooseElemButtonSpec
  | EquipmentChooseElemButtonSpec
  | TechnologyChooseElemButtonSpec

interface GuiSpec {
  type
}

/** @discriminatedUnion type */
type LuaGuiElement = {
  readonly [name: string]: LuaGuiElement | undefined
} & {
  readonly type: GuiElementType

  /** @variantsName GuiSpec */
  add<Spec extends GuiSpec>(element: Spec): Extract<LuaGuiElement, { type: Spec["type"] }>

  readonly elem_type: ChooseElemButtonType
  // @ts-ignore
  elem_value: (this["elem_type"] extends "signal" ? SignalID : string) | undefined
  // @ts-ignore
  elem_filters: ChooseElemButtonFilters[this["elem_type"]] | undefined

  /** @subclasses dropdown list-box */
  clear_items()
  /** @subclasses dropdown list-box */
  get_item()
  /** @subclasses dropdown list-box */
  set_item()
  /** @subclasses dropdown list-box */
  add_item()
  /** @subclasses dropdown list-box */
  remove_item()
  /** @subclasses slider */
  get_slider_minimum()
  /** @subclasses slider */
  get_slider_maximum()
  /** @subclasses slider */
  set_slider_minimum_maximum()
  /** @subclasses slider */
  get_slider_value_step()
  /** @subclasses slider */
  get_slider_discrete_slider()
  /** @subclasses slider */
  get_slider_discrete_values()
  /** @subclasses slider */
  set_slider_value_step()
  /** @subclasses slider */
  set_slider_discrete_slider()
  /** @subclasses slider */
  set_slider_discrete_values()
  /** @subclasses sprite-button sprite */
  sprite
  /** @subclasses sprite-button sprite */
  resize_to_sprite
  /** @subclasses sprite-button */
  clicked_sprite
  /** @subclasses dropdown list-box */
  items
  /** @subclasses dropdown list-box */
  selected_index
  /** @subclasses sprite-button */
  number
  /** @subclasses sprite-button */
  show_percent_for_small_numbers
  /** @subclasses camera minimap */
  position
  /** @subclasses camera minimap */
  surface_index
  /** @subclasses camera minimap */
  zoom
  /** @subclasses minimap */
  force
  /** @subclasses button sprite-button */
  mouse_button_filter
  /** @subclasses flow frame label table empty-widget */
  drag_target: LuaGuiElement | undefined
  /** @subclasses tabbed-pane */
  readonly tabs
  /** @subclasses entity-preview camera minimap */
  entity
}

interface LuaItemStack {
  durability: double | undefined
}

interface LuaInventory extends ReadonlyArray<LuaItemStack> {
  find_item_stack(item: string): LuaMultiReturn<[undefined] | [LuaItemStack, uint]>
  find_empty_stack(item?: string): LuaMultiReturn<[undefined] | [LuaItemStack, uint]>
}

interface LuaTransportLine extends ReadonlyArray<LuaItemStack> {}

interface ChunkPositionAndArea {}
interface LuaChunkIterator extends LuaIterable<ChunkPositionAndArea> {}

interface LuaPermissionGroup {}
interface LuaPermissionGroups {
  create_group(name?: string): LuaPermissionGroup | undefined
}

interface LuaPlayer {
  readonly cutscene_character: LuaEntity | undefined
}

// concepts
type LocalisedString = [string, ...LocalisedString[]] | string | number

type RealOrientation = float

type Tags = Record<string, AnyBasic | undefined>

interface PositionTable {}
interface PositionArray {}
interface Position {}
type Vector = PositionArray

// last updated 1.1.37
interface MapSettings {
  readonly pollution: {
    enabled: boolean
    /**
     * These are values for 60 ticks (1 simulated second)
     *
     * (possibly repeated for other directions as well)
     */
    diffusion_ratio: number
    /** This much PUs must be on the chunk to start diffusing */
    min_to_diffuse: number
    /** Constant modifier a percentage of 1 - the pollution eaten by a chunks tiles */
    ageing: number
    /** Anything bigger than this is visualised as this value */
    expected_max_per_chunk: number
    /** Anything lower than this (but > 0) is visualised as this value */
    min_to_show_per_chunk: number
    min_pollution_to_damage_trees: number
    pollution_with_max_forest_damage: number
    pollution_per_tree_damage: number
    pollution_restored_per_tree_damage: number
    max_pollution_to_restore_trees: number
    enemy_attack_pollution_consumption_modifier: number
  }

  readonly enemy_evolution: {
    enabled: boolean
    /** Percentual increase in the evolve factor for every second (60 ticks) */
    time_factor: number
    /** Percentual increase in the evolve factor for every destroyed spawner */
    destroy_factor: number
    /** Percentual increase in the evolve factor for 1 pollution unit */
    pollution_factor: number
  }

  readonly enemy_expansion: {
    enabled: boolean
    /**
     * Distance in chunks from the furthest base around.
     *
     * Player's territory
     */
    max_expansion_distance: number

    friendly_base_influence_radius: number
    enemy_building_influence_radius: number

    /**
     * A candidate chunk's score is given as follows:
     *
     * And includes the central chunk as well. distance is the Manhattan distance, and ^ signifies exponentiation.
     */
    building_coefficient: number
    other_base_coefficient: number
    neighbouring_chunk_coefficient: number
    neighbouring_base_chunk_coefficient: number

    /**
     * A chunk has to have at most this much percent unbuildable tiles for it to be considered a candidate.
     *
     * This is to avoid chunks full of water to be marked as candidates.
     */
    max_colliding_tiles_coefficient: number

    /**
     * Size of the group that goes to build new base (in game this is multiplied by the
     *
     * Evolution factor).
     */
    settler_group_min_size: number
    settler_group_max_size: number

    /**
     * Ticks to expand to a single
     *
     * Where lerp is the linear interpolation function, and e is the current evolution factor.
     */
    min_expansion_cooldown: number
    max_expansion_cooldown: number
  }

  readonly unit_group: {
    /** Pollution triggered group waiting time is a random time between min and max gathering time */
    min_group_gathering_time: number
    max_group_gathering_time: number
    /**
     * After the gathering is finished the group can still wait for late members,
     *
     * But it doesn't accept new ones anymore
     */
    max_wait_time_for_late_members: number
    /** Limits for group radius (calculated by number of numbers) */
    max_group_radius: number
    min_group_radius: number
    /** When a member falls behind the group he can speedup up till this much of his regular speed */
    max_member_speedup_when_behind: number
    /** When a member gets ahead of its group, it will slow down to at most this factor of its speed */
    max_member_slowdown_when_ahead: number
    /** When members of a group are behind, the entire group will slow down to at most this factor of its max speed */
    max_group_slowdown_factor: number
    /** If a member falls behind more than this times the group radius, the group will slow down to max_group_slowdown_factor */
    max_group_member_fallback_factor: number
    /** If a member falls behind more than this time the group radius, it will be removed from the group. */
    member_disown_distance: number
    tick_tolerance_when_member_arrives: number

    /** Maximum number of automatically created unit groups gathering for attack at any time. */
    max_gathering_unit_groups: number

    /**
     * Maximum size of an attack unit group. This only affects automatically-created unit groups;
     *
     * Manual groups created through the API are unaffected.
     */
    max_unit_group_size: number
  }

  readonly steering: {
    readonly default: {
      /** Not including the radius of the unit */
      radius: number
      separation_force: number
      separation_factor: number
      force_unit_fuzzy_goto_behavior: boolean
    }
    readonly moving: {
      radius: number
      separation_force: number
      separation_factor: number
      /** Used only for special "to look good" purposes (like in trailer) */
      force_unit_fuzzy_goto_behavior: boolean
    }
  }

  readonly path_finder: {
    /** Defines whether we prefer forward (>1) or backward (<1) or symmetrical (1) search */
    fwd2bwd_ratio: number
    /**
     * When comparing nodes in open which one to check next
     *
     * The higher the number the more is the search directed directly towards the goal
     */
    goal_pressure_ratio: number
    /** How many nodes can be expanded at most per tick. */
    max_steps_worked_per_tick: number
    /** How much work each pathfinding job is allowed to do per tick. */
    max_work_done_per_tick: number
    /** Path cache settings */
    use_path_cache: boolean
    /** Number of elements in the cache */
    short_cache_size: number
    long_cache_size: number
    /** Minimal distance to goal for path to be searched in short path cache */
    short_cache_min_cacheable_distance: number
    /** Minimal number of algorithm steps for path to be inserted into the short path cache */
    short_cache_min_algo_steps_to_cache: number
    /** Minimal distance to goal for path to be searched in long path cache */
    long_cache_min_cacheable_distance: number
    /** When searching for connection to path cache path, search at most for this number of steps times the initial estimate */
    cache_max_connect_to_cache_steps_multiplier: number
    /** When looking for path from cache make sure it doesn't start too far from requested start in relative distance terms */
    cache_accept_path_start_distance_ratio: number
    /**
     * When looking for path from cache make sure it doesn't end too far from requested end this is typically higher
     * than accept value for the start because the end target can be moving
     */
    cache_accept_path_end_distance_ratio: number
    /** Same as cache_accept_path_start_distance_ratio, but used for negative cache queries */
    negative_cache_accept_path_start_distance_ratio: number
    /** Same as cache_accept_path_end_distance_ratio, but used for negative cache queries */
    negative_cache_accept_path_end_distance_ratio: number
    /** When assigning rating to the best path this * start distances is considered */
    cache_path_start_distance_rating_multiplier: number
    /**
     * When assigning rating to the best path this * end distances is considered
     *
     * This is typically higher than value for the start to achieve better path end quality
     */
    cache_path_end_distance_rating_multiplier: number

    /**
     * Somewhere along the path is stuck enemy we need to avoid
     *
     * Then units further in the back will use this and run around the target
     */
    stale_enemy_with_same_destination_collision_penalty: number
    /** If there is a moving unit further than this we don't really care */
    ignore_moving_enemy_collision_distance: number
    /** Enemy is not moving/or is too close and has different destination */
    enemy_with_different_destination_collision_penalty: number
    /** Simplification for now - collision with everything else is this */
    general_entity_collision_penalty: number
    /** Collision penalty for successors of positions that require destroy to reach */
    general_entity_subsequent_collision_penalty: number
    /** Collision penalty for collisions in the extended bounding box but outside the entity's actual bounding box */
    extended_collision_penalty: number
    /** Until this amount any client will be served by the path finder (no estimate on the path length) */
    max_clients_to_accept_any_new_request: number
    /** From max_clients_to_accept_any_new_request till this one only those that have a short estimate will be served */
    max_clients_to_accept_short_new_request: number
    /** This is the "threshold" to decide what is short and what is not */
    direct_distance_to_consider_short_request: number
    /** If a short request takes more than this many steps, it will be rescheduled as a long request */
    short_request_max_steps: number
    /** How many steps will be allocated to short requests each tick, as a ratio of all available steps per tick */
    short_request_ratio: number
    /** Absolute minimum of steps that will be performed for every path find request no matter what */
    min_steps_to_check_path_find_termination: number
    /** If the amount of steps is higher than this times estimate of start to goal then path finding is terminated */
    start_to_goal_cost_multiplier_to_terminate_path_find: number
    /**
     * When the number of waiting clients exceeds certain values, the per-tick work limit will be increased by the
     *
     * Overload_levels and overload_multipliers must be the same length.
     */
    overload_levels: number[]
    /**
     * When the number of waiting clients exceeds certain values, the per-tick work limit will be increased by the
     *
     * Overload_levels and overload_multipliers must be the same length.
     */
    overload_multipliers: number[]
    /** The score of all paths in the negative cache is decreased by one every this many ticks. */
    negative_path_cache_delay_interval: number
  }

  /**
   * If a behavior fails this many times, the enemy (or enemy group)
   *
   * This solves biters stuck within their own base.
   */
  max_failed_behavior_count: number
}

type MapGenSize =
  | number
  | "none"
  | "very-low"
  | "very-small"
  | "very-poor"
  | "low"
  | "small"
  | "poor"
  | "normal"
  | "medium"
  | "regular"
  | "high"
  | "big"
  | "good"
  | "very-high"
  | "very-big"
  | "very-good"

interface ArithmeticCombinatorParameters {
  readonly operation?: "*" | "/" | "+" | "-" | "%" | "^" | "<<" | ">>" | "AND" | "OR" | "XOR"
}

type SpriteType =
  | "item"
  | "entity"
  | "technology"
  | "recipe"
  | "item-group"
  | "fluid"
  | "tile"
  | "virtual-signal"
  | "achievement"
  | "equipment"
  | "file"
  | "utility"
type SpritePath = string | `${SpriteType}/${string}`

type SoundType =
  | "utility"
  | "ambient"
  | "tile-walking"
  | "tile-mined"
  | "tile-build-small"
  | "tile-build-medium"
  | "tile-build-large"
  | "entity-build"
  | "entity-mined"
  | "entity-mining"
  | "entity-vehicle_impact"
  | "entity-rotated"
  | "entity-open"
  | "entity-close"
type SoundPath = string | `${SoundType}/${string}`

type CollisionMaskLayer =
  | "ground-tile"
  | "water-tile"
  | "resource-layer"
  | "doodad-layer"
  | "floor-layer"
  | "item-layer"
  | "ghost-layer"
  | "object-layer"
  | "player-layer"
  | "train-layer"
  | "rail-layer"
  | "transport-belt-layer"
  | "not-setup"
  | `layer-${number}`

type CollisionMask = {
  readonly [P in CollisionMaskLayer]?: true
}

type CollisionMaskWithFlags = {
  readonly [P in
    | CollisionMaskLayer
    | "not-colliding-with-itself"
    | "consider-tile-transitions"
    | "colliding-with-tiles-only"]?: true
}

type TriggerTargetMask = {
  readonly [P in string]?: true
}

type CircularProjectileCreationSpecification = [RealOrientation, Vector]

type AnyBasic =
  | string
  | number
  | boolean
  | LuaTable
  | {
      [K in keyof any]: AnyBasic | undefined
    }

type Any = any

type MouseButtonFlag =
  | "left"
  | "right"
  | "middle"
  | "button-4"
  | "button-5"
  | "button-6"
  | "button-7"
  | "button-8"
  | "button-9"

type MouseButtonFlagsTable = {
  readonly [P in MouseButtonFlag]?: true
}
type MouseButtonFlagsArray = readonly (MouseButtonFlag | "left-and-right")[]
/** @tableOrArray */
type MouseButtonFlags = MouseButtonFlagsTable | MouseButtonFlagsArray

type RenderLayer =
  | number
  | `${number}`
  | "water-tile"
  | "ground-tile"
  | "tile-transition"
  | "decals"
  | "lower-radius-visualization"
  | "radius-visualization"
  | "transport-belt-integration"
  | "resource"
  | "building-smoke"
  | "decorative"
  | "ground-patch"
  | "ground-patch-higher"
  | "remnants"
  | "floor"
  | "transport-belt"
  | "transport-belt-endings"
  | "floor-mechanics-under-corpse"
  | "corpse"
  | "floor-mechanics"
  | "item"
  | "lower-object"
  | "transport-belt-circuit-connector"
  | "lower-object-above-shadow"
  | "object"
  | "higher-object-under"
  | "higher-object-above"
  | "item-in-inserter-hand"
  | "wires"
  | "wires-above"
  | "entity-info-icon"
  | "entity-info-icon-above"
  | "explosion"
  | "projectile"
  | "smoke"
  | "air-object"
  | "air-entity-info-icon"
  | "light-effect"
  | "selection-box"
  | "higher-selection-box"
  | "collision-selection-box"
  | "arrow"
  | "cursor"

interface LuaEntityClonedEventFilter {}
interface LuaEntityDamagedEventFilter {}
interface LuaPlayerMinedEntityEventFilter {}
interface LuaPreRobotMinedEntityEventFilter {}
interface LuaRobotBuiltEntityEventFilter {}
interface LuaPostEntityDiedEventFilter {}
interface LuaEntityDiedEventFilter {}
interface LuaScriptRaisedReviveEventFilter {}
interface LuaPrePlayerMinedEntityEventFilter {}
interface LuaEntityMarkedForDeconstructionEventFilter {}
interface LuaPreGhostDeconstructedEventFilter {}
interface LuaEntityDeconstructionCancelledEventFilter {}
interface LuaEntityMarkedForUpgradeEventFilter {}
interface LuaSectorScannedEventFilter {}
interface LuaRobotMinedEntityEventFilter {}
interface LuaScriptRaisedDestroyEventFilter {}
interface LuaUpgradeCancelledEventFilter {}
interface LuaScriptRaisedBuiltEventFilter {}
interface LuaPlayerBuiltEntityEventFilter {}
interface LuaPlayerRepairedEntityEventFilter {}

// todo: special types for events
type EventFilter =
  | LuaEntityClonedEventFilter[]
  | LuaEntityDamagedEventFilter[]
  | LuaPlayerMinedEntityEventFilter[]
  | LuaPreRobotMinedEntityEventFilter[]
  | LuaRobotBuiltEntityEventFilter[]
  | LuaPostEntityDiedEventFilter[]
  | LuaEntityDiedEventFilter[]
  | LuaScriptRaisedReviveEventFilter[]
  | LuaPrePlayerMinedEntityEventFilter[]
  | LuaEntityMarkedForDeconstructionEventFilter[]
  | LuaPreGhostDeconstructedEventFilter[]
  | LuaEntityDeconstructionCancelledEventFilter[]
  | LuaEntityMarkedForUpgradeEventFilter[]
  | LuaSectorScannedEventFilter[]
  | LuaRobotMinedEntityEventFilter[]
  | LuaScriptRaisedDestroyEventFilter[]
  | LuaUpgradeCancelledEventFilter[]
  | LuaScriptRaisedBuiltEventFilter[]
  | LuaPlayerBuiltEntityEventFilter[]
  | LuaPlayerRepairedEntityEventFilter[]

// concept modifications

// where a vector is supposed to be not a vector

interface SmokeSource {
  readonly position?: PositionTable
  readonly north_position?: PositionTable
  readonly east_position?: PositionTable
  readonly south_position?: PositionTable
  readonly west_position?: PositionTable
}

interface FluidBoxConnection {
  readonly positions: PositionTable[]
}

interface CircularParticleCreationSpecification {
  readonly center: PositionTable
}

// additional types

interface MapGenSettings {}

/**
 * A map gen preset. Used in {@link https://wiki.factorio.com/Prototype/MapGenPresets Prototype/MapGenPresets}.
 *
 * {@link https://wiki.factorio.com/Types/MapGenPreset View Documentation}
 */
interface MapGenPreset {
  /** Specifies the ordering the map generator gui. */
  order: string
  /** Whether this is the default preset. If set to boolean, this preset may not have any other properties besides this and order. */
  default?: boolean
  /**
   * This is a table with the below key/value pairs. All key/value pairs are optional. If not set they will just use the
   * default values.
   */
  basic_settings: Partial<MapGenSettings>
  /**
   * This is a table with the below key/value pairs. All key/value pairs are optional, if not set they will just use the
   * existing values.
   */
  readonly advanced_settings: {
    readonly pollution?: {
      enabled?: boolean
      /** Must be <= 0.25. */
      diffusion_ratio?: double
      /** Also known as dissipation rate. Must be >= 0.5. */
      ageing?: double
      enemy_attack_pollution_consumption_modifier?: double
      min_pollution_to_damage_trees?: double
      pollution_restored_per_tree_damage?: double
    }
    readonly enemy_evolution?: {
      enabled?: boolean
      time_factor?: double
      destroy_factor?: double
      pollution_factor?: double
    }
    readonly enemy_expansion?: {
      enabled?: boolean
      max_expansion_distance?: double
      settler_group_min_size?: double
      settler_group_max_size?: double
      /** In ticks. */
      min_expansion_cooldown?: double
      /** In ticks. */
      max_expansion_cooldown?: double
    }
    readonly difficulty_settings?: {
      recipe_difficulty?: defines.difficulty_settings.recipe_difficulty
      technology_difficulty?: defines.difficulty_settings.technology_difficulty
      technology_price_multiplier?: double
      research_queue_setting?: "after-victory" | "always" | "never"
    }
  }
}

interface ItemPrototypeFilter {}
interface TilePrototypeFilter {}
interface EntityPrototypeFilter {}
interface FluidPrototypeFilter {}
interface RecipePrototypeFilter {}
interface DecorativePrototypeFilter {}
interface AchievementPrototypeFilter {}
interface EquipmentPrototypeFilter {}
interface TechnologyPrototypeFilter {}

// last updated 1.1.37
/**
 * Object containing information about the connections to other entities formed by red or green wires.
 *
 * {@link https://wiki.factorio.com/Blueprint_string_format#Connection_object View Documentation}
 */
interface BlueprintCircuitConnection {
  /** First connection point. The default for everything that doesn't have multiple connection points. */
  "1"?: BlueprintConnectionPoint
  /** Second connection point. For example, the "output" part of an arithmetic combinator. */
  "2"?: BlueprintConnectionPoint
}
/**
 * The actual point where a wire is connected to. Contains information about where it is connected to.
 *
 * {@link https://wiki.factorio.com/Blueprint_string_format#Connection_point_object View Documentation}
 */
interface BlueprintConnectionPoint {
  /**
   * An array of {@link BlueprintConnectionData Connection data object} containing all the connections from this point
   * created by red wire.
   */
  red?: BlueprintConnectionData[]
  /**
   * An array of {@link BlueprintConnectionData Connection data object} containing all the connections from this point
   * created by green wire.
   */
  green?: BlueprintConnectionData[]
}
/**
 * Information about a single connection between two connection points.
 *
 * {@link https://wiki.factorio.com/Blueprint_string_format#Connection_data_object View Documentation}
 */
interface BlueprintConnectionData {
  /** ID of the entity this connection is connected with. */
  entity_id: uint
  /** The circuit connector id of the entity this connection is connected to, see {@link defines.circuit_connector_id} */
  circuit_id?: defines.circuit_connector_id
}

/** There are not yet full definitions for this type. See {@link https://lua-api.factorio.com/1.1.36/LuaControlBehavior.html}. */
type BlueprintControlBehavior = unknown
