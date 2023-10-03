import { CHARACTER_SCHEMES } from "../../utils/utils.js";
import { ActorSR } from "../ActorSR.js";

export class PersonnageSR extends ActorSR {
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
                  schemes[key][subKey] = false;
                });
              } else {
                schemes[key] = Object.keys(CHARACTER_SCHEMES[key]).reduce((subSchemes, subKey) => {
                  subSchemes[subKey] = CHARACTER_SCHEMES[key][subKey].reduce((subSubSchemes, subSubKey) => {
                    subSubSchemes[subSubKey] = false;
                    return subSubSchemes;
                  }, {});
                  return subSchemes;
                }, {});
              }
          
              return schemes;
            }, {}), flags.shaanRenaissance.schemes || {}
          );    }
}