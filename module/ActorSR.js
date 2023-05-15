export class ActorSR extends Actor {
  static async createDocuments(data=[], context={}) {
    if ( context.parent?.pack ) context.pack = context.parent.pack;
    const {parent, pack, ...options} = context; 
    data[0].prototypeToken = {}
    data[0].prototypeToken = {bar3: {attribute: ''}}
    const created = await this.database.create(this.implementation, {data, options, parent, pack});
    await this._onCreateDocuments(created, context);
    console.log(data)
    return created;
  }
}