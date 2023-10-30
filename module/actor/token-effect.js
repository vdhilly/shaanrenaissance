import { sluggify } from "../utils/utils.js";
export class TokenEffect {
  constructor(effect) {
    this.effect = effect;
    this.tint = null;
    this.isTemporary = true;
  }

  get id() {
    return this.effect.id;
  }

  get _id() {
    return this.effect.id;
  }

  get parent() {
    return this.effect.parent;
  }

  get name() {
    return this.effect.name;
  }

  get icon() {
    return this.effect.img;
  }

  get changes() {
    return [];
  }

  get description() {
    return this.effect.description;
  }

  get flags() {
    return this.effect.flags;
  }

  get statuses() {
    return new Set([this.effect.slug]);
  }

  get disabled() {
    return this.effect.isOfType("effect") && this.effect.isExpired;
  }

  get transfer() {
    return false;
  }

  get origin() {
    return this.effect.uuid;
  }

  getFlag(scope, flag) {
    return this.effect.getFlag(scope, flag);
  }
}
