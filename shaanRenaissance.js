import { shaanRenaissance } from "./module/config.js";
import ShaanRItemSheet from "./module/sheets/ShaanRItemSheet.js";
import ShaanRActorsSheet from "./module/sheets/ShaanRActorsSheet.js"
import ShaanNPCSheet from "./module/sheets/ShaanNPCSheet.js";
import ShaanShaaniSheet from "./module/sheets/ShaanShaaniSheet.js";
import ShaanTrihnSheet from "./module/sheets/ShaanTrihnSheet.js";
import ShaanCreatorSet from "./module/sheets/ShaanCreatorSet.js";

async function preloadHandleBarTemplates() 
{
    // register templates parts
    const templatePaths = [
      // Character sheet
      // Sidebar
      "systems/Shaan_Renaissance/templates/actors/Personnage/sidebar/health.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/sidebar/armor.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/header.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/sidebar/initiative.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/sidebar/jets.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/sidebar/reserve.hbs",

      // Content
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/acquis.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/biography.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/general.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/magic.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/powers.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/background.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/domaincircle.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/specialisations.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/ressources.hbs",

      // NPC
      "systems/Shaan_Renaissance/templates/actors/PNJ/partials/cercle.hbs",
      "systems/Shaan_Renaissance/templates/actors/PNJ/partials/general.hbs",
      "systems/Shaan_Renaissance/templates/actors/PNJ/partials/powers.hbs",
      "systems/Shaan_Renaissance/templates/actors/PNJ/partials/bio.hbs",
      "systems/Shaan_Renaissance/templates/actors/PNJ/partials/acquis.hbs",
      "systems/Shaan_Renaissance/templates/actors/PNJ/partials/specialisations.hbs",

      // Shaani
      // Sidebar
      "systems/Shaan_Renaissance/templates/actors/Shaani/sidebar/health.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/sidebar/armor.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/partials/header.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/sidebar/initiative.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/sidebar/jets.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/sidebar/reserve.hbs",

      // Content
      "systems/Shaan_Renaissance/templates/actors/Shaani/tabs/acquis.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/tabs/details.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/tabs/general.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/tabs/symbioses.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/tabs/powers.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/partials/background.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/partials/domaincircle.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/partials/specialisations.hbs",
      "systems/Shaan_Renaissance/templates/actors/Shaani/partials/ressources.hbs",


      // Item sheets
      "systems/Shaan_Renaissance/templates/items/partials/header.hbs",

      // JETS
      "systems/Shaan_Renaissance/templates/chat/initiative.hbs",
      "systems/Shaan_Renaissance/templates/chat/domainTest-dialog.hbs"

    ];
    return loadTemplates( templatePaths );
};

Hooks.once("init", function(){
    console.log ("SHAAN RENAISSANCE | Initialising Shaan Renaissance System");

    CONFIG.shaanRenaissance = shaanRenaissance;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("Shaan_Renaissance", ShaanRItemSheet, {
      types: ["Pouvoir", "Armement", "Armimale", "Manuscrit", "Artefact", "Outil", "Transport", "Technologie", "Richesse", "Protection", "Relation", "Bâtiment"],
      label: "Acquis"
    });
    Items.registerSheet("Shaan_Renaissance", ShaanTrihnSheet, {
      types: ["Trihn"],
      label: "Trihn"
    });
    Items.registerSheet("Shaan_Renaissance", ShaanCreatorSet, {
      types: ["Race", "Peuple", "Caste", "Métier"],
      label: "Character Developpement"
    });
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("Shaan_Renaissance", ShaanRActorsSheet, {
      types: ["Personnage"],
      label: "Personnage"
    });
    Actors.registerSheet("Shaan_Renaissance", ShaanNPCSheet, {
      types: ["PNJ"],
      label: "PNJ"
    });
    Actors.registerSheet("Shaan_Renaissance", ShaanShaaniSheet, {
      types: ["Shaani"],
      label: "Shaani"
    });

    preloadHandleBarTemplates();

  });

Handlebars.registerHelper('ifeq', function (a, b, options) {
  if (a == b) { return options.fn(this); }
  return options.inverse(this);
});

Handlebars.registerHelper('ifnoteq', function (a, b, options) {
  if (a != b) { return options.fn(this); }
  return options.inverse(this);


});





