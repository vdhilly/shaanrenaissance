import { compendiumBrowser } from "../../module/apps/compendium-browser/compendiumBrowser.js";
import { StatusEffects } from "../../module/canvas/status-effect.js";
import { SRTokenHUD } from "../../module/token/SRTokenHUD.js";

export const Ready = {
  listen: () => {
    Hooks.once("ready", function () {
      canvas.hud.token = new SRTokenHUD();
      game.shaanRenaissance.compendiumBrowser = new compendiumBrowser();
      game.shaanRenaissance.StatusEffects = StatusEffects;
      game.shaanRenaissance.StatusEffects.initialize();
      game.shaanRenaissance.ConditionManager.initialize();
    });
  },
};
