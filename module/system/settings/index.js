export function registerSettings() {
    game.settings.register("shaanrenaissance", "showCheckOptions", {
      config: true,
      scope: "client",
      name: "SETTINGS.showCheckOptions.name",
      hint: "SETTINGS.showCheckOptions.label",
      type: Boolean,
      default: true
    }); game.settings.register("shaanrenaissance", "compendiumBrowserPacks", {
      name: "SETTINGS.CompendiumBrowserPacks.Name",
      hint: "SETTINGS.CompendiumBrowserPacks.Hint",
      default: {},
      type: Object,
      scope: "world",
      onChange: () => {
          game.shaanRenaissance.compendiumBrowser.initCompendiumList()
      }
  })
  }