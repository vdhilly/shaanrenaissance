import { CONDITION_SLUGS } from "../item/condition/values.js";
import {
  ErrorSR,
  fontAwesomeIcon,
  htmlQueryAll,
  objectHasKey,
  setHasElement,
} from "../utils/utils.js";

const debouncedRender = foundry.utils.debounce(() => {
  canvas.tokens.hud.render();
}, 20);

export class StatusEffects {
  static initialize() {
    CONFIG.shaanRenaissance.statusEffects.iconDir =
      "systems/shaanRenaissance/icons/conditions/";
    this.updateStatusIcons();
  }
  static get conditions() {
    return LocalizeSR.translations.shaanRenaissance.condition;
  }
  static activateListeners(html) {
    // Mouse actions
    for (const control of htmlQueryAll(html, ".effect-control")) {
      control.addEventListener("click", (event) => {
        this.setStatusValue(control, event);
      });
      control.addEventListener("contextmenu", (event) => {
        this.setStatusValue(control, event);
      });

      control.addEventListener("mouseover", () => {
        this.showStatusLabel(control);
      });
      control.addEventListener("mouseout", () => {
        this.showStatusLabel(control);
      });
    }
  }
  static async onRenderTokenHUD(html, tokenData) {
    var _b, _c, _d;
    const token = canvas.tokens.get(tokenData._id);
    if (!token) return;
    const iconGrid = html.querySelector(".status-effects");
    if (!iconGrid)
      throw (0, ErrorSR)("Unexpected error retrieving status effects grid");
    const actor = token.actor;
    const activeConditions = (actor && actor.conditions.active) || [];

    const affectingConditions = activeConditions.filter((c) => c.isInHUD);
    const titleBar = document.createElement("div");
    (titleBar.className = "title-bar"), iconGrid.append(titleBar);
    const statusIcons = iconGrid.querySelectorAll(".effect-control");
    for (const icon of statusIcons) {
      const picture = document.createElement("picture");
      picture.classList.add("effect-control"),
        (picture.dataset.statusId = icon.dataset.statusId),
        (picture.title = icon.title);
      const iconSrc = icon.getAttribute("src");
      picture.setAttribute("src", iconSrc);
      const newIcon = document.createElement("img");
      (newIcon.src = iconSrc),
        picture.append(newIcon),
        icon.replaceWith(picture);
      const slug =
          null !== (_d = picture.dataset.statusId) && void 0 !== _d ? _d : "",
        affecting = affectingConditions.filter((c) => c.slug === slug);
      if (affecting.length > 0 || iconSrc === token.document.overlayEffect) {
        picture.classList.add("active");
      }
    }
    this.activateListeners.call(this, iconGrid);
  }
  static updateStatusIcons() {
    (CONFIG.statusEffects = Object.entries(
      CONFIG.shaanRenaissance.statusEffects.conditions
    ).map(([id, label]) => ({
      id,
      label,
      icon: `systems/shaanRenaissance/icons/conditions/${id}.webp`,
    }))),
      CONFIG.statusEffects.push({
        id: "dead",
        label: "SR.Actor.Dead",
        icon: CONFIG.controlIcons.defeated,
      });
  }
  static showStatusLabel(control) {
    const titleBar = control
      .closest(".status-effects")
      ?.querySelector(".title-bar");
    if (titleBar && control.title) {
      titleBar.innerText = control.title;
      titleBar.classList.toggle("active");
    }
  }
  static async setStatusValue(control, event) {
    event.preventDefault();
    event.stopPropagation();

    const slug = control.dataset.statusId;
    if (!setHasElement(CONDITION_SLUGS, slug) && slug !== "dead") {
      return;
    }
    for (const token of canvas.tokens.controlled) {
      const { actor } = token;
      if (!(actor && slug)) continue;

      const condition = actor.conditions
        .bySlug(slug, { active: true, temporary: false })
        .find((c) => c.isInHUD && !c.system.references.parent);

      if (event.type === "click") {
        if (typeof condition?.value === "number") {
          await game.shaanRenaissance.ConditionManager.updateConditionValue(
            condition.id,
            token,
            condition.value + 1
          );
        } else if (objectHasKey(CONFIG.shaanRenaissance.conditionTypes, slug)) {
          await this.toggleStatus(token, control, event);
        } else {
          this.toggleStatus(token, control, event);
        }
      } else if (event.type === "contextmenu") {
        // Remove or decrement condition
        if (event.ctrlKey && slug !== "dead") {
          // Remove all conditions
          const conditionIds = actor.conditions
            .bySlug(slug, { temporary: false })
            .map((c) => c.id);
          await token.actor?.deleteEmbeddedDocuments("Item", conditionIds);
        } else if (condition?.value) {
          await game.shaanRenaissance.ConditionManager.updateConditionValue(
            condition.id,
            token,
            condition.value - 1
          );
        } else {
          await this.toggleStatus(token, control, event);
        }
      }
    }
  }

  static async toggleStatus(token, control, event) {
    const { actor } = token;
    if (!actor) return;

    const slug = control.dataset.statusId || "";
    if (!setHasElement(CONDITION_SLUGS, slug) && slug !== "dead") {
      return;
    }

    const imgElement = control.querySelector("img");
    const iconSrc = imgElement?.getAttribute("src");

    const affecting = actor.conditions
      .bySlug(slug, { active: true, temporary: false })
      .find((c) => !c.system.references.parent);
    const conditionIds = [];

    if (event.type === "click" && !affecting) {
      if (objectHasKey(CONFIG.shaanRenaissance.conditionTypes, slug)) {
        const newCondition =
          game.shaanRenaissance.ConditionManager.getCondition(slug).toObject();
        await token.actor?.createEmbeddedDocuments("Item", [newCondition]);
      } else if (
        iconSrc &&
        (event.shiftKey || control.dataset.statusId === "dead")
      ) {
        await token.toggleEffect(iconSrc, { overlay: true, active: true });
      }
    } else if (event.type === "contextmenu") {
      if (affecting) conditionIds.push(affecting.id);

      if (conditionIds.length > 0) {
        await token.actor?.deleteEmbeddedDocuments("Item", conditionIds);
      } else if (token.document.overlayEffect === iconSrc) {
        await token.document.update({ overlayEffect: "" });
      }
    }
  }
  static refresh() {
    if (canvas.ready && canvas.tokens.hud.rendered) {
      debouncedRender();
    }
  }
}
