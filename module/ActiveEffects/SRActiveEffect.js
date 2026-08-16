export class SRActiveEffect extends ActiveEffect {
  // En V14, la surcharge de la méthode d'addition s'effectue via _applyAdd
  _applyAdd(actor, change, current, delta, changes) {
    let update;
    const ct = foundry.utils.getType(current);
    switch (ct) {
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
    changes[change.key] = update;
  }
}