import * as Dice from "../../jets/dice.js";
import {
  ErrorSR,
  htmlClosest,
  htmlQuery,
  htmlQueryAll,
} from "../../utils/utils.js";
import { ItemSummaryRenderer } from "../sheet/item-summary-renderer.js";
import { AddCoinsPopup } from "../sheet/popups/add-coins-popup.js";
import { RemoveCoinsPopup } from "../sheet/popups/remove-coins-popup.js";
import { PersonnageSheetTabManager } from "./tab-manager.js";

export default class ShaanRActorsSheet extends ActorSheet {
  constructor() {
    super(...arguments), (this.itemRenderer = new ItemSummaryRenderer(this));
  }
  static get defaultOptions() {
    const options = super.defaultOptions;
    return (
      (options.classes = [...options.classes, "character"]),
      (options.width = 750),
      (options.height = 800),
      options.scrollY.push(".sheet-body"),
      (options.tabs = [
        {
          navSelector: ".sheet-navigation",
          contentSelector: ".sheet-content",
          initial: "character",
        },
        {
          navSelector: ".magic-navigation",
          contentSelector: ".magic-content",
          initial: "schemes",
        },
      ]),
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
        inventory: this.actor.inventory,
        document: this.actor,
        effects: this.actor.getEmbeddedCollection("ActiveEffect"),
        limited: this.actor.limited,
        owner: this.actor.isOwner,
        title: this.title,
        actor: actorData,
        data: actorData.system,
        items: actorData.items,
        flags: actorData.flags,
        prototypeToken: actorData.prototypeToken,
        config: CONFIG.shaanRenaissance,
        user: {
          isGM: game.user.isGM,
        },
      };
    // Filtres catégorie pouvoir
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
    if (typeof sheetData.data.attributes !== "undefined") {
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
      let attributes = sheetData.data.attributes;
      if (attributes.hpEsprit.value > attributes.hpEsprit.max) {
        this.actor.update({
          data: {
            attributes: {
              hpEsprit: {
                value: attributes.hpEsprit.max,
              },
            },
          },
        });
      }
      if (attributes.hpAme.value > attributes.hpAme.max) {
        this.actor.update({
          data: {
            attributes: {
              hpAme: {
                value: attributes.hpAme.max,
              },
            },
          },
        });
      }
      if (attributes.hpCorps.value > attributes.hpCorps.max) {
        this.actor.update({
          data: {
            attributes: {
              hpCorps: {
                value: attributes.hpCorps.max,
              },
            },
          },
        });
      }

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

    // Editors
    sheetData.enrichedGMnotes = await TextEditor.enrichHTML(
      getProperty(this.actor.system, "biography.campagne.gm"),
      { async: true }
    );
    sheetData.enrichedBiography = await TextEditor.enrichHTML(
      getProperty(this.actor.system, "biography.histoire"),
      { async: true }
    );
    sheetData.enrichedApparence = await TextEditor.enrichHTML(
      getProperty(this.actor.system, "biography.apparence"),
      { async: true }
    );
    sheetData.enrichedNotes = await TextEditor.enrichHTML(
      getProperty(this.actor.system, "biography.campagne.notes"),
      { async: true }
    );
    sheetData.enrichedAllies = await TextEditor.enrichHTML(
      getProperty(this.actor.system, "biography.campagne.allies"),
      { async: true }
    );
    sheetData.enrichedEnemies = await TextEditor.enrichHTML(
      getProperty(this.actor.system, "biography.campagne.enemies"),
      { async: true }
    );
    sheetData.enrichedSchemes = await TextEditor.enrichHTML(
      getProperty(this.actor.system, "Magic.schèmes"),
      { async: true }
    );
    sheetData.enrichedAlchemy = await TextEditor.enrichHTML(
      getProperty(this.actor.system, "Magic.alchimie"),
      { async: true }
    );
    sheetData.enrichedEnchants = await TextEditor.enrichHTML(
      getProperty(this.actor.system, "Magic.enchantement"),
      { async: true }
    );

    if (sheetData.actor.system.skills) {
      this.SchemesSystem(sheetData);
    }
    sheetData.tabVisibility = deepClone(
      this.actor.flags.shaanRenaissance.sheetTabs
    );
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
      html.find(".add-acquis").click(this._onAcquisCreate.bind(this));
      html.find(".item-create").click(this._onItemCreate.bind(this));
      html.find(".pouvoir-chat").click(this._onPouvoirChat.bind(this));
      html.find(".acquis-chat").click(this._onAcquisChat.bind(this));
      html.find(".pouvoir-use").click(this._onPouvoirUse.bind(this));
      html.find(".item-wear").click(this._onAcquisUse.bind(this));
      html.find(".item-edit").click(this._onItemEdit.bind(this));
      html.find(".item-delete").click(this._onItemDelete.bind(this));
      html.find(".roll-initiative").click(this._onInitiative.bind(this));
      html.find(".roll-icon").click(this._onTest.bind(this));
      html.find(".spéTest").click(this._onSpéTest.bind(this));
      html.find(".spéTestNécr").click(this._onSpéTestNécr.bind(this));
      html.find(".regen-hp").click(this._onRegen.bind(this));
      html.find(".select-input").focus(this._onInputSelect);
      html
        .find("button[data-action=add-coins]")
        .click(this._onAddCoins.bind(this));
      html
        .find("button[data-action=remove-coins]")
        .click(this._onRemoveCoins.bind(this));
      html.find("a.trihnTest").click(this._onTrihnTest.bind(this));
      const title = $(".sheet-navigation .active").attr("title");
      title && html.find(".navigation-title").text(title);
      html
        .find(".sheet-navigation")
        .on("mouseover", ".item,.manage-tabs", (event) => {
          const title = event.target.title;
          title &&
            $(event.target)
              .parents(".sheet-navigation")
              .find(".navigation-title")
              .text(title);
        }),
        html
          .find(".sheet-navigation")
          .on("mouseout", ".item,.manage-tabs", (event) => {
            const parent = $(event.target).parents(".sheet-navigation"),
              title = parent.find(".item.active").attr("title");
            title && parent.find(".navigation-title").text(title);
          });
      html.find(".open-compendium").on("click", (event) => {
        if (event.currentTarget.dataset.compendium) {
          const compendium = game.packs.get(
            event.currentTarget.dataset.compendium
          );
          compendium && compendium.render(!0);
        }
      });
      super.activateListeners(html);
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
    const scheme = html.find(".scheme[type=checkbox]");
    scheme.on("change");
    PersonnageSheetTabManager.initialize(
      this.actor,
      html.find("a[data-action=manage-tabs]")[0]
    );
  }
  SchemesSystem(sheetData) {
    let actor = sheetData.actor;
    const schemes = actor.flags.shaanRenaissance.schemes;

    const schemes_action = schemes.action;
    const schemes_element = schemes.element;
    const schemes_cles = schemes.cles;
    const schemes_duree = schemes.duree;
    const schemes_portee = schemes.portee;
    const schemes_cibles = schemes.cibles;
    const schemes_frequence = schemes.frequence;
    schemes.bonusSpe =
      actor.system.skills.Magie.specialisations.maitrisedesschemes.bonus;
    schemes.domaine = actor.system.skills.Magie.rank;
    const domaine_schemes_count = {
      ...schemes_duree,
      ...schemes_portee,
      ...schemes_cibles,
      ...schemes_frequence,
      ...schemes_element,
    };
    // Décompte des schèmes apprenables en fonction du Domaine et de la Spé
    if (
      actor.system.skills.Magie.rank >= 5 &&
      actor.system.skills.Magie.specialisations.maitrisedesschemes.bonus >= 1 &&
      schemes.maitrise
    ) {
      let learnedCountDomaine = 0 - 4;
      for (const key in domaine_schemes_count) {
        if (
          domaine_schemes_count.hasOwnProperty(key) &&
          domaine_schemes_count[key].learned === true
        ) {
          learnedCountDomaine++;
        }
      }
      schemes.learnedCountDomaine = schemes.domaine - learnedCountDomaine - 4;
      let learnedCountSpe = 0;
      for (const key in schemes_action) {
        if (
          schemes_action.hasOwnProperty(key) &&
          schemes_action[key].learned === true
        ) {
          learnedCountSpe++;
        }
      }
      schemes.learnedCountSpe = schemes.bonusSpe - learnedCountSpe;
    }
    // Passage à Magie 5 et Maitrise des Schèmes +1
    if (
      actor.system.skills.Magie.rank >= 5 &&
      actor.system.skills.Magie.specialisations.maitrisedesschemes.bonus >= 1 &&
      !schemes.maitrise
    ) {
      for (const key in schemes_cles) {
        if (schemes_cles.hasOwnProperty(key)) {
          schemes_cles[key].learned = true;
        }
      }
      schemes_duree.duree1.learned = true;
      schemes_frequence.frequence1.learned = true;
      schemes_cibles.cibles1.learned = true;
      schemes_portee.contact.learned = true;
      schemes.maitrise = true;
      console.log(schemes, "OUI");
    }
    this.actor.update({ "flags.shaanRenaissance.schemes": schemes });
  }
  _onAddCoins(event) {
    new AddCoinsPopup(this.actor).render(true);
    return;
  }
  _onRemoveCoins(event) {
    new RemoveCoinsPopup(this.actor).render(true);
    return;
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
  _onTrihnTest(event) {
    const trihn = event.currentTarget.dataset.trihn;
    let actor = this.actor;
    let hp = actor.system.attributes;

    Dice.trihnTest({
      actor,
      hp,
      trihn,
    });
  }
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
    const actorData = this.actor.toObject(!1);
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
