// import * as Dice from "../jets/dice.js";

export default class ShaanShaaniSheet extends ActorSheet {
    static get defaultOptions() {
        const options = super.defaultOptions;
        console.log(options)
        return options.classes = [...options.classes, "Shaani"], options.width = 750, options.height = 800, options.scrollY.push(".tab.active .tab-content"), options.tabs = [{

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
            // sheetData.acquis = actorData.items.filter(function (item) { return item.type == "Armement" || item.type == "Armimale" || item.type == "Artefact" ||  item.type == "Manuscrit" || item.type == "Outil" || item.type == "Protection" || item.type == "Relation" || item.type == "Richesse" || item.type == "Technologie" || item.type == "Transport" });
        
            // sheetData.pouvoirs = actorData.items.filter(function (item) { return item.type == "Pouvoir" });


        console.log(sheetData);
        return await sheetData;

        }
}
