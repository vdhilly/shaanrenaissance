import { CHARACTER_SCHEMES } from "../../utils/utils.js";
import { ActorSR } from "../ActorSR.js";

export class PersonnageSR extends ActorSR {
  prepareBaseData() {
    var _a, _b;
    super.prepareBaseData();
    const { flags } = this;
    flags.shaanRenaissance.schemes = mergeObject(
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
          schemes[key] = Object.keys(CHARACTER_SCHEMES[key]).reduce(
            (subSchemes, subKey) => {
              subSchemes[subKey] = CHARACTER_SCHEMES[key][subKey].reduce(
                (subSubSchemes, subSubKey) => {
                  subSubSchemes[subSubKey] = {
                    type: subSubKey,
                    learned: false,
                    title: game.i18n.localize(
                      `SRSchemes.titles.${subSubSchemes}`
                    ),
                  };
                  return subSubSchemes;
                },
                {}
              );
              return subSchemes;
            },
            {}
          );
        }
        schemes.maitrise = false;
        schemes.bonusSpe = 0;
        schemes.domaine = 0;
        schemes.learnedCountDomaine = 0;
        schemes.learnedCountSpe = 0;
        return schemes;
      }, {}),
      flags.shaanRenaissance.schemes || {}
    );
  }
  _onUpdate(changed, options, user){
    super._onUpdate(changed, options, user)
    for (const shaani of this.shaanis) {
      for (const domainKey in shaani.system.details.shaandars) {
        const shaandars = shaani.system.details.shaandars
        const domain = shaandars[domainKey];
        let shaandarIndex = -1;
        for (let i = 0; i < domain.length; i++) {
          if (domain[i]._id == this._id) {
            shaandarIndex = i;
            break;
          }
        }

        const newShaandar = {
          _id: this._id,
          system: { ...domain[shaandarIndex]?.system, skills: this.system.skills },

        };
  
        for (const shaandar of domain){
          if(shaandar._id == this._id){
              domain[shaandarIndex] = newShaandar;
              shaani.update({"system.details.shaandars":shaandars})
          }
        }
      }

      if(shaani.sheet.rendered){
        shaani.sheet.render(false)
      }
    }

  }
  _onDelete(options, userId){
    super._onDelete(options, userId);

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
