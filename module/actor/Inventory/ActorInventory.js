export class ActorInventory extends Collection {
    constructor(actor, entries) {
        super(null == entries ? void 0 : entries.map((entry => [entry.id, entry]))), this.actor = actor
    }
    async addCoins(coins){
        const actor = this.actor
        const credos = Number(actor.system.attributes.crédos)
        this.actor.update({
            "system.attributes.crédos": Number(credos + coins)
        })
    }
    async removeCoins(coins){
        const actor = this.actor
        const credos = Number(actor.system.attributes.crédos)
        console.log(credos, coins,credos - coins)
            this.actor.update({
                "system.attributes.crédos": Number(credos - coins)
            })
    }
}