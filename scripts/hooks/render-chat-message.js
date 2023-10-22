import * as Puiser from "../../module/jets/puiser.js";
export const RenderChatMessage = {
  listen: () => {
    Hooks.on("renderChatMessage", (app, html, data) => {
      Puiser.hideChatPuiserButtons(app, html, data);
      Puiser.addChatListeners(app, html, data);
    });
  },
};
