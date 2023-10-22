import { registerSheets } from "../register-sheets.js";
export const Setup = {
  listen: () => {
    Hooks.once("setup", () => {
      // Register actor and item sheets
      registerSheets();

      // Forced panning is intrinsically annoying: change default to false
      game.settings.settings.get("core.chatBubblesPan").default = false;
      // Improve discoverability of map notes
      game.settings.settings.get("core.notesDisplayToggle").default = true;

      // Set Hover by Owner as defaults for Default Token Configuration
      const defaultTokenSettingsDefaults =
        game.settings.settings.get("core.defaultToken").default;
      defaultTokenSettingsDefaults.displayName =
        CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER;
      defaultTokenSettingsDefaults.displayBars =
        CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER;
    });
  },
};
