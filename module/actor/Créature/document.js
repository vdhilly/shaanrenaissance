import { ActorSR } from "../ActorSR.js";

export class CreatureSR extends ActorSR {
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
