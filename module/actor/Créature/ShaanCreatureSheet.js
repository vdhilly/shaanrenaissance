import * as Dice from "../../jets/dice.js";
import { htmlQuery } from "../../utils/utils.js";
import { ActorSheetSR } from "../sheet.js";
import { ItemSummaryRenderer } from "../sheet/item-summary-renderer.js";

export default class ShaanCreatureSheet extends ActorSheetSR {
  constructor() {
    super(...arguments), (this.itemRenderer = new ItemSummaryRenderer(this));
  }
  static get defaultOptions() {
    const options = super.defaultOptions;
    return (
      (options.classes = [...options.classes, "Créature"]),
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
    if (this.actor.isOwner) {
      // html.find(".roll-initiative").click(this._onInitiative.bind(this));
      // html.find(".roll-icon").click(this._onTest.bind(this));
      // html.find(".spéTest").click(this._onSpéTest.bind(this));
      // html.find(".spéTestNécr").click(this._onSpéTestNécr.bind(this));
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
  // _onSpéTest(event) {
  //   let actor = this.actor;
  //   const actorData = this.actor.toObject(!1);
  //   if (actor.conditions.unconscious)
  //     return ui.notifications.warn("Ce personnage est Inconscient");

  //   let domain = $(event.target.closest(".creature"))
  //     .children(".specialisations-title")
  //     .find(".specialisations-label")
  //     .text();
  //   let spécialisation = $(event.target)
  //     .text()
  //     .toLowerCase()
  //     .replaceAll(" ", "")
  //     .replace("'", "")
  //     .replaceAll("é", "e")
  //     .replace("è", "e")
  //     .replace("ê", "e")
  //     .replace("à", "a")
  //     .replace("â", "a")
  //     .replace("î", "i");
  //   let description = game.i18n.translations.SRspéDesc[spécialisation];

  //   if (
  //     actor.conditions.paralyzed &&
  //     (domain === "Rituels" || domain === "Survie" || domain === "Combat")
  //   )
  //     return ui.notifications.warn("Ce personnage est Paralysé");
  //   if (
  //     actor.conditions.dominated &&
  //     (domain === "Technique" || domain === "Savoir" || domain === "Social")
  //   )
  //     return ui.notifications.warn("Ce personnage est Dominé");
  //   if (
  //     actor.conditions.bewitched &&
  //     (domain === "Arts" || domain === "Shaan" || domain === "Magie")
  //   )
  //     return ui.notifications.warn("Ce personnage est Envoûté");

  //   Dice.SpéTest({
  //     actor,
  //     domain: domain,
  //     spécialisation: spécialisation,
  //     description: description,
  //     askForOptions: event.shiftKey,
  //   });
  // }

  // _onSpéTestNécr(event) {
  //   let actor = this.actor;
  //   if (actor.conditions.unconscious)
  //     return ui.notifications.warn("Ce personnage est Inconscient");

  //   let domain = $(event.target.closest(".creature"))
  //     .children(".specialisations-title")
  //     .find(".specialisations-label")
  //     .text();
  //   let spécialisation = $(event.target)
  //     .text()
  //     .toLowerCase()
  //     .replaceAll(" ", "")
  //     .replace("'", "")
  //     .replaceAll("é", "e")
  //     .replace("è", "e")
  //     .replace("ê", "e")
  //     .replace("à", "a")
  //     .replace("â", "a")
  //     .replace("î", "i");
  //   let description = game.i18n.translations.SRspéDesc[spécialisation];

  //   Dice.SpéTestNécr({
  //     actor,
  //     domain: domain,
  //     spécialisation: spécialisation,
  //     description: description,
  //     askForOptions: event.shiftKey,
  //   });
  // }
  // _onInitiative(event) {
  //   const dataset = event.currentTarget.dataset;
  //   let actor = this.actor;

  //   Dice.Initiative({
  //     actor,
  //     domain: dataset.domain,
  //     domainLevel: dataset.domainLevel,
  //   });
  // }
  // _onTest(event) {
  //   const dataset = event.target.closest(".roll-data").dataset.itemId;
  //   let actor = this.actor;
  //   if (actor.conditions.unconscious)
  //     return ui.notifications.warn("Ce personnage est Inconscient");

  //   if (dataset == "domainTest" || "necroseTest") {
  //     Dice[dataset]({
  //       actor,
  //       checkType: dataset,
  //     });
  //   }
  // }
}
