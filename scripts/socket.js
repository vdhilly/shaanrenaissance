import { ItemTransfer } from "../module/actor/item-transfer.js";


function activateSocketListeners() {
    game.socket.on("system.shaanrenaissance", async (...[message, userId]) => {
        const sender = game.users.get(userId, { strict: true });

        switch (message.request) {
            case "itemTransfer":
                if (game.user.isGM) {
                    console.debug(`Shaan Renaissance System | Received item-transfer request from ${sender.name}`);
                    const transfer = new ItemTransfer(message.data);
                    transfer.enact(sender);
                }
                break;
        }
    })
}

export {activateSocketListeners}