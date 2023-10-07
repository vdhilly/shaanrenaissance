import { CHARACTER_SCHEMES } from "../../utils/utils.js";
import { ActorSR } from "../ActorSR.js";

export class PersonnageSR extends ActorSR {
    constructor() {
      super(...arguments)
    }
    prepareBaseData() {
      var _a, _b
      super.prepareBaseData();
      const                             {
          flags
      } = this;
      flags.shaanRenaissance.schemes = mergeObject(
          Object.keys(CHARACTER_SCHEMES).reduce((schemes, key) => {
            schemes[key] = {};
        
            if (Array.isArray(CHARACTER_SCHEMES[key])) {
              CHARACTER_SCHEMES[key].forEach(subKey => {
                schemes[key][subKey] = {type: key, learned: false};
              });
            } else {
              schemes[key] = Object.keys(CHARACTER_SCHEMES[key]).reduce((subSchemes, subKey) => {
                subSchemes[subKey] = CHARACTER_SCHEMES[key][subKey].reduce((subSubSchemes, subSubKey) => {
                  subSubSchemes[subSubKey] = {type: subSubKey, learned: false};
                  return subSubSchemes;
                }, {});
                return subSchemes;
              }, {});
            }
            schemes.maitrise = false
            schemes.bonusSpe = 0
            schemes.domaine = 0
            schemes.learnedCountDomaine = 0
            schemes.learnedCountSpe = 0
            return schemes;
          }, {}), flags.shaanRenaissance.schemes || {}
      );
    }
}