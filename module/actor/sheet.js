import { Symbiose } from "../item/ability/symbiose.js";
import * as Dice from "../jets/dice.js";
import { htmlQuery } from "../utils/utils.js";
import { ShaaniSR } from "./Shaani/document.js";
import { LootSR } from "./loot/LootSR.js";
export class ActorSheetSR extends ActorSheet {
  get template() {
    return `systems/shaanrenaissance/templates/actors/${this.actor.type}/sheet.hbs`;
  }
  itemSort(items) {
    items.sort((a, b) => (a.sort || 0) - (b.sort || 0));
  }
  itemFilter(sheetData, actorData) {
    if (
      typeof actorData.items.filter(function (item) {
        return item.system.pouvoir;
      }) !== undefined
    ) {
      (sheetData.items.Category = {}),
        (sheetData.items.Category.Armement = actorData.items.filter(function (
          item
        ) {
          return item.type == "Armement" && item.system.morphe == false;
        })),
        (sheetData.items.Category.Armimales = actorData.items.filter(function (
          item
        ) {
          return item.type == "Armimale";
        })),
        (sheetData.items.Category.Artefacts = actorData.items.filter(function (
          item
        ) {
          return item.type == "Artefact";
        })),
        (sheetData.items.Category.Manuscrits = actorData.items.filter(function (
          item
        ) {
          return item.type == "Manuscrit";
        })),
        (sheetData.items.Category.Outils = actorData.items.filter(function (
          item
        ) {
          return item.type == "Outil" && item.system.morphe == false;
        })),
        (sheetData.items.Category.Protections = actorData.items.filter(
          function (item) {
            return item.type == "Protection" && item.system.morphe == false;
          }
        )),
        (sheetData.items.Category.Relations = actorData.items.filter(function (
          item
        ) {
          return item.type == "Relation";
        })),
        (sheetData.items.Category.Richesses = actorData.items.filter(function (
          item
        ) {
          return item.type == "Richesse";
        })),
        (sheetData.items.Category.Technologie = actorData.items.filter(
          function (item) {
            return item.type == "Technologie" && item.system.morphe == false;
          }
        )),
        (sheetData.items.Category.Transports = actorData.items.filter(function (
          item
        ) {
          return item.type == "Transport";
        }));
      sheetData.items.Category.Bâtiments = actorData.items.filter(function (
        item
      ) {
        return item.type == "Bâtiment";
      });
      sheetData.SummonedTrihns = actorData.items.filter(function (item) {
        return item.type == "Trihn";
      });
      sheetData.morpheModules = actorData.items.filter(function (item) {
        return (
          (item.system.morphe == true && item.type == "Protection") ||
          (item.system.morphe == true && item.type == "Outil") ||
          (item.system.morphe == true && item.type == "Armement") ||
          (item.system.morphe == true && item.type == "Technologie")
        );
      });

      (sheetData.pouvoirEsprit = actorData.items.filter(function (item) {
        return (
          (item.type == "Pouvoir" && item.system.trihn == "Esprit") ||
          item.system.pouvoir.value == "Astuce de Technique" ||
          item.system.pouvoir.value == "Secret de Savoir" ||
          item.system.pouvoir.value == "Privilège de Social"
        );
      })),
        (sheetData.pouvoirAme = actorData.items.filter(function (item) {
          return (
            (item.type == "Pouvoir" && item.system.trihn == "Âme") ||
            item.system.pouvoir.value == "Création d'Arts" ||
            item.system.pouvoir.value == "Symbiose de Shaan" ||
            item.system.pouvoir.value == "Sort de Magie"
          );
        })),
        (sheetData.pouvoirCorps = actorData.items.filter(function (item) {
          return (
            (item.type == "Pouvoir" && item.system.trihn == "Corps") ||
            item.system.pouvoir.value == "Transe de Rituels" ||
            item.system.pouvoir.value == "Exploit de Survie" ||
            item.system.pouvoir.value == "Tactique de Combat"
          );
        })),
        (sheetData.pouvoirNecrose = actorData.items.filter(function (item) {
          return (
            (item.type == "Pouvoir" && item.system.trihn == "Nécrose") ||
            item.system.pouvoir.value == "Tourment de Nécrose"
          );
        }));
    }
  }
  characterFilter(sheetData, actorData) {
    // Filtre Race
    let race = actorData.items.filter(function (item) {
      return item.type == "Race";
    });
    let lastElement = race[race.length - 1];
    let avantLastElement = race[race.length - 2];

    race.forEach((element) => {
      if (
        sheetData.data.attributes &&
        sheetData.data.attributes.isIndar === false
      ) {
        if (element != lastElement) {
          let itemId = element._id;
          return this.actor.deleteEmbeddedDocuments("Item", [itemId]);
        }
      } else if (
        sheetData.data.attributes &&
        sheetData.data.attributes.isIndar === true
      ) {
        if (element != lastElement && element != avantLastElement) {
          let itemId = element._id;
          return this.actor.deleteEmbeddedDocuments("Item", [itemId]);
        }
      }
    });
    if (
      sheetData.data.attributes &&
      sheetData.data.attributes.isIndar == true
    ) {
      sheetData.Race = lastElement;
      sheetData.RaceSecondaire = avantLastElement;
    } else {
      sheetData.Race = lastElement;
    }
    if (
      typeof sheetData.data.attributes !== "undefined" &&
      typeof sheetData.Race !== "undefined"
    ) {
      if (sheetData.Race.name === "Nécrosien") {
        this.actor.update({
          data: {
            attributes: { isNecrosian: true },
          },
        });
      }
    }
    // Filtre Peuple
    let peuple = actorData.items.filter(function (item) {
      return item.type == "Peuple";
    });
    lastElement = peuple[peuple.length - 1];

    peuple.forEach((element) => {
      if (element != lastElement) {
        let itemId = element._id;
        return this.actor.deleteEmbeddedDocuments("Item", [itemId]);
      }
    });
    sheetData.Peuple = lastElement;
    // Filtre Caste
    let caste = actorData.items.filter(function (item) {
      return item.type == "Caste";
    });
    lastElement = caste[caste.length - 1];

    caste.forEach((element) => {
      if (element != lastElement) {
        let itemId = element._id;
        return this.actor.deleteEmbeddedDocuments("Item", [itemId]);
      }
    });
    sheetData.Caste = lastElement;
    // Filtre Métier
    let metier = actorData.items.filter(function (item) {
      return item.type == "Métier";
    });
    lastElement = metier[metier.length - 1];

    metier.forEach((element) => {
      if (element != lastElement) {
        let itemId = element._id;
        return this.actor.deleteEmbeddedDocuments("Item", [itemId]);
      }
    });
    sheetData.Metier = lastElement;
  }
  defineMaxHealth(sheetData) {
    if (typeof sheetData.data.attributes !== "undefined") {
      if (sheetData.data.attributes.isNecrosian) {
        this.actor.update({
          data: {
            attributes: {
              hpEsprit: {
                max:
                  Math.max(
                    sheetData.data.skills.Technique.rank,
                    sheetData.data.skills.Savoir.rank,
                    sheetData.data.skills.Social.rank
                  ) +
                  Math.min(
                    sheetData.data.skills.Technique.rank,
                    sheetData.data.skills.Savoir.rank,
                    sheetData.data.skills.Social.rank
                  ),
              },
              hpCorps: {
                max:
                  Math.max(
                    sheetData.data.skills.Rituels.rank,
                    sheetData.data.skills.Survie.rank,
                    sheetData.data.skills.Combat.rank
                  ) +
                  Math.min(
                    sheetData.data.skills.Rituels.rank,
                    sheetData.data.skills.Survie.rank,
                    sheetData.data.skills.Combat.rank
                  ),
              },
            },
          },
        });
      } else {
        this.actor.update({
          data: {
            attributes: {
              hpEsprit: {
                max:
                  Math.max(
                    sheetData.data.skills.Technique.rank,
                    sheetData.data.skills.Savoir.rank,
                    sheetData.data.skills.Social.rank
                  ) +
                  Math.min(
                    sheetData.data.skills.Technique.rank,
                    sheetData.data.skills.Savoir.rank,
                    sheetData.data.skills.Social.rank
                  ),
              },
              hpAme: {
                max:
                  Math.max(
                    sheetData.data.skills.Arts.rank,
                    sheetData.data.skills.Shaan.rank,
                    sheetData.data.skills.Magie.rank
                  ) +
                  Math.min(
                    sheetData.data.skills.Arts.rank,
                    sheetData.data.skills.Shaan.rank,
                    sheetData.data.skills.Magie.rank
                  ),
              },
              hpCorps: {
                max:
                  Math.max(
                    sheetData.data.skills.Rituels.rank,
                    sheetData.data.skills.Survie.rank,
                    sheetData.data.skills.Combat.rank
                  ) +
                  Math.min(
                    sheetData.data.skills.Rituels.rank,
                    sheetData.data.skills.Survie.rank,
                    sheetData.data.skills.Combat.rank
                  ),
              },
            },
          },
        });
      }
    }
  }
  defineInitiative(sheetData, actorData) {
    if (typeof sheetData.data.attributes !== "undefined") {
      const domain = sheetData.data.attributes.initiative.statistic,
        domainValue =
          actorData.system.skills[domain].rank +
          actorData.system.skills[domain].temp;
      sheetData.data.attributes.initiative.value = domainValue;
      if (game.actors.get(actorData._id)) {
        game.actors
          .get(actorData._id)
          .getRollData().attributes.initiative.value = domainValue;
      }
    }
  }
  activateListeners(html) {
    super.activateListeners(html);
    const $html = html[0];

    html.find(".add-acquis").click(this._onAcquisCreate.bind(this));
    html.find(".item-create").click(this._onItemCreate.bind(this));
    html.find(".item-edit").click(this._onItemEdit.bind(this));
    html.find(".item-delete").click(this._onItemDelete.bind(this));
    html.find(".pouvoir-chat").click(this._onPouvoirChat.bind(this));
    html.find(".acquis-chat").click(this._onAcquisChat.bind(this));
    html.find(".pouvoir-use").click(this._onPouvoirUse.bind(this));
    html.find(".item-wear").click(this._onAcquisUse.bind(this));
    html.find(".regen-hp").click(this._onRegen.bind(this));
    html.find(".select-input").focus(this._onInputSelect);
    html.find(".roll-initiative").click(this._onInitiative.bind(this));
    html.find(".roll-icon").click(this._onTest.bind(this));
    html.find(".spéTest").click(this._onSpéTest.bind(this));
    html.find(".spéTestNécr").click(this._onSpéTestNécr.bind(this));

    const imageLink = htmlQuery($html, "a[data-action=show-image]");
    if (!imageLink) return;

    imageLink.addEventListener("click", () => {
      const actor = this.actor;
      const title =
        actor?.token?.name || actor?.prototypeToken?.name || actor.name;

      new ImagePopout(actor.img, {
        title,
        uuid: actor.uuid,
      }).render(true);
    });
  }
  _onInputSelect(event) {
    event.currentTarget.select();
  }
  // ICI
  _onSpéTest(event) {
    let actor = this.actor;
    let domain = $(event.target.closest(".pc"))
      .children(".specialisations-title")
      .find(".specialisations-label")
      .text();
    let spécialisation = $(event.target)
      .text()
      .toLowerCase()
      .replaceAll(" ", "")
      .replace("'", "")
      .replaceAll("é", "e")
      .replace("è", "e")
      .replace("ê", "e")
      .replace("à", "a")
      .replace("â", "a")
      .replace("î", "i");
    let description = game.i18n.translations.SRspéDesc[spécialisation];
    console.log(domain, spécialisation);

    Dice.SpéTest({
      actor,
      domain: domain,
      spécialisation: spécialisation,
      description: description,
      askForOptions: event.shiftKey,
    });
  }

  _onSpéTestNécr(event) {
    let actor = this.actor;
    let domain = $(event.target.closest(".pc"))
      .children(".specialisations-title")
      .find(".specialisations-label")
      .text();
    let spécialisation = $(event.target)
      .text()
      .toLowerCase()
      .replaceAll(" ", "")
      .replace("'", "")
      .replaceAll("é", "e")
      .replace("è", "e")
      .replace("ê", "e")
      .replace("à", "a")
      .replace("â", "a")
      .replace("î", "i");
    let description = game.i18n.translations.SRspéDesc[spécialisation];

    const actorData = actor.toObject(!1)
    // Filtre Race
    let race = actorData.items.filter(function (item) {
      return item.type == "Race";
    });
    let lastElement = race[race.length - 1];
    if (actor.conditions.unconscious)
      return ui.notifications.warn("Ce personnage est Inconscient");

    race.forEach((element) => {
      if (element != lastElement) {
        let itemId = element._id;
        return this.actor.deleteEmbeddedDocuments("Item", [itemId]);
      }
    });
    if(lastElement){
      race = lastElement.name;
    }

    Dice.SpéTestNécr({
      actor,
      domain: domain,
      spécialisation: spécialisation,
      description: description,
      askForOptions: event.shiftKey,
      race:race
    });
  }

  _onInitiative(event) {
    const dataset = event.currentTarget.dataset;
    let actor = this.actor;

    Dice.Initiative({
      actor,
      domain: dataset.domain,
      domainLevel: dataset.domainLevel,
    });
  }
  _onTest(event) {
    const dataset = event.target.closest(".roll-data").dataset.itemId;
    let actor = this.actor;
    const actorData = actor.toObject(!1)
    // Filtre Race
    let race = actorData.items.filter(function (item) {
      return item.type == "Race";
    });
    let lastElement = race[race.length - 1];
    if (actor.conditions.unconscious)
      return ui.notifications.warn("Ce personnage est Inconscient");

    race.forEach((element) => {
      if (element != lastElement) {
        let itemId = element._id;
        return this.actor.deleteEmbeddedDocuments("Item", [itemId]);
      }
    });
    if(lastElement){
      race = lastElement.name;
    }
    if (dataset == "domainTest" || "necroseTest") {
      Dice[dataset]({
        actor,
        checkType: dataset,
        race: race
      });
    }
  }
  _onRegen(event) {
    let actor = this.actor;
    let hp = actor.system.attributes;
    hp.hpEsprit.max =
      Math.max(
        actor.system.skills.Technique.rank,
        actor.system.skills.Savoir.rank,
        actor.system.skills.Social.rank
      ) +
      Math.min(
        actor.system.skills.Technique.rank,
        actor.system.skills.Savoir.rank,
        actor.system.skills.Social.rank
      );
    hp.hpAme.max =
      Math.max(
        actor.system.skills.Arts.rank,
        actor.system.skills.Shaan.rank,
        actor.system.skills.Magie.rank
      ) +
      Math.min(
        actor.system.skills.Arts.rank,
        actor.system.skills.Shaan.rank,
        actor.system.skills.Magie.rank
      );
    hp.hpCorps.max =
      Math.max(
        actor.system.skills.Rituels.rank,
        actor.system.skills.Survie.rank,
        actor.system.skills.Combat.rank
      ) +
      Math.min(
        actor.system.skills.Rituels.rank,
        actor.system.skills.Survie.rank,
        actor.system.skills.Combat.rank
      );

    Dice.RegenHP({
      actor,
      hp,
    });
  }
  _onAcquisCreate(event) {
    let actor = this.actor;
    event.preventDefault();
    acquisCreate({
      actor,
    });

    async function acquisCreate({ actor = null, type = null } = {}) {
      const actorData = actor ? actor.system : null;
      let checkOptions = await GetAcquisOptions({ type });

      if (checkOptions.cancelled) {
        return;
      }

      type = checkOptions.type;

      let itemData = {
        name: "Nouvel Acquis",
        type: type,
        img: "systems/shaanrenaissance/assets/icons/navbar/icon_acquis.webp",
      };
      return actor.createEmbeddedDocuments("Item", [itemData]);

      async function GetAcquisOptions({
        type = null,
        template = "systems/shaanrenaissance/templates/actors/PNJ/partials/createAcquis-dialog.hbs",
      } = {}) {
        const actorData = actor.toObject(!1);
        actorData.itemTypes = {
          Armement: {},
          Armimale: {},
          Artefact: {},
          Manuscrit: {},
          Outil: {},
          Protection: {},
          Relation: {},
          Richesse: {},
          Technologie: {},
          Transport: {},
          Bâtiment: {},
        };
        const html = await renderTemplate(template, {
          actor,
          type,
          config: CONFIG.shaanRenaissance,
        });

        return new Promise((resolve) => {
          const data = {
            title: game.i18n.format("Création d'Acquis"),
            content: html,
            actor: actorData,
            buttons: {
              normal: {
                label: game.i18n.localize("chat.actions.create"),
                callback: (html) =>
                  resolve(
                    _processAcquisCreateOptions(html[0].querySelector("form"))
                  ),
              },
              cancel: {
                label: game.i18n.localize("chat.actions.cancel"),
                callback: (html) => resolve({ cancelled: true }),
              },
            },
            default: "normal",
            close: () => resolve({ cancelled: true }),
          };
          new Dialog(data, null).render(true);
        });
      }
      function _processAcquisCreateOptions(form) {
        return {
          type: form.type?.value,
        };
      }
    }
  }

  _onItemCreate(event) {
    event.preventDefault();
    let actor = this.actor;
    const espritBtn = event.target.closest("#Esprit-add");
    const ameBtn = event.target.closest("#Ame-add");
    const corpsBtn = event.target.closest("#Corps-add");
    const necroseBtn = event.target.closest("#Nécrose-add");
    const magicTrihnBtn = event.target.closest("#MagicTrihn-add");
    const graftAddBtn = event.target.closest("#graft-add");

    if (magicTrihnBtn) {
      trihnCreate({
        actor,
      });

      async function trihnCreate({
        actor = null,
        trihn = null,
        puissance = null,
      } = {}) {
        const actorData = actor ? actor.system : null;
        let checkOptions = await GetPouvoirOptions({ trihn, puissance });

        if (checkOptions.cancelled) {
          return;
        }
        let invocation = await Dice.SpéTest({
          actor,
          domain: "Magie",
          spécialisation: "invocation",
          askForOptions: false,
        });
        (trihn = checkOptions.trihn), (puissance = checkOptions.puissance);

        let itemData = {
          name: `${trihn}`,
          type: "Trihn",
          system: {
            trihnType: trihn,
            puissance: puissance,
            emplacement: "Transit",
          },
          img: `systems/shaanrenaissance/assets/icons/trihns/${trihn}.webp`,
        };
        return actor.createEmbeddedDocuments("Item", [itemData]);

        async function GetPouvoirOptions({
          type = null,
          puissance = null,
          template = "systems/shaanrenaissance/templates/dialogs/createTrihn-dialog.hbs",
        } = {}) {
          const actorData = actor.toObject(!1);
          actorData.pouvoirTypes = {
            Esprit: {},
            Ame: {},
            Corps: {},
            "Anti-Âme": {},
          };
          const html = await renderTemplate(template, {
            actor,
            trihn,
            puissance,
            config: CONFIG.shaanRenaissance,
          });

          return new Promise((resolve) => {
            const data = {
              title: game.i18n.format("Invocation de Trihn"),
              content: html,
              actor: actorData,
              buttons: {
                normal: {
                  label: game.i18n.localize("chat.actions.create"),
                  callback: (html) =>
                    resolve(
                      _processAcquisCreateOptions(html[0].querySelector("form"))
                    ),
                },
                cancel: {
                  label: game.i18n.localize("chat.actions.cancel"),
                  callback: (html) => resolve({ cancelled: true }),
                },
              },
              default: "normal",
              close: () => resolve({ cancelled: true }),
            };
            new Dialog(data, null).render(true);
          });
        }
        function _processAcquisCreateOptions(form) {
          return {
            trihn: form.trihn?.value,
            puissance: form.puissance?.value,
          };
        }
      }
    }
    this.actor.sheet.render();

    if (espritBtn) {
      espritPouvoirCreate({
        actor,
      });

      async function espritPouvoirCreate({ actor = null, type = null } = {}) {
        const actorData = actor ? actor.system : null;
        let checkOptions = await GetPouvoirOptions({ type });

        if (checkOptions.cancelled) {
          return;
        }

        type = checkOptions.type;
        let itemData = {
          name: `${type}`,
          type: "Pouvoir",
          system: { pouvoir: { value: type } },
          img: `systems/shaanrenaissance/assets/icons/domaines/${type
            .replace("Astuce de ", "")
            .replace("Secret de ", "")
            .replace("Privilège de ", "")}.png`,
        };
        return actor.createEmbeddedDocuments("Item", [itemData]);

        async function GetPouvoirOptions({
          type = null,
          template = "systems/shaanrenaissance/templates/dialogs/createPouvoirEsprit-dialog.hbs",
        } = {}) {
          const actorData = actor.toObject(!1);
          actorData.pouvoirTypes = {
            Technique: {},
            Savoir: {},
            Social: {},
          };
          const html = await renderTemplate(template, {
            actor,
            type,
            config: CONFIG.shaanRenaissance,
          });

          return new Promise((resolve) => {
            const data = {
              title: game.i18n.format("Création de Pouvoir"),
              content: html,
              actor: actorData,
              buttons: {
                normal: {
                  label: game.i18n.localize("chat.actions.create"),
                  callback: (html) =>
                    resolve(
                      _processAcquisCreateOptions(html[0].querySelector("form"))
                    ),
                },
                cancel: {
                  label: game.i18n.localize("chat.actions.cancel"),
                  callback: (html) => resolve({ cancelled: true }),
                },
              },
              default: "normal",
              close: () => resolve({ cancelled: true }),
            };
            new Dialog(data, null).render(true);
          });
        }
        function _processAcquisCreateOptions(form) {
          return {
            type: form.type?.value,
          };
        }
      }
    }
    this.actor.sheet.render();

    if (ameBtn) {
      amePouvoirCreate({
        actor,
      });

      async function amePouvoirCreate({ actor = null, type = null } = {}) {
        const actorData = actor ? actor.system : null;
        let checkOptions = await GetPouvoirOptions({ type });

        if (checkOptions.cancelled) {
          return;
        }

        type = checkOptions.type;
        let itemData = {
          name: `${type}`,
          type: "Pouvoir",
          system: { pouvoir: { value: type } },
          img: `systems/shaanrenaissance/assets/icons/domaines/${type
            .replace("Création d'", "")
            .replace("Symbiose de ", "")
            .replace("Sort de ", "")}.png`,
        };
        return actor.createEmbeddedDocuments("Item", [itemData]);

        async function GetPouvoirOptions({
          type = null,
          template = "systems/shaanrenaissance/templates/dialogs/createPouvoirAme-dialog.hbs",
        } = {}) {
          const actorData = actor.toObject(!1);
          actorData.pouvoirTypes = {
            Arts: {},
            Shaan: {},
            Magie: {},
          };
          const html = await renderTemplate(template, {
            actor,
            type,
            config: CONFIG.shaanRenaissance,
          });

          return new Promise((resolve) => {
            const data = {
              title: game.i18n.format("Création de Pouvoir"),
              content: html,
              actor: actorData,
              buttons: {
                normal: {
                  label: game.i18n.localize("chat.actions.create"),
                  callback: (html) =>
                    resolve(
                      _processAcquisCreateOptions(html[0].querySelector("form"))
                    ),
                },
                cancel: {
                  label: game.i18n.localize("chat.actions.cancel"),
                  callback: (html) => resolve({ cancelled: true }),
                },
              },
              default: "normal",
              close: () => resolve({ cancelled: true }),
            };
            new Dialog(data, null).render(true);
          });
        }
        function _processAcquisCreateOptions(form) {
          return {
            type: form.type?.value,
          };
        }
      }
    }
    this.actor.sheet.render();

    if (corpsBtn) {
      corpsPouvoirCreate({
        actor,
      });

      async function corpsPouvoirCreate({ actor = null, type = null } = {}) {
        const actorData = actor ? actor.system : null;
        let checkOptions = await GetPouvoirOptions({ type });

        if (checkOptions.cancelled) {
          return;
        }

        type = checkOptions.type;
        let itemData = {
          name: `${type}`,
          type: "Pouvoir",
          system: { pouvoir: { value: type } },
          img: `systems/shaanrenaissance/assets/icons/domaines/${type
            .replace("Transe de ", "")
            .replace("Exploit de ", "")
            .replace("Tactique de ", "")}.png`,
        };
        return actor.createEmbeddedDocuments("Item", [itemData]);

        async function GetPouvoirOptions({
          type = null,
          template = "systems/shaanrenaissance/templates/dialogs/createPouvoirCorps-dialog.hbs",
        } = {}) {
          const actorData = actor.toObject(!1);
          actorData.pouvoirTypes = {
            Rituels: {},
            Survie: {},
            Combat: {},
          };
          const html = await renderTemplate(template, {
            actor,
            type,
            config: CONFIG.shaanRenaissance,
          });

          return new Promise((resolve) => {
            const data = {
              title: game.i18n.format("Création de Pouvoir"),
              content: html,
              actor: actorData,
              buttons: {
                normal: {
                  label: game.i18n.localize("chat.actions.create"),
                  callback: (html) =>
                    resolve(
                      _processAcquisCreateOptions(html[0].querySelector("form"))
                    ),
                },
                cancel: {
                  label: game.i18n.localize("chat.actions.cancel"),
                  callback: (html) => resolve({ cancelled: true }),
                },
              },
              default: "normal",
              close: () => resolve({ cancelled: true }),
            };
            new Dialog(data, null).render(true);
          });
        }
        function _processAcquisCreateOptions(form) {
          return {
            type: form.type?.value,
          };
        }
      }
    }
    this.actor.sheet.render();

    if (necroseBtn) {
      let itemData = {
        name: `Tourment de Nécrose`,
        type: "Pouvoir",
        system: { pouvoir: { value: "Tourment de Nécrose" } },
        img: `systems/shaanrenaissance/assets/icons/domaines/Nécrose.png`,
      };

      return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }
    this.actor.sheet.render();

    if (graftAddBtn) {
      let actor = this.actor;
      const actorData = actor.toObject(!1);
      const itemsF = actorData.items.filter(function (item) {
        return (
          (item.system.morphe == false && item.type == "Armement") ||
          (item.system.morphe == false && item.type == "Outil") ||
          (item.system.morphe == false && item.type == "Protection") ||
          (item.system.morphe == false && item.type == "Technologie")
        );
      });

      graftCreate({
        actor: actor,
        items: itemsF,
      });

      async function graftCreate({ actor = null, items = null } = {}) {
        let item;
        let actorId = actor._id;
        let checkOptions = await GetGraftOptions({ item });

        if (checkOptions.cancelled) {
          return;
        }

        item = checkOptions.item;
        const itemF = actor.items.get(item);
        itemF.update({
          system: {
            morphe: true,
          },
        });
        actor.sheet.render();

        async function GetGraftOptions({
          item = null,
          template = "systems/shaanrenaissance/templates/actors/Personnage/partials/createGraft-dialog.hbs",
        } = {}) {
          const actorData = actor;
          actorData.itemsNotGraft = actorData.items.filter(function (item) {
            return (
              (item.system.morphe == false && item.type == "Armement") ||
              (item.system.morphe == false && item.type == "Outil") ||
              (item.system.morphe == false && item.type == "Protection") ||
              (item.system.morphe == false && item.type == "Technologie")
            );
          });
          const html = await renderTemplate(template, { actor, item });

          return new Promise((resolve) => {
            const data = {
              title: game.i18n.format("Greffe de module"),
              content: html,
              actor: actorData,
              buttons: {
                normal: {
                  label: game.i18n.localize("chat.actions.graft"),
                  callback: (html) =>
                    resolve(
                      _processGraftCreateOptions(html[0].querySelector("form"))
                    ),
                },
                cancel: {
                  label: game.i18n.localize("chat.actions.cancel"),
                  callback: (html) => resolve({ cancelled: true }),
                },
              },
              default: "normal",
              close: () => resolve({ cancelled: true }),
            };
            new Dialog(data, null).render(true);
          });
        }
        function _processGraftCreateOptions(form) {
          return {
            item: form.item?.value,
          };
        }
      }
    }
  }
  _onAcquisChat(event) {
    event.preventDefault();
    let element = event.target;
    let itemId = element.closest(".item").dataset.itemId;
    let actor = this.actor;
    let item = actor.items.get(itemId);

    AcquisChat({
      actor: actor,
      acquis: item,
    });

    async function AcquisChat({
      actor = null,
      acquis = null,
      extraMessageData = {},
      sendMessage = true,
    } = {}) {
      const messageTemplate =
        "systems/shaanrenaissance/templates/chat/acquis-chat.hbs";

      if (sendMessage) {
        ToCustomMessage(actor, acquis, messageTemplate, {
          ...extraMessageData,
          actorID: actor.uuid,
        });
      }

      async function ToCustomMessage(
        actor = null,
        acquis,
        template,
        extraData
      ) {
        let templateContext = {
          ...extraData,
          acquisData: acquis,
        };

        let chatData = {
          user: game.user.id,
          speaker: ChatMessage.getSpeaker({ actor }),
          content: await renderTemplate(template, templateContext),
          sound: CONFIG.sounds.notification,
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        };

        ChatMessage.create(chatData);
      }
    }
  }
  _onPouvoirChat(event) {
    event.preventDefault();
    let element = event.target;
    let itemId = element.closest(".item").dataset.itemId;
    let actor = this.actor;
    let item = actor.items.get(itemId);

    PouvoirChat({
      actor: actor,
      pouvoir: item,
    });

    async function PouvoirChat({
      actor = null,
      pouvoir = null,
      extraMessageData = {},
      sendMessage = true,
    } = {}) {
      const messageTemplate =
        "systems/shaanrenaissance/templates/chat/pouvoir-chat.hbs";

      if (sendMessage) {
        ToCustomMessage(actor, pouvoir, messageTemplate, {
          ...extraMessageData,
          actorID: actor.uuid,
        });
      }

      async function ToCustomMessage(
        actor = null,
        pouvoir,
        template,
        extraData
      ) {
        let templateContext = {
          ...extraData,
          pouvoirData: pouvoir,
        };
        console.log(templateContext);
        console.log(pouvoir);

        let chatData = {
          user: game.user.id,
          speaker: ChatMessage.getSpeaker({ actor }),
          content: await renderTemplate(template, templateContext),
          sound: CONFIG.sounds.notification,
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        };
        console.log(chatData);

        ChatMessage.create(chatData);
      }
    }
  }
  _onPouvoirUse(event) {
    let itemId = event.target.closest(".item").dataset.itemId;
    let item = this.actor.items.get(itemId);

    if (item.system.isUsed == false) {
      item.update({
        system: {
          isUsed: true,
        },
      });
    } else if (item.system.isUsed == true) {
      item.update({
        system: {
          isUsed: false,
        },
      });
    }
  }
  async _onAcquisUse(event) {
    const itemId = event.target.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
    const isUsed = item.system.isUsed;
    console.log(item);
    const effects = this.actor.effects.filter((effect) =>
      effect.origin.endsWith(itemId)
    );
    console.log(effects);
    for (const effect of effects) {
      const isDisabled = effect.disabled;
      await effect.update({
        disabled: !isDisabled,
      });
    }
    return item.update({ "system.isUsed": !isUsed });
  }
  _onItemEdit(event) {
    event.preventDefault();
    let element = event.target;
    let itemId = element.closest(".item").dataset.itemId;
    let item = this.actor.items.get(itemId);

    item.sheet.render(true);
  }
  _onItemDelete(event) {
    event.preventDefault();
    let element = event.target;
    let itemId = element.closest(".item").dataset.itemId;
    return this.actor.deleteEmbeddedDocuments("Item", [itemId]);
  }
  async _onDropItem(event, data) {
    if ( !this.actor.isOwner ) return false;
    const item = await Item.implementation.fromDropData(data);
    const itemData = item.toObject();

    // Handle item sorting within the same Actor
    if ( this.actor.uuid === item.parent?.uuid ) return this._onSortItem(event, itemData);

    // Create the owned item
    if(item instanceof Symbiose){
      if(this.document instanceof ShaaniSR){
        return this._onDropItemCreate(itemData);
      } else {
        return ui.notifications.warn("Une Symbiose ne peut être ajoutées qu'à un Shaani")
      }
    } else if(this.document instanceof LootSR) {
      if(game.user.role == 4) {
        return this._onDropItemCreate(itemData);
      } else {
        return;
      }
    } else {
      return this._onDropItemCreate(itemData);
    }
  }
}
