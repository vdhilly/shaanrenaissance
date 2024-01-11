import * as Dice from "../../jets/dice.js";
import { htmlQuery } from "../../utils/utils.js";
import { ActorSheetSR } from "../sheet.js";
import { ItemSummaryRenderer } from "../sheet/item-summary-renderer.js";
import { AddCoinsPopup } from "../sheet/popups/add-coins-popup.js";
import { RemoveCoinsPopup } from "../sheet/popups/remove-coins-popup.js";

export default class ShaanNPCSheet extends ActorSheetSR {
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
    this.characterFilter(sheetData, actorData);
    this.defineInitiative(sheetData, actorData);

    console.log(sheetData);
    return sheetData;
  }
  activateListeners(html) {
    var _a, _b, _c;
    super.activateListeners(html);
    const $html = html[0];

    html
        .find("button[data-action=add-coins]")
        .click(this._onAddCoins.bind(this));
      html
        .find("button[data-action=remove-coins]")
        .click(this._onRemoveCoins.bind(this));

    if ((this.itemRenderer.activateListeners($html), !this.options.editable))
      return;
    if (this.isEditable) {
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
  }
  _onAddCoins(event) {
    new AddCoinsPopup(this.actor).render(true);
    return;
  }
  _onRemoveCoins(event) {
    new RemoveCoinsPopup(this.actor).render(true);
    return;
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
}
