import { shaanRenaissance } from "./module/config.js";
import ShaanRItemSheet from "./module/sheets/ShaanRItemSheet.js";
import ShaanRActorsSheet from "./module/sheets/ShaanRActorsSheet.js"

async function preloadHandleBarTemplates() 
{
    // register templates parts
    const templatePaths = [
      // Character sheet
      "systems/Shaan_Renaissance/templates/actors/Personnage/sidebar/health.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/sidebar/armor.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/header.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/sidebar/initiative.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/sidebar/jets.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/icons/d20.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/acquis.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/biography.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/general.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/magic.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/tabs/powers.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/background.hbs",
      "systems/Shaan_Renaissance/templates/sheet/Race-sheet.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/domaincircle.hbs",
      "systems/Shaan_Renaissance/templates/actors/Personnage/partials/specialisations.hbs"
      // Power sheet

    ];
    return loadTemplates( templatePaths );
};

Hooks.once("init", function(){
    console.log ("SHAAN RENAISSANCE | Initialising Shaan Renaissance System");

    CONFIG.shaanRenaissance = shaanRenaissance;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("Shaan_Renaissance", ShaanRItemSheet, {makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("Shaan_Renaissance", ShaanRActorsSheet, {makeDefault: true});

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
