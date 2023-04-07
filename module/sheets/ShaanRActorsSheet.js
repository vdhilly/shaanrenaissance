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
                items: {
                    powerCategory: {
                        pouvoirEsprit: actorData.items.filter(function (item) { return item.system.trihn == "Esprit"}),
                        pouvoirAme: actorData.items.filter(function (item) { return item.system.trihn == "Âme" }),
                        pouvoirCorps: actorData.items.filter(function (item) { return item.system.trihn == "Corps"}),
                        pouvoirNecrose: actorData.items.filter(function (item) { return item.system.trihn == "Nécrose"}),
                    },
                },
                config: CONFIG.shaanRenaissance,
                user: {
                    isGM: game.user.isGM
                },
            };
            // Filtres catégorie pouvoir
            sheetData.items.powerCategory.pouvoirEsprit = actorData.items.filter(function (item) { return item.system.trihn == "Esprit" });


        console.log(sheetData);
        return await sheetData;
    }
    activateListeners(html) {
        if (this.isEditable) {
            html.find(".power-create").click(this._onItemCreate.bind(this));
            html.find(".power-edit").click(this._onItemEdit.bind(this));
            html.find(".power-delete").click(this._onItemDelete.bind(this));     
        super.activateListeners(html);
    }
    }
    _onItemCreate(event) {
        event.preventDefault();
        const espritBtn = event.target.closest("#Esprit-add")
        const ameBtn = event.target.closest("#Ame-add")
        const corpsBtn = event.target.closest("#Corps-add")
        const necroseBtn = event.target.closest("#Nécrose-add")
        
        if (espritBtn) {
            let itemData = {
          name: "Nouveau pouvoir d'Esprit",
          type: "Pouvoir",
          system: {
            trihn: "Esprit"
          }
        };

        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();

        if (ameBtn) {
            let itemData = {
          name: "Nouveau pouvoir d'Âme",
          type: "Pouvoir",
          system: {
            trihn: "Âme"
          }
        };

        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();

        if (corpsBtn) {
            let itemData = {
          name: "Nouveau pouvoir de Corps",
          type: "Pouvoir",
          system: {
            trihn: "Corps"
          }
        };

        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();

        if (necroseBtn) {
            let itemData = {
          name: "Nouveau pouvoir de Nécrose",
          type: "Pouvoir",
          system: {
            trihn: "Nécrose"
          }
        };

        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();
    }
    _onItemEdit(event) {
        event.preventDefault();
        let element = event.target
        let itemId = element.closest(".pouvoir").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.sheet.render(true);
    }
    _onItemDelete(event) {
        event.preventDefault();
        let element = event.target
        let itemId = element.closest(".pouvoir").dataset.itemId;
        return this.actor.deleteEmbeddedDocuments("Item", [itemId])
    }
}