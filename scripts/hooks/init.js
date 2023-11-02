import { LicenseViewer } from "../../module/apps/license-viewer/app.js";
import { shaanRenaissance } from "../../module/config.js";
import { ConditionManager } from "../../module/system/conditions/manager.js";
import { ModuleArt } from "../../module/system/module-art.js";
import { registerSettings } from "../../module/system/settings/index.js";
import { registerHandlebarsHelpers } from "../handlebars.js";
import { templatePaths } from "../preloadTemplates.js";
import { registerFonts } from "../register-fonts.js";

export const Init = {
  listen: () => {
    Hooks.once("init", () => {
      console.log("SHAAN RENAISSANCE | Initialising Shaan Renaissance System");

      CONFIG.shaanRenaissance = shaanRenaissance;
      CONFIG.specialStatusEffects.BLIND = "blinded";
      registerFonts();
      registerHandlebarsHelpers();
      registerSettings();
      preloadHandleBarTemplates();

      game.shaanRenaissance = {};
      game.shaanRenaissance.ConditionManager = ConditionManager;
      game.shaanRenaissance.LicenseViewer = new LicenseViewer();

      game.shaanRenaissance.system = { moduleArt: new ModuleArt() };
    });
  },
};
async function preloadHandleBarTemplates() {
  return loadTemplates(templatePaths);
}
