import * as Dice from "../jets/dice.js";

export default class ShaanRActorsSheet extends ActorSheet {
    static get defaultOptions() {
        const options = super.defaultOptions;
        return options.classes = [...options.classes, "character"], options.width = 750, options.height = 800, options.scrollY.push(".sheet-body"), options.tabs = [{

            navSelector: ".sheet-navigation",
            contentSelector: ".sheet-content",
            initial: "character"
        }], options
    }
    get template(){
        return `systems/Shaan_Renaissance/templates/actors/${this.actor.type}/sheet.hbs`;
    }
    getData(options = this.options) {
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

            if (typeof actorData.items.filter(function (item) {return item.system.pouvoir}) !== undefined) {
                sheetData.items.Category = {},
                sheetData.items.Category.Armement = actorData.items.filter(function (item) { return item.type == "Armement" && item.system.morphe == false}),
                sheetData.items.Category.Armimales = actorData.items.filter(function (item) { return item.type == "Armimale" }),
                sheetData.items.Category.Artefacts = actorData.items.filter(function (item) { return item.type == "Artefact" }),
                sheetData.items.Category.Manuscrits = actorData.items.filter(function (item) { return item.type == "Manuscrit" }),
                sheetData.items.Category.Outils = actorData.items.filter(function (item) { return item.type == "Outil" && item.system.morphe == false}),
                sheetData.items.Category.Protections = actorData.items.filter(function (item) { return item.type == "Protection" && item.system.morphe == false}),
                sheetData.items.Category.Relations = actorData.items.filter(function (item) { return item.type == "Relation" }),
                sheetData.items.Category.Richesses = actorData.items.filter(function (item) { return item.type == "Richesse" }),
                sheetData.items.Category.Technologie = actorData.items.filter(function (item) { return item.type == "Technologie" && item.system.morphe == false}),
                sheetData.items.Category.Transports = actorData.items.filter(function (item) { return item.type == "Transport" });
                sheetData.items.Category.Bâtiments = actorData.items.filter(function (item) { return item.type == "Bâtiment" });
                sheetData.SummonedTrihns = actorData.items.filter(function (item) { return item.type == "Trihn"});
                sheetData.morpheModules = actorData.items.filter(function (item) { return item.system.morphe == true && item.type == "Protection" || item.system.morphe == true && item.type == "Outil" || item.system.morphe == true && item.type == "Armement" || item.system.morphe == true && item.type == "Technologie"})

                sheetData.pouvoirEsprit = actorData.items.filter(function (item) { return item.type == "Pouvoir" && item.system.trihn == "Esprit" || item.system.pouvoir.value == "Astuce de Technique" || item.system.pouvoir.value == "Secret de Savoir" || item.system.pouvoir.value == "Privilège de Social"}),
                sheetData.pouvoirAme = actorData.items.filter(function (item) { return item.type == "Pouvoir" && item.system.trihn == "Âme" || item.system.pouvoir.value == "Création d'Arts" || item.system.pouvoir.value == "Symbiose de Shaan" || item.system.pouvoir.value == "Sort de Magie"}),
                sheetData.pouvoirCorps = actorData.items.filter(function (item) { return item.type == "Pouvoir" && item.system.trihn == "Corps" || item.system.pouvoir.value == "Transe de Rituels" || item.system.pouvoir.value == "Exploit de Survie" || item.system.pouvoir.value == "Tactique de Combat"}),
                sheetData.pouvoirNecrose = actorData.items.filter(function (item) { return item.type == "Pouvoir" && item.system.trihn == "Nécrose" || item.system.pouvoir.value == "Tourment de Nécrose"});

                // Filtre Race
                let race = actorData.items.filter(function (item) { return item.type == "Race"});
                let lastElement = race[race.length - 1]
                let avantLastElement = race[race.length - 2]
                
                race.forEach(element => {
                    if(sheetData.data.attributes && sheetData.data.attributes.isIndar === false) {
                        if(element != lastElement) {
                        let itemId = element._id
                        return this.actor.deleteEmbeddedDocuments("Item", [itemId])
                        }
                    }
                    else if(sheetData.data.attributes && sheetData.data.attributes.isIndar === true) {
                        if(element != lastElement && element != avantLastElement) {
                            let itemId = element._id
                            return this.actor.deleteEmbeddedDocuments("Item", [itemId])
                        }
                    }
                });
                if(sheetData.data.attributes && sheetData.data.attributes.isIndar == true) {
                sheetData.Race = lastElement
                sheetData.RaceSecondaire = avantLastElement
                }
                else {
                    sheetData.Race = lastElement
                }
                // Filtre Peuple
                let peuple = actorData.items.filter(function (item) { return item.type == "Peuple"});
                lastElement = peuple[peuple.length - 1]
                
                peuple.forEach(element => {
                    if(element != lastElement) {
                        let itemId = element._id
                        return this.actor.deleteEmbeddedDocuments("Item", [itemId])
                    }
                });
                sheetData.Peuple = lastElement
                // Filtre Caste
                let caste = actorData.items.filter(function (item) { return item.type == "Caste"});
                lastElement = caste[caste.length - 1]
                
                caste.forEach(element => {
                    if(element != lastElement) {
                        let itemId = element._id
                        return this.actor.deleteEmbeddedDocuments("Item", [itemId])
                    }
                });
                sheetData.Caste = lastElement
                // Filtre Métier
                let metier = actorData.items.filter(function (item) { return item.type == "Métier"});
                lastElement = metier[metier.length - 1]
                
                metier.forEach(element => {
                    if(element != lastElement) {
                        let itemId = element._id
                        return this.actor.deleteEmbeddedDocuments("Item", [itemId])
                    }
                });
                sheetData.Metier = lastElement
            }
            if (typeof sheetData.data.attributes !== "undefined") {
                this.actor.update({
                    data: {
                        attributes: {
                            hpEsprit: {
                                max: (Math.max(sheetData.data.skills.Technique.rank, sheetData.data.skills.Savoir.rank, sheetData.data.skills.Social.rank)) + (Math.min(sheetData.data.skills.Technique.rank, sheetData.data.skills.Savoir.rank, sheetData.data.skills.Social.rank))
                            },
                            hpAme: {
                                max: (Math.max(sheetData.data.skills.Arts.rank, sheetData.data.skills.Shaan.rank, sheetData.data.skills.Magie.rank)) + (Math.min(sheetData.data.skills.Arts.rank, sheetData.data.skills.Shaan.rank, sheetData.data.skills.Magie.rank))
                            },
                            hpCorps: {
                                max: (Math.max(sheetData.data.skills.Rituels.rank, sheetData.data.skills.Survie.rank, sheetData.data.skills.Combat.rank)) + (Math.min(sheetData.data.skills.Rituels.rank, sheetData.data.skills.Survie.rank, sheetData.data.skills.Combat.rank))
                            }
                        }
                    }
                })
                // Initiative
                const domain = sheetData.data.attributes.initiative.statistic,
                domainValue = actorData.system.skills[domain].rank + actorData.system.skills[domain].temp;
                sheetData.data.attributes.initiative.value = domainValue
                game.actors.get(actorData._id).getRollData().attributes.initiative.value = domainValue
            }

        console.log(sheetData);
        return sheetData;
    }
    activateListeners(html) {
        if (this.isEditable) {
            html.find(".item-create").click(this._onItemCreate.bind(this));
            html.find(".pouvoir-chat").click(this._onPouvoirChat.bind(this))
            html.find(".item-edit").click(this._onItemEdit.bind(this));
            html.find(".item-delete").click(this._onItemDelete.bind(this));
            html.find(".roll-initiative").click(this._onInitiative.bind(this));
            html.find(".roll-icon").click(this._onTest.bind(this));
            html.find(".spéTest").click(this._onSpéTest.bind(this));
            html.find(".spéTestNécr").click(this._onSpéTestNécr.bind(this));
            html.find(".regen-hp").click(this._onRegen.bind(this)); 
            const title = $(".sheet-navigation .active").attr("title");
                title && html.find(".navigation-title").text(title)                  
                        html.find(".sheet-navigation").on("mouseover", ".item,.manage-tabs", (event => {
                            const title = event.target.title;  
                            title && $(event.target).parents(".sheet-navigation").find(".navigation-title").text(title)
                        })), html.find(".sheet-navigation").on("mouseout", ".item,.manage-tabs", (event => {
                            const parent = $(event.target).parents(".sheet-navigation"),
                                title = parent.find(".item.active").attr("title");
                            title && parent.find(".navigation-title").text(title)
                        })); html.find(".open-compendium").on("click", (event => {
                            if (event.currentTarget.dataset.compendium) {
                                const compendium = game.packs.get(event.currentTarget.dataset.compendium);
                                console.log(compendium)
                                compendium && compendium.render(!0)
                            }
                        }))
        super.activateListeners(html);
        }
    }
    _onRegen(event) {
        let actor = this.actor 
        let hp = actor.system.attributes
        hp.hpEsprit.max = (Math.max(actor.system.skills.Technique.rank, actor.system.skills.Savoir.rank, actor.system.skills.Social.rank)) + (Math.min(actor.system.skills.Technique.rank, actor.system.skills.Savoir.rank, actor.system.skills.Social.rank))
        hp.hpAme.max = (Math.max(actor.system.skills.Arts.rank, actor.system.skills.Shaan.rank, actor.system.skills.Magie.rank)) + (Math.min(actor.system.skills.Arts.rank, actor.system.skills.Shaan.rank, actor.system.skills.Magie.rank))
        hp.hpCorps.max = (Math.max(actor.system.skills.Rituels.rank, actor.system.skills.Survie.rank, actor.system.skills.Combat.rank)) + (Math.min(actor.system.skills.Rituels.rank, actor.system.skills.Survie.rank, actor.system.skills.Combat.rank))

        Dice.RegenHP({
            actor,
            hp
        })
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
        const actorData = this.actor.toObject(!1)
        // Filtre Race
        let race = actorData.items.filter(function (item) { return item.type == "Race"});
        let lastElement = race[race.length - 1]
        
        race.forEach(element => {
            if(element != lastElement) {
                let itemId = element._id
                return this.actor.deleteEmbeddedDocuments("Item", [itemId])
            }
        });
        race = lastElement.name

        Dice.SpéTestNécr({
            actor,
            race,
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
        const actorData = this.actor.toObject(!1)
        // Filtre Race
        let race = actorData.items.filter(function (item) { return item.type == "Race"});
        let lastElement = race[race.length - 1]
        
        race.forEach(element => {
            if(element != lastElement) {
                let itemId = element._id
                return this.actor.deleteEmbeddedDocuments("Item", [itemId])
            }
        });
        race = lastElement.name

        if(dataset == "domainTest" || "necroseTest") {
            Dice[dataset]({
                actor,
                race,
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
        const protectionBtn = event.target.closest("#Protections-add")
        const relationBtn = event.target.closest("#Relations-add")
        const richesseBtn = event.target.closest("#Richesses-add")
        const technologieBtn = event.target.closest("#Technologie-add")
        const transportBtn = event.target.closest("#Transports-add")
        const batimentBtn = event.target.closest("#Bâtiments-add")
        const magicTrihnBtn = event.target.closest("#MagicTrihn-add")
        const graftAddBtn = event.target.closest("#graft-add")

        if(magicTrihnBtn) {
            let itemData = {
                name: "Trihn",
                type: "Trihn",
                item: {
                    system: {
                        trihnType: null,
                        puissance: null,
                        emplacement: null,
                        pouvoir: {
                            value: null
                        }
                    }
                }
            }
            return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();

        if(batimentBtn) {
            let itemData = {
                name: "Nouveau Bâtiment",
                type: "Bâtiment",
                img:"systems/Shaan_Renaissance/assets/icons/navbar/icon_acquis.webp"
              };
      
              return this.actor.createEmbeddedDocuments("Item", [itemData]);
              }
              this.actor.sheet.render();
        

        if(armementBtn) {
            let itemData = {
                name: "Nouvel Armement",
                type: "Armement",
                img:"systems/Shaan_Renaissance/assets/icons/navbar/icon_acquis.webp"
              };
      
              return this.actor.createEmbeddedDocuments("Item", [itemData]);
              }
              this.actor.sheet.render();

        if(armimaleBtn) {
            let itemData = {
                name: "Nouvelle Armimale",
                type: "Armimale",
                img:"systems/Shaan_Renaissance/assets/icons/navbar/icon_acquis.webp"
                };
          
                return this.actor.createEmbeddedDocuments("Item", [itemData]);
                }
                this.actor.sheet.render();

        if(artefactBtn) {
            let itemData = {
                name: "Nouvel Artefact",
                type: "Artefact",
                img:"systems/Shaan_Renaissance/assets/icons/navbar/icon_acquis.webp"
                };
        
                return this.actor.createEmbeddedDocuments("Item", [itemData]);
                }
                this.actor.sheet.render();

        if(manuscritBtn) {
            let itemData = {
                name: "Nouveau Manuscrit",
                type: "Manuscrit",
                img:"systems/Shaan_Renaissance/assets/icons/navbar/icon_acquis.webp"
            };
            
            return this.actor.createEmbeddedDocuments("Item", [itemData]);
            }
            this.actor.sheet.render();

        if(outilBtn) {
            let itemData = {
                name: "Nouvel Outil",
                type: "Outil",
                img:"systems/Shaan_Renaissance/assets/icons/navbar/icon_acquis.webp"
            };
            
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();

        if(protectionBtn) {
            let itemData = {
                name: "Nouvelle Protection",
                type: "Protection",
                img:"systems/Shaan_Renaissance/assets/icons/navbar/icon_acquis.webp"
            };
            
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();

        if(relationBtn) {
        let itemData = {
            name: "Nouvelle Relation",
            type: "Relation",
            img:"systems/Shaan_Renaissance/assets/icons/navbar/icon_acquis.webp"
            };
    
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();

        if(richesseBtn) {
        let itemData = {
            name: "Nouvelle Richesse",
            type: "Richesse",
            img:"systems/Shaan_Renaissance/assets/icons/navbar/icon_acquis.webp"
            };
    
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();

        if(technologieBtn) {
        let itemData = {
            name: "Nouvelle Technologie",
            type: "Technologie",
            img:"systems/Shaan_Renaissance/assets/icons/navbar/icon_acquis.webp"
            };
    
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        }
        this.actor.sheet.render();

        if(transportBtn) {
        let itemData = {
            name: "Nouveau Transport",
            type: "Transport",
            img:"systems/Shaan_Renaissance/assets/icons/navbar/icon_acquis.webp"
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

        if (graftAddBtn) {
            let actor = this.actor
            const actorData = actor.toObject(!1)
            const itemsF = actorData.items.filter(function (item) { return item.system.morphe == false && item.type == "Armement" || item.system.morphe == false && item.type == "Outil" || item.system.morphe == false && item.type == "Protection" || item.system.morphe == false && item.type == "Technologie"})

            graftCreate({
                actor: actor,
                items: itemsF
            })

            console.log(actorData)
            
            async function graftCreate ({
                actor = null,
                items = null
            } = {}) { 
                let item
                let actorId = actor._id
                let checkOptions = await GetGraftOptions ({item})
    
                if (checkOptions.cancelled) {
                    return;
                }
                
                item = checkOptions.item
                const itemF = actor.items.get(item)
                itemF.update({
                    system: {
                        morphe: true
                    }
                })
                actor.sheet.render()
                
            
            async function GetGraftOptions({
                item = null,
                template = "systems/Shaan_Renaissance/templates/actors/Personnage/partials/createGraft-dialog.hbs"} = {}) {
                    const actorData = actor
                    actorData.itemsNotGraft = actorData.items.filter(function (item) { return item.system.morphe == false && item.type == "Armement" || item.system.morphe == false && item.type == "Outil" || item.system.morphe == false && item.type == "Protection" || item.system.morphe == false && item.type == "Technologie"})
                    const html = await renderTemplate(template, { actor, item });
    
                    return new Promise(resolve => {
                        const data = {
                            title: game.i18n.format("Greffe de module"),
                            content: html,
                            actor: actorData,
                            buttons: {
                                normal: {
                                  label: game.i18n.localize("chat.actions.graft"),
                                  callback: html => resolve(_processGraftCreateOptions(html[0].querySelector("form")))
                                },
                                cancel: {
                                  label: game.i18n.localize("chat.actions.cancel"),
                                  callback: html => resolve({ cancelled: true })
                                }
                              },
                              default: "normal",
                              close: () => resolve({ cancelled: true }),
                        };
                        new Dialog(data, null).render(true);
                    });
            }
            function _processGraftCreateOptions(form) {
                return {
                    item: form.item?.value
                }
            }
            
        }
        
        }

    }
    _onPouvoirChat(event) {
        event.preventDefault();
        let element = event.target
        let itemId = element.closest(".item").dataset.itemId;
        let actor = this.actor
        let item = actor.items.get(itemId)

        PouvoirChat({
            actor: actor,
            pouvoir: item
        })

        async function PouvoirChat({
            actor = null,
            pouvoir = null,
            extraMessageData = {},
            sendMessage = true
        } = {}) {
            const messageTemplate = "systems/Shaan_Renaissance/templates/chat/pouvoir-chat.hbs";

            if(sendMessage) {
                ToCustomMessage(actor, pouvoir, messageTemplate, {
                    ...extraMessageData,
                    actorID: actor.uuid
                })
            }

            async function ToCustomMessage(actor = null, pouvoir, template, extraData) {
                let templateContext = {
                    ...extraData,
                    pouvoirData: pouvoir
                };
                console.log(templateContext)
                console.log(pouvoir)

                let chatData = {
                    user: game.user.id,
                    speaker: ChatMessage.getSpeaker({actor}),
                    content: await renderTemplate(template, templateContext),
                    sound: CONFIG.sounds.notification,
                    type: CONST.CHAT_MESSAGE_TYPES.OTHER
                }
                console.log(chatData)

                ChatMessage.create(chatData)
            }
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