import { shaanRenaissance } from "./module/config.js";
import ShaanRItemSheet from "./module/sheets/ShaanRItemSheet.js";
import ShaanRActorsSheet from "./module/sheets/ShaanRActorsSheet.js"
import ShaanNPCSheet from "./module/sheets/ShaanNPCSheet.js";
import SRItem from "./module/SRItem.js";

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
      "systems/Shaan_Renaissance/templates/actors/Personnage/icons/d20.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/sidebar/reserve.hbs",

      // Content
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/acquis.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/biography.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/general.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/magic.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/powers.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/background.hbs",
      "systems/Shaan_Renaissance/templates/sheet/Race-sheet.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/domaincircle.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/specialisations.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/ressources.hbs",

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
    CONFIG.Item.entityClass = SRItem;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("Shaan_Renaissance", ShaanRItemSheet, {makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("Shaan_Renaissance", ShaanRActorsSheet, {
      types: ["Personnage"],
      label: "Personnage"
    });
    Actors.registerSheet("Shaan_Renaissance", ShaanNPCSheet, {
      types: ["PNJ"],
      label: "PNJ"
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



