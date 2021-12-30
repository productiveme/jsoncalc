![Lines](https://img.shields.io/badge/Coverage-80.85%25-yellow.svg)

# jsoncalc

A utility to watch a JSON or YAML file and run calculations recursively.

## Installation

```bash
npm install --global jsoncalc
```

![](sample/jsoncalc-vscode.gif)

### Usage

```bash
jsoncalc budget.json
```

![](sample/jsoncalc-vscode.gif)

OR

```bash
jsoncalc budget.yml
```

![](sample/jsoncalc-yaml.gif)

#### `jsoncalc -h`

```text
Usage: jsoncalc [options] <pathToJson>

Watches for changes and adds calculated elements to each hashmap in the json file at <pathToJson>

Options:
  -V, --version            output the version number
  -r, --reducer <reducer>  One or more (comma seperated) of the available reducer computations: [sum, count, avg, yep, nope]. (default: sum)
  -h, --help               display help for command
```
