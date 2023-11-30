import {
  ErrorSR,
  htmlClosest,
  htmlQuery,
  htmlQueryAll,
} from "../../utils/utils.js";
import { ActorSheetSR } from "../sheet.js";
import { ItemSummaryRenderer } from "../sheet/item-summary-renderer.js";
import { AddCoinsPopup } from "../sheet/popups/add-coins-popup.js";
import { RemoveCoinsPopup } from "../sheet/popups/remove-coins-popup.js";
import { PersonnageSheetTabManager } from "./tab-manager.js";

export default class ShaanPersonnageSheet extends ActorSheetSR {
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
    this.itemSort(sheetData.items);
    this.itemFilter(sheetData, actorData);
    this.characterFilter(sheetData, actorData);
    this.defineMaxHealth(sheetData);
    this.defineInitiative(sheetData, actorData);

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
    if ((this.itemRenderer.activateListeners($html), !this.options.editable))
      return;
    if (this.isEditable) {
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
      schemes.learnedCountDomaine = schemes.domaine - learnedCountDomaine;
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
        if (schemes_cles.hasOwnProperty(key) && schemes_cles[key]) {
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
  _onTrihnTest(event) {
    const trihn = event.currentTarget.dataset.trihn;
    let actor = this.actor;
    let hp = actor.system.attributes;
    const actorData = this.actor.toObject(!1);
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
    race = lastElement.name;
    if (actor.conditions.paralyzed && trihn === "Corps")
      return ui.notifications.warn("Ce personnage est Paralysé");
    if (actor.conditions.dominated && trihn === "Esprit")
      return ui.notifications.warn("Ce personnage est Dominé");
    if (actor.conditions.bewitched && trihn === "Ame")
      return ui.notifications.warn("Ce personnage est Envoûté");

    Dice.trihnTest({
      actor,
      hp,
      race,
      trihn,
    });
  }
}
