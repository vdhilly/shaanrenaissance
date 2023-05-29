export default class ShaanRItemSheet extends ItemSheet {
    get template(){
        return `systems/shaanrenaissance/templates/items/${this.item.type}/sheet.hbs`;
    }
    static get defaultOptions() {
        const options = super.defaultOptions;
        return options.width = 691, options.height = 500, options.tabs = [{

            navSelector: ".sheet-navigation",
            contentSelector: ".sheet-content",
            initial: "general"
        }], options
    }
    getData(options = this.options) {
        options.id || (options.id = this.id);
        const itemData = this.item.toObject(!1),
            sheetData = {
                cssClass: this.item.isOwner ? "editable" : "locked",
                editable: this.isEditable,
                document: this.item,
                limited: this.item.limited,
                owner: this.item.isOwner,
                title: this.title,
                item: itemData, 
                data: itemData.system,
                effects: itemData.effects,
                config: CONFIG.shaanRenaissance,
                user: {
                    isGM: game.user.isGM
                },
            };

        console.log(sheetData);
        return sheetData;
    }

    activateListeners(html) {
        if(this.isEditable) {
            html.find(".effect-control").click(this._onEffectControl.bind(this));
        }
    }

    _onEffectControl(event) {
        event.preventDefault();
        const owner = this.item;
        const a = event.currentTarget;
        const tr = a.closest("tr");
        let effect
        if(tr) {
            effect = tr.dataset.effectId ? owner.effects.get(tr.dataset.effectId) : null;
        }
        console.log(effect)

        switch (a.dataset.action) {
            case "create":
                return owner.createEmbeddedDocuments("ActiveEffect", [{
                    label: "New Effect",
                    icon: "icons/svg/aura.svg",
                    origin: owner.uuid,
                    disabled: false
                }]);
            case "edit":
                return effect.sheet.render(true);
            case "delete": 
                return effect.delete();
        }
    }
}