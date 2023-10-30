import * as Dice from "../../jets/dice.js";
import { htmlQuery } from "../../utils/utils.js";
import { ItemSummaryRenderer } from "../sheet/item-summary-renderer.js";

export default class ShaanNPCSheet extends ActorSheet {
  constructor() {
    super(...arguments), (this.itemRenderer = new ItemSummaryRenderer(this));
  }
  static get defaultOptions() {
    const options = super.defaultOptions;
    return (
      (options.classes = [...options.classes, "PNJ"]),
      (options.width = 900),
      (options.height = 700),
      options.scrollY.push(".window-content"),
      options
    );
  }
  get template() {
    return `systems/shaanrenaissance/templates/actors/${this.actor.type}/sheet.hbs`;
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
          isGM: game.user.isGM,
        },
      };
    sheetData.items.sort((a, b) => (a.sort || 0) - (b.sort || 0));
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
    sheetData.pouvoirs = actorData.items.filter(function (item) {
      return item.type == "Pouvoir";
    });

    if (typeof sheetData.data.attributes.hpEsprit !== "undefined") {
      // Initiative
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
    // Filtre Race
    let race = actorData.items.filter(function (item) {
      return item.type == "Race";
    });
    let lastElement = race[race.length - 1];

    race.forEach((element) => {
      if (element != lastElement) {
        let itemId = element._id;
        return this.actor.deleteEmbeddedDocuments("Item", [itemId]);
      }
    });
    sheetData.Race = lastElement;
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

    console.log(sheetData);
    return sheetData;
  }
  activateListeners(html) {
    var _a, _b, _c;
    super.activateListeners(html);
    const $html = html[0];
    if (
      (this.itemRenderer.activateListeners($html),
      null === (_a = (0, htmlQuery)($html, "a[data-action=show-image]")) ||
        void 0 === _a ||
        _a.addEventListener("click", () => {
          var _a, _b, _c, _d;
          const actor = this.actor,
            title =
              null !==
                (_d =
                  null !==
                    (_b =
                      null === (_a = actor.token) || void 0 === _a
                        ? void 0
                        : _a.name) && void 0 !== _b
                    ? _b
                    : null === (_c = actor.prototypeToken) || void 0 === _c
                    ? void 0
                    : _c.name) && void 0 !== _d
                ? _d
                : actor.name;
          new ImagePopout(actor.img, {
            title,
            uuid: actor.uuid,
          }).render(!0);
        }),
      !this.options.editable)
    )
      return;
    if (this.isEditable) {
      html.find(".item-create").click(this._onItemCreate.bind(this));
      html.find(".add-acquis").click(this._onAcquisCreate.bind(this));
      html.find(".pouvoir-chat").click(this._onPouvoirChat.bind(this));
      html.find(".pouvoir-use").click(this._onPouvoirUse.bind(this));
      html.find(".item-wear").click(this._onAcquisUse.bind(this));
      html.find(".item-edit").click(this._onItemEdit.bind(this));
      html.find(".item-delete").click(this._onItemDelete.bind(this));
      html.find(".select-input").focus(this._onInputSelect);
      html.find(".regen-hp").click(this._onRegen.bind(this));
      html.find(".open-compendium").on("click", (event) => {
        if (event.currentTarget.dataset.compendium) {
          const compendium = game.packs.get(
            event.currentTarget.dataset.compendium
          );
          console.log(compendium);
          compendium && compendium.render(!0);
        }
      });

      super.activateListeners(html);
    }
    if (this.actor.isOwner) {
      html.find(".roll-initiative").click(this._onInitiative.bind(this));
      html.find(".roll-icon").click(this._onTest.bind(this));
      html.find(".spéTest").click(this._onSpéTest.bind(this));
      html.find(".spéTestNécr").click(this._onSpéTestNécr.bind(this));
    }
    html.find(".item-increase-quantity").on("click", (event) => {
      var _a;
      const itemId =
          null !==
            (_a = $(event.currentTarget)
              .parents(".item")
              .attr("data-item-id")) && void 0 !== _a
            ? _a
            : "",
        item = this.actor.items.get(itemId);
      console.log(event);
      if (!event.shiftKey && !event.ctrlKey) {
        this.actor.updateEmbeddedDocuments("Item", [
          {
            _id: itemId,
            "system.quantity": Number(item.system.quantity + 1),
          },
        ]);
      }
      if (event.shiftKey) {
        this.actor.updateEmbeddedDocuments("Item", [
          {
            _id: itemId,
            "system.quantity": Number(item.system.quantity + 5),
          },
        ]);
      }
      if (event.ctrlKey) {
        this.actor.updateEmbeddedDocuments("Item", [
          {
            _id: itemId,
            "system.quantity": Number(item.system.quantity + 10),
          },
        ]);
      }
    }),
      html.find(".item-decrease-quantity").on("click", (event) => {
        var _a;
        const itemId =
            null !==
              (_a = $(event.currentTarget)
                .parents(".item")
                .attr("data-item-id")) && void 0 !== _a
              ? _a
              : "",
          item = this.actor.items.get(itemId);
        console.log(item.system.quantity);
        if (!event.shiftKey && !event.ctrlKey) {
          item.system.quantity > 0 &&
            this.actor.updateEmbeddedDocuments("Item", [
              {
                _id: itemId,
                "system.quantity": Number(item.system.quantity - 1),
              },
            ]);
        }
        if (event.shiftKey) {
          item.system.quantity > 0 &&
            this.actor.updateEmbeddedDocuments("Item", [
              {
                _id: itemId,
                "system.quantity": Number(item.system.quantity - 5),
              },
            ]);
        }
        if (event.ctrlKey) {
          item.system.quantity > 0 &&
            this.actor.updateEmbeddedDocuments("Item", [
              {
                _id: itemId,
                "system.quantity": Number(item.system.quantity - 10),
              },
            ]);
        }
      });
  }
  _onInputSelect(event) {
    event.currentTarget.select();
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
  _onSpéTest(event) {
    let actor = this.actor;
    const actorData = this.actor.toObject(!1);
    let domain = $(event.target.closest(".npc"))
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

    // Filtre Race
    let race = actorData.items.filter(function (item) {
      return item.type == "Race";
    });
    let lastElement = race[race.length - 1];

    race.forEach((element) => {
      if (element != lastElement) {
        let itemId = element._id;
        return this.actor.deleteEmbeddedDocuments("Item", [itemId]);
      }
    });
    race = lastElement.name;
    if (
      actor.conditions.paralyzed &&
      (domain === "Rituels" || domain === "Survie" || domain === "Combat")
    )
      return ui.notifications.warn("Ce personnage est Paralysé");
    if (
      actor.conditions.dominated &&
      (domain === "Technique" || domain === "Savoir" || domain === "Social")
    )
      return ui.notifications.warn("Ce personnage est Dominé");
    if (
      actor.conditions.bewitched &&
      (domain === "Arts" || domain === "Shaan" || domain === "Magie")
    )
      return ui.notifications.warn("Ce personnage est Envoûté");
    if (actor.conditions.unconscious) return ui.notifications.warn("Ce personnage est Inconscient");
    Dice.SpéTest({
      actor,
      domain: domain,
      spécialisation: spécialisation,
      description: description,
      askForOptions: event.shiftKey,
      race,
    });
  }
  _onAcquisCreate(event) {
    let actor = this.actor;
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
          console.log(data);
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
    let actor = this.actor;
    event.preventDefault();
    const espritBtn = event.target.closest("#Esprit-add");
    const ameBtn = event.target.closest("#Ame-add");
    const corpsBtn = event.target.closest("#Corps-add");
    const necroseBtn = event.target.closest("#Nécrose-add");
    const magicTrihnBtn = event.target.closest("#MagicTrihn-add");
    const graftAddBtn = event.target.closest("#graft-add");

    if (magicTrihnBtn) {
      let itemData = {
        name: "Trihn",
        type: "Trihn",
        item: {
          system: {
            trihnType: null,
            puissance: null,
            emplacement: null,
            pouvoir: {
              value: null,
            },
          },
        },
      };
      return this.actor.createEmbeddedDocuments("Item", [itemData]);
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

      console.log(actorData);

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
  _onSpéTestNécr(event) {
    let actor = this.actor;
    let domain = $(event.target.closest(".npc"))
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
    // Filtre Race
    const actorData = this.actor.toObject(!1);
    let race = actorData.items.filter(function (item) {
      return item.type == "Race";
    });
    let lastElement = race[race.length - 1];
    let description = game.i18n.translations.SRspéDesc[spécialisation];

    race.forEach((element) => {
      if (element != lastElement) {
        let itemId = element._id;
        return this.actor.deleteEmbeddedDocuments("Item", [itemId]);
      }
    });
    race = lastElement.name;
    if (actor.conditions.unconscious) return ui.notifications.warn("Ce personnage est Inconscient");


    Dice.SpéTestNécr({
      actor,
      race,
      domain: domain,
      spécialisation: spécialisation,
      description: description,
      askForOptions: event.shiftKey,
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
    const actorData = this.actor.toObject(!1);
    if (actor.conditions.unconscious) return ui.notifications.warn("Ce personnage est Inconscient");

    // Filtre Race
    let race = actorData.items.filter(function (item) {
      return item.type == "Race";
    });
    let lastElement = race[race.length - 1];

    race.forEach((element) => {
      if (element != lastElement) {
        let itemId = element._id;
        return this.actor.deleteEmbeddedDocuments("Item", [itemId]);
      }
    });
    if (lastElement) {
      race = lastElement.name;
    } else {
      race = "race";
    }

    if (dataset == "domainTest" || "necroseTest") {
      Dice[dataset]({
        actor,
        race,
        checkType: dataset,
      });
    }
  }

  _onItemCreateNPC(event) {
    event.preventDefault();
    const pouvoirBtn = event.target.closest("#pouvoir-add");
    const acquisBtn = event.target.closest("#acquis-add");

    if (pouvoirBtn) {
      let itemData = {
        name: "Nouveau pouvoir",
        type: "Pouvoir",
      };

      return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }
    this.actor.sheet.render();

    if (acquisBtn) {
      let actor = this.actor;

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
            Trihn: {},
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
              data: { actor: { actorData }, config: CONFIG.shaanRenaissance },
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
}
