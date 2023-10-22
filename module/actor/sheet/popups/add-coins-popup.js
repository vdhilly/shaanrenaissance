export class AddCoinsPopup extends FormApplication {
  static get defaultOptions() {
    const options = super.defaultOptions;
    return (
      (options.id = "add-coins"),
      (options.classes = []),
      (options.title = game.i18n.localize("SR.AddCoinsTitle")),
      (options.template =
        "systems/shaanrenaissance/templates/actors/add-coins.hbs"),
      (options.width = "auto"),
      options
    );
  }
  async _updateObject(_event, formData) {
    const coins = formData.credos;
    this.object.inventory.addCoins(coins);
  }
}
