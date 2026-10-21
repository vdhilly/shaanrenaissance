export class AddCoinsPopup extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.api.ApplicationV2
) {
  constructor(actor, options = {}) {
    super(options);
    this.actor = actor;
  }

  static DEFAULT_OPTIONS = {
    id: "add-coins",
    classes: ["shaan", "popup"],
    tag: "form",
    window: {
      frame: true,
      title: "SR.AddCoinsTitle",
      icon: "fa-solid fa-coins"
    },
    position: {
      width: 320,
      height: "auto"
    },
    form: {
      handler: AddCoinsPopup.#onSubmit, // Cible la méthode statique
      submitOnChange: false,
      closeOnSubmit: true
    }
  };

  static PARTS = {
    form: {
      template: "systems/shaanrenaissance/templates/actors/add-coins.hbs"
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.actor = this.actor;
    return context;
  }

  // CORRECTION CLÉ : La méthode redevent 'static' pour l'initialiseur, 
  // mais on utilise 'form.app' pour récupérer l'acteur de l'instance.
  static async #onSubmit(event, form, formData) {
    const coins = formData.object.credos;
    
    // form.app correspond à l'instance courante de ta AddCoinsPopup
    const appInstance = form.app;

    if (appInstance.actor?.inventory?.addCoins) {
      await appInstance.actor.inventory.addCoins(coins);
    }
  }
}