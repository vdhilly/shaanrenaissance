export default class SRItem extends Item {
    async roll() {

        let chatData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker()
        };

        let cardData = {
            ...this.data,
            owner: this.actor.id
        };

        chatData.content = await renderTemplate (this.chatTemplate[this.type], cardData);

        chatData.roll = true;
        return ChatMessage.create(chatData);
    }
}