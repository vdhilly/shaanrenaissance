import { objectHasKey } from "../utils/utils.js";

export class TokenDocumentSR extends TokenDocument {
  hasStatusEffect(statusId) {
    if (statusId === "dead") return !!this.actor?.statuses.has("dead");
    const { actor } = this;

    if (!actor) return false;

    const hasCondition = objectHasKey(CONFIG.shaanRenaissance.conditionTypes, statusId) && actor.hasCondition(statusId);
    return hasCondition;
  }

  getBarAttribute(barName, { alternative } = {}) {
    let attribute = alternative;
    
    if ( !attribute ) {
      if ( barName === "bar3" ) {
        attribute = "attributes.hpCorps";
      } else {
        attribute = this[barName]?.attribute;
      }
    }

    if (!attribute || !this.actor) return null;
    
    const system = this.actor.system;
    const isSystemDataModel = system instanceof foundry.abstract.DataModel;
    const templateModel = game.model.Actor[this.actor.type];

    const data = foundry.utils.getProperty(system, attribute);
    if (data === null || data === undefined) return null;

    if ( typeof data === "number" || Number.isFinite(Number(data)) ) {
      let editable = foundry.utils.hasProperty(templateModel, attribute);
      if (isSystemDataModel) {
        const field = system.schema.getField(attribute);
        if (field) editable = field instanceof foundry.data.fields.NumberField;
      }
      return { type: "value", attribute, value: Number(data), editable };
    }

    else if ( data && typeof data === "object" && "value" in data && "max" in data ) {
      let editable = foundry.utils.hasProperty(templateModel, `${attribute}.value`);
      if (isSystemDataModel) {
        const field = system.schema.getField(`${attribute}.value`);
        if (field) editable = field instanceof foundry.data.fields.NumberField;
      }
      return { type: "bar", attribute, value: parseInt(data.value || 0), max: parseInt(data.max || 0), editable };
    }

    return null;
  }
}