import { ActorSR } from "./actor/ActorSR.js";
import { CreatureSR } from "./actor/Creature/document.js";
import { NpcSR } from "./actor/PNJ/document.js";
import { PersonnageSR } from "./actor/Personnage/PersonnageSR.js";
import { ShaaniSR } from "./actor/Shaani/document.js";
import { LootSR } from "./actor/loot/LootSR.js";
import { AcquisSR } from "./item/Acquis/base.js";
import { CreatorSet } from "./item/CreatorSet/base.js";
import { ItemSR } from "./item/ItemSR.js";
import { Ability } from "./item/ability/base.js";
import { Symbiose } from "./item/ability/symbiose.js";
import { ConditionSR } from "./item/condition/document.js";
import { SpéTest, SpéTestNécr, domainTest, necroseTest } from "./jets/dice.js";
import { AddCoins, AddPrestige, AddXP, RemoveCoins } from "./macros/macros.js";
import { getSelectedOrOwnActors } from "./utils/utils.js";

export const shaanRenaissance = {};

shaanRenaissance.Actor = {
  documentClasses: {
    Personnage: PersonnageSR,
    Loot: LootSR,
    Shaani: ShaaniSR,
    Réseau: ActorSR,
    Créature: CreatureSR,
    PNJ: NpcSR,
  },
};
shaanRenaissance.Item = {
  documentClasses: {
    Armement: AcquisSR,
    Artefact: AcquisSR,
    Armimale: AcquisSR,
    Manuscrit: AcquisSR,
    Outil: AcquisSR,
    Protection: AcquisSR,
    Relation: AcquisSR,
    Richesse: AcquisSR,
    Technologie: AcquisSR,
    Transport: AcquisSR,
    Bâtiment: AcquisSR,
    Trihn: ItemSR,
    Pouvoir: Ability,
    Race: CreatorSet,
    Peuple: CreatorSet,
    Caste: CreatorSet,
    Métier: CreatorSet,
    condition: ConditionSR,
    Symbiose: Symbiose,
  },
};
shaanRenaissance.macros = {
  domainTest: domainTest,
  necroseTest: necroseTest,
  speTest: SpéTest,
  speTestNecrose: SpéTestNécr,
  addCoins: AddCoins,
  removeCoins: RemoveCoins,
  addXP: AddXP,
  addPrestige: AddPrestige,
};
shaanRenaissance.utils = {
  getSelectedOrOwnActors: getSelectedOrOwnActors,
};
shaanRenaissance.tokenHUDStatuses = {
  deafened: "SR.ConditionTypeDeafened",
  blinded: "SR.ConditionTypeBlinded",
  stunned: "SR.ConditionTypeStunned",
  obscurity: "SR.ConditionTypeObscurity",
  weakened: "SR.ConditionTypeWeakened",
  dazzled: "SR.ConditionTypeDazzled",
  muted: "SR.ConditionTypeMuted",
  dominated: "SR.ConditionTypeDominated",
  slowed: "SR.ConditionTypeSlowed",
  bewitched: "SR.ConditionTypeBewitched",
  paralyzed: "SR.ConditionTypeParalyzed",
  unconscious: "SR.ConditionTypeUnconscious",
  advantaged: "SR.ConditionTypeAdvantaged",
  protected: "SR.ConditionTypeProtected",
  invisible: "SR.ConditionTypeInvisible",
  prone: "SR.ConditionTypeProne",
};
shaanRenaissance.conditionTypes = {
  ...shaanRenaissance.tokenHUDStatuses,
};
(shaanRenaissance.statusEffects = {
  IconTheme: "default",
  iconDir: "systems/shaanrenaissance/icons/conditions/",
  conditions: shaanRenaissance.tokenHUDStatuses,
}),
  (shaanRenaissance.SRdomains = {
    Shaan: "Shaan",
    Technique: "Technique",
    Savoir: "Savoir",
    Social: "Social",
    Arts: "Arts",
    Magie: "Magie",
    Rituels: "Rituels",
    Survie: "Survie",
    Combat: "Combat",
    Nécrose: "Nécrose",
  });
shaanRenaissance.createAcquis = {
  Armement: "Armement",
  Armimale: "Armimale",
  Artefact: "Artefact",
  Manuscrit: "Manuscrit",
  Outil: "Outil",
  Protection: "Protection",
  Relation: "Relation",
  Richesse: "Richesse",
  Technologie: "Technologie",
  Transport: "Transport",
  Bâtiment: "Bâtiment",
};
shaanRenaissance.createPouvoir = {
  esprit: {
    "Astuce de Technique": "Astuce de Technique",
    "Secret de Savoir": "Secret de Savoir",
    "Privilège de Social": "Privilège de Social",
  },
  ame: {
    "Création d'Arts": "Création d'Arts",
    "Symbiose de Shaan": "Symbiose de Shaan",
    "Sort de Magie": "Sort de Magie",
  },
  corps: {
    "Transe de Rituels": "Transe de Rituels",
    "Exploit de Survie": "Exploit de Survie",
    "Tactique de Combat": "Tactique de Combat",
  },
};
shaanRenaissance.createTrihn = {
  type: {
    Esprit: "Esprit",
    Ame: "Âme",
    Corps: "Corps",
    "Anti-Âme": "Anti-Âme",
  },
};
shaanRenaissance.pouvoirs = {
  trihns: {
    esprit: "Esprit",
    ame: "Âme",
    corps: "Corps",
    necrose: "Nécrose",
  },
  pouvoirSelect: {
    none: "",
    "Astuce de Technique": "Astuce de Technique",
    "Secret de Savoir": "Secret de Savoir",
    "Privilège de Social": "Privilège de Social",
    "Création d'Arts": "Création d'Arts",
    "Symbiose de Shaan": "Symbiose de Shaan",
    "Sort de Magie": "Sort de Magie",
    "Transe de Rituels": "Transe de Rituels",
    "Exploit de Survie": "Exploit de Survie",
    "Tactique de Combat": "Tactique de Combat",
    "Tourment de Nécrose": "Tourment de Nécrose",
  },
  pouvoirRank: {
    Rank1: "Rang 1",
    Rank2: "Rang 2",
    Rank3: "Rang 3",
    Rank4: "Rang 4",
  },
  pouvoirType: {
    none: "",
    Attaque: "Attaque",
    Défense: "Défense",
    Déplacement: "Déplacement",
    Amélioration: "Amélioration",
    Altération: "Altération",
    Invocation: "Invocation",
    Contrôle: "Contrôle",
    Perception: "Perception",
    Récupération: "Récupération",
    Communication: "Communication",
  },
  pouvoirFréquence: {
    none: "",
    Permanente: "Permanente",
    "1/Tour": "1/Tour",
    "1/Situation": "1/Situation",
    "1/Jour": "1/Jour",
    "1/Transition": "1/Transition",
  },
  pouvoirActivation: {
    none: "",
    "1 Geste": "1 Geste",
    "1 Action": "1 Action",
    "2 Action": "2 Action",
    "1 Action par Cible": "1 Action par Cible",
    "1 Heure": "1 Heure",
    "1 Jour": "1 Jour",
    "1 Transition": "1 Transition",
    "1 Semaine": "1 Semaine",
    "1 Test par Action": "1 Test par Action",
    "1 Test par Heure": "1 Test par Heure",
    "1 Test par Jour": "1 Test par Jour",
    "1 Heure et 1 point de Corps": "1 Heure et 1 point de Corps",
    "2 Actions ou 1 Actions et -1 de Corps": "2 Actions ou 1 Actions et -1 de Corps",
    "1 Test toutes les 2 Actions ou 1 Test et -1 points de corps par Action":
      "1 Test toutes les 2 Actions ou 1 Test et -1 points de corps par Action",
    "2 Actions et -2 points de Corps ou 3 Actions et -1 point de Corps":
      "2 Actions et -2 points de Corps ou 3 Actions et -1 point de Corps",
  },
  pouvoirPortée: {
    none: "",
    soi: "Soi",
    contact: "Contact",
    interaction: "Interaction",
    distance: "Distance",
    horizon: "Horizon",
  },
};
shaanRenaissance.acquis = {
  category: {
    Armement: "Armement",
    Armimale: "Armimales",
    Artefact: "Artefacts",
    Manuscrit: "Manuscrits",
    Outil: "Outils",
    Protection: "Protections",
    Relation: "Relations",
    Richesse: "Richesses",
    Technologie: "Technologie",
    Transport: "Transport",
    Bâtiment: "Bâtiment",
  },
  class: {
    class1: "Classe 1",
    class2: "Classe 2",
    class3: "Classe 3",
    class4: "Classe 4",
    class5: "Classe 5",
  },
  caste: {
    none: "",
    Novateur: "Novateur",
    Erudit: "Erudit",
    Négociant: "Négociant",
    Artiste: "Artiste",
    Shaaniste: "Shaaniste",
    Magicien: "Magicien",
    Elementaliste: "Elementaliste",
    Voyageur: "Voyageur",
    Combattant: "Combattant",
    Ombre: "Ombre",
  },
  voie: {
    none: "",
    terrestre: "Terrestre",
    aerienne: "Aérienne",
    maritime: "Maritime",
  },
  Ressources: {
    Verre: "Verre",
    Bois: "Bois",
    Or: "Or",
    Population: "Population",
    Pierre: "Pierre",
    Trihnite: "Trihnite",
    Animal: "Animal",
    Cultures: "Cultures",
    Métal: "Métal",
    Hydrocarbure: "Hydrocarbure",
  },
};
shaanRenaissance.abilitiesTypes = {
  Attaque: "SR.abilitiesTypes.Attaque",
  Défense: "SR.abilitiesTypes.Défense",
  Déplacement: "SR.abilitiesTypes.Déplacement",
  Amelioration: "SR.abilitiesTypes.Amelioration",
  Altération: "SR.abilitiesTypes.Altération",
  Invocation: "SR.abilitiesTypes.Invocation",
  Control: "SR.abilitiesTypes.Control",
  Perception: "SR.abilitiesTypes.Perception",
  Récuperation: "SR.abilitiesTypes.Récuperation",
};
shaanRenaissance.abilitiesDomains = {
  Technique: "SRdomains.Technique",
  Savoir: "SRdomains.Savoir",
  Social: "SRdomains.Social",
  Arts: "SRdomains.Arts",
  Shaan: "SRdomains.Shaan",
  Magie: "SRdomains.Magie",
  Rituels: "SRdomains.Rituels",
  Survie: "SRdomains.Survie",
  Combat: "SRdomains.Combat",
  Nécrose: "SRdomains.Nécrose",
};
shaanRenaissance.bestiaryBrowser = {
  type: {
    Créature: "SR.creature",
    PNJ: "SR.PNJ",
  },
  class: {
    Mammifère: "SR.mammifere",
    Poisson: "SR.poisson",
    Oiseau: "SR.oiseau",
    Reptile: "SR.reptile",
    Mollusquien: "SR.mollusquien",
    Crustacé: "SR.crustace",
    Amphibien: "SR.amphibien",
    Insectoïde: "SR.insectoide",
    Créature: "SR.creature",
    Monstre: "SR.monstre",
  },
  role: {
    "Prédateur alpha": "SR.alphapredateur",
    Prédateur: "SR.predateur",
    Omnivore: "SR.omnivore",
    Herbivore: "SR.herbivore",
    Recycleur: "SR.recycleur",
  },
};
shaanRenaissance.activeEffectChanges = {
  spés: [
    { value: "system.skills.Technique.specialisations.engrenages.acquis", label: "Engrenages", group: "Technique" },
    { value: "system.skills.Technique.specialisations.pilotage.acquis", label: "Pilotage", group: "Technique" },
    { value: "system.skills.Technique.specialisations.recuperation.acquis", label: "Récuperation", group: "Technique" },
    { value: "system.skills.Technique.specialisations.sensdelapierre.acquis", label: "Sens de la pierre", group: "Technique" },
    { value: "system.skills.Technique.specialisations.sensdubois.acquis", label: "Sens du bois", group: "Technique" },
    { value: "system.skills.Technique.specialisations.sensducuir.acquis", label: "Sens du cuir", group: "Technique" },
    { value: "system.skills.Technique.specialisations.sensdumetal.acquis", label: "Sens du métal", group: "Technique" },
    { value: "system.skills.Technique.specialisations.sensdutissu.acquis", label: "Sens du tissu", group: "Technique" },
    { value: "system.skills.Technique.specialisations.sensduverre.acquis", label: "Sens du verre", group: "Technique" },
    { value: "system.skills.Technique.specialisations.technologie.acquis", label: "Technologie", group: "Technique" },

    { value: "system.skills.Savoir.specialisations.alchimie.acquis", label: "Alchimie", group: "Savoir" },
    { value: "system.skills.Savoir.specialisations.bibliotheque.acquis", label: "Bibliothèque", group: "Savoir" },
    { value: "system.skills.Savoir.specialisations.botanique.acquis", label: "Botanique", group: "Savoir" },
    { value: "system.skills.Savoir.specialisations.culturehumaine.acquis", label: "Culture Humaine", group: "Savoir" },
    { value: "system.skills.Savoir.specialisations.esoterisme.acquis", label: "Ésotérisme", group: "Savoir" },
    { value: "system.skills.Savoir.specialisations.geologie.acquis", label: "Géologie", group: "Savoir" },
    { value: "system.skills.Savoir.specialisations.histoiredheos.acquis", label: "Histoire d'Heos", group: "Savoir" },
    { value: "system.skills.Savoir.specialisations.medecine.acquis", label: "Médecine", group: "Savoir" },
    { value: "system.skills.Savoir.specialisations.protocoles.acquis", label: "Protocoles", group: "Savoir" },
    { value: "system.skills.Savoir.specialisations.zoologie.acquis", label: "Zoologie", group: "Savoir" },

    { value: "system.skills.Social.specialisations.arpege.acquis", label: "Arpège", group: "Social" },
    { value: "system.skills.Social.specialisations.bluff.acquis", label: "Bluff", group: "Social" },
    { value: "system.skills.Social.specialisations.commerce.acquis", label: "Commerce", group: "Social" },
    { value: "system.skills.Social.specialisations.diplomatie.acquis", label: "Diplomatie", group: "Social" },
    { value: "system.skills.Social.specialisations.enseignement.acquis", label: "Enseignement", group: "Social" },
    { value: "system.skills.Social.specialisations.langageprimal.acquis", label: "Langage Primal", group: "Social" },
    { value: "system.skills.Social.specialisations.languesexotiques.acquis", label: "Langues Exotiques", group: "Social" },
    { value: "system.skills.Social.specialisations.psychologie.acquis", label: "Psychologie", group: "Social" },
    { value: "system.skills.Social.specialisations.seduction.acquis", label: "Séduction", group: "Social" },
    { value: "system.skills.Social.specialisations.vieurbaine.acquis", label: "Vie Urbaine", group: "Social" },

    { value: "system.skills.Arts.specialisations.artsappliques.acquis", label: "Arts Appliqués", group: "Arts" },
    { value: "system.skills.Arts.specialisations.artsdufeu.acquis", label: "Arts du Feu", group: "Arts" },
    { value: "system.skills.Arts.specialisations.chant.acquis", label: "Chant", group: "Arts" },
    { value: "system.skills.Arts.specialisations.comedie.acquis", label: "Comédie", group: "Arts" },
    { value: "system.skills.Arts.specialisations.deguisement.acquis", label: "Déguisement", group: "Arts" },
    { value: "system.skills.Arts.specialisations.gastronomie.acquis", label: "Gastronomie", group: "Arts" },
    { value: "system.skills.Arts.specialisations.langageducorps.acquis", label: "Langage du Corps", group: "Arts" },
    { value: "system.skills.Arts.specialisations.lettres.acquis", label: "Lettres", group: "Arts" },
    { value: "system.skills.Arts.specialisations.musique.acquis", label: "Musique", group: "Arts" },
    { value: "system.skills.Arts.specialisations.trucages.acquis", label: "Trucages", group: "Arts" },

    { value: "system.skills.Shaan.specialisations.embiose.acquis", label: "Embiose", group: "Shaan" },
    { value: "system.skills.Shaan.specialisations.empathieanimale.acquis", label: "Empathie Animale", group: "Shaan" },
    { value: "system.skills.Shaan.specialisations.empathieantheenne.acquis", label: "Empathie Anthéenne", group: "Shaan" },
    { value: "system.skills.Shaan.specialisations.empathieminerale.acquis", label: "Empathie Minérale", group: "Shaan" },
    { value: "system.skills.Shaan.specialisations.empathievegetale.acquis", label: "Empathie Végétale", group: "Shaan" },
    { value: "system.skills.Shaan.specialisations.intuition.acquis", label: "Intuition", group: "Shaan" },
    { value: "system.skills.Shaan.specialisations.reve.acquis", label: "Rêve", group: "Shaan" },
    { value: "system.skills.Shaan.specialisations.soinsdelame.acquis", label: "Soins de l'Âme", group: "Shaan" },
    { value: "system.skills.Shaan.specialisations.soinsdelesprit.acquis", label: "Soins de l'Esprit", group: "Shaan" },
    { value: "system.skills.Shaan.specialisations.soinsducorps.acquis", label: "Soins du Corps", group: "Shaan" },

    { value: "system.skills.Magie.specialisations.arcanes.acquis", label: "Arcanes", group: "Magie" },
    { value: "system.skills.Magie.specialisations.conjuration.acquis", label: "Conjuration", group: "Magie" },
    { value: "system.skills.Magie.specialisations.defensemagique.acquis", label: "Défense Magique", group: "Magie" },
    { value: "system.skills.Magie.specialisations.enchantement.acquis", label: "Enchantement", group: "Magie" },
    { value: "system.skills.Magie.specialisations.invocation.acquis", label: "Invocation", group: "Magie" },
    { value: "system.skills.Magie.specialisations.incandescence.acquis", label: "Incandescence", group: "Magie" },
    { value: "system.skills.Magie.specialisations.maitrisedesschemes.acquis", label: "Maîtrise des Schèmes", group: "Magie" },
    { value: "system.skills.Magie.specialisations.regenerationdetrihn.acquis", label: "Régénération de Trihn", group: "Magie" },
    { value: "system.skills.Magie.specialisations.transfert.acquis", label: "Transfert", group: "Magie" },
    { value: "system.skills.Magie.specialisations.voile.acquis", label: "Voile", group: "Magie" },

    { value: "system.skills.Rituels.specialisations.ritedarts.acquis", label: "Rite d'Arts", group: "Rituels" },
    { value: "system.skills.Rituels.specialisations.ritedecombat.acquis", label: "Rite de Combat", group: "Rituels" },
    { value: "system.skills.Rituels.specialisations.ritedelanimal.acquis", label: "Rite de l'Animal", group: "Rituels" },
    { value: "system.skills.Rituels.specialisations.ritedemagie.acquis", label: "Rite de Magie", group: "Rituels" },
    { value: "system.skills.Rituels.specialisations.ritedenecrose.acquis", label: "Rite de Nécrose", group: "Rituels" },
    { value: "system.skills.Rituels.specialisations.ritedesavoir.acquis", label: "Rite de Savoir", group: "Rituels" },
    { value: "system.skills.Rituels.specialisations.ritedeshaan.acquis", label: "Rite de Shaan", group: "Rituels" },
    { value: "system.skills.Rituels.specialisations.ritedesocial.acquis", label: "Rite de Social", group: "Rituels" },
    { value: "system.skills.Rituels.specialisations.ritedesurvie.acquis", label: "Rite de Survie", group: "Rituels" },
    { value: "system.skills.Rituels.specialisations.ritedetechnique.acquis", label: "Rite de Technique", group: "Rituels" },

    { value: "system.skills.Survie.specialisations.acrobatie.acquis", label: "Acrobatie", group: "Survie" },
    { value: "system.skills.Survie.specialisations.caravane.acquis", label: "Caravane", group: "Survie" },
    { value: "system.skills.Survie.specialisations.cultureheossienne.acquis", label: "Culture Heossienne", group: "Survie" },
    { value: "system.skills.Survie.specialisations.culturenecrosienne.acquis", label: "Culture Nécrosienne", group: "Survie" },
    { value: "system.skills.Survie.specialisations.discretion.acquis", label: "Discrétion", group: "Survie" },
    { value: "system.skills.Survie.specialisations.educationphysique.acquis", label: "Éducation Physique", group: "Survie" },
    { value: "system.skills.Survie.specialisations.monture.acquis", label: "Monture", group: "Survie" },
    { value: "system.skills.Survie.specialisations.navigation.acquis", label: "Navigation", group: "Survie" },
    { value: "system.skills.Survie.specialisations.viesauvage.acquis", label: "Vie Sauvage", group: "Survie" },
    { value: "system.skills.Survie.specialisations.vigilance.acquis", label: "Vigilance", group: "Survie" },

    { value: "system.skills.Combat.specialisations.armeslancees.acquis", label: "Armes Lancées", group: "Combat" },
    { value: "system.skills.Combat.specialisations.armesdemelee.acquis", label: "Armes de Mêlée", group: "Combat" },
    { value: "system.skills.Combat.specialisations.armesaprojectiles.acquis", label: "Armes à Projectiles", group: "Combat" },
    { value: "system.skills.Combat.specialisations.armimales.acquis", label: "Armes Imales", group: "Combat" },
    { value: "system.skills.Combat.specialisations.enginsdeguerre.acquis", label: "Engins de Guerre", group: "Combat" },
    { value: "system.skills.Combat.specialisations.esquive.acquis", label: "Esquive", group: "Combat" },
    { value: "system.skills.Combat.specialisations.forcer.acquis", label: "Forcer", group: "Combat" },
    { value: "system.skills.Combat.specialisations.intimidation.acquis", label: "Intimidation", group: "Combat" },
    { value: "system.skills.Combat.specialisations.pugilat.acquis", label: "Pugilat", group: "Combat" },
    { value: "system.skills.Combat.specialisations.strategie.acquis", label: "Stratégie", group: "Combat" },

    { value: "system.skills.Nécrose.specialisations.armeshumaines.acquis", label: "Armes Humaines", group: "Nécrose" },
    { value: "system.skills.Nécrose.specialisations.biomorphie.acquis", label: "Biomorphie", group: "Nécrose" },
    { value: "system.skills.Nécrose.specialisations.cauchemar.acquis", label: "Cauchemar", group: "Nécrose" },
    { value: "system.skills.Nécrose.specialisations.contrebande.acquis", label: "Contrebande", group: "Nécrose" },
    { value: "system.skills.Nécrose.specialisations.corruption.acquis", label: "Corruption", group: "Nécrose" },
    { value: "system.skills.Nécrose.specialisations.explosifs.acquis", label: "Explosifs", group: "Nécrose" },
    { value: "system.skills.Nécrose.specialisations.fraude.acquis", label: "Fraude", group: "Nécrose" },
    { value: "system.skills.Nécrose.specialisations.harcelement.acquis", label: "Harcèlement", group: "Nécrose" },
    { value: "system.skills.Nécrose.specialisations.larcin.acquis", label: "Larcin", group: "Nécrose" },
    { value: "system.skills.Nécrose.specialisations.pactenecrotique.acquis", label: "Pacte Nécrotique", group: "Nécrose" },
  ],
  protections: [
    { value: "system.protections.esprit.value", label: "Esprit" },
    { value: "system.protections.ame.value", label: "Âme" },
    { value: "system.protections.corps.value", label: "Corps" },
  ],
};

shaanRenaissance.lootSheetTypeOptions = {
  "Loot": "SR.loot.LootLabel", 
  "Merchant": "SR.loot.MerchantLabel",
}