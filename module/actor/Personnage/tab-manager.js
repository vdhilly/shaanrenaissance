export class PersonnageSheetTabManager {
  constructor(actor, link) {
    (this.actor = actor),
      (this.link = link),
      renderTemplate(
        `systems/shaanrenaissance/templates/actors/${actor.type}/manage-tabs.hbs`
      ).then((template) => {
        $(this.link).tooltipster({
          content: template,
          contentAsHTML: !0,
          delay: 250,
          interactive: !0,
          theme: "crb-hover",
          title: game.i18n.localize("SR.TabManagerLabel"),
          trigger: "custom",
          triggerOpen: {
            click: !0,
          },
          triggerClose: {
            originClick: !0,
            mouseleave: !0,
          },
          functionReady: (_origin, helper) => this.onReady(helper.tooltip),
          functionAfter: () => this.onClose(),
        });
      });
  }
  static initialize(actor, link) {
    new this(actor, link);
  }
  onReady(tooltip) {
    var _a, _b;
    const tabVisibility = this.actor.flags.shaanRenaissance.sheetTabs,
      nav = this.link.closest("nav"),
      tabs =
        null !==
          (_a =
            null == nav ? void 0 : nav.querySelectorAll("a.item[data-tab]")) &&
        void 0 !== _a
          ? _a
          : [];
    for (const tab of Array.from(tabs)) {
      const tabName =
          null !== (_b = tab.dataset.tab) && void 0 !== _b ? _b : "",
        selector = `input[data-tab-name="${tabName}"]`;
      console.log(tabVisibility, tabName);
      (tooltip.querySelector(selector).checked = tabVisibility[tabName]),
        tab.classList.contains("hidden") &&
          (tab.classList.remove("hidden"), tab.classList.add("to-hide"));
    }
    const checkboxes = Array.from(
      tooltip.querySelectorAll('input[type="checkbox"]')
    );
    for (const checkbox of checkboxes)
      this.handleOnChange(checkbox, checkboxes);
  }
  handleOnChange(checkbox, checkboxes) {
    checkbox.addEventListener("change", async () => {
      const nav = this.link.closest("nav");
      const tabName = checkbox?.dataset.tabName ?? "";
      const tab = nav?.querySelector(`a.item[data-tab="${tabName}"]`);
      for (const c of checkboxes) {
        c.readOnly = true;
      }
      console.log(this.actor);
      if (checkbox.checked) {
        tab?.classList.remove("to-hide");
        await this.actor.update(
          { [`flags.shaanRenaissance.sheetTabs.-=${tabName}`]: null },
          { render: false }
        );
      } else {
        tab?.classList.add("to-hide");
        await this.actor.update(
          { [`flags.shaanRenaissance.sheetTabs.${tabName}`]: false },
          { render: false }
        );
      }

      for (const c of checkboxes) {
        c.readOnly = false;
      }
    });
  }
  onClose() {
    var _a, _b;
    const tabs = Array.from(
      null !==
        (_b =
          null === (_a = this.link.closest("nav")) || void 0 === _a
            ? void 0
            : _a.querySelectorAll("a.item[data-tab]")) && void 0 !== _b
        ? _b
        : []
    );
    for (const tab of tabs)
      tab.classList.contains("to-hide") &&
        (tab.classList.remove("to-hide"), tab.classList.add("hidden"));
  }
}
