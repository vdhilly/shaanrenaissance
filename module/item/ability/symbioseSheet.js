import ShaanRItemSheet from "../ShaanRItemSheet.js";

export class symbioseSheet extends ShaanRItemSheet {
    get template() {
        return `systems/shaanrenaissance/templates/items/${this.item.type}/sheet.hbs`;
    }
    async getData(options = this.options) {
        options.id || (options.id = this.id);
        const itemData = this.item.toObject(!1),
          sheetData = {
            cssClass: this.item.isOwner ? "editable" : "locked",
            editable: this.isEditable,
            document: this.item,
            limited: this.item.limited,
            owner: this.item.isOwner,
            parent: this.item.parent,
            title: this.title,
            item: itemData,
            data: itemData.system,
            effects: itemData.effects,
            config: CONFIG.shaanRenaissance,
            user: {
              isGM: game.user.isGM,
            },
          };
    
        console.log(itemData);
        console.log(sheetData);
        return sheetData;
    }
}
