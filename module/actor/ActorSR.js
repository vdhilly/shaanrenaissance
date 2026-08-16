import { CHARACTER_ACTOR_TYPES, CHARACTER_SHEET_TABS, ErrorSR, tupleHasValue } from "../utils/utils.js";
import { ActorInventory } from "./Inventory/ActorInventory.js";
import { ActorConditions } from "./conditions.js";
import { TokenEffect } from "./token-effect.js";

export class ActorSR extends Actor {
  constructor(...args) {
    super(...args);
    this.shaanis = new Set();
    this.conditions = new ActorConditions();
  }

  get hasPlayerOwner() {
    return game.users.some((u) => !u.isGM && this.testUserPermission(u, "OWNER"));
  }

  get temporaryEffects() {
    const fromConditions = this.conditions.active.map((c) => new TokenEffect(c));
    return [...super.temporaryEffects, ...fromConditions].flat();
  }

  get primaryUpdater() {
    // Correction V14 : activeGM n'existe plus, on utilise le tableau activeGMs
    const activeGMs = game.users.activeGMs;
    if (activeGMs.length > 0) return activeGMs.sort((a, b) => (a.id > b.id ? 1 : -1))[0];

    const activeUsers = game.users.filter((u) => u.active);

    // L'utilisateur assigné à cet acteur
    const primaryPlayer = this.isToken ? null : activeUsers.find((u) => u.character && u.character.id === this.id);
    if (primaryPlayer) return primaryPlayer;

    // Utilisateur avec la permission d'édition
    const firstUpdater = game.users
      .filter((u) => this.canUserModify(u, "update"))
      .sort((a, b) => (a.id > b.id ? 1 : -1))
      .shift();

    return firstUpdater || null;
  }

  isOfType(...types) {
    return types.some((t) => ("character" === t ? tupleHasValue(CHARACTER_ACTOR_TYPES, this.type) : this.type === t));
  }

  isLootableBy(user) {
    return this.canUserModify(user, "update");
  }

  _initialize(options) {
    super._initialize(options);
  }

  prepareBaseData() {
    super.prepareBaseData();
    
    this.flags.shaanRenaissance ??= {};
    this.flags.shaanRenaissance.sheetTabs = foundry.utils.mergeObject(
      CHARACTER_SHEET_TABS.reduce(
        (tabs, tab) => ({
          ...tabs,
          [tab]: true,
        }),
        {}
      ),
      this.flags.shaanRenaissance.sheetTabs || {}
    );
  }

  hasCondition(...slugs) {
    return slugs.some((slug) => this.conditions.bySlug(slug, { active: true }).length > 0);
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

  // CORRECTION CRITIQUE V14 : Délégation directe au moteur standard de création de documents
  static async createDocuments(data = [], context = {}) {
    return await super.createDocuments(data, context);
  }

  async modifyTokenAttribute(attribute, value, isDelta = false, isBar = true) {
    const current = foundry.utils.getProperty(this.system, attribute);
    let updates;
    if (isBar) {
      if (isDelta) {
        value = Math.clamp(-30, Number(current.value) + value, current.max);
      }
      updates = { [`system.${attribute}.value`]: value };
    } else {
      value = Number(current) + value;
      updates = { [`system.${attribute}`]: value };
    }

    const allowed = Hooks.call("modifyTokenAttribute", { attribute, value, isDelta, isBar }, updates);
    return allowed !== false ? this.update(updates) : this;
  }

  async _preCreate(data, options, user) {
    let icon = data.img;
    const type = data.type;

    switch (type) {
      case "Personnage":
      case "PNJ":
        icon = "systems/shaanrenaissance/assets/icons/navbar/icon_general.webp";
        break;
    }

    this.updateSource({ img: icon });

    return await super._preCreate(data, options, user);
  }
}

export const ActorProxySR = new Proxy(ActorSR, {
  construct: (_target, args) => new CONFIG.shaanRenaissance.Actor.documentClasses[args[0].type](...args),
});