export class TokenConfigSR extends TokenConfig {
  get template() {
    return "systems/shaanrenaissance/templates/scene/tokenConfig.hbs";
  }
  // async getData(options = {}) {
  //   const alternateImages = await this._getAlternateTokenImages();
  //   const attributes = TokenDocument.implementation.getTrackedAttributes(
  //     this.actor?.system ?? {}
  //   );
  //   const canBrowseFiles = game.user.hasPermission("FILES_BROWSE");
  //   const gridUnits =
  //     this.isPrototype || !canvas.ready
  //       ? game.system.gridUnits
  //       : canvas.scene.grid.units;

  //   // Prepare Token data
  //   const token = this.object.toObject();
  //   const basicDetection = token.detectionModes.find(
  //     (m) => m.id === DetectionMode.BASIC_MODE_ID
  //   )
  //     ? null
  //     : this.object.detectionModes.find(
  //         (m) => m.id === DetectionMode.BASIC_MODE_ID
  //       );

  //   const ConfigData = {
  //     cssClasses: [this.isPrototype ? "prototype" : null]
  //       .filter((c) => !!c)
  //       .join(" "),
  //     isPrototype: this.isPrototype,
  //     hasAlternates: !foundry.utils.isEmpty(alternateImages),
  //     alternateImages: alternateImages,
  //     object: token,
  //     options: this.options,
  //     gridUnits: gridUnits || game.i18n.localize("GridUnits"),
  //     barAttributes:
  //       TokenDocument.implementation.getTrackedAttributeChoices(attributes),
  //     bar1: this.token.getBarAttribute?.("bar1"),
  //     bar2: this.token.getBarAttribute?.("bar2"),
  //     bar3: this.token.getBarAttribute?.("bar3"),
  //     colorationTechniques: AdaptiveLightingShader.SHADER_TECHNIQUES,
  //     visionModes: Object.values(CONFIG.Canvas.visionModes).filter(
  //       (f) => f.tokenConfig
  //     ),
  //     detectionModes: Object.values(CONFIG.Canvas.detectionModes).filter(
  //       (f) => f.tokenConfig
  //     ),
  //     basicDetection,
  //     displayModes: Object.entries(CONST.TOKEN_DISPLAY_MODES).reduce(
  //       (obj, e) => {
  //         obj[e[1]] = game.i18n.localize(`TOKEN.DISPLAY_${e[0]}`);
  //         return obj;
  //       },
  //       {}
  //     ),
  //     actors: game.actors
  //       .reduce((actors, a) => {
  //         if (!a.isOwner) return actors;
  //         actors.push({ _id: a.id, name: a.name });
  //         return actors;
  //       }, [])
  //       .sort((a, b) => a.name.localeCompare(b.name)),
  //     dispositions: Object.entries(CONST.TOKEN_DISPOSITIONS).reduce(
  //       (obj, e) => {
  //         obj[e[1]] = game.i18n.localize(`TOKEN.${e[0]}`);
  //         return obj;
  //       },
  //       {}
  //     ),
  //     lightAnimations: Object.entries(CONFIG.Canvas.lightAnimations).reduce(
  //       (obj, e) => {
  //         obj[e[0]] = game.i18n.localize(e[1].label);
  //         return obj;
  //       },
  //       { "": game.i18n.localize("None") }
  //     ),
  //     isGM: game.user.isGM,
  //     randomImgEnabled:
  //       this.isPrototype && (canBrowseFiles || this.object.randomImg),
  //     scale: Math.abs(this.object.texture.scaleX),
  //     mirrorX: this.object.texture.scaleX < 0,
  //     mirrorY: this.object.texture.scaleY < 0,
  //   };
  //   // Return rendering context
  //   console.log(ConfigData);
  //   return ConfigData;
  // }
  _getSubmitData(updateData = {}) {
    const formData = super._getSubmitData(updateData);

    // Mirror token scale
    if ("scale" in formData) {
      formData["texture.scaleX"] = formData.scale * (formData.mirrorX ? -1 : 1);
      formData["texture.scaleY"] = formData.scale * (formData.mirrorY ? -1 : 1);
    }
    ["scale", "mirrorX", "mirrorY"].forEach((k) => delete formData[k]);

    // Clear detection modes array
    if (!("detectionModes.0.id" in formData)) formData.detectionModes = [];

    // Treat "None" as null for bar attributes
    formData["bar1.attribute"] ||= null;
    formData["bar2.attribute"] ||= null;
    formData["bar3.attribute"] ||= null;
    return formData;
  }
}
