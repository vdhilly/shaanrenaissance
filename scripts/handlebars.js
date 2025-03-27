export function registerHandlebarsHelpers() {
  Handlebars.registerHelper("ifeq", function (a, b, options) {
    if (a == b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
  Handlebars.registerHelper("ifnoteq", function (a, b, options) {
    if (a != b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
  Handlebars.registerHelper("eq", function (a, b) {
    return a === b;
  });
  Handlebars.registerHelper("gt", function (a, b) {
    return a > b;
  });
  Handlebars.registerHelper("gte", function (a, b) {
    return a >= b;
  });
  Handlebars.registerHelper("lt", function (a, b) {
    return a < b;
  });
  Handlebars.registerHelper("lte", function (a, b) {
    return a <= b;
  });
  Handlebars.registerHelper("ne", function (a, b) {
    return a !== b;
  });
  Handlebars.registerHelper("percentage", function (value, max) {
    return (Number(value) * 100) / Number(max);
  });
  Handlebars.registerHelper("toLowerCase", function (str) {
    return str.toLowerCase();
  });
  Handlebars.registerHelper("replace", function (str, toReplace, replace) {
    return str.replace(toReplace, replace);
  });
  Handlebars.registerHelper("capitalize", function (str) {
    if (typeof str !== "string") {
      return "";
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  Handlebars.registerHelper("number", function(value) {
    if (typeof value === "string") {
        let match = value.match(/\d+/);
        return match ? Number(match[0]) : 0;
    }
    return Number(value);
});
}
