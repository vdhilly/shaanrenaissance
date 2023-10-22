import { fontAwesomeIcon, htmlQuery, htmlQueryAll } from "../../utils/utils.js";
var _ItemDirectorySR_instances,
  _ItemDirectorySR_appendBrowseButton,
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

export class ItemDirectorySR extends ItemDirectory {
  constructor() {
    super(...arguments), _ItemDirectorySR_instances.add(this);
  }
  activateListeners($html) {
    var _a, _b;
    super.activateListeners($html);
    const html = $html[0];
    for (const element of (0, htmlQueryAll)(html, "li.directory-item.item")) {
      const item = game.items.get(
        null !== (_a = element.dataset.documentId) && void 0 !== _a ? _a : ""
      );
      (null == item
        ? void 0
        : item.testUserPermission(game.user, "OBSERVER")) ||
        null === (_b = element.querySelector("span.item-level")) ||
        void 0 === _b ||
        _b.remove();
    }
    __classPrivateFieldGet(
      this,
      _ItemDirectorySR_instances,
      "m",
      _ItemDirectorySR_appendBrowseButton
    ).call(this, html);
  }
}

(_ItemDirectorySR_instances = new WeakSet()),
  (_ItemDirectorySR_appendBrowseButton = function (html) {
    var _a;
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
        game.shaanRenaissance.compendiumBrowser.render(!0, {
          focus: !0,
        });
      }),
      null === (_a = (0, htmlQuery)(html, "footer.directory-footer")) ||
        void 0 === _a ||
        _a.append(browseButton);
  });
