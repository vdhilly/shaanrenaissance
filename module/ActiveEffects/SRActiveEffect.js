export class SRActiveEffect extends ActiveEffect {
    _applyAdd(actor, change, current, delta, changes) {
        let update;
        const ct = foundry.utils.getType(current);
        console.log(ct)
        switch ( ct ) {
          case "boolean":
            update = current || delta;
            break;
          case "null":
            update = delta;
            break;
          case "Array":
            update = current.concat(delta);
            break;
          default:
            update = current + delta;
            break;
        }
        console.log(update)
        changes[change.key] = update;  
      }
}