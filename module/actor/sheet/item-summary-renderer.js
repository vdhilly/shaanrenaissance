import { ItemSR } from "../../item/ItemSR.js";
import {
  htmlClosest,
  htmlQuery,
  htmlQueryAll,
  isItemSystemData,
} from "../../utils/utils.js";
export class ItemSummaryRenderer {
  constructor(sheet) {
    this.sheet = sheet;
  }
  activateListeners(html) {
    const itemNameElems = (0, htmlQueryAll)(
      html,
      ".item .acquis-header h4, .item .pouvoir-header h4, .symbiose-header h4"
    );
    for (const itemNameElem of itemNameElems)
      itemNameElem.addEventListener("click", async () => {

        const element = (0, htmlClosest)(
          itemNameElem,
          "[data-item-id], .expandable"
        );
    
        if(this.sheet.actor.type !== "Shaani" || element.dataset.itemType == "Symbiose"){
          element && (await this.toggleSummary(element));
        } else {
          element && (await this.toggleSummaryShaani(element))
        }
      });
  }
  async toggleSummary(element, options = {}) {
    var _a, _b;
    const actor = this.sheet.actor,
      { itemId, itemType, actionIndex } = element.dataset,
      isFormula = !!element.dataset.isFormula;

    const item = isFormula
      ? await fromUuid(null != itemId ? itemId : "")
      : "condition" === itemType
      ? actor.conditions.get(itemId, {
          strict: !0,
        })
      : actionIndex
      ? null !==
          (_b =
            null === (_a = actor.system.actions) || void 0 === _a
              ? void 0
              : _a[Number(actionIndex)].item) && void 0 !== _b
        ? _b
        : null
      : actor.items.get(itemId, {
          strict: !0,
        });
    if (!(item instanceof ItemSR)) return;
    const summary = await (async () => {
      const existing = (0, htmlQuery)(element, ":scope > .item-summary");
      if (existing) return existing;
      if (!item.isOfType("Trihn")) {
        const insertLocation = (0, htmlQueryAll)(
          element,
          ":scope > .acquis-name, :scope > .item-controls, :scope > pouvoir-name, :scope > .symbiose-header"
        ).at(-1);
        if (!insertLocation) return null;
        const summary = document.createElement("div");
        summary.classList.add("item-summary"),
          (summary.hidden = !0),
          insertLocation.after(summary);
        const chatData = await item.getChatData(
          {
            secrets: actor.isOwner,
          },
          element.dataset
        );
        return await this.renderItemSummary(summary, item, chatData), summary;
      }
      return null;
    })();
    if (!summary) return;
    const showSummary =
      !element.classList.contains("expanded") || summary.hidden;
    options.instant
      ? ((summary.hidden = !showSummary),
        element.classList.toggle("expanded", showSummary))
      : showSummary
      ? (element.classList.add("expanded"),
        await gsap.fromTo(
          summary,
          {
            height: 0,
            opacity: 0,
            hidden: !1,
          },
          {
            height: "auto",
            opacity: 1,
            duration: 0.4,
          }
        ))
      : await gsap.to(summary, {
          height: 0,
          duration: 0.4,
          opacity: 0,
          paddingTop: 0,
          paddingBottom: 0,
          margin: 0,
          clearProps: "all",
          onComplete: () => {
            (summary.hidden = !0), element.classList.remove("expanded");
          },
        });
  }
  async toggleSummaryShaani(element, options = {}) {
    var _a, _b;
    const { itemId, parentId, itemType, actionIndex } = element.dataset, 
  
    actor = this.sheet.actor.members.find(d => d._id === parentId),
      isFormula = !!element.dataset.isFormula;

    const item = isFormula
      ? await fromUuid(null != itemId ? itemId : "")
      : "condition" === itemType
      ? actor.conditions.get(itemId, {
          strict: !0,
        })
      : actionIndex
      ? null !==
          (_b =
            null === (_a = actor.system.actions) || void 0 === _a
              ? void 0
              : _a[Number(actionIndex)].item) && void 0 !== _b
        ? _b
        : null
      : actor.items.get(itemId, {
          strict: !0,
        });

        
    if (!(item instanceof ItemSR)) return;
    const summary = await (async () => {
      const existing = (0, htmlQuery)(element, ":scope > .item-summary");
      if (existing) return existing;
      if (!item.isOfType("Trihn")) {
        const insertLocation = (0, htmlQueryAll)(
          element,
          ":scope > .acquis-name, :scope > .quantity, :scope > .pouvoir-header, :scope > .owner"
        ).at(-1);
        if (!insertLocation) return null;
        const summary = document.createElement("div");
        summary.classList.add("item-summary"),
          (summary.hidden = !0),
          insertLocation.after(summary);
        const chatData = await item.getChatData(
          {
            secrets: actor.isOwner,
          },
          element.dataset
        );
        return await this.renderItemSummary(summary, item, chatData), summary;
      }
      return null;
    })();
    if (!summary) return;
    const showSummary =
      !element.classList.contains("expanded") || summary.hidden;
    options.instant
      ? ((summary.hidden = !showSummary),
        element.classList.toggle("expanded", showSummary))
      : showSummary
      ? (element.classList.add("expanded"),
        await gsap.fromTo(
          summary,
          {
            height: 0,
            opacity: 0,
            hidden: !1,
          },
          {
            height: "auto",
            opacity: 1,
            duration: 0.4,
          }
        ))
      : await gsap.to(summary, {
          height: 0,
          duration: 0.4,
          opacity: 0,
          paddingTop: 0,
          paddingBottom: 0,
          margin: 0,
          clearProps: "all",
          onComplete: () => {
            (summary.hidden = !0), element.classList.remove("expanded");
          },
        });
  }
  async renderItemSummary(div, item, chatData) {
    var _a, _b, _c;
    const description = (0, isItemSystemData)(chatData)
        ? chatData.description.value
        : await TextEditor.enrichHTML(item.description, {
            rollData: item.getRollData(),
            async: !0,
          }),
      summary = await renderTemplate(
        "systems/shaanrenaissance/templates/actors/partials/item-summary.hbs",
        {
          item,
          description,
          chatData,
        }
      );
    if (div.innerHTML = summary,
      item?.actor?.isOfType("character")
    )

      for (const button of (0, htmlQueryAll)(div, "button"))
        button.addEventListener("click", (event) => {
          event.preventDefault(), event.stopPropagation();
        });
  }
}
