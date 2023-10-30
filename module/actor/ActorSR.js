import {
  CHARACTER_ACTOR_TYPES,
  CHARACTER_SHEET_TABS,
  ErrorSR,
  tupleHasValue,
} from "../utils/utils.js";
import { ActorInventory } from "./Inventory/ActorInventory.js";
import { ActorConditions } from "./conditions.js";
import { TokenEffect } from "./token-effect.js";
export class ActorSR extends Actor {
  get hasPlayerOwner() {
    return game.users.some(
      (u) => !u.isGM && this.testUserPermission(u, "OWNER")
    );
  }
  get temporaryEffects() {
    const fromConditions = this.conditions.active.map(
      (c) => new TokenEffect(c)
    );

    return [...super.temporaryEffects, ...fromConditions];
  }
  isOfType(...types) {
    return types.some((t) =>
      "character" === t
        ? (0, tupleHasValue)(CHARACTER_ACTOR_TYPES, this.type)
        : this.type === t
    );
  }
  _initialize(options) {
    this.conditions = new ActorConditions();
    super._initialize(options);
  }
  prepareBaseData() {
    var _a, _b, _c, _d, _e, _f, _g;
    super.prepareBaseData();
    const { flags } = this;
    this.flags.shaanRenaissance = mergeObject(
      null !== (_a = this.flags.shaanRenaissance) && void 0 !== _a ? _a : {}
    );
    flags.shaanRenaissance.sheetTabs = mergeObject(
      CHARACTER_SHEET_TABS.reduce(
        (tabs, tab) => ({
          ...tabs,
          [tab]: !0,
        }),
        {}
      ),
      null !== (_b = flags.shaanRenaissance.sheetTabs) && void 0 !== _b
        ? _b
        : {}
    );
  }
  hasCondition(...slugs) {
    return slugs.some(
      (slug) => this.conditions.bySlug(slug, { active: true }).length > 0
    );
  }
  async increaseCondition(
    conditionSlug,
    { min, max = Number.MAX_SAFE_INTEGER, value } = {}
  ) {
    const existing = (() => {
      if (typeof conditionSlug !== "string") return conditionSlug;
      const conditions = this.conditions.stored;
      return value
        ? conditions.find((c) => c.slug === conditionSlug && !c.isLocked)
        : conditions.find((c) => c.slug === conditionSlug && c.active);
    })();

    if (existing) {
      const conditionValue = (() => {
        if (existing.value === null) return null;
        if (min && max && min > max)
          throw ErrorSR(`min (${min}) > max (${max})`);
        return min && max
          ? Math.clamped(existing.value + 1, min, max)
          : max
          ? Math.min(existing.value + 1, max)
          : existing.value + 1;
      })();

      if (conditionValue === null || conditionValue > (max || 0)) {
        return null;
      }

      await game.shaanRenaissance.ConditionManager.updateConditionValue(
        existing.id,
        this,
        conditionValue
      );
      return existing;
    }

    if (typeof conditionSlug === "string") {
      const conditionSource =
        game.shaanRenaissance.ConditionManager.getCondition(
          conditionSlug
        ).toObject();
      const conditionValue =
        typeof conditionSource?.system.value.value === "number" && min && max
          ? Math.clamped(conditionSource.system.value.value, min, max)
          : null;
      conditionSource.system.value.value = conditionValue;

      const newItem = (
        await this.createEmbeddedDocuments("Item", [conditionSource])
      ).shift();
      return newItem || null;
    }

    return null;
  }
  prepareEmbeddedDocuments() {
    super.prepareEmbeddedDocuments();
    const Items = this.items.filter((i) =>
      i.isOfType(
        "Armement",
        "Armimale",
        "Artefact",
        "Manuscrit",
        "Outil",
        "Protection",
        "Relation",
        "Richesse",
        "Technologie",
        "Transport",
        "Bâtiment"
      )
    );
    this.inventory = new ActorInventory(this, Items);
    this.prepareDataFromItems();
  }
  prepareDataFromItems() {
    for (const item of this.items) {
      item.prepareActorData?.();
    }
  }
  static async createDocuments(data = [], context = {}) {
    if (context.parent?.pack) context.pack = context.parent.pack;
    const { parent, pack, ...options } = context;
    const created = await this.database.create(this.implementation, {
      data,
      options,
      parent,
      pack,
    });
    await this._onCreateDocuments(created, context);
    return created;
  }
  async modifyTokenAttribute(attribute, value, isDelta = false, isBar = true) {
    const current = foundry.utils.getProperty(this.system, attribute);
    // Determine the updates to make to the actor data
    let updates;
    if (isBar) {
      if (isDelta) {
        value = Math.clamped(-30, Number(current.value) + value, current.max);
      }
      updates = { [`system.${attribute}.value`]: value };
    } else {
      value = Number(current) + value;
      updates = { [`system.${attribute}`]: value };
    }

    const allowed = Hooks.call(
      "modifyTokenAttribute",
      { attribute, value, isDelta, isBar },
      updates
    );
    return allowed !== false ? this.update(updates) : this;
  }
}
export const ActorProxySR = new Proxy(ActorSR, {
  construct: (_target, args) =>
    new CONFIG.shaanRenaissance.Actor.documentClasses[args[0].type](...args),
});
