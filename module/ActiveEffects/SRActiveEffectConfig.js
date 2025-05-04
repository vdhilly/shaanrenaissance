export class SRActiveEffectConfig extends foundry.applications.sheets.ActiveEffectConfig {
  get template() {
    return "systems/shaanrenaissance/templates/items/partials/activeEffect-config.hbs";
  }
  async getData(options = {}) {
    const context = await super.getData(options);
    context.descriptionHTML = await TextEditor.enrichHTML(this.object.description, { secrets: this.object.isOwner });
    const legacyTransfer = CONFIG.ActiveEffect.legacyTransferral;
    const labels = {
      transfer: {
        name: game.i18n.localize(`EFFECT.Transfer${legacyTransfer ? "Legacy" : ""}`),
        hint: game.i18n.localize(`EFFECT.TransferHint${legacyTransfer ? "Legacy" : ""}`),
      },
    };

    // Status Conditions
    const statuses = CONFIG.statusEffects.map((s) => {
      return {
        id: s.id,
        label: game.i18n.localize(s.name ?? /** @deprecated since v12 */ s.label),
        selected: context.statuses.includes(s.id) ? "selected" : "",
      };
    });

    // Return rendering context
    return foundry.utils.mergeObject(context, {
      config: CONFIG.shaanRenaissance,
      labels,
      effect: this.object, // Backwards compatibility
      data: this.object,
      isActorEffect: this.object.parent.documentName === "Actor",
      isItemEffect: this.object.parent.documentName === "Item",
      submitText: "EFFECT.Submit",
      statuses,
      modes: Object.entries(CONST.ACTIVE_EFFECT_MODES).reduce((obj, e) => {
        obj[e[1]] = game.i18n.localize(`EFFECT.MODE_${e[0]}`);
        return obj;
      }, {}),
    });
  }
}
