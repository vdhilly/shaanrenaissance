export const RenderSettings = {
  listen: () => {
    Hooks.on("renderSettings", async (__app, $html) => {
      var _a;
      const html = $html[0];
      // License btn
      const license = document.createElement("div");
      license.id = "shaan-license";
      const licenseButton = document.createElement("button");
      const licenseIcon = document.createElement("i");
      licenseIcon.classList.add("fa-solid", "fa-scale-balanced");
      (licenseButton.type = "button"),
        licenseButton.append(
          licenseIcon,
          game.i18n.localize("SETTINGS.LicenseViewer.label")
        ),
        licenseButton.addEventListener("click", () => {
          game.shaanRenaissance.LicenseViewer.render(!0);
        }),
        license.append(licenseButton);
      // Bug btn
      const signalBug = document.createElement("div");
      signalBug.id = "shaan-bugs";
      const signalBugButtonA = document.createElement("a");
      signalBugButtonA.href =
        "https://github.com/YoimPouet/shaanrenaissance/issues/new/choose";
      const signalBugButton = document.createElement("button"),
        signalBugIcon = document.createElement("i");
      signalBugIcon.classList.add("fa-solid", "fa-bug");
      (signalBugButton.type = "button"),
        signalBugButton.append(
          signalBugIcon,
          game.i18n.localize("SETTINGS.signalBug.label")
        ),
        signalBugButtonA.append(signalBugButton);
      signalBug.append(signalBugButtonA);
      // Website btn
      const Website = document.createElement("div");
      Website.id = "shaan-website";
      const WebsiteButtonA = document.createElement("a");
      WebsiteButtonA.href = "https://www.shaan-rpg.com/";
      const WebsiteButton = document.createElement("button"),
        WebsiteIcon = document.createElement("i");
      WebsiteIcon.classList.add("fa-regular", "fa-globe");
      (WebsiteButton.type = "button"),
        WebsiteButton.append(
          WebsiteIcon,
          game.i18n.localize("SETTINGS.Sidebar.Site")
        ),
        WebsiteButtonA.append(WebsiteButton);
      Website.append(WebsiteButtonA);
      // Discord btn
      const Discord = document.createElement("div");
      Discord.id = "shaan-discord";
      const DiscordButtonA = document.createElement("a");
      DiscordButtonA.href = "https://discord.gg/7fnZ9yCJZq";
      const DiscordButton = document.createElement("button"),
        DiscordIcon = document.createElement("i");
      DiscordIcon.classList.add("fa-brands", "fa-discord");
      (DiscordButton.type = "button"),
        DiscordButton.append(
          DiscordIcon,
          game.i18n.localize("SETTINGS.Sidebar.Discord")
        ),
        DiscordButtonA.append(DiscordButton);
      Discord.append(DiscordButtonA);
      // Changelog btn
      const Changelog = document.createElement("div");
      Changelog.id = "shaan-Changelog";
      const ChangelogButtonA = document.createElement("a");
      ChangelogButtonA.href =
        "https://github.com/YoimPouet/shaanrenaissance/blob/main/CHANGELOG.md";
      const ChangelogButton = document.createElement("button"),
        ChangelogIcon = document.createElement("i");
      ChangelogIcon.classList.add("fa-solid", "fa-list");
      (ChangelogButton.type = "button"),
        ChangelogButton.append(
          ChangelogIcon,
          game.i18n.localize("SETTINGS.Sidebar.Changelog")
        ),
        ChangelogButtonA.append(ChangelogButton);
      Changelog.append(ChangelogButtonA);

      const header = document.createElement("h2");
      (header.innerText = "Shaan Renaissance"),
        null === (_a = html.querySelector("#settings-documentation")) ||
          void 0 === _a ||
          _a.after(header, license, Website, Discord, Changelog, signalBug);
    });
  },
};
