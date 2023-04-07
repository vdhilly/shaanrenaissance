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
            // Filtres catégorie pouvoir
            sheetData.pouvoirEsprit = actorData.items.filter(function (item) { return item.system.pouvoir.value == "Secret de Savoir"  || item.system.pouvoir.value == "Privilège de Social" || item.system.pouvoir.value == "Astuce de Technique"});
            sheetData.pouvoirAme = actorData.items.filter(function (item) { return item.system.pouvoir.value == "Création d'Arts"  || item.system.pouvoir.value == "Symbiose de Shaan" || item.system.pouvoir.value == "Sort de Magie"});
            sheetData.pouvoirCorps = actorData.items.filter(function (item) { return item.system.pouvoir.value == "Transe de Rituels"  || item.system.pouvoir.value == "Exploit de Survie" || item.system.pouvoir.value == "Tactique de Combat"});
            sheetData.pouvoirNecrose = actorData.items.filter(function (item) { return item.system.pouvoir.value == "Tourment de Nécrose"});
                
        console.log(sheetData);
        return await sheetData;
    }
    activateListeners(html) {
        if (this.isEditable) {
            // html.find(".power-create").click(this._onItemCreate.bind(this));
            // html.find(".power-edit").click(this._onItemEdit.bind(this));
            // html.find(".power-delete").on("click", (event => {
            //     var _a;
            //     null === (_a = this.getItemFromEvent(event)) || void 0 === _a || _a.delete() }));
        
        super.activateListeners(html);
    }
    }
    // _onItemCreate(event) {
    //     event.preventDefault();
    //     const espritBtn = event.target.closest("#Esprit-add")
    //     const ameBtn = event.target.closest("#Ame-add")
    //     const corpsBtn = event.target.closest("#Corps-add")
    //     const necroseBtn = event.target.closest("#Nécrose-add")
    //     console.log(espritBtn)
    //     console.log(ameBtn)
        
    //     if (espritBtn) {
    //         let itemData = {
    //       name: "Nouveau pouvoir d'Esprit",
    //       type: "Pouvoir"       
    //     };

    //     return this.actor.createEmbeddedDocuments("Item", [itemData]);

    //     }

    //     if (ameBtn) {
    //     let itemData = {
    //       name: "Nouveau pouvoir d'Âme",
    //       type: "Pouvoir",
          
    //     };
    //         return this.actor.createEmbeddedDocuments("Item", [itemData]);

    //     }


}