import { SRActiveEffectConfig } from "../module/ActiveEffects/SRActiveEffectConfig.js";
import ShaanCreatureSheet from "../module/actor/Creature/ShaanCreatureSheet.js";
import ShaanNPCSheet from "../module/actor/PNJ/ShaanNPCSheet.js";
import ShaanPersonnageSheet from "../module/actor/Personnage/sheet.js";
import ShaanReseauSheet from "../module/actor/Reseau/ShaanReseauSheet.js";
import { ShaaniSheetSR } from "../module/actor/Shaani/sheet.js";
import ShaanLootSheetSR from "../module/actor/loot/ShaanLootSheet.js";
import ShaanCreatorSet from "../module/item/CreatorSet/ShaanCreatorSet.js";
import ShaanRItemSheet from "../module/item/ShaanRItemSheet.js";
import ShaanTrihnSheet from "../module/item/ShaanTrihnSheet.js";
import { symbioseSheet } from "../module/item/ability/symbioseSheet.js";
import { ShaanConditionSheet } from "../module/item/condition/sheet.js";
import { TokenConfigSR } from "../module/token/TokenConfigSR.js";

export function registerSheets() {
  foundry.applications.apps.DocumentSheetConfig.registerSheet(ActiveEffect, "shaanrenaissance", SRActiveEffectConfig, { makeDefault: true, label: "test" });
  foundry.applications.apps.DocumentSheetConfig.registerSheet(TokenDocument, "shaanrenaissance", TokenConfigSR, { makeDefault: true });
  foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
  foundry.documents.collections.Items.registerSheet("shaanrenaissance", ShaanRItemSheet, {
    types: [
      "Pouvoir",
      "Armement",
      "Armimale",
      "Manuscrit",
      "Artefact",
      "Outil",
      "Transport",
      "Technologie",
      "Richesse",
      "Protection",
      "Relation",
      "Bâtiment",
    ],
    label: "Acquis",
  });
  foundry.documents.collections.Items.registerSheet("shaanrenaissance", ShaanTrihnSheet, {
    types: ["Trihn"],
    label: "Trihn",
  });
  foundry.documents.collections.Items.registerSheet("shaanrenaissance", ShaanCreatorSet, {
    types: ["Race", "Peuple", "Caste", "Métier"],
    label: "Character Developpement",
  });
  foundry.documents.collections.Items.registerSheet("shaanrenaissance", ShaanConditionSheet, {
    types: ["condition"],
    label: "Condition",
  });
  foundry.documents.collections.Items.registerSheet("shaanrenaissance", symbioseSheet, {
    types: ["Symbiose"],
    label: "Symbiose",
  });
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Actors.registerSheet("shaanrenaissance", ShaanPersonnageSheet, {
    types: ["Personnage"],
    label: "Personnage",
  });
  foundry.documents.collections.Actors.registerSheet("shaanrenaissance", ShaanNPCSheet, {
    types: ["PNJ"],
    label: "PNJ",
  });
  foundry.documents.collections.Actors.registerSheet("shaanrenaissance", ShaanCreatureSheet, {
    types: ["Créature"],
    label: "Créature",
  });
  foundry.documents.collections.Actors.registerSheet("shaanrenaissance", ShaaniSheetSR, {
    types: ["Shaani"],
    label: "Shaani",
  });
  foundry.documents.collections.Actors.registerSheet("shaanrenaissance", ShaanReseauSheet, {
    types: ["Réseau"],
    label: "Réseau",
  });
  foundry.documents.collections.Actors.registerSheet("shaanrenaissance", ShaanLootSheetSR, {
    types: ["Loot"],
    label: "Loot",
  });
}
