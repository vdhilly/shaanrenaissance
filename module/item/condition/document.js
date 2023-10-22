import { ItemSR } from "../ItemSR.js";

export class ConditionSR extends ItemSR {
  get slug() {
    return this.system.slug;
  }
  prepareBaseData() {
    super.prepareBaseData();
    this.active = true;
  }
  prepareActorData() {
    super.prepareActorData();

    this.actor.conditions.set(this.id, this);
  }
  get isInHUD() {
    return this.slug in CONFIG.shaanRenaissance.statusEffects.conditions;
  }
}
