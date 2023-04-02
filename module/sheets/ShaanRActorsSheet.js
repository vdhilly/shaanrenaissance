export default class ShaanRActorsSheet extends ActorSheet {
    static get defaultOptions() {
        const options = super.defaultOptions;
        return options.classes = [...options.classes, "character"], options.width = 750, options.height = 800, options.scrollY.push(".tab.active .tab-content"), options.tabs = [{
            navSelector: ".sheet-navigation",
            contentSelector: ".sheet-content",
            initial: "character"
        }], options
    }
    get template(){
        return `systems/Shaan_Renaissance/templates/actors/${this.actor.type}/sheet.hbs`;
    }
    async getData(options = this.options) {
        options.id || (options.id = this.id);
        const actorData = this.actor.toObject(!1),
            sheetData = {
                cssClass: this.actor.isOwner ? "editable" : "locked",
                editable: this.isEditable,
                document: this.actor,
                limited: this.actor.limited,
                owner: this.actor.isOwner,
                title: this.title,
                actor: actorData,
                data: actorData.system,
                items: actorData.items,
                config: CONFIG.shaanRenaissance,
                user: {
                    isGM: game.user.isGM
                },
            };
        console.log(sheetData);
        return await sheetData;
    }
}