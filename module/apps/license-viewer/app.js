export class LicenseViewer extends foundry.applications.api.ApplicationV2 {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "license-viewer",
      title: game.i18n.localize("SETTINGS.LicenseViewer.label"),
      template: "systems/shaanrenaissance/templates/packs/license-viewer.hbs",
      width: 500,
      height: 600,
      resizable: !0,
    });
  }
}
