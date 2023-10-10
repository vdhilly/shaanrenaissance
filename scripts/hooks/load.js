import { TokenSR } from "../../module/token/TokenSR.js";
import { TokenDocumentSR } from "../../module/token/TokenDocumentSR.js";
import { ActorProxySR, ActorSR } from "../../module/actor/ActorSR.js";
import { TokenConfigSR } from "../../module/token/TokenConfigSR.js";
import { SRActiveEffectConfig } from "../../module/ActiveEffects/SRActiveEffectConfig.js";
import { SRActiveEffect } from "../../module/ActiveEffects/SRActiveEffect.js";
import { ItemProxySR, ItemSR } from "../../module/item/ItemSR.js";
import { ActorDirectorySR } from "../../module/apps/sidebar/actorDirectory.js";
import { ItemDirectorySR } from "../../module/apps/sidebar/itemDirectory.js";
import { CompendiumDirectorySR } from "../../module/apps/sidebar/compendiumDirectory.js";
import { CombatSR } from "../../module/encounter/combat.js";

export const Load = {
    listen: () => {
        CONFIG.Actor.documentClass = ActorProxySR;
        CONFIG.Token.objectClass = TokenSR;
        CONFIG.Token.documentClass = TokenDocumentSR;
        CONFIG.Token.prototypeSheetClass = TokenConfigSR;
        CONFIG.Item.documentClass = ItemProxySR;
        CONFIG.ActiveEffect.documentClass = SRActiveEffect;
        CONFIG.ActiveEffect.sheetClass = SRActiveEffectConfig;
        CONFIG.ui.actors = ActorDirectorySR;
        CONFIG.ui.items = ItemDirectorySR;
        CONFIG.ui.compendium = CompendiumDirectorySR;
        CONFIG.Combat.documentClass = CombatSR;
    }
}