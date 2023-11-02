import { ActorSR } from "../../actor/ActorSR.js";
import { ConditionSR } from "../../item/condition/document.js";
import { CONDITION_SLUGS } from "../../item/condition/values.js";
import {
  ErrorSR,
  localizer,
  setHasElement,
  sluggify,
  tupleHasValue,
} from "../../utils/utils.js";

export class ConditionManager {
  static #initialized = false;

  static conditions = new Map();

  static get conditionsSlugs() {
    return [...this.conditions.keys()].filter(
      (k) => !k.startsWith("Compendium.")
    );
  }

  static async initialize(force = false) {
    if (this.#initialized && !force) return;

    const content =
      (await game.packs
        .get("shaanrenaissance.conditionitems")
        ?.getDocuments()) ?? [];
    const entries = content
      .map((c) => [c.slug, c])
      .concat(content.map((c) => [c.uuid, c]));

    this.conditions = new Map(entries);
    this.#initialized = true;
  }
  /**
   * Get a condition using the condition name.
   * @param slug A condition slug
   */
  static getCondition(slug, modifications) {
    slug = sluggify(slug);
    if (!setHasElement(CONDITION_SLUGS, slug)) return null;

    const condition = ConditionManager.conditions
      .get(slug)
      ?.clone(modifications);
    if (!condition) throw ErrorSR("Unexpected failure looking up condition");

    return condition;
  }
}
