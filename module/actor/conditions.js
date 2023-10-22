import { CONDITION_SLUGS } from "../item/condition/values.js";

const conditionSlugsArray = Array.from(CONDITION_SLUGS);
const ConditionSlug = conditionSlugsArray[0];

export class ActorConditions extends Collection {
  #idMap = new Collection();

  /** A secondary map by condition slug */
  #slugMap = new Collection();

  get active() {
    return this.#idMap.filter((c) => c.active);
  }
  get stored() {
    return this.filter((c) => c.actor.items.has(c.id));
  }
  get advantaged() {
    const condition = this.bySlug("advantaged", { active: true });
    return condition.shift() || null;
  }
  get protected() {
    const condition = this.bySlug("protected", { active: true });
    return condition.shift() || null;
  }
  get invisible() {
    const condition = this.bySlug("invisible", { active: true });
    return condition.shift() || null;
  }
  get prone() {
    const condition = this.bySlug("prone", { active: true });
    return condition.shift() || null;
  }
  get obscurity() {
    const condition = this.bySlug("obscurity", { active: true });
    return condition.shift() || null;
  }
  get weakened() {
    const condition = this.bySlug("weakened", { active: true });
    return condition.shift() || null;
  }
  get deafened() {
    const condition = this.bySlug("deafened", { active: true });
    return condition.shift() || null;
  }
  get dazzled() {
    const condition = this.bySlug("dazzled", { active: true });
    return condition.shift() || null;
  }
  get blinded() {
    const condition = this.bySlug("blinded", { active: true });
    return condition.shift() || null;
  }
  get muted() {
    const condition = this.bySlug("muted", { active: true });
    return condition.shift() || null;
  }
  get slowed() {
    const condition = this.bySlug("slowed", { active: true });
    return condition.shift() || null;
  }
  get unconscious() {
    const condition = this.bySlug("unconscious", { active: true });
    return condition.shift() || null;
  }
  get dominated() {
    const condition = this.bySlug("dominated", { active: true });
    return condition.shift() || null;
  }
  get bewitched() {
    const condition = this.bySlug("bewitched", { active: true });
    return condition.shift() || null;
  }
  get paralyzed() {
    const condition = this.bySlug("paralyzed", { active: true });
    return condition.shift() || null;
  }
  get stunned() {
    const condition = this.bySlug("stunned", { active: true });
    return condition.shift() || null;
  }
  get(key, { strict = false, active = null, temporary = null } = {}) {
    const condition = super.get(key, { strict });
    if (active === true && !condition?.active) return undefined;
    if (active === false && condition?.active) return undefined;
    if (temporary === true && condition?.actor.items.has(key)) return undefined;
    if (temporary === false && !condition?.actor.items.has(key))
      return undefined;
    return condition;
  }

  has(id) {
    return this.#idMap.has(id);
  }

  set(id, condition) {
    this.#idMap.set(id, condition);
    const listBySlug = this.#slugMap.get(condition.slug) ?? [];
    listBySlug.push(condition);
    this.#slugMap.set(condition.slug, listBySlug);
    return this;
  }

  filter(condition) {
    return this.#idMap.filter(condition);
  }

  some(condition) {
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

  bySlug(slug, options = {}) {
    const { active = null, temporary = null } = options;
    return (this.#slugMap.get(slug) || []).filter((condition) => {
      const activeFilterSatisfied =
        active === true
          ? condition.active
          : active === false
          ? !condition.active
          : true;
      const temporaryFilterSatisfied =
        temporary === true
          ? !condition.actor.items.has(condition.id)
          : temporary === false
          ? condition.actor.items.has(condition.id)
          : true;
      return activeFilterSatisfied && temporaryFilterSatisfied;
    });
  }
}
