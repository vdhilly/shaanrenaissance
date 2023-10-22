import { DiceSoNiceReady } from "./dice-so-nice-ready.js";
import { Init } from "./init.js";
import { Load } from "./load.js";
import { Ready } from "./ready.js";
import { RenderChatMessage } from "./render-chat-message.js";
import { RenderDialog } from "./render-dialog.js";
import { RenderSettings } from "./render-settings.js";
import { RenderTokenHUD } from "./render-token-hud.js";
import { Setup } from "./setup.js";

export const HooksSR = {
  listen() {
    const listeners = [
      Load,
      DiceSoNiceReady,
      Init,
      Ready,
      RenderChatMessage,
      RenderDialog,
      RenderSettings,
      RenderTokenHUD,
      Setup,
    ];
    for (const Listener of listeners) {
      Listener.listen();
    }
  },
};
