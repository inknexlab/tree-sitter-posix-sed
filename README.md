# tree-sitter-sed

[![CI](https://github.com/inknexlab/tree-sitter-sed/actions/workflows/ci.yml/badge.svg)](https://github.com/inknexlab/tree-sitter-sed/actions/workflows/ci.yml)

[Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammars for
POSIX.1-2024 and GNU `sed` 4.10, with separate languages for basic and extended
regular expressions. The repository includes four generated C parsers and
shared highlighting queries.

![A POSIX sed script with syntax highlighting in Emacs](assets/highlight-preview.png)

_POSIX `sed` syntax highlighting in a customized Emacs setup._

## Grammars

| Dialect | Regexp | Language | Scope | Selection |
| --- | --- | --- | --- | --- |
| GNU `sed` 4.10 | BRE | `sed_gnu_bre` | `source.sed.gnu.bre` | Default for `.sed` files and option-free `sed`/`gsed` shebangs |
| GNU `sed` 4.10 | ERE | `sed_gnu_ere` | `source.sed.gnu.ere` | Select explicitly for `sed -E` or `sed -r` scripts |
| POSIX.1-2024 `sed` | BRE | `sed_posix_bre` | `source.sed.posix.bre` | Select explicitly for strict POSIX default syntax |
| POSIX.1-2024 `sed` | ERE | `sed_posix_ere` | `source.sed.posix.ere` | Select explicitly for strict POSIX `sed -E` syntax |

The grammars provide nodes for commands, addresses, regular expressions,
replacements, dynamic delimiters, and dialect-specific syntax. Error recovery
keeps later commands parseable while a script is incomplete.

BRE and ERE spellings with the same role use common regexp node types. For
example, BRE `\(` and ERE `(` both produce `regex_group_open`, while inactive
spellings remain `regex_literal` or `regex_escape`. The regexp CST stays flat so
that unmatched or incomplete input remains traversable.

## Usage

Requires Node.js 24.18+, npm 11.16+, and a C compiler.

```sh
npm ci
npm run cli -- parse --scope source.sed.gnu.bre path/to/script.sed
npm run cli -- highlight --scope source.sed.gnu.bre path/to/script.sed
```

Use the scope matching both the `sed` implementation and the regular-expression
mode used to invoke it. A standalone `.sed` file does not record whether the
caller will pass `-E`, so only GNU BRE participates in automatic file and
option-free `sed`/`gsed` shebang selection. The other three languages require an
explicit scope or injection name.

## Layout

- `gnu-bre/` and `gnu-ere/` — GNU grammar entry points and generated parsers
- `posix-bre/` and `posix-ere/` — POSIX grammar entry points and generated parsers
- `grammar/` — shared grammar factory and POSIX/GNU command definitions
- `common/scanner.h` — shared external scanner implementation
- `queries/` — common and GNU-specific highlighting queries

Language-specific bindings are not bundled.

## Development

| Command | Purpose |
| --- | --- |
| `npm run check` | Run formatting checks, verify generated files, and run the full test suite |
| `npm test` | Run corpus, WebAssembly API, loader-selection, and highlighting tests |
| `npm run test:fuzz` | Exercise all four parsers with randomized edits |
| `npm run generate` | Regenerate all four C parsers |

## Specifications

- [POSIX.1-2024 `sed`](https://pubs.opengroup.org/onlinepubs/9799919799.2024edition/utilities/sed.html)
- [GNU `sed` 4.10 manual](https://www.gnu.org/software/sed/manual/html_node/index.html)

## License

[MIT](LICENSE)
