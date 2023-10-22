import {
  ErrorSR,
  PHYSICAL_ITEM_TYPES,
  isItemSystemData,
  setHasElement,
} from "../utils/utils.js";

export class ItemSR extends Item {
  get slug() {
    return this.system.slug;
  }
  isOfType(...types) {
    return types.some((t) =>
      "physical" === t
        ? (0, setHasElement)(PHYSICAL_ITEM_TYPES, this.type)
        : this.type === t
    );
  }
  static async createDocuments(data = [], context = {}) {
    const sources = data.map((d) => (d instanceof ItemSR ? d.toObject() : d));

    const actor = context.parent;
    if (!actor) return super.createDocuments(sources, context);

    const items = await Promise.all(
      sources.map(async (source) => {
        if (!(context.keepId || context.keepEmbeddedIds)) {
          source._id = randomID();
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
        null !==
          (_b =
            null === (_a = data.properties) || void 0 === _a
              ? void 0
              : _a.filter((property) => null !== property)) && void 0 !== _b
          ? _b
          : []),
      (0, isItemSystemData)(data))
    ) {
      const chatData = duplicate(data);
      return (
        (htmlOptions.rollData = mergeObject(
          this.getRollData(),
          null !== (_c = htmlOptions.rollData) && void 0 !== _c ? _c : {}
        )),
        (chatData.description.value = await TextEditor.enrichHTML(
          chatData.description.value,
          {
            ...htmlOptions,
            async: !0,
          }
        )),
        chatData
      );
    }
    return data;
  }
  async getChatData(htmlOptions = {}, _rollOptions = {}) {
    if (!this.actor)
      throw (0, ErrorSR)(
        `Cannot retrieve chat data for unowned item ${this.name}`
      );
    const systemData = {
      ...this.system,
    };
    return this.processChatData(htmlOptions, deepClone(systemData));
  }
  static async createDialog(data = {}, options = {}) {
    var _a;
    const original = game.system.documentTypes.Item;
    const withClasses = {
        ...options,
        classes: [
          ...(null !== (_a = options.classes) && void 0 !== _a ? _a : []),
          "dialog-item-create",
        ],
      },
      newItem = super.createDialog(data, withClasses);
    return (game.system.documentTypes.Item = original), newItem;
  }
  prepareActorData() {}
}
export const ItemProxySR = new Proxy(ItemSR, {
  construct: (_target, args) =>
    new CONFIG.shaanRenaissance.Item.documentClasses[args[0].type](...args),
});
