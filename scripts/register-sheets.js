import { SRActiveEffectConfig } from "../module/ActiveEffects/SRActiveEffectConfig.js";
import ShaanCreatureSheet from "../module/actor/Créature/ShaanCreatureSheet.js";
import ShaanNPCSheet from "../module/actor/PNJ/ShaanNPCSheet.js";
import ShaanPersonnageSheet from "../module/actor/Personnage/sheet.js";
import ShaanRéseauSheet from "../module/actor/Réseau/ShaanRéseauSheet.js";
import { ShaaniSheetSR } from "../module/actor/Shaani/sheet.js";
import ShaanLootSheetSR from "../module/actor/loot/ShaanLootSheet.js";
import ShaanCreatorSet from "../module/item/CreatorSet/ShaanCreatorSet.js";
import ShaanRItemSheet from "../module/item/ShaanRItemSheet.js";
import ShaanTrihnSheet from "../module/item/ShaanTrihnSheet.js";
import { symbioseSheet } from "../module/item/ability/symbioseSheet.js";
import { ShaanConditionSheet } from "../module/item/condition/sheet.js";
import { TokenConfigSR } from "../module/token/TokenConfigSR.js";

export function registerSheets() {
  DocumentSheetConfig.registerSheet(
    ActiveEffect,
    "shaanrenaissance",
    SRActiveEffectConfig,
    { makeDefault: true, label: "test" }
  );
  DocumentSheetConfig.registerSheet(
    TokenDocument,
    "shaanrenaissance",
    TokenConfigSR,
    { makeDefault: true }
  );
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("shaanrenaissance", ShaanRItemSheet, {
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
  Items.registerSheet("shaanrenaissance", ShaanTrihnSheet, {
    types: ["Trihn"],
    label: "Trihn",
  });
  Items.registerSheet("shaanrenaissance", ShaanCreatorSet, {
    types: ["Race", "Peuple", "Caste", "Métier"],
    label: "Character Developpement",
  });
  Items.registerSheet("shaanrenaissance", ShaanConditionSheet, {
    types: ["condition"],
    label: "Condition",
  });
  Items.registerSheet("shaanrenaissance", symbioseSheet, {
    types: ["Symbiose"],
    label: "Symbiose",
  });
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("shaanrenaissance", ShaanPersonnageSheet, {
    types: ["Personnage"],
    label: "Personnage",
  });
  Actors.registerSheet("shaanrenaissance", ShaanNPCSheet, {
    types: ["PNJ"],
    label: "PNJ",
  });
  Actors.registerSheet("shaanrenaissance", ShaanCreatureSheet, {
    types: ["Créature"],
    label: "Créature",
  });
  Actors.registerSheet("shaanrenaissance", ShaaniSheetSR, {
    types: ["Shaani"],
    label: "Shaani",
  });
  Actors.registerSheet("shaanrenaissance", ShaanRéseauSheet, {
    types: ["Réseau"],
    label: "Réseau",
  });
  Actors.registerSheet("shaanrenaissance", ShaanLootSheetSR, {
    types: ["Loot"],
    label: "Loot",
  });
}
