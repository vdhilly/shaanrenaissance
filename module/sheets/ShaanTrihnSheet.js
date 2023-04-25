export default class ShaanTrihnSheet extends ItemSheet {
    get template(){
        return `systems/Shaan_Renaissance/templates/items/${this.item.type}/sheet.hbs`;
    }
    static get defaultOptions() {
        const options = super.defaultOptions;
        return options.width = 350, options.height = 220, options
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
                title: this.title,
                item: itemData, 
                data: itemData.system,
                items: itemData.items,
                config: CONFIG.shaanRenaissance,
                user: {
                    isGM: game.user.isGM
                },
            };

        console.log(sheetData);
        return sheetData;
    }
    
}