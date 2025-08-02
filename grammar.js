/**
 * @file A tree-sitter parser for Gentoo USE-flags files
 * @author Vadim Komissarov <komissarov@eveloth.ru>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const REGEXP = {
  DISABLE: "-",
  CATEGORY: new RustRegex("[A-Za-z0-9_][A-Za-z0-9+_.-]*"),
  PACKAGE: new RustRegex(
    "(([A-z0-9_])([A-z0-9+_-]*)(([A-z][0-9]*)|([A-z])))|([A-z0-9]*)",
  ),
  REPOSITORY: new RustRegex("[A-Za-z0-9_][A-Za-z0-9+_-]*"),
  SLOT: new RustRegex("[A-Za-z0-9_][A-Za-z0-9+_-]*"),
  USE_FLAG: new RustRegex("[A-Za-z0-9][A-Za-z0-9+_-]*"),
  VERSION: new RustRegex("[0-9]+(\.[0-9]+)*(_p([0-9]+)?)?(-r[0-9])?"),
};

module.exports = grammar({
  name: "use",
  extras: ($) => [/\s/, $.comment],
  rules: {
    source_file: ($) => repeat(seq($.use_def, "\n")),

    use_def: ($) =>
      seq(
        optional($.cmp),
        choice($.package_identifier, $.wildcard),
        /\s/,
        repeat1(choice($.set, $.unset)),
      ),

    package_identifier: ($) =>
      seq(
        $.package,
        optional($.version),
        optional($.slot),
        optional($.repository),
      ),

    version: (_) => seq(/-/, REGEXP.VERSION),

    slot: (_) => seq(/:/, REGEXP.SLOT),

    repository: (_) => seq(/::/, REGEXP.REPOSITORY),

    all_keywords: (_) => token("**"),

    unset: (_) => token(seq(REGEXP.DISABLE, REGEXP.USE_FLAG)),

    set: (_) => token(REGEXP.USE_FLAG),

    package: (_) => seq(REGEXP.CATEGORY, "/", REGEXP.PACKAGE),

    category: (_) => token(REGEXP.CATEGORY),

    wildcard: (_) => token("*/*"),

    cmp: (_) => token(choice(/~/, /=/, />/, /</, />=/, /<=/)),

    comment: (_) => token(seq("#", /[^\n\r]*/)),
  },
});
