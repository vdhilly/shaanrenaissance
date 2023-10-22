import { ErrorSR } from "../../../utils/utils.js";
export class LootNPCsPopup extends FormApplication {
  static get defaultOptions() {
    const options = super.defaultOptions;
    return (
      (options.id = "loot-NPCs"),
      (options.classes = []),
      (options.title = "Loot NPCs"),
      (options.template =
        "systems/shaanrenaissance/templates/actors/Loot/partials/loot-npcs-popup.hbs"),
      (options.width = "auto"),
      options
    );
  }
  async _updateObject(_event, formData) {
    var _a;
    const itemData = [],
      selectionData = Array.isArray(formData.selection)
        ? formData.selection
        : [formData.selection];
    for (let i = 0; i < selectionData.length; i++) {
      const token = canvas.tokens.placeables.find((token) => {
        var _a;
        return (
          token.actor &&
          token.id ===
            (null === (_a = this.form[i]) || void 0 === _a ? void 0 : _a.id)
        );
      });
      if (!token)
        throw (0, ErrorSR)(
          `Token ${
            null === (_a = this.form[i]) || void 0 === _a ? void 0 : _a.id
          } not found`
        );
      const currentSource = token.actor;
      if (selectionData[i] && currentSource) {
        const currentSourceItemData = currentSource.inventory.map((item) =>
          item.toObject()
        );
        itemData.push(...currentSourceItemData);
        const idsToDelete = currentSourceItemData.map((item) => item._id);
        currentSource.deleteEmbeddedDocuments("Item", idsToDelete);
      }
    }
    itemData.length > 0 &&
      (await this.object.createEmbeddedDocuments("Item", itemData));
  }
  async getData() {
    const tokenInfo = canvas.tokens.controlled
      .filter((token) => token.actor && token.actor.id !== this.object.id)
      .map((token) => ({
        id: token.id,
        name: token.name,
        checked: token.actor.hasPlayerOwner,
      }));
    return {
      ...(await super.getData()),
      tokenInfo,
    };
  }
}
