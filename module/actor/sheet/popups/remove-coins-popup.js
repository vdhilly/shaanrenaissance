export class RemoveCoinsPopup extends FormApplication {
  static get defaultOptions() {
    const options = super.defaultOptions;
    return (
      (options.id = "remove-coins"),
      (options.classes = []),
      (options.title = game.i18n.localize("SR.RemoveCoinsTitle")),
      (options.template =
        "systems/shaanrenaissance/templates/actors/remove-coins.hbs"),
      (options.width = "auto"),
      options
    );
  }
  async _updateObject(_event, formData) {
    const coins = formData.credos;
    this.object.inventory.removeCoins(coins);
  }
}
