const languages = Object.freeze([
  Object.freeze({
    id: "posix-bre",
    languageName: "posix_sed_bre",
    directory: "posix-bre",
    wasmName: "tree-sitter-sed-posix-bre.wasm",
  }),
  Object.freeze({
    id: "posix-ere",
    languageName: "posix_sed_ere",
    directory: "posix-ere",
    wasmName: "tree-sitter-sed-posix-ere.wasm",
  }),
]);

module.exports = { languages };
