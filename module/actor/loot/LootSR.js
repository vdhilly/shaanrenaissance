import { ActorSR } from "../ActorSR.js";
import { ItemTransfer } from "../item-transfer.js";
export class LootSR extends ActorSR {
  get isLoot() {
    return "Loot" === this.system.lootSheetType;
  }
  get isMerchant() {
    return "Merchant" === this.system.lootSheetType;
  }
  get hiddenWhenEmpty() {
    return this.isLoot && this.system.hiddenWhenEmpty;
  }

  async toggleTokenHiding() {
    if (!this.hiddenWhenEmpty || !this.isOwner) return;
    const hiddenStatus = 0 === this.items.size;
    const scenesAndTokens = game.scenes.map((s) => [
      s,
      s.tokens.filter((t) => t.actor === this),
    ]);
    const promises = scenesAndTokens.map(([scene, tokenDocs]) =>
      scene.updateEmbeddedDocuments(
        "Token",
        tokenDocs.map((tokenDoc) => ({
          _id: tokenDoc.id,
          hidden: hiddenStatus,
        }))
      )
    );
    await Promise.allSettled(promises);
  }

  // TODO : ici
  async transferItemToActor(targetActor, item, isPurchase){
    isPurchase ??= this.isOfType("loot") && this.isMerchant;

    const gmMustTransfer = (source, target) => {
      const bothAreOwned = source.isOwner && target.isOwner
      const sourceIsOwnedOrLoot = source.isLootableBy(game.user);
      const targetIsOwnedOrLoot = target.isLootableBy(game.user);
      
      return !bothAreOwned && !sourceIsOwnedOrLoot && targetIsOwnedOrLoot;
    }
    

    if (gmMustTransfer(this, targetActor)) {
      const source = { tokenId: this.token?.id, actorId: this.id, itemId: item.id };
      const target = { tokenId: targetActor.token?.id, actorId: targetActor.id };
      await new ItemTransfer({ source, target, isPurchase }).request();
      return null;
    }

    if (!this.canUserModify(game.user, "update")) {
      return null;
    }
    if (!targetActor.canUserModify(game.user, "update")) {
        return null;
    }

    await targetActor.createEmbeddedDocuments("Item", [item.toObject()]);

    return item.delete();
  }

  isLootableBy(user) {
    return this.canUserModify(user, "update");
  }

  _onCreate(data, options, userId) {
    this.toggleTokenHiding(), super._onCreate(data, options, userId);
  }
  _onUpdate(changed, options, userId) {
    var _a;
    void 0 !==
      (null === (_a = changed.system) || void 0 === _a
        ? void 0
        : _a.hiddenWhenEmpty) && this.toggleTokenHiding(),
      super._onUpdate(changed, options, userId);
  }
  _onCreateDescendantDocuments(
    embeddedName,
    documents,
    result,
    options,
    userId
  ) {
    this.toggleTokenHiding(),
      super._onCreateDescendantDocuments(
        embeddedName,
        documents,
        result,
        options,
        userId
      );
  }
  _onDeleteDescendantDocuments(
    embeddedName,
    documents,
    result,
    options,
    userId
  ) {
    this.toggleTokenHiding(),
      super._onDeleteDescendantDocuments(
        embeddedName,
        documents,
        result,
        options,
        userId
      );
  }
}
