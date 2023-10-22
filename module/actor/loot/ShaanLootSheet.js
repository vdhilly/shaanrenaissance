import { ItemSR } from "../../item/ItemSR.js";
import { getSelectedOrOwnActors, htmlQuery } from "../../utils/utils.js";
import { ItemSummaryRenderer } from "../sheet/item-summary-renderer.js";
import { LootNPCsPopup } from "../sheet/loot/loot-npcs-popup.js";
import { AddCoinsPopup } from "../sheet/popups/add-coins-popup.js";
import { DistributeCoinsPopup } from "../sheet/popups/distribute-coins-popup.js";
import { RemoveCoinsPopup } from "../sheet/popups/remove-coins-popup.js";

export default class ShaanLootSheetSR extends ActorSheet {
  constructor() {
    super(...arguments), (this.itemRenderer = new ItemSummaryRenderer(this));
  }
  static get defaultOptions() {
    const options = super.defaultOptions;
    return (
      (options.classes = [...options.classes, "character"]),
      (options.width = 700),
      (options.height = 600),
      options.scrollY.push(".sheet-body"),
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
        owner: this.actor.isOwner,
        isLoot: this.actor.system.lootSheetType == "Loot",
        editable: this.isEditable,
        actor: this.actor,
        inventory: this.actor.inventory,
        prototypeToken: actorData.prototypeToken,
        items: actorData.items,
        user: {
          isGM: game.user.isGM,
        },
      };

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
      (sheetData.items.Category.Protections = actorData.items.filter(function (
        item
      ) {
        return item.type == "Protection" && item.system.morphe == false;
      })),
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
      (sheetData.items.Category.Technologie = actorData.items.filter(function (
        item
      ) {
        return item.type == "Technologie" && item.system.morphe == false;
      })),
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

    sheetData.enrichedGMnotes = await TextEditor.enrichHTML(
      getProperty(this.actor.system, "details.description"),
      { async: true }
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
      html.find("a.item-take").click(this._onTakeAcquis.bind(this));
      html.find(".acquis-chat").click(this._onAcquisChat.bind(this));
      html.find("a.item-buy").click(this._onBuyAcquis.bind(this));
      html.find(".add-acquis").click(this._onAcquisCreate.bind(this));
      html.find(".item-edit").click(this._onItemEdit.bind(this));
      html.find(".item-delete").click(this._onItemDelete.bind(this));
    }
    html.find(".open-compendium").on("click", (event) => {
      if (event.currentTarget.dataset.compendium) {
        const compendium = game.packs.get(
          event.currentTarget.dataset.compendium
        );
        compendium && compendium.render(!0);
      }
    });
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
    html
      .find(".split-coins")
      .removeAttr("disabled")
      .on("click", (event) => this.distributeCoins(event));
    html
      .find(".loot-npcs")
      .removeAttr("disabled")
      .on("click", (event) => this.lootNPCs(event));
    html.find("i.fa-info-circle.help[title]").tooltipster({
      maxWidth: 275,
      position: "right",
      theme: "crb-hover",
      contentAsHTML: true,
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
  async distributeCoins(event) {
    event.preventDefault();
    await new DistributeCoinsPopup(this.actor).render(true);
  }
  async lootNPCs(event) {
    event.preventDefault();
    if (
      canvas.tokens.controlled.some(
        (token) => token.actor?.id !== this.actor.id
      )
    ) {
      await new LootNPCsPopup(this.actor).render(true);
    } else {
      ui.notifications.warn("Aucun token n'est sélectionné.");
    }
  }
  async _onTakeAcquis(event) {
    const LootActorID = this.actor._id;
    const actors = (0, getSelectedOrOwnActors)([
      "Personnage",
      "PNJ",
      "Créature",
      "Shaani",
      "Réseau",
    ]);
    const itemID = event.currentTarget.closest(".item").dataset.itemId,
      item = await this.getAcquisItem(itemID, LootActorID);
    console.log(item);
    if (0 !== actors.length) {
      for (const actor of actors)
        await actor.createEmbeddedDocuments("Item", [item.toObject()]);
      1 === actors.length &&
      game.user.character &&
      actors[0] === game.user.character
        ? ui.notifications.info(
            game.i18n.format("SR.CompendiumBrowser.AddedItemToCharacter", {
              item: item.name,
              character: game.user.character.name,
            })
          )
        : ui.notifications.info(
            game.i18n.format("SR.CompendiumBrowser.AddedItem", {
              item: item.name,
            })
          );
      return this.actor.deleteEmbeddedDocuments("Item", [itemID]);
    } else
      ui.notifications.error(
        game.i18n.format("SR.ErrorMessage.NoTokenSelected")
      );
  }
  async _onBuyAcquis(event) {
    let LootActoruuID = this.actor.uuid;
    console.log(this.actor);
    if (this.actor.isToken) {
      LootActoruuID = this.actor.token.uuid;
    }
    const actors = (0, getSelectedOrOwnActors)([
      "Personnage",
      "PNJ",
      "Créature",
      "Shaani",
      "Réseau",
    ]);
    const itemID = event.currentTarget.closest(".item").dataset.itemId,
      item = await this.getAcquisItem(itemID, LootActoruuID);
    console.log(item);
    if (0 === actors.length)
      return void ui.notifications.error(
        game.i18n.format("SR.ErrorMessage.NoTokenSelected")
      );
    let purchasesSucceeded = 0;
    console.log(item);
    for (const actor of actors) {
      if (actor.system.attributes.crédos - item.system.acquis.valeur < 0) {
        return ui.notifications.warn(
          "Vous ne pouvez pas vous permettre cet achat."
        );
      } else {
        await actor.inventory.removeCoins(Number(item.system.acquis.valeur)),
          (purchasesSucceeded += 1);
        await this.actor.inventory.addCoins(Number(item.system.acquis.valeur)),
          await actor.createEmbeddedDocuments("Item", [item.toObject()]);
      }
    }
    1 === actors.length
      ? 1 === purchasesSucceeded
        ? ui.notifications.info(
            game.i18n.format("SR.CompendiumBrowser.BoughtItemWithCharacter", {
              item: item.name,
              character: actors[0].name,
            })
          )
        : ui.notifications.warn(
            game.i18n.format(
              "SR.CompendiumBrowser.FailedToBuyItemWithCharacter",
              {
                item: item.name,
                character: actors[0].name,
              }
            )
          )
      : purchasesSucceeded === actors.length
      ? ui.notifications.info(
          game.i18n.format("SR.CompendiumBrowser.BoughtItemWithAllCharacters", {
            item: item.name,
          })
        )
      : ui.notifications.warn(
          game.i18n.format(
            "SR.CompendiumBrowser.FailedToBuyItemWithSomeCharacters",
            {
              item: item.name,
            }
          )
        );
    return this.actor.deleteEmbeddedDocuments("Item", [itemID]);
  }
  async getAcquisItem(itemID, actor) {
    const item = await fromUuid(`${actor}.Item.${itemID}`);
    console.log(item);
    if (!(item instanceof ItemSR))
      return ui.notifications.warn(
        "Unexpected failure retrieving compendium item"
      );
    return item;
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
