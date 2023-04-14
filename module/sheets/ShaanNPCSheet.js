import * as Dice from "../jets/dice.js";

export default class ShaanNPCSheet extends ActorSheet {
    static get defaultOptions() {
        const options = super.defaultOptions;
        console.log(options)
        return options.classes = [...options.classes, "PNJ"], options.width = 900, options.height = 700, options
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
            sheetData.acquis = actorData.items.filter(function (item) { return item.type == "Armement" || item.type == "Armimale" || item.type == "Artefact" ||  item.type == "Manuscrit" || item.type == "Outil" || item.type == "Protection" || item.type == "Relation" || item.type == "Richesse" || item.type == "Technologie" || item.type == "Transport" });
        
            sheetData.pouvoirs = actorData.items.filter(function (item) { return item.type == "Pouvoir" });


        console.log(sheetData);
        return await sheetData;
    }

    activateListeners(html) {
        if (this.isEditable) {
            html.find(".item-create").click(this._onItemCreate.bind(this));
            html.find(".item-edit").click(this._onItemEdit.bind(this));
            html.find(".item-delete").click(this._onItemDelete.bind(this));  

        super.activateListeners(html);
        }
        if (this.actor.isOwner) {
            html.find(".roll-initiative").click(this._onInitiative.bind(this));
            html.find(".roll-icon").click(this._onTest.bind(this));
            html.find(".spéTest").click(this._onSpéTest.bind(this));
            html.find(".spéTestNécr").click(this._onSpéTestNécr.bind(this));

        }
    }

    _onSpéTest(event) {
        let actor = this.actor
        let domain = $(event.target.closest(".npc")).children(".specialisations-title").find(".specialisations-label").text()
        let spécialisation = $(event.target).text().toLowerCase().replaceAll(' ', '').replace("'", '').replaceAll("é", "e").replace("è", "e").replace("ê", "e").replace("à", "a").replace("â", "a").replace("î", "i");

        Dice.SpéTest({
            actor,
            domain: domain,
            spécialisation: spécialisation
        });
    }

    _onSpéTestNécr(event) {
        let actor = this.actor
        let domain = $(event.target.closest(".npc")).children(".specialisations-title").find(".specialisations-label").text()
        let spécialisation = $(event.target).text().toLowerCase().replaceAll(' ', '').replace("'", '').replaceAll("é", "e").replace("è", "e").replace("ê", "e").replace("à", "a").replace("â", "a").replace("î", "i");

        Dice.SpéTestNécr({
            actor,
            domain: domain,
            spécialisation: spécialisation
        });

    }

    _onInitiative(event) {
        const dataset = event.currentTarget.dataset;
        let actor = this.actor

        Dice.Initiative({
            actor,
            domain: dataset.domain,
            domainLevel: dataset.domainLevel
        });
    }
    _onTest(event) {
        const dataset = event.target.closest(".roll-data").dataset.itemId;
        let actor = this.actor

        if(dataset == "domainTest" || "necroseTest") {
            Dice[dataset]({
                actor,
                checkType: dataset
            })
        }

    }

    _onItemCreate(event) {
        event.preventDefault();
        const pouvoirBtn = event.target.closest("#pouvoir-add")
        const acquisBtn = event.target.closest("#acquis-add")

        if (pouvoirBtn) {
            let itemData = {
          name: "Nouveau pouvoir",
          type: "Pouvoir"
        };

        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();

        if(acquisBtn) {
            
        }
    }
    _onItemEdit(event) {
        event.preventDefault();
        let element = event.target
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.sheet.render(true);
    }
    _onItemDelete(event) {
        event.preventDefault();
        let element = event.target
        let itemId = element.closest(".item").dataset.itemId;
        return this.actor.deleteEmbeddedDocuments("Item", [itemId])
    }


}
