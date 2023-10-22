export class CombatSR extends Combat {
  async rollInitiative(
    ids,
    { formula = null, updateTurn = true, messageOptions = {} } = {}
  ) {
    // Structure input data
    ids = typeof ids === "string" ? [ids] : ids;
    const currentId = this.combatant?.id;
    const chatRollMode = game.settings.get("core", "rollMode");

    // Iterate over Combatants, performing an initiative roll for each
    const updates = [];
    const messages = [];
    for (let [i, id] of ids.entries()) {
      // Get Combatant data (non-strictly)
      const combatant = this.combatants.get(id);
      if (!combatant?.isOwner) continue;

      // Produce an initiative roll for the Combatant
      const roll = combatant.getInitiativeRoll(formula);
      await roll.evaluate({ async: true });
      if (roll.terms[0].total == 10) {
        let Limbes = roll.total - 10;
        roll._total = Limbes;
        roll.terms[0].results[0].result = 0;
        updates.push({ _id: id, initiative: Limbes });
      } else {
        updates.push({ _id: id, initiative: roll.total });
      }

      // Construct chat message data
      let messageData = foundry.utils.mergeObject(
        {
          speaker: ChatMessage.getSpeaker({
            actor: combatant.actor,
            token: combatant.token,
            alias: combatant.name,
          }),
          flavor: game.i18n.format("COMBAT.RollsInitiative", {
            name: combatant.name,
          }),
          flags: { "core.initiativeRoll": true },
        },
        messageOptions
      );
      const chatData = await roll.toMessage(messageData, { create: false });

      // If the combatant is hidden, use a private roll unless an alternative rollMode was explicitly requested
      chatData.rollMode =
        "rollMode" in messageOptions
          ? messageOptions.rollMode
          : combatant.hidden
          ? CONST.DICE_ROLL_MODES.PRIVATE
          : chatRollMode;

      // Play 1 sound for the whole rolled set
      if (i > 0) chatData.sound = null;
      messages.push(chatData);
    }
    if (!updates.length) return this;

    // Update multiple combatants
    await this.updateEmbeddedDocuments("Combatant", updates);

    // Ensure the turn order remains with the same combatant
    if (updateTurn && currentId) {
      await this.update({
        turn: this.turns.findIndex((t) => t.id === currentId),
      });
    }
    // Create multiple chat messages
    await ChatMessage.implementation.create(messages);
    return this;
  }
}
