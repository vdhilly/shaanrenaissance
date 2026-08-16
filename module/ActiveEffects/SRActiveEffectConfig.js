export class SRActiveEffectConfig extends foundry.applications.sheets.ActiveEffectConfig {
  get template() {
    return "systems/shaanrenaissance/templates/items/partials/activeEffect-config.hbs";
  }

  // ApplicationV2 utilise _prepareContext à la place de getData
  async _prepareContext(options = {}) {
    const context = await super._prepareContext(options);
    
    // Support natif d'enrichHTML en V14
    context.descriptionHTML = await TextEditor.enrichHTML(this.document.description, {
      secrets: this.document.isOwner,
      async: true
    });

    const legacyTransfer = CONFIG.ActiveEffect.legacyTransferral;
    const labels = {
      transfer: {
        name: game.i18n.localize(`EFFECT.Transfer${legacyTransfer ? "Legacy" : ""}`),
        hint: game.i18n.localize(`EFFECT.TransferHint${legacyTransfer ? "Legacy" : ""}`),
      },
    };

    // Gestion des statuts
    const currentStatuses = context.statuses ?? Array.from(this.document.statuses);
    const statuses = CONFIG.statusEffects.map((s) => {
      return {
        id: s.id,
        label: game.i18n.localize(s.name ?? s.label),
        selected: currentStatuses.includes(s.id) ? "selected" : "",
      };
    });

    return foundry.utils.mergeObject(context, {
      config: CONFIG.shaanRenaissance,
      labels,
      effect: this.document,
      data: this.document,
      isActorEffect: this.document.parent?.documentName === "Actor",
      isItemEffect: this.document.parent?.documentName === "Item",
      submitText: "EFFECT.Submit",
      statuses,
      modes: Object.entries(CONST.ACTIVE_EFFECT_MODES).reduce((obj, [key, val]) => {
        obj[val] = game.i18n.localize(`EFFECT.MODE_${key}`);
        return obj;
      }, {}),
    });
  }
}