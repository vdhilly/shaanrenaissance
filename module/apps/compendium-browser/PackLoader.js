import * as localize_1 from "../../utils/LocalizeSR.js";
import * as progress_1 from "../../utils/Progress.js";

export class PackLoader {
  constructor() {
    this.loadedPacks = {
      Actor: {},
      Item: {},
    };
  }
  async *loadPacks(documentType, packs, indexFields) {
    var _a, _b, _c, _d;
    (null !== (_a = (_d = this.loadedPacks)[documentType]) && void 0 !== _a) ||
      (_d[documentType] = {});
    const translations =
        localize_1.LocalizeSR.translations.SR.CompendiumBrowser.ProgressBar,
      progress = new progress_1.Progress({
        steps: packs.length,
      });
    for (const packId of packs) {
      let data = this.loadedPacks[documentType][packId];
      if (data) {
        const { pack } = data;
        progress.advance(
          game.i18n.format(translations.LoadingPack, {
            pack:
              null !== (_b = null == pack ? void 0 : pack.metadata.label) &&
              void 0 !== _b
                ? _b
                : "",
          })
        );
      } else {
        const pack = game.packs.get(packId);
        if (!pack) {
          progress.advance("");
          continue;
        }
        if (
          (progress.advance(
            game.i18n.format(translations.LoadingPack, {
              pack: pack.metadata.label,
            })
          ),
          pack.documentName !== documentType)
        )
          continue;
        {
          const index = await pack.getIndex({
            fields: indexFields,
          });
          if (
            !(null !== (_c = index.contents.at(0)) && void 0 !== _c ? _c : {})
              .system
          ) {
            ui.notifications.warn(
              game.i18n.format("SR.BrowserWarnPackNotLoaded", {
                pack: pack.collection,
              })
            );
            continue;
          }
          this.setModuleArt(packId, index),
            (data = {
              pack,
              index,
            }),
            (this.loadedPacks[documentType][packId] = data);
        }
      }

      yield data;
    }
    progress.close(translations.LoadingComplete);
  }
  setModuleArt(packName, index) {
    var _a;
    if (packName.startsWith("shaanrenaissance."))
      for (const record of index) {
        const uuid = `Compendium.${packName}.${record._id}`,
          actorArt =
            null ===
              (_a = game.shaanRenaissance.system.moduleArt.map.get(uuid)) ||
            void 0 === _a
              ? void 0
              : _a.img;
        record.img = null != actorArt ? actorArt : record.img;
      }
  }
}
