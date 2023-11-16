import * as Dice from "../../jets/dice.js";
import { htmlQuery } from "../../utils/utils.js";
import { PersonnageSheetTabManager } from "../Personnage/tab-manager.js";
import { ActorSheetSR } from "../sheet.js";
import { ItemSummaryRenderer } from "../sheet/item-summary-renderer.js";
import { AddCoinsPopup } from "../sheet/popups/add-coins-popup.js";
import { RemoveCoinsPopup } from "../sheet/popups/remove-coins-popup.js";

export default class ShaanRéseauSheet extends ActorSheetSR {
  constructor() {
    super(...arguments), (this.itemRenderer = new ItemSummaryRenderer(this));
  }
  static get defaultOptions() {
    const options = super.defaultOptions;
    return (
      (options.classes = [...options.classes, "Réseau"]),
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
    this.itemFilter(sheetData, actorData);
    this.defineInitiative(sheetData, actorData);

    sheetData.enrichedGMnotes = await TextEditor.enrichHTML(
      getProperty(this.actor.system, "biography.campagne.gm"),
      { async: true }
    );
    sheetData.enrichedTypeMembres = await TextEditor.enrichHTML(
      getProperty(this.actor.system, "typesMembres"),
      { async: true }
    );
    sheetData.enrichedMotivations = await TextEditor.enrichHTML(
      getProperty(this.actor.system, "motivation"),
      { async: true }
    );
    sheetData.enrichedMoyens = await TextEditor.enrichHTML(
      getProperty(this.actor.system, "moyens"),
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
  _onAddCoins(event) {
    new AddCoinsPopup(this.actor).render(true);
    return;
  }
  _onRemoveCoins(event) {
    new RemoveCoinsPopup(this.actor).render(true);
    return;
  }
}
