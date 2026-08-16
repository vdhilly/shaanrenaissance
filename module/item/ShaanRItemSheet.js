export default class ShaanRItemSheet extends foundry.appv1.sheets.ItemSheet {
  get template() {
    // .slugify() évite les erreurs ENOENT sur les types avec accents (ex: "Réseau" -> "reseau")
    const folderType = this.item.type.slugify();
    return `systems/shaanrenaissance/templates/items/${folderType}/sheet.hbs`;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 691,
      height: 500,
      tabs: [
        {
          navSelector: ".sheet-navigation",
          contentSelector: ".sheet-content",
          initial: "general",
        },
      ],
    });
  }

  async getData(options = this.options) {
    options.id ||= this.id;
    const itemData = this.item.toObject(false);
    
    return {
      cssClass: this.item.isOwner ? "editable" : "locked",
      editable: this.isEditable,
      document: this.item,
      limited: this.item.limited,
      owner: this.item.isOwner,
      parent: this.item.parent,
      title: this.title,
      item: itemData,
      system: itemData.system,
      effects: itemData.effects,
      config: CONFIG.shaanRenaissance,
      user: {
        isGM: game.user.isGM,
      },
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (this.isEditable) {
      html.find(".effect-control").click(this._onEffectControl.bind(this));
    }
  }

  async _onEffectControl(event) {
    event.preventDefault();
    const owner = this.item;
    const a = event.currentTarget;
    const tr = a.closest("tr");
    let effect;
    
    if (tr) {
      effect = tr.dataset.effectId ? owner.effects.get(tr.dataset.effectId) : null;
    }

    switch (a.dataset.action) {
      case "create":
        // En V14, les ActiveEffects utilisent "name" au lieu de "label"
        return owner.createEmbeddedDocuments("ActiveEffect", [
          {
            name: game.i18n.localize("EFFECT.New") || "New Effect",
            icon: "icons/svg/aura.svg",
            origin: owner.uuid,
            disabled: false,
          },
        ]);
      case "edit":
        return effect?.sheet.render(true);
      case "delete":
        return effect?.delete();
    }
  }
}