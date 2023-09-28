import { ItemSR } from "../ItemSR.js";

export class ConditionSR extends ItemSR {
    prepareBaseData(){
        super.prepareBaseData();
        this.active = true;
    }
    prepareActorData() {
        super.prepareActorData();

        this.actor.conditions.set(this.id, this);
    }
    get isInHUD() {
        return this.slug in CONFIG.ShaanRenaisssance.statusEffects.conditions
    }
}