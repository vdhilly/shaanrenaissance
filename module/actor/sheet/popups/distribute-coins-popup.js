

import { ActorSR } from "../../../ActorSR.js"
export class DistributeCoinsPopup extends FormApplication {
    static get defaultOptions() {
        const options = super.defaultOptions;
        return options.id = "distribute-coins", options.classes = [], options.title = "Distribute Coins", options.template = "systems/shaanrenaissance/templates/actors/Loot/partials/distribute-coins.hbs", options.width = "auto", options
    }
    async _updateObject(_event, formData){
        console.log(formData)
        const thisActor = this.object,
        selectedActors = formData.actorIds.flatMap((actorId => {
            const maybeActor = game.actors.get(actorId);
            return maybeActor instanceof ActorSR ? maybeActor : []
        })),
        playerCount = selectedActors.length;
        console.log(playerCount)
        const credos = thisActor.system.attributes.crédos
        if (credos == 0) return ui.notifications.warn("Il n'y a aucun crédos dans le Butin")
        thisActor.inventory.removeCoins(credos)
        const coinShare = credos / playerCount
        let message = "Distribution de ";
        0 !== coinShare && (message += `${coinShare} crédos chacun `);
        message += `de ${thisActor.name} vers `;
        for (const actor of selectedActors) {
            await actor.inventory.addCoins(coinShare);
            const index = selectedActors.indexOf(actor);
            message += 0 === index ? `${actor.name}` : index < playerCount - 1 ? `, ${actor.name}` : ` et ${actor.name}.`
        }
        ChatMessage.create({
            user: game.user.id,
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: message
        })
    }
    async _onSubmit(event, options = {}) {
        var _a;
        const actorIds = Array.from(this.form.elements).flatMap((element => element instanceof HTMLInputElement && "actorIds" === element.name && element.checked ? element.value : []));
        return options.updateData = mergeObject(null !== (_a = options.updateData) && void 0 !== _a ? _a : {}, {
            actorIds
        }), super._onSubmit(event, options)
    }
    async getData() {
        const sheetData = await super.getData(); console.log(sheetData); 
            const playerActors = game.actors.filter((actor => actor.hasPlayerOwner && actor.isOfType("character")));
            
        return sheetData.actorInfo = playerActors.map((actor => ({
            id: actor.id,
            name: actor.name,
            checked: game.users.players.some((user => {
                var _a;
                return user.active && (null === (_a = user.character) || void 0 === _a ? void 0 : _a.id) === actor.id
            })) 
        }))), sheetData
    }
}