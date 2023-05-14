export function SRToken() {
    console.log("Test")
Token.prototype._drawAttributeBars = SRTokenDrawAttributeBars;
Token.prototype._onUpdateBarAttributes = SROnUpdateBarAttributes;

Token.prototype._onCreate =  (function () {
  let superFunction = Token.prototype._onCreate;
  return async function() {
      await superFunction.apply(this, arguments);
      this.document.bar1 = {attribute: "attributes.hpEsprit"};
      this.document.bar2 = {attribute: "attributes.hpAme"};
      this.document.bar3 = {attribute: "attributes.hpCorps"};

  }
})();
TokenDocument.prototype._onCreate =  (function () {
  let superFunction = TokenDocument.prototype._onCreate;
  return async function() {
      await superFunction.apply(this, arguments);
      this.bar1 = {attribute: "attributes.hpEsprit"};
      this.bar2 = {attribute: "attributes.hpAme"};
      this.bar3 = {attribute: "attributes.hpCorps"};
  }
})();

TokenDocument.prototype._onUpdate = (function () {
  const superFunction = TokenDocument.prototype._onUpdate;
  return async function() {
      superFunction.apply(this, arguments);

      this.object.drawBars();
  }
})();
Token.prototype.drawBars = (function() {
  let superFunction = Token.prototype.drawBars;
  return function() {
    return SRTokenDrawBars.apply(this, arguments);
  };

})();

// Override the actual draw call so we can apply our own positioning and styling to the bars
Token.prototype._drawBar = (function() {
  let superFunction = Token.prototype._drawBar;
  return function() {
    return drawSRBar.apply(this, arguments);
  };

})();
Token.prototype.getBarAttribute = (function () {
  let superFunction = Token.prototype.getBarAttribute;
  return function (barName, { alternative } = {}) {
    if(!this.actor){
      return;
    }
    return getSRTokenBarAttribute.apply(this, arguments);
  }
})();
let defaultTokenConfigOptions = TokenConfig.defaultOptions;
Object.defineProperty(TokenConfig, "defaultOptions", {
    get: function () {
        return mergeObject(defaultTokenConfigOptions, {
            template: "systems/Shaan_Renaissance/templates/scene/tokenConfig.hbs"
        });
    }
});
TokenConfig.prototype.getData = (function () {
  const superFunction = TokenConfig.prototype.getData;
  console.log(superFunction)
  return function (options) {
    let result = superFunction.apply(this, arguments);
    console.log(this.object)
    let bar3 = this.object.getBarAttribute("bar3");
    console.log(bar3)

      result.displayBar3 = bar3 && (bar3.type !== "none");
      result.bar3 = {attribute: ""}
      result.bar3Data = bar3;
    console.log(result)
    return result
  }
})();
let defaultTokenHUDOptions = TokenHUD.defaultOptions;
Object.defineProperty(TokenHUD, "defaultOptions", {
    get: function () {
        return mergeObject(defaultTokenHUDOptions, {
            template: "systems/Shaan_Renaissance/templates/hud/tokenHUD.hbs"
        });
    }
});
TokenHUD.prototype.getData = (function () {
  const superFunction = TokenHUD.prototype.getData;
  return function (options) {
      let result = superFunction.apply(this, arguments);

      let bar3 = this.object.getBarAttribute("bar3");

      result.displayBar3 = bar3 && (bar3.type !== "none");
      result.bar3 = {attribute: bar3.attribute}
      result.bar3Data = bar3;


      return result;
  };
})();

function SRTokenDrawAttributeBars() {
  const bars = new PIXI.Container();
  bars.bar1 = bars.addChild(new PIXI.Graphics());
  bars.bar2 = bars.addChild(new PIXI.Graphics());
  bars.bar3 = bars.addChild(new PIXI.Graphics());
  return bars;
}
function SRTokenDrawBars() {
  if (!this.actor || (this.document.displayBars === CONST.TOKEN_DISPLAY_MODES.NONE)) return;
  ["bar1", "bar2", "bar3"].forEach((b, i) => {
      if (!this.hasOwnProperty("bars"))
      return;
      const bar = this.bars[b];
      const attr = this.getBarAttribute(b);
      if (!attr || (attr.type !== "bar")) return bar.visible = false;
      this._drawBar(i, bar, attr);
      bar.visible = true;
  });
}
function SROnUpdateBarAttributes(updateData) {
  const update = ["bar1", "bar2", "bar3"].some(b => {
    let bar = this.data[b];
    if (!bar)
      return false;

    return bar.attribute && hasProperty(updateData, "data."+bar.attribute);
  });

  if (update)
      this.object.drawBars();
}
function drawSRBar(number, bar, data) {
  

  const val = Number(data.value);
  const pct = Math.clamped(val, 0, data.max) / data.max;
  let h = Math.max((canvas.dimensions.size / 12), 8);
  if (this.document.height >= 2) h *= 1.6;  // Enlarge the bar for large tokens

  // Stacked bars, all atop one another
  let yPositions = {
      0: this.h - (3 * h),
      1: this.h - (2 * h),
      2: this.h - h
  };

  // Let's do at least one good thing by making these colors configurable
  let colors = {
      0: "#b8985a",
      1: "#4263a3",
      2: "#c95b40"
  }

  let color = colors[number];

    bar.clear()
    .beginFill(0x000000, 0.5)
    .lineStyle(2, 0x000000, 0.9)
    .drawRoundedRect(0, 0, this.w, h, 3)
    .beginFill(color, 0.8)
    .lineStyle(1, 0x000000, 0.8)
    .drawRoundedRect(1, 1, pct * (this.w - 2), h - 2, 2);

    // Set position
    let posY = yPositions[number];
    bar.position.set(0, posY);
}
function getSRTokenBarAttribute(barName, { alternative } = {}) {
  let attribute;
  if (barName === "bar1") {
      attribute = "attributes.hpEsprit";
  } else if (barName === "bar2") {
      attribute = "attributes.hpAme";
  } else if (barName === "bar3") {
      attribute = "attributes.hpCorps";
  }
  let data = getProperty(this.actor.system, attribute);
  data = duplicate(data);
  return {
      type: "bar",
      attribute: attribute,
      value: parseInt(data.value || 0),
      max: parseInt(data.max || 0)
  }
}
}