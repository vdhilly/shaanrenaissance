export class ActorSR extends Actor {
  static async createDocuments(data=[], context={}) {
    if ( context.parent?.pack ) context.pack = context.parent.pack;
    const {parent, pack, ...options} = context;  
    const created = await this.database.create(this.implementation, {data, options, parent, pack});
    await this._onCreateDocuments(created, context);
    return created;
  }
  async modifyTokenAttribute(attribute, value, isDelta=false, isBar=true) {
    const current = foundry.utils.getProperty(this.system, attribute);
    console.log(current)
    // Determine the updates to make to the actor data
    let updates;
    if ( isBar ) {
      if (isDelta) value = Math.clamped(0, Number(current.value) + value, current.max);
      updates = {[`system.${attribute}.value`]: value};
    } else {
      if ( isDelta ) value = Number(current) + value;
      updates = {[`system.${attribute}`]: value};
    }
  }
}