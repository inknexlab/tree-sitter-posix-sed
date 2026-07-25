# tree-sitter-sed

[![CI](https://github.com/inknexlab/tree-sitter-sed/actions/workflows/ci.yml/badge.svg)](https://github.com/inknexlab/tree-sitter-sed/actions/workflows/ci.yml)

[Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammars for
POSIX.1-2024 and GNU `sed` 4.10, with generated C parsers and highlighting
queries.

## Development

```sh
npm ci
npm run check
```

Requires Node.js 24.18+, npm 11.16+, and a C compiler.

`npm run generate` regenerates both parsers.

## Specifications

- [POSIX.1-2024 `sed`](https://pubs.opengroup.org/onlinepubs/9799919799.2024edition/utilities/sed.html)
- [GNU `sed` 4.10 manual](https://www.gnu.org/software/sed/manual/html_node/index.html)

## License

[MIT](LICENSE)
