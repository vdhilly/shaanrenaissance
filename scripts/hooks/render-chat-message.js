import * as Puiser from "../../module/jets/puiser.js";
export const RenderChatMessage = {
  listen: () => {
    Hooks.on("renderChatMessageHTML", (message, html, context) => {
      Puiser.hideChatPuiserButtons(message, $(html), context);
      Puiser.addChatListeners(message, $(html), context);
    });
  },
};
