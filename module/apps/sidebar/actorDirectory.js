import { fontAwesomeIcon, htmlQuery, htmlQueryAll } from "../../utils/utils.js";
var _ActorDirectorySR_instances,
  _ActorDirectorySR_appendBrowseButton,
  __classPrivateFieldGet =
    (this && this.__classPrivateFieldGet) ||
    function (receiver, state, kind, f) {
      if ("a" === kind && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (
        "function" == typeof state
          ? receiver !== state || !f
          : !state.has(receiver)
      )
        throw new TypeError(
          "Cannot read private member from an object whose class did not declare it"
        );
      return "m" === kind
        ? f
        : "a" === kind
        ? f.call(receiver)
        : f
        ? f.value
        : state.get(receiver);
    };
export class ActorDirectorySR extends ActorDirectory {
  constructor() {
    super(...arguments), _ActorDirectorySR_instances.add(this);
  }
  activateListeners($html) {
    var _a, _b;
    super.activateListeners($html);
    const html = $html[0];
    for (const element of (0, htmlQueryAll)(html, "li.directory-item.actor")) {
      const actor = game.actors.get(
        null !== (_a = element.dataset.documentId) && void 0 !== _a ? _a : ""
      );
      (null == actor
        ? void 0
        : actor.testUserPermission(game.user, "OBSERVER")) ||
        null === (_b = element.querySelector("span.actor-level")) ||
        void 0 === _b ||
        _b.remove();
    }
    __classPrivateFieldGet(
      this,
      _ActorDirectorySR_instances,
      "m",
      _ActorDirectorySR_appendBrowseButton
    ).call(this, html);
  }
}

(_ActorDirectorySR_instances = new WeakSet()),
  (_ActorDirectorySR_appendBrowseButton = function (html) {
    var _a;
    if (!game.user.isGM) return;
    const browseButton = document.createElement("button");
    (browseButton.type = "button"),
      browseButton.append(
        (0, fontAwesomeIcon)("search", {
          fixedWidth: !0,
        }),
        " ",
        game.i18n.localize("SR.CompendiumBrowser.Title")
      ),
      browseButton.addEventListener("click", () => {
        game.shaanRenaissance.compendiumBrowser.openTab("bestiary");
      }),
      null === (_a = (0, htmlQuery)(html, "footer.directory-footer")) ||
        void 0 === _a ||
        _a.append(browseButton);
  });
