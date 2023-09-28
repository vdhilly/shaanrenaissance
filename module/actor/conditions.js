export class ActorConditions extends Collection {
    #idMap = new Collection();

    /** A secondary map by condition slug */
    #slugMap = new Collection();

    get active() {
        return this.filter((c => c.active))
    }
    get(
        key, { 
        strict = false, active = null, temporary = null 
    } = {})  {
        const condition = this.#idMap.get(key, { strict });
        if (active === true && !condition?.active) return undefined;
        if (active === false && condition?.active) return undefined;
        if (temporary === true && condition?.actor.items.has(key)) return undefined;
        if (temporary === false && !condition?.actor.items.has(key)) return undefined;

        return condition;
    }

    has(id) {
        return this.#idMap.has(id);
    }

    set(id, condition){
        console.log(id, condition)
        this.#idMap.set(id, condition);
        const listBySlug = this.#slugMap.get(condition.slug) ?? [];
        listBySlug.push(condition);
        this.#slugMap.set(condition.slug, listBySlug);

        return this;
    }

    filter(condition) {
        return this.#idMap.filter(condition);
    }

    some(condition){
        return this.#idMap.some(condition);
    }

    every(condition) {
        return this.#idMap.contents.every(condition);
    }

    map(transformer) {
        return this.#idMap.map(transformer);
    }

    flatMap(transformer) {
        return this.#idMap.contents.flatMap(transformer);
    }

    /** No deletions: a new instance is created every data preparation cycle */
    delete() {
        return false;
    }
}
