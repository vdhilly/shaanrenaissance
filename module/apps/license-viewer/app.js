export class LicenseViewer extends Application {
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
        id:"license-viewer",
        title: game.i18n.localize("SETTINGS.LicenseViewer.label"),
        template: "systems/shaanrenaissance/templates/packs/license-viewer.hbs",
        width: 500,
        height: 600,
        resizable: !0
      })
    }
  }