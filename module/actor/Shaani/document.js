import { tupleHasValue } from "../../utils/utils.js";
import { ActorSR } from "../ActorSR.js";
import { CreatureSR } from "../Créature/document.js";
import { NpcSR } from "../PNJ/document.js";
import { PersonnageSR } from "../Personnage/PersonnageSR.js";
import { ItemSummaryRenderer } from "../sheet/item-summary-renderer.js";

export class ShaaniSR extends ActorSR {
  constructor(...args) {
    super(...args), (this.itemRenderer = new ItemSummaryRenderer(this));
    this.members = [];
  }
  prepareBaseData() {
    super.prepareBaseData();

    this.members = this.system.details.members
      .map((m) => fromUuidSync(m.uuid))
      .filter(
        (a) =>
          a instanceof PersonnageSR ||
          a instanceof NpcSR ||
          a instanceof CreatureSR
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const member of this.members) {
      member?.shaanis.add(this);
    }
  }
  async addMembers(...membersToAdd) {
    const existing = this.system.details.members.filter((d) =>
      this.members.some((m) => m.uuid === d.uuid)
    );
    const existingUUIDs = new Set(existing.map((data) => data.uuid));
    const newMembers = membersToAdd.filter(
      (a) => a.uuid.startsWith("Actor.") && !existingUUIDs.has(a.uuid)
    );

    const members = [...existing, ...newMembers.map((m) => ({ uuid: m.uuid }))];
    await this.update({ system: { details: { members } } });

    // await resetActors(newMembers);
  }
  async removeMembers(...remove) {
    const uuids = remove.map((d) => (typeof d === "string" ? d : d.uuid));
    const existing = this.system.details.members.filter((d) =>
      this.members.some((m) => m.uuid === d.uuid)
    );
    const members = existing.filter((m) => !tupleHasValue(uuids, m.uuid));
    await this.update({ system: { details: { members } } });
  }
}
