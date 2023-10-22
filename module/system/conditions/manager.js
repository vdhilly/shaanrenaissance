import { ActorSR } from "../../actor/ActorSR.js";
import { ConditionSR } from "../../item/condition/document.js";
import { CONDITION_SLUGS } from "../../item/condition/values.js";
import { ErrorSR, localizer, setHasElement, sluggify, tupleHasValue } from "../../utils/utils.js"

export class ConditionManager {
    static #initialized = false;

    static conditions = new Map();
    
    static get conditionsSlugs() {
        return [...this.conditions.keys()].filter((k) => !k.startsWith("Compendium."));
    }

    static async initialize(force = false) {
        if (this.#initialized && !force) return;
    
        const content = await game.packs.get("shaanrenaissance.conditionitems")?.getDocuments() ?? [];
        const entries = content.map((c) => [c.slug, c]).concat(content.map((c) => [c.uuid, c]));
    
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

        const condition = ConditionManager.conditions.get(slug)?.clone(modifications);
        if (!condition) throw ErrorSR("Unexpected failure looking up condition");

        return condition;
    }

    /**
     * Update the value of a condition.
     * @param itemId The ID of the condition item.
     * @param actorOrToken The actor or token to which the condition belongs.
     * @param value The new value for the condition.
     */
    static async updateConditionValue(itemId, actorOrToken, value) {
        const actor = actorOrToken instanceof ActorSR ? actorOrToken : actorOrToken.actor;
        const condition = actor?.items.get(itemId);

        if (condition?.isOfType("condition")) {
            if (value === 0) {
                // Value is zero, remove the condition
                await condition.delete();
            } else if (actor?.isOfType("creature")) {
                // Cap the value if a capped condition
                const cappedConditions = ["dying", "wounded", "doomed"];
                if (cappedConditions.includes(condition.slug)) {
                    value = Math.min(value, actor.attributes[condition.slug].max);
                }
                await condition.update({ "system.value.value": value });
            }
        }
    }
}