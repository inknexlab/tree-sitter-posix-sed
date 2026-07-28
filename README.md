# tree-sitter-sed

[![CI](https://github.com/inknexlab/tree-sitter-sed/actions/workflows/ci.yml/badge.svg)](https://github.com/inknexlab/tree-sitter-sed/actions/workflows/ci.yml)

[Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammars for
POSIX.1-2024 `sed` and GNU `sed` 4.10.

![A sed script with syntax highlighting in Emacs](assets/highlight-preview.png)

_`sed` syntax highlighting in a customized Emacs setup._

## Usage

### Neovim

Install this repository as a Neovim package alongside
[nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter). It
registers the parser definitions automatically and supplies the runtime
queries. Then install the conventional parser:

```vim
:TSInstall sed
```

### Emacs

```elisp
(add-to-list
 'treesit-language-source-alist
 '(sed . ("https://github.com/inknexlab/tree-sitter-sed")))

(treesit-install-language-grammar 'sed)
```

## Variants

`sed` is GNU `sed` 4.10 using Basic Regular Expressions (BRE). If a project
needs POSIX syntax or Extended Regular Expressions (ERE), choose an explicit
language instead.

| Dialect | Regex mode | Directory | Language | Scope |
| --- | --- | --- | --- | --- |
| GNU `sed` 4.10 | BRE | `gnu-bre` | `sed_gnu_bre` | `source.sed.gnu.bre` |
| GNU `sed` 4.10 | ERE | `gnu-ere` | `sed_gnu_ere` | `source.sed.gnu.ere` |
| POSIX.1-2024 `sed` | BRE | `posix-bre` | `sed_posix_bre` | `source.sed.posix.bre` |
| POSIX.1-2024 `sed` | ERE | `posix-ere` | `sed_posix_ere` | `source.sed.posix.ere` |

### Neovim

Neovim registers these parser names too, so they can be installed with commands
such as `:TSInstall sed_posix_bre`. To use one for `sed` buffers, map that
parser deliberately:

```lua
vim.treesitter.language.register('sed_posix_bre', { 'sed' })
```

### Emacs

Choose the language and directory from the table. For example, POSIX BRE uses
`sed_posix_bre` and `posix-bre/src`:

```elisp
(add-to-list
 'treesit-language-source-alist
 '(sed_posix_bre
   . ("https://github.com/inknexlab/tree-sitter-sed"
      nil
      "posix-bre/src")))

(treesit-install-language-grammar 'sed_posix_bre)
```

Only one parser should be mapped to the `sed` filetype at a time. Each language
has Neovim-ready highlight, fold, and block-indent queries. GNU languages also
inject the `shell_argument` of an `e` command as Bash-compatible shell source.
No locals query is provided because sed labels are script-wide rather than
lexically scoped locals.

## Language server

[sed-language-server](https://github.com/inknexlab/sed-language-server) uses
these grammars to provide diagnostics, formatting, and label navigation
through the Language Server Protocol.

## Specifications

- [POSIX.1-2024 `sed`](https://pubs.opengroup.org/onlinepubs/9799919799.2024edition/utilities/sed.html)
- [GNU `sed` 4.10 manual](https://www.gnu.org/software/sed/manual/html_node/index.html)

## License

[MIT](LICENSE)
