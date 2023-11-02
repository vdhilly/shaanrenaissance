import { ItemSR } from "../ItemSR.js";

export class ConditionSR extends ItemSR {
  get slug() {
    return this.system.slug;
  }
  prepareBaseData() {
    super.prepareBaseData();
    const slug = this.slug;
    this.rollOptionSlug = slug.replace(/^(?:[a-z]+-)?(?:effect|stance)-/, "");
    this.active = true;
  }
  prepareActorData() {
    super.prepareActorData();

    this.actor.conditions.set(this.id, this);
  }
  get isInHUD() {
    return this.slug in CONFIG.shaanRenaissance.statusEffects.conditions;
  }
  _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
    this.handleChange({ create: this });
  }
  _onDelete(options, userId) {
    super._onDelete(options, userId);
    this.handleChange({ delete: { name: this._source.name } });
  }
  handleChange(change) {
    if (this.isOfType("condition")) {
      const activeTokens = this.actor ? this.actor.getActiveTokens() : [];
      for (const token of activeTokens) {
        token._onApplyStatusEffect(this.rollOptionSlug, false);
      }
    }

    game.shaanRenaissance.StatusEffects.refresh();
  }
}
