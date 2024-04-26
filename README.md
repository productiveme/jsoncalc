![Lines](https://img.shields.io/badge/Coverage-85.37%25-yellow.svg)

# jsoncalc

A utility to watch a json file and run calculations recursively.

## Installation

```bash
npm install --global jsoncalc
```

![](sample/jsoncalc-vscode.gif)

### Usage

```bash
jsoncalc budget.json
```

#### `jsoncalc -h`

```text
Usage: jsoncalc [options] <pathToJson>

Watches for changes and adds calculated elements to each hashmap in the json file at <pathToJson>

Options:
  -V, --version            output the version number
  -r, --reducer <reducer>  One or more (comma seperated) of the available reducer computations: [sum, count, avg, yep, nope]. (default: sum)
  -h, --help               display help for command
```

### Handy Aliases

```bash
# Using the defined EDITOR environment variable, e.g. export EDITOR=nvim
alias jsonc='function _jsonc(){ (for i in $@; do :; done; jsoncalc $@ & $EDITOR $i) }; _jsonc'
# Autocompletion for zsh
compdef '_files -g "*.(json|yaml|yml)"' _jsonc
```
