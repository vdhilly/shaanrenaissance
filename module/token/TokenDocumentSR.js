export class TokenDocumentSR extends TokenDocument {
    _onCreate(data, options, userId) {
        super._onCreate(data, options, userId);
        if ( this.parent.isView ) this.object?._onCreate(data, options, userId);
        this.bar1 = {attribute: "attributes.hpEsprit"};
        this.bar2 = {attribute: "attributes.hpAme"};
        this.bar3 = {attribute: "attributes.hpCorps"};

        console.log(this, data)
    }
    _onUpdate(data, options, userId) {
        // Update references to original state so that resetting the preview does not clobber these updates in-memory.
        if ( !options.preview ) Object.values(this.apps).forEach(app => app.original = this.toObject());
    
        // If the Actor association has changed, expire the cached Token actor
        if ( ("actorId" in data) || ("actorLink" in data) ) {
          if ( this._actor ) Object.values(this._actor.apps).forEach(app => app.close({submit: false}));
          this._actor = null;
        }
    
        // If the Actor data override changed, simulate updating the synthetic Actor
        if ( ("actorData" in data) && !this.isLinked ) {
          this._onUpdateTokenActor(data.actorData, options, userId);
        }
    
        // Post-update the Token itself
        this.object.drawBars()
        return super._onUpdate(data, options, userId);
      }
    getBarAttribute(barName, {alternative}={}) {
        const attr = alternative || this[barName]?.attribute;
        console.log(this)
        if ( !attr || !this.actor ) return null;
        let data = foundry.utils.getProperty(this.actor.system, attr);
        if ( (data === null) || (data === undefined) ) return null;
        const model = game.model.Actor[this.actor.type];
    
        // Single values
        if ( Number.isNumeric(data) ) {
          return {
            type: "value",
            attribute: attr,
            value: Number(data),
            editable: foundry.utils.hasProperty(model, attr)
          };
        }
    else if ( ("value" in data) && ("max" in data) ) {
        return {
          type: "bar",
          attribute: attr,
          value: parseInt(data.value || 0),
          max: parseInt(data.max || 0),
          editable: foundry.utils.hasProperty(model, `${attr}.value`)
        };
      }
      return null;
    }
}