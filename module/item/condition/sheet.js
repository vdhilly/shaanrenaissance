import ShaanRItemSheet from "../ShaanRItemSheet.js";
export class ShaanConditionSheet extends ShaanRItemSheet {
  get template() {
    return `systems/shaanrenaissance/templates/items/${this.item.type}/sheet.hbs`;
  }
  static get defaultOptions() {
    const options = super.defaultOptions;
    return (
      (options.width = 691),
      (options.height = 500),
      (options.tabs = [
        {
          navSelector: ".sheet-navigation",
          contentSelector: ".sheet-content",
          initial: "description",
        },
      ]),
      options
    );
  }
  getData(options = this.options) {
    options.id || (options.id = this.id);
    const itemData = this.item.toObject(!1),
      sheetData = {
        cssClass: this.item.isOwner ? "editable" : "locked",
        editable: this.isEditable,
        document: this.item,
        limited: this.item.limited,
        owner: this.item.isOwner,
        title: this.title,
        item: itemData,
        data: itemData.system,
        effects: itemData.effects,
        config: CONFIG.shaanRenaissance,
        user: {
          isGM: game.user.isGM,
        },
      };

    console.log(sheetData);
    return sheetData;
  }
  activateListeners(html) {
    super.activateListeners(html);
  }
}
