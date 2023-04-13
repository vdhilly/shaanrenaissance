import * as Dice from "../jets/dice.js";

export default class ShaanRActorsSheet extends ActorSheet {
    static get defaultOptions() {
        const options = super.defaultOptions;
        console.log(options)
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

            if (typeof actorData.items.filter(function (item) {return item.system.pouvoir}) !== 'undefined') {
                sheetData.items.Category = {},
                sheetData.items.Category.Armement = actorData.items.filter(function (item) { return item.type == "Armement" }),
                sheetData.items.Category.Armimales = actorData.items.filter(function (item) { return item.type == "Armimale" }),
                sheetData.items.Category.Artefacts = actorData.items.filter(function (item) { return item.type == "Artefact" }),
                sheetData.items.Category.Manuscrits = actorData.items.filter(function (item) { return item.type == "Manuscrit" }),
                sheetData.items.Category.Outils = actorData.items.filter(function (item) { return item.type == "Outil" }),
                sheetData.items.Category.Protections = actorData.items.filter(function (item) { return item.type == "Protection" }),
                sheetData.items.Category.Relations = actorData.items.filter(function (item) { return item.type == "Relation" }),
                sheetData.items.Category.Richesses = actorData.items.filter(function (item) { return item.type == "Richesse" }),
                sheetData.items.Category.Technologie = actorData.items.filter(function (item) { return item.type == "Technologie" }),
                sheetData.items.Category.Transports = actorData.items.filter(function (item) { return item.type == "Transport" }),

                sheetData.pouvoirEsprit = actorData.items.filter(function (item) { return item.type = "Pouvoir" && item.system.trihn == "Esprit" || item.system.pouvoir.value == "Astuce de Technique" || item.system.pouvoir.value == "Secret de Savoir" || item.system.pouvoir.value == "Privilège de Social"}),
                sheetData.pouvoirAme = actorData.items.filter(function (item) { return item.type = "Pouvoir" && item.system.trihn == "Âme" || item.system.pouvoir.value == "Création d'Arts" || item.system.pouvoir.value == "Symbiose de Shaan" || item.system.pouvoir.value == "Sort de Magie"}),
                sheetData.pouvoirCorps = actorData.items.filter(function (item) { return item.type = "Pouvoir" && item.system.trihn == "Corps" || item.system.pouvoir.value == "Transe de Rituel" || item.system.pouvoir.value == "Exploit de Survie" || item.system.pouvoir.value == "Tactique de Combat"}),
                sheetData.pouvoirNecrose = actorData.items.filter(function (item) { return item.type = "Pouvoir" && item.system.trihn == "Nécrose" || item.system.pouvoir.value == "Tourment de Nécrose"});
    
            }


        console.log(sheetData);
        return await sheetData;
    }
    activateListeners(html) {
        if (this.isEditable) {
            html.find(".item-create").click(this._onItemCreate.bind(this));
            html.find(".item-edit").click(this._onItemEdit.bind(this));
            html.find(".item-delete").click(this._onItemDelete.bind(this));  
            const title = $(".sheet-navigation .active").attr("title");
                title && html.find(".navigation-title").text(title)                  
                        html.find(".sheet-navigation").on("mouseover", ".item,.manage-tabs", (event => {
                            const title = event.target.title;  
                            title && $(event.target).parents(".sheet-navigation").find(".navigation-title").text(title)
                        })), html.find(".sheet-navigation").on("mouseout", ".item,.manage-tabs", (event => {
                            const parent = $(event.target).parents(".sheet-navigation"),
                                title = parent.find(".item.active").attr("title");
                            title && parent.find(".navigation-title").text(title)
                        }));

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
        let domain = $(event.target.closest(".pc")).children(".specialisations-title").find(".specialisations-label").text()
        let spécialisation = $(event.target).text().toLowerCase().replaceAll(' ', '').replace("'", '').replaceAll("é", "e").replace("è", "e").replace("ê", "e").replace("à", "a").replace("â", "a").replace("î", "i");

        Dice.SpéTest({
            actor,
            domain: domain,
            spécialisation: spécialisation
        });
    }

    _onSpéTestNécr(event) {
        let actor = this.actor
        let domain = $(event.target.closest(".pc")).children(".specialisations-title").find(".specialisations-label").text()
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
        const espritBtn = event.target.closest("#Esprit-add")
        const ameBtn = event.target.closest("#Ame-add")
        const corpsBtn = event.target.closest("#Corps-add")
        const necroseBtn = event.target.closest("#Nécrose-add")
        const armementBtn = event.target.closest("#Armement-add")
        const armimaleBtn = event.target.closest("#Armimales-add")
        const artefactBtn = event.target.closest("#Artefacts-add")
        const manuscritBtn = event.target.closest("#Manuscrits-add")
        const outilBtn = event.target.closest("#Outils-add")
        const protectionBtn = event.target.closest("#Protection-sadd")
        const relationBtn = event.target.closest("#Relations-add")
        const richesseBtn = event.target.closest("#Richesses-add")
        const technologieBtn = event.target.closest("#Technologie-add")
        const transportBtn = event.target.closest("#Transport-add")
        

        if(armementBtn) {
            let itemData = {
                name: "Nouvel Armement",
                type: "Armement"
              };
      
              return this.actor.createEmbeddedDocuments("Item", [itemData]);
              }
              this.actor.sheet.render();

        if(armimaleBtn) {
            let itemData = {
                name: "Nouvelle Armimale",
                type: "Armimale"
                };
          
                return this.actor.createEmbeddedDocuments("Item", [itemData]);
                }
                this.actor.sheet.render();

        if(artefactBtn) {
            let itemData = {
                name: "Nouvel Artefact",
                type: "Artefact"
                };
        
                return this.actor.createEmbeddedDocuments("Item", [itemData]);
                }
                this.actor.sheet.render();

        if(manuscritBtn) {
            let itemData = {
                name: "Nouveau Manuscrit",
                type: "Manuscrit"
            };
            
            return this.actor.createEmbeddedDocuments("Item", [itemData]);
            }
            this.actor.sheet.render();

        if(outilBtn) {
            let itemData = {
                name: "Nouvel Outil",
                type: "Outil"
            };
            
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();

        if(protectionBtn) {
            let itemData = {
                name: "Nouvelle Protection",
                type: "Protection"
            };
            
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();

        if(relationBtn) {
        let itemData = {
            name: "Nouvelle Relation",
            type: "Relation"
            };
    
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();

        if(richesseBtn) {
        let itemData = {
            name: "Nouvelle Richesse",
            type: "Richesse"
            };
    
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();

        if(technologieBtn) {
        let itemData = {
            name: "Nouvelle Technologie",
            type: "Technologie"
            };
    
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();

        if(transportBtn) {
        let itemData = {
            name: "Nouveau Transport",
            type: "Transport"
            };
    
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();

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