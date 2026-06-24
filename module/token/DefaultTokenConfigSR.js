export class DefaultTokenConfigSR extends DefaultTokenConfig {
  get template() {
    return "systems/shaanrenaissance/templates/scene/tokenConfig.hbs";
  }

  async getData(options = {}) {
    const context = await super.getData(options);
    
    const tokenDoc = this.document ?? this.token;

    return Object.assign(context, {
      object: tokenDoc.toObject(false),
      isDefault: true,
      barAttributes: TokenDocument.implementation.getTrackedAttributeChoices(),
      bar1: tokenDoc.bar1,
      bar2: tokenDoc.bar2,
      bar3: tokenDoc.getFlag("shaanrenaissance", "bar3") || { attribute: "attributes.hpCorps" },
    });
  }

  _getSubmitData(updateData = {}) {
    const formData = foundry.utils.expandObject(super._getSubmitData(updateData));
    
    if ( formData.light ) formData.light.color = formData.light.color || undefined;
    if ( formData.bar1 ) formData.bar1.attribute = formData.bar1.attribute || null;
    if ( formData.bar2 ) formData.bar2.attribute = formData.bar2.attribute || null;
    
    if ( formData.bar3 ) {
      formData["flags.shaanrenaissance.bar3.attribute"] = formData.bar3.attribute || null;
      delete formData.bar3;
    }
    return formData;
  }
}