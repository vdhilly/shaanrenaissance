import { shaanRenaissance } from "./module/config.js";
import ShaanRItemSheet from "./module/sheets/ShaanRitemSheet.js";
import ShaanRActorsSheet from "./module/sheets/ShaanRActorsSheet.js"

async function preloadHandleBarTemplates() 
{
    // register templates parts
    const templatePaths = [
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
      "systems/Shaan_Renaissance/templates/sheet/Race-sheet.hbs"
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
