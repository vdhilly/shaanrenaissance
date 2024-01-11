export class ActorInventory extends Collection {
  constructor(actor, entries) {
    super(null == entries ? void 0 : entries.map((entry) => [entry.id, entry])),
      (this.actor = actor);
  }
  async addCoins(coins) {
    const actor = this.actor;
    const credos = Number(actor.system.attributes.crédos);
    let updateCredos = Number(credos) + Number(coins)
    this.actor.update({
      "system.attributes.crédos": updateCredos,
    });
  }
  async removeCoins(coins) {
    console.log(coins)
    const actor = this.actor;
    const credos = Number(actor.system.attributes.crédos);
    let updateCredos = Number(credos) - Number(coins)
    this.actor.update({
      "system.attributes.crédos": updateCredos,
    });
  }
}
