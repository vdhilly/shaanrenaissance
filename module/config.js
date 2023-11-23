import { ActorSR } from "./actor/ActorSR.js";
import { PersonnageSR } from "./actor/Personnage/PersonnageSR.js";
import { LootSR } from "./actor/loot/LootSR.js";
import { AcquisSR } from "./item/Acquis/base.js";
import { CreatorSet } from "./item/CreatorSet/base.js";
import { ItemSR } from "./item/ItemSR.js";
import { Ability } from "./item/ability/base.js";
import { ConditionSR } from "./item/condition/document.js";
import { domainTest, necroseTest } from "./jets/dice.js";
import { getSelectedOrOwnActors } from "./utils/utils.js";

export const shaanRenaissance = {};

shaanRenaissance.Actor = {
  documentClasses: {
    Personnage: PersonnageSR,
    Loot: LootSR,
    Shaani: ActorSR,
    Réseau: ActorSR,
    Créature: ActorSR,
    PNJ: ActorSR,
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
  },
};
shaanRenaissance.macros = {
  domainTest: domainTest,
  necroseTest: necroseTest,
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
    AstucedeTechnique: "Astuce de Technique",
    SecretdeSavoir: "Secret de Savoir",
    PrivilegedeSocial: "Privilège de Social",
    CréationdArts: "Création d'Arts",
    SymbiosedeShaan: "Symbiose de Shaan",
    SortdeMagie: "Sort de Magie",
    TransedeRituel: "Transe de Rituels",
    ExploitdeSurvie: "Exploit de Survie",
    TactiquedeCombat: "Tactique de Combat",
    TourmentdeNécrose: "Tourment de Nécrose",
  },
  pouvoirRank: {
    Rank1: "Rang 1",
    Rank2: "Rang 2",
    Rank3: "Rang 3",
    Rank4: "Rang 4",
  },
  pouvoirType: {
    none: "",
    attaque: "Attaque",
    défense: "Défense",
    déplacement: "Déplacement",
    amélioration: "Amélioration",
    altération: "Altération",
    invocation: "Invocation",
    controle: "Contrôle",
    perception: "Perception",
    recuperation: "Récupération",
  },
  pouvoirFréquence: {
    none: "",
    permanente: "Permanente",
    tour: "1/Tour",
    situation: "1/Situation",
    jour: "1/Jour",
    transition: "1/Transition",
  },
  pouvoirActivation: {
    none: "",
    geste: "1 Geste",
    action: "1 Action",
    actions: "2 Actions",
    actioncible: "1 Action par Cible",
    heure: "1 Heure",
    jour: "1 Jour",
    transition: "1 Transition",
    testparaction: "1 Test par Action",
    testparheure: "1 Test par Heure",
    testparjour: "1 Test par Jour",
    deuxactoumoinscorps: "2 Actions ou 1 Actions et -1 de Corps",
    untestdeuxactoumoinscorps:
      "1 Test toutes les 2 Actions ou 1 Test et -1 points de corps par Action",
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
  spés: {
    Technique: {
      "data.skills.Technique.specialisations.engrenages.acquis":
        "SRActiveEffect.changes.engrenagesAcquis",
      "data.skills.Technique.specialisations.pilotage.acquis":
        "SRActiveEffect.changes.pilotageAcquis",
      "data.skills.Technique.specialisations.recuperation.acquis":
        "SRActiveEffect.changes.recuperationAcquis",
      "data.skills.Technique.specialisations.sensdelapierre.acquis":
        "SRActiveEffect.changes.sensdelapierreAcquis",
      "data.skills.Technique.specialisations.sensdubois.acquisbonus":
        "SRActiveEffect.changes.sensduboisAcquis",
      "data.skills.Technique.specialisations.sensducuir.acquis":
        "SRActiveEffect.changes.sensducuirAcquis",
      "data.skills.Technique.specialisations.sensdumetal.acquis":
        "SRActiveEffect.changes.sensdumetalAcquis",
      "data.skills.Technique.specialisations.sensdutissu.acquis":
        "SRActiveEffect.changes.sensdutissuAcquis",
      "data.skills.Technique.specialisations.sensduverre.acquis":
        "SRActiveEffect.changes.sensduverreAcquis",
      "data.skills.Technique.specialisations.technologie.acquis":
        "SRActiveEffect.changes.technologieAcquis",
    },
    Savoir: {
      "data.skills.Savoir.specialisations.alchimie.acquis":
        "SRActiveEffect.changes.alchimieAcquis",
      "data.skills.Savoir.specialisations.bibliotheque.acquis":
        "SRActiveEffect.changes.bibliothequeAcquis",
      "data.skills.Savoir.specialisations.botanique.acquis":
        "SRActiveEffect.changes.botaniqueAcquis",
      "data.skills.Savoir.specialisations.culturehumaine.acquis":
        "SRActiveEffect.changes.culturehumaineAcquis",
      "data.skills.Savoir.specialisations.esoterisme.acquis":
        "SRActiveEffect.changes.esoterismeAcquis",
      "data.skills.Savoir.specialisations.geologie.acquis":
        "SRActiveEffect.changes.geologieAcquis",
      "data.skills.Savoir.specialisations.histoiredheos.acquis":
        "SRActiveEffect.changes.histoiredheosAcquis",
      "data.skills.Savoir.specialisations.medecine.acquis":
        "SRActiveEffect.changes.medecineAcquis",
      "data.skills.Savoir.specialisations.protocoles.acquis":
        "SRActiveEffect.changes.protocolesAcquis",
      "data.skills.Savoir.specialisations.zoologie.acquis":
        "SRActiveEffect.changes.zoologieAcquis",
    },
    Social: {
      "data.skills.Social.specialisations.arpege.acquis":
        "SRActiveEffect.changes.arpegeAcquis",
      "data.skills.Social.specialisations.bluff.acquis":
        "SRActiveEffect.changes.bluffAcquis",
      "data.skills.Social.specialisations.commerce.acquis":
        "SRActiveEffect.changes.commerceAcquis",
      "data.skills.Social.specialisations.diplomatie.acquis":
        "SRActiveEffect.changes.diplomatieAcquis",
      "data.skills.Social.specialisations.enseignement.acquis":
        "SRActiveEffect.changes.enseignementAcquis",
      "data.skills.Social.specialisations.langageprimal.acquis":
        "SRActiveEffect.changes.langageprimalAcquis",
      "data.skills.Social.specialisations.languesexotiques.acquis":
        "SRActiveEffect.changes.languesexotiquesAcquis",
      "data.skills.Social.specialisations.psychologie.acquis":
        "SRActiveEffect.changes.psychologieAcquis",
      "data.skills.Social.specialisations.seduction.acquis":
        "SRActiveEffect.changes.seductionAcquis",
      "data.skills.Social.specialisations.vieurbaine.acquis":
        "SRActiveEffect.changes.vieurbaineAcquis",
    },
    Arts: {
      "data.skills.Arts.specialisations.artsappliques.acquis":
        "SRActiveEffect.changes.artsappliquesAcquis",
      "data.skills.Arts.specialisations.artsdufeu.acquis":
        "SRActiveEffect.changes.artsdufeuAcquis",
      "data.skills.Arts.specialisations.chant.acquis":
        "SRActiveEffect.changes.chantAcquis",
      "data.skills.Arts.specialisations.comedie.acquis":
        "SRActiveEffect.changes.comedieAcquis",
      "data.skills.Arts.specialisations.deguisement.acquis":
        "SRActiveEffect.changes.deguisementAcquis",
      "data.skills.Arts.specialisations.gastronomie.acquis":
        "SRActiveEffect.changes.gastronomieAcquis",
      "data.skills.Arts.specialisations.langageducorps.acquis":
        "SRActiveEffect.changes.langageducorpsAcquis",
      "data.skills.Arts.specialisations.lettres.acquis":
        "SRActiveEffect.changes.lettresAcquis",
      "data.skills.Arts.specialisations.musique.acquis":
        "SRActiveEffect.changes.musiqueAcquis",
      "data.skills.Arts.specialisations.trucages.acquis":
        "SRActiveEffect.changes.trucagesAcquis",
    },
    Shaan: {
      "data.skills.Shaan.specialisations.embiose.acquis":
        "SRActiveEffect.changes.embioseAcquis",
      "data.skills.Shaan.specialisations.empathieanimale.acquis":
        "SRActiveEffect.changes.empathieanimaleAcquis",
      "data.skills.Shaan.specialisations.empathieantheenne.acquis":
        "SRActiveEffect.changes.empathieantheenneAcquis",
      "data.skills.Shaan.specialisations.empathieminerale.acquis":
        "SRActiveEffect.changes.empathiemineraleAcquis",
      "data.skills.Shaan.specialisations.empathievegetale.acquis":
        "SRActiveEffect.changes.empathievegetaleAcquis",
      "data.skills.Shaan.specialisations.intuition.acquis":
        "SRActiveEffect.changes.intuitionAcquis",
      "data.skills.Shaan.specialisations.reve.acquis":
        "SRActiveEffect.changes.reveAcquis",
      "data.skills.Shaan.specialisations.soinsdelame.acquis":
        "SRActiveEffect.changes.soinsdelameAcquis",
      "data.skills.Shaan.specialisations.soinsdelesprit.acquis":
        "SRActiveEffect.changes.soinsdelespritAcquis",
      "data.skills.Shaan.specialisations.soinsducorps.acquis":
        "SRActiveEffect.changes.soinsducorpsAcquis",
    },
    Magie: {
      "data.skills.Magie.specialisations.arcanes.acquis":
        "SRActiveEffect.changes.arcanesAcquis",
      "data.skills.Magie.specialisations.conjuration.acquis":
        "SRActiveEffect.changes.conjurationAcquis",
      "data.skills.Magie.specialisations.defensemagique.acquis":
        "SRActiveEffect.changes.defensemagiqueAcquis",
      "data.skills.Magie.specialisations.enchantement.acquis":
        "SRActiveEffect.changes.enchantementAcquis",
      "data.skills.Magie.specialisations.invocation.acquis":
        "SRActiveEffect.changes.invocationAcquis",
      "data.skills.Magie.specialisations.incandescence.acquis":
        "SRActiveEffect.changes.incandescenceAcquis",
      "data.skills.Magie.specialisations.maitrisedesschemes.acquis":
        "SRActiveEffect.changes.maitrisedesschemesAcquis",
      "data.skills.Magie.specialisations.regenerationdetrihn.acquis":
        "SRActiveEffect.changes.regenerationdetrihnAcquis",
      "data.skills.Magie.specialisations.transfert.acquis":
        "SRActiveEffect.changes.transfertAcquis",
      "data.skills.Magie.specialisations.voile.acquis":
        "SRActiveEffect.changes.voileAcquis",
    },
    Rituels: {
      "data.skills.Rituels.specialisations.ritedarts.acquis":
        "SRActiveEffect.changes.ritedartsAcquis",
      "data.skills.Rituels.specialisations.ritedecombat.acquis":
        "SRActiveEffect.changes.ritedecombatAcquis",
      "data.skills.Rituels.specialisations.ritedelanimal.acquis":
        "SRActiveEffect.changes.ritedelanimalAcquis",
      "data.skills.Rituels.specialisations.ritedemagie.acquis":
        "SRActiveEffect.changes.ritedemagieAcquis",
      "data.skills.Rituels.specialisations.ritedenecrose.acquis":
        "SRActiveEffect.changes.ritedenecroseAcquis",
      "data.skills.Rituels.specialisations.ritedesavoir.acquis":
        "SRActiveEffect.changes.ritedesavoirAcquis",
      "data.skills.Rituels.specialisations.ritedeshaan.acquis":
        "SRActiveEffect.changes.ritedeshaanAcquis",
      "data.skills.Rituels.specialisations.ritedesocial.acquis":
        "SRActiveEffect.changes.ritedesocialAcquis",
      "data.skills.Rituels.specialisations.ritedesurvie.acquis":
        "SRActiveEffect.changes.ritedesurvieAcquis",
      "data.skills.Rituels.specialisations.ritedetechnique.acquis":
        "SRActiveEffect.changes.ritedetechniqueAcquis",
    },
    Survie: {
      "data.skills.Survie.specialisations.acrobatie.acquis":
        "SRActiveEffect.changes.acrobatieAcquis",
      "data.skills.Survie.specialisations.caravane.acquis":
        "SRActiveEffect.changes.caravaneAcquis",
      "data.skills.Survie.specialisations.cultureheossienne.acquis":
        "SRActiveEffect.changes.cultureheossienneAcquis",
      "data.skills.Survie.specialisations.culturenecrosienne.acquis":
        "SRActiveEffect.changes.culturenecrosienneAcquis",
      "data.skills.Survie.specialisations.discretion.acquis":
        "SRActiveEffect.changes.discretionAcquis",
      "data.skills.Survie.specialisations.educationphysique.acquis":
        "SRActiveEffect.changes.educationphysiqueAcquis",
      "data.skills.Survie.specialisations.monture.acquis":
        "SRActiveEffect.changes.montureAcquis",
      "data.skills.Survie.specialisations.navigation.acquis":
        "SRActiveEffect.changes.navigationAcquis",
      "data.skills.Survie.specialisations.viesauvage.acquis":
        "SRActiveEffect.changes.viesauvageAcquis",
      "data.skills.Survie.specialisations.vigilance.acquis":
        "SRActiveEffect.changes.vigilanceAcquis",
    },
    Combat: {
      "data.skills.Combat.specialisations.armeslancees.acquis":
        "SRActiveEffect.changes.armeslanceesAcquis",
      "data.skills.Combat.specialisations.armesdemelee.acquis":
        "SRActiveEffect.changes.armesdemeleeAcquis",
      "data.skills.Combat.specialisations.armesaprojectiles.acquis":
        "SRActiveEffect.changes.armesaprojectilesAcquis",
      "data.skills.Combat.specialisations.armimales.acquis":
        "SRActiveEffect.changes.armimalesAcquis",
      "data.skills.Combat.specialisations.enginsdeguerre.acquis":
        "SRActiveEffect.changes.enginsdeguerreAcquis",
      "data.skills.Combat.specialisations.esquive.acquis":
        "SRActiveEffect.changes.esquiveAcquis",
      "data.skills.Combat.specialisations.forcer.acquis":
        "SRActiveEffect.changes.forcerAcquis",
      "data.skills.Combat.specialisations.intimidation.acquis":
        "SRActiveEffect.changes.intimidationAcquis",
      "data.skills.Combat.specialisations.pugilat.acquis":
        "SRActiveEffect.changes.pugilatAcquis",
      "data.skills.Combat.specialisations.strategie.acquis":
        "SRActiveEffect.changes.strategieAcquis",
    },
    Nécrose: {
      "data.skills.Nécrose.specialisations.armeshumaines.acquis":
        "SRActiveEffect.changes.armeshumainesAcquis",
      "data.skills.Nécrose.specialisations.biomorphie.acquis":
        "SRActiveEffect.changes.biomorphieAcquis",
      "data.skills.Nécrose.specialisations.cauchemar.acquis":
        "SRActiveEffect.changes.cauchemarAcquis",
      "data.skills.Nécrose.specialisations.contrebande.acquis":
        "SRActiveEffect.changes.contrebandeAcquis",
      "data.skills.Nécrose.specialisations.corruption.acquis":
        "SRActiveEffect.changes.corruptionAcquis",
      "data.skills.Nécrose.specialisations.explosifs.acquis":
        "SRActiveEffect.changes.explosifsAcquis",
      "data.skills.Nécrose.specialisations.fraude.acquis":
        "SRActiveEffect.changes.fraudeAcquis",
      "data.skills.Nécrose.specialisations.harcelement.acquis":
        "SRActiveEffect.changes.harcelementAcquis",
      "data.skills.Nécrose.specialisations.larcin.acquis":
        "SRActiveEffect.changes.larcinAcquis",
      "data.skills.Nécrose.specialisations.pactenecrotique.acquis":
        "SRActiveEffect.changes.pactenecrotiqueAcquis",
    },
  },
  protections: {
    "data.protections.esprit.value": "SRLabels.Esprit",
    "data.protections.ame.value": "SRLabels.Ame",
    "data.protections.corps.value": "SRLabels.Corps",
  },
};
