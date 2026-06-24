export class SRTokenHUD extends foundry.applications.hud.TokenHUD {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "token-hud",
      template: "systems/shaanrenaissance/templates/hud/tokenHUD.hbs",
    });
  }

  getData(options = {}) {
    let data = super.getData(options);
    const doc = this.object.document;

    const bar1 = doc.getBarAttribute("bar1", { alternative: "attributes.hpEsprit" });
    const bar2 = doc.getBarAttribute("bar2", { alternative: "attributes.hpAme" });
    const bar3 = doc.getBarAttribute("bar3", { alternative: "attributes.hpCorps" });
    
    const bars = [bar1, bar2, bar3];

    if (this.object.actor && this.object.actor.type !== "Loot") {
      bars.forEach((b) => {
        if (b && typeof b.value === "number") {
          if (b.value > b.max) {
            b.value = b.max;
          }
        }
      });

      data = foundry.utils.mergeObject(data, {
        canConfigure: game.user.can("TOKEN_CONFIGURE"),
        canToggleCombat: ui.combat !== null,
        displayBar1: bar1 && bar1.type !== "none",
        bar1Data: bar1,
        displayBar2: bar2 && bar2.type !== "none",
        bar2Data: bar2,
        displayBar3: bar3 && bar3.type !== "none",
        bar3: bar3,
        bar3Data: bar3,
        visibilityClass: data.hidden ? "active" : "",
        effectsClass: this._statusEffects ? "active" : "",
        combatClass: this.object.inCombat ? "active" : "",
        targetClass: this.object.targeted.has(game.user) ? "active" : "",
      });
    }
    data.statusEffects = this._getStatusEffectChoices(data);
    return data;
  }
}