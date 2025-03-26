import { ErrorSR, PHYSICAL_ITEM_TYPES, isItemSystemData, setHasElement } from "../utils/utils.js";

export class ItemSR extends Item {
  get slug() {
    return this.system.slug;
  }
  isOfType(...types) {
    return types.some((t) => ("physical" === t ? (0, setHasElement)(PHYSICAL_ITEM_TYPES, this.type) : this.type === t));
  }
  static async createDocuments(data = [], context = {}) {
    const sources = data.map((d) => (d instanceof ItemSR ? d.toObject() : d));

    const actor = context.parent;
    if (!actor) return super.createDocuments(sources, context);

    const items = await Promise.all(
      sources.map(async (source) => {
        if (!(context.keepId || context.keepEmbeddedIds)) {
          source._id = foundry.utils.randomID();
        }
        const item = new CONFIG.Item.documentClass(source, { parent: actor });
        await item.prepareActorData?.();
        return item;
      })
    );
    return super.createDocuments(items, context);
  }
  getRollData() {
    return {
      actor: this.actor,
      item: this,
    };
  }
  async processChatData(htmlOptions = {}, data) {
    var _a, _b, _c;
    if (
      ((data.properties =
        null !== (_b = null === (_a = data.properties) || void 0 === _a ? void 0 : _a.filter((property) => null !== property)) &&
        void 0 !== _b
          ? _b
          : []),
      (0, isItemSystemData)(data))
    ) {
      const chatData = duplicate(data);
      return (
        (htmlOptions.rollData = foundry.utils.mergeObject(
          this.getRollData(),
          null !== (_c = htmlOptions.rollData) && void 0 !== _c ? _c : {}
        )),
        (chatData.description.value = await TextEditor.enrichHTML(chatData.description.value, {
          ...htmlOptions,
          async: !0,
        })),
        chatData
      );
    }
    return data;
  }
  async getChatData(htmlOptions = {}, _rollOptions = {}) {
    if (!this.actor) throw (0, ErrorSR)(`Cannot retrieve chat data for unowned item ${this.name}`);
    const systemData = {
      ...this.system,
    };
    return this.processChatData(htmlOptions, foundry.utils.deepClone(systemData));
  }
  static async createDialog(data = {}, options = {}) {
    const original = game.system.documentTypes.Item;
    options.classes = [...(options.classes || []), "dialog-item-create"];
    const newItem = await super.createDialog(data, options);
    game.system.documentTypes.Item = original;
    return newItem;
  }
  async _preCreate(data, options, user) {
    let icon = data.img;
    const type = data.type;

    if(icon.includes("navbar") || icon.includes("svg")){
      switch (type) {
        case "Armement":
        case "Armimale":
        case "Artefact":
        case "Bâtiment":
        case "Outil":
        case "Protection":
        case "Relation":
        case "Richesse":
        case "Technologie":
        case "Transport":
          icon = "systems/shaanrenaissance/assets/icons/navbar/icon_acquis.webp";
          break;
        case "Manuscrit":
          icon = "systems/shaanrenaissance/assets/icons/navbar/icon_biographie.webp";
          break;
        case "Pouvoir":
          if (icon && !icon.includes("domaines")) icon = "systems/shaanrenaissance/assets/icons/navbar/icon_pouvoir.webp";
          break;
        case "Symbiose":
          icon = "systems/shaanrenaissance/assets/icons/navbar/icon_symbiose.webp";
          break;
        case "Trihn":
          icon = "systems/shaanrenaissance/assets/icons/navbar/icon_magie.webp";
          break;
      }
    }

    await this.updateSource({ img: icon });

    return await super._preCreate(data, options, user);
  }
  prepareActorData() {}
}
export const ItemProxySR = new Proxy(ItemSR, {
  construct: (_target, args) => new CONFIG.shaanRenaissance.Item.documentClasses[args[0].type](...args),
});
