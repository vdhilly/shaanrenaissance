import {tupleHasValue, CHARACTER_ACTOR_TYPES, CHARACTER_SHEET_TABS, ErrorSR} from "./utils/utils.js"
import { ActorInventory } from "./actor/Inventory/ActorInventory.js";
export class ActorSR extends Actor {
  isOfType(...types) {
    return types.some((t => "character" === t ? (0, tupleHasValue)(CHARACTER_ACTOR_TYPES, this.type) : this.type === t))
  }
  async importFromJSON(json) {

    // Construct a document class to (strictly) clean and validate the source data
    const doc = new this.constructor(JSON.parse(json), {strict: true});
    console.log(doc)

    // Treat JSON import using the same workflows that are used when importing from a compendium pack
    const data = this.collection.fromCompendium(doc, {addFlags: false});
    console.log(data)

    // Preserve certain fields from the destination document
    const preserve = Object.fromEntries(this.constructor.metadata.preserveOnImport.map(k => {
      return [k, foundry.utils.getProperty(this, k)];
    }));
    preserve.folder = this.folder?.id;
    console.log(preserve)
    foundry.utils.mergeObject(data, preserve);

    // Commit the import as an update to this document
    await this.update(data, {diff: false, recursive: false, noHook: true});
    ui.notifications.info(game.i18n.format("DOCUMENT.Imported", {document: this.documentName, name: this.name}));
    return this;
  }
  prepareEmbeddedDocuments() {
    super.prepareEmbeddedDocuments()
    const Items = this.items.filter((i => i.isOfType("Armement", "Armimale", "Artefact", "Manuscrit", "Outil", "Protection", "Relation", "Richesse", "Technologie", "Transport", "Bâtiment")));
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