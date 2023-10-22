import { CONDITION_SLUGS } from "../item/condition/values.js";
import {
  ErrorSR,
  htmlQueryAll,
  objectHasKey,
  setHasElement,
} from "../utils/utils.js";

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
    const affectingConditions =
        null !==
          (_c =
            null === (_b = token.actor) || void 0 === _b
              ? void 0
              : _b.conditions.active.filter((c) => c.isInHUD)) && void 0 !== _c
          ? _c
          : [],
      titleBar = document.createElement("div");
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
      if (
        ((affecting.length > 0 || iconSrc === token.document.overlayEffect) &&
          picture.classList.add("active"),
        affecting.length > 0)
      ) {
        const isOverridden = affecting.every(
            (c) => c.system.references.overriddenBy.length > 0
          ),
          isLocked = affecting.every((c) => c.isLocked),
          hasValue = affecting.some((c) => c.value);
        if (isOverridden) {
          picture.classList.add("overridden");
          const badge = (0, _util_1.fontAwesomeIcon)("angle-double-down");
          badge.classList.add("badge"), picture.append(badge);
        } else if (isLocked) {
          picture.classList.add("locked");
          const badge = (0, _util_1.fontAwesomeIcon)("lock");
          badge.classList.add("badge"), picture.append(badge);
        } else if (hasValue) {
          picture.classList.add("valued");
          const badge = document.createElement("i");
          badge.classList.add("badge");
          const value = Math.max(
            ...affecting.map((c) => {
              var _b;
              return null !== (_b = c.value) && void 0 !== _b ? _b : 1;
            })
          );
          (badge.innerText = value.toString()), picture.append(badge);
        }
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
    console.log(slug);
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
          console.log("click1");
          await game.shaanRenaissance.ConditionManager.updateConditionValue(
            condition.id,
            token,
            condition.value + 1
          );
        } else if (objectHasKey(CONFIG.shaanRenaissance.conditionTypes, slug)) {
          console.log("click2");
          await token.actor?.increaseCondition(slug);
        } else {
          console.log("click3");
          this.toggleStatus(token, control, event);
        }
      } else if (event.type === "contextmenu") {
        // Remove or decrement condition
        if (event.ctrlKey && slug !== "dead") {
          // Remove all conditions
          const conditionIds = actor.conditions
            .bySlug(slug, { temporary: false })
            .map((c) => c.id);
          console.log(conditionIds);
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
    console.log(affecting);
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
}
