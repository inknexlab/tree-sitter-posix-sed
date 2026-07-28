/**
 * @file Tree-sitter grammar for GNU sed scripts using BREs.
 * @author inknexlab
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const defineGrammar = require("./common/factory");
const gnu = require("./common/gnu");

module.exports = defineGrammar("sed", gnu, "bre");
