import {tupleHasValue, CREATURE_ACTOR_TYPES, ErrorSR} from "./utils/utils.js"
import { ActorInventory } from "./actor/Inventory/ActorInventory.js";
export class ActorSR extends Actor {
  isOfType(...types) {
    return types.some((t => "creature" === t ? (0, tupleHasValue)(CREATURE_ACTOR_TYPES, this.type) : this.type === t))
  }
  prepareEmbeddedDocuments() {
    super.prepareEmbeddedDocuments()
    const Items = this.items.filter((i => i.isOfType("Armement", "Armimale", "Artefact", "Manuscrit", "Outil", "Protection", "Relation", "Richesse", "Technologie", "Transport", "Bâtiment")));
    console.log(Items)
    this.inventory = new ActorInventory(this, Items);
  }
  static async createDocuments(data=[], context={}) {
    if ( context.parent?.pack ) context.pack = context.parent.pack;
    const {parent, pack, ...options} = context;  
    const created = await this.database.create(this.implementation, {data, options, parent, pack});
    await this._onCreateDocuments(created, context);
    return created;
  }
  async modifyTokenAttribute(attribute, value, isDelta=false, isBar=true) {
    const current = foundry.utils.getProperty(this.system, attribute);
    // Determine the updates to make to the actor data
    let updates;
    if ( isBar ) {
      if( isDelta ) {
        value = Math.clamped(-30, Number(current.value) + value, current.max);
      }
      updates = {[`system.${attribute}.value`]: value};
    } else {
      value = Number(current) + value;
      updates = {[`system.${attribute}`]: value};
    }

    const allowed = Hooks.call("modifyTokenAttribute", {attribute, value, isDelta, isBar}, updates);
    return allowed !== false ? this.update(updates) : this;
  }
}