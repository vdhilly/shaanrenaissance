import { CHARACTER_SCHEMES } from "../../utils/utils.js";
import { ActorSR } from "../ActorSR.js";

export class PersonnageSR extends ActorSR {
  prepareBaseData() {
    super.prepareBaseData();
    
    this.flags.shaanRenaissance ??= {};
    
    this.flags.shaanRenaissance.schemes = foundry.utils.mergeObject(
      Object.keys(CHARACTER_SCHEMES).reduce((schemes, key) => {
        schemes[key] = {};

        if (Array.isArray(CHARACTER_SCHEMES[key])) {
          CHARACTER_SCHEMES[key].forEach((subKey) => {
            schemes[key][subKey] = {
              type: key,
              learned: false,
              title: game.i18n.localize(`SRSchemes.titles.${subKey}`),
            };
          });
        } else {
          schemes[key] = Object.keys(CHARACTER_SCHEMES[key]).reduce((subSchemes, subKey) => {
            subSchemes[subKey] = CHARACTER_SCHEMES[key][subKey].reduce((subSubSchemes, subSubKey) => {
              subSubSchemes[subSubKey] = {
                type: subSubKey,
                learned: false,
                title: game.i18n.localize(`SRSchemes.titles.${subSubSchemes}`), 
              };
              return subSubSchemes;
            }, {});
            return subSchemes;
          }, {});
        }
        schemes.maitrise = false;
        schemes.bonusSpe = 0;
        schemes.domaine = 0;
        schemes.learnedCountDomaine = 0;
        schemes.learnedCountSpe = 0;
        return schemes;
      }, {}),
      this.flags.shaanRenaissance.schemes || {}
    );
  }

  _onUpdate(changed, options, user) {
    super._onUpdate(changed, options, user);
    
    if ( !this.shaanis ) return;

    for (const shaani of this.shaanis) {
      const shaandars = shaani.system.details?.shaandars;
      if (!shaandars) continue;

      for (const domainKey in shaandars) {
        const domain = shaandars[domainKey];
        if (!Array.isArray(domain)) continue;

        let shaandarIndex = domain.findIndex(s => s._id === this._id);
        if (shaandarIndex === -1) continue;

        const newShaandar = {
          _id: this._id,
          system: { ...domain[shaandarIndex]?.system, skills: this.system.skills },
        };

        domain[shaandarIndex] = newShaandar;
        shaani.update({ [`system.details.shaandars.${domainKey}`]: domain });
      }

      if (shaani.sheet?.rendered) {
        shaani.sheet.render(false);
      }
    }
  }

  _onDelete(options, userId) {
    super._onDelete(options, userId);
    if (!this.shaanis) return;

    for (const shaani of this.shaanis) {
      const updater = shaani.primaryUpdater;
      if (game.user === updater) {
        shaani.removeMembers(this.uuid);
      } else if (!updater) {
        shaani.reset();
        ui.actors.render();
      }
    }
  }
}