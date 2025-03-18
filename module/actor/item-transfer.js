export class ItemTransfer {
    constructor(data) {
        this.source = data.source;
        this.target = data.target;
        this.quantity = data.quantity;
        this.containerId = data.containerId;
        this.isPurchase = data.isPurchase ?? null;
    }

    async request() {
        const gamemaster = game.users.find((u) => u.isGM && u.active);

        if(!gamemaster) {
            return
        }

        game.socket.emit("system.shaanrenaissance", { request: "itemTransfer", data: this });
    }

    async enact(requester){
        if (!game.user.isGM) {
            return console.log("Transfer d'item non autorisé");
        }

        const sourceActor = this.#getSource();
        const sourceItem = sourceActor?.items.find((i) => i.id === this.source.itemId);
        const targetActor = this.#getTarget();

        if (!(sourceActor?.isLootableBy(game.user) && sourceItem && targetActor?.isLootableBy(game.user))) {
            return 
        }

        this.isPurchase ??= sourceActor.isOfType("loot") && sourceActor.isMerchant;
        const targetItem = await sourceActor.transferItemToActor(
            targetActor,
            sourceItem,
            this.quantity,
            this.containerId,
            false,
            this.isPurchase,
        );
        
        await sourceActor.inventory.addCoins(Number(sourceItem.system.acquis.valeur.replace(" crédos", "")))

        return targetItem
    }

    #getActor(tokenId, actorId) {
        if (typeof tokenId === "string") {
            const token = canvas.tokens.placeables.find((t) => t.id === tokenId);
            return token?.actor ?? null;
        }
        return game.actors.get(actorId) ?? null;
    }

    #getSource() {
        return this.#getActor(this.source.tokenId, this.source.actorId);
    }

    #getTarget() {
        return this.#getActor(this.target.tokenId, this.target.actorId);
    }
}