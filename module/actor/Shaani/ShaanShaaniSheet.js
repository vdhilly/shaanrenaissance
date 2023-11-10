import * as Dice from "../../jets/dice.js";
import { htmlQuery } from "../../utils/utils.js";
import { PersonnageSheetTabManager } from "../Personnage/tab-manager.js";
import { ActorSheetSR } from "../sheet.js";
import { ItemSummaryRenderer } from "../sheet/item-summary-renderer.js";
import { AddCoinsPopup } from "../sheet/popups/add-coins-popup.js";
import { RemoveCoinsPopup } from "../sheet/popups/remove-coins-popup.js";

export default class ShaanShaaniSheet extends ActorSheetSR {
  constructor() {
    super(...arguments), (this.itemRenderer = new ItemSummaryRenderer(this));
  }
  static get defaultOptions() {
    const options = super.defaultOptions;
    return (
      (options.classes = [...options.classes, "Shaani"]),
      (options.width = 750),
      (options.height = 800),
      options.scrollY.push(".sheet-body"),
      (options.tabs = [
        {
          navSelector: ".sheet-navigation",
          contentSelector: ".sheet-content",
          initial: "character",
        },
      ]),
      options
    );
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
    this.itemSort(sheetData.items);
    if (
      typeof actorData.items.filter(function (item) {
        return item.system.pouvoir;
      }) !== "undefined"
    ) {
      (sheetData.items.Category = {}),
        (sheetData.items.Category.Armement = actorData.items.filter(function (
          item
        ) {
          return item.type == "Armement";
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
          return item.type == "Outil";
        })),
        (sheetData.items.Category.Protections = actorData.items.filter(
          function (item) {
            return item.type == "Protection";
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
            return item.type == "Technologie";
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

      (sheetData.pouvoirEsprit = actorData.items.filter(function (item) {
        return (item.type =
          ("Pouvoir" && item.system.trihn == "Esprit") ||
          item.system.pouvoir.value == "Astuce de Technique" ||
          item.system.pouvoir.value == "Secret de Savoir" ||
          item.system.pouvoir.value == "Privilège de Social");
      })),
        (sheetData.pouvoirAme = actorData.items.filter(function (item) {
          return (item.type =
            ("Pouvoir" && item.system.trihn == "Âme") ||
            item.system.pouvoir.value == "Création d'Arts" ||
            item.system.pouvoir.value == "Symbiose de Shaan" ||
            item.system.pouvoir.value == "Sort de Magie");
        })),
        (sheetData.pouvoirCorps = actorData.items.filter(function (item) {
          return (item.type =
            ("Pouvoir" && item.system.trihn == "Corps") ||
            item.system.pouvoir.value == "Transe de Rituels" ||
            item.system.pouvoir.value == "Exploit de Survie" ||
            item.system.pouvoir.value == "Tactique de Combat");
        })),
        (sheetData.pouvoirNecrose = actorData.items.filter(function (item) {
          return (item.type =
            ("Pouvoir" && item.system.trihn == "Nécrose") ||
            item.system.pouvoir.value == "Tourment de Nécrose");
        }));
    }
    if (typeof sheetData.data.attributes.hpEsprit !== "undefined") {
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
    sheetData.enrichedGMnotes = await TextEditor.enrichHTML(
      getProperty(this.actor.system, "biography.campagne.gm"),
      { async: true }
    );
    sheetData.enrichedMotivations = await TextEditor.enrichHTML(
      getProperty(this.actor.system, "motivation"),
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
      html.find(".regen-hp").click(this._onRegen.bind(this));
      html.find(".select-input").focus(this._onInputSelect);
      html
        .find("button[data-action=add-coins]")
        .click(this._onAddCoins.bind(this));
      html
        .find("button[data-action=remove-coins]")
        .click(this._onRemoveCoins.bind(this));
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
          console.log(compendium);
          compendium && compendium.render(!0);
        }
      });
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
    PersonnageSheetTabManager.initialize(
      this.actor,
      html.find("a[data-action=manage-tabs]")[0]
    );
  }
  _onInputSelect(event) {
    event.currentTarget.select();
  }
  _onAddCoins(event) {
    new AddCoinsPopup(this.actor).render(true);
    return;
  }
  _onRemoveCoins(event) {
    new RemoveCoinsPopup(this.actor).render(true);
    return;
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

    Dice.SpéTestNécr({
      actor,
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

    if (dataset == "domainTest" || "necroseTest") {
      Dice[dataset]({
        actor,
        checkType: dataset,
      });
    }
  }
}
