# [![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-7fffff?style=flat&labelColor=ff80ff)](https://github.com/neostandard/neostandard)

Validating and linting the git branch name. Create a config file or use the default configuration file. Use it in husky config file to make sure that your branch will not be rejected by some pesky Jenkins branch name conventions. You may use it as part of a CI process or just as an handy `npx` command.

## Install

```
$ npm install branch-name-lint
```

## CLI usage

```console
$ npx branch-name-lint
```

```console
$ npx branch-name-lint --help

  Lint your branch names

  Usage
    $ npx branch-name-lint [configuration-file.json]

  Options
    --help - to get this screen
    --branch, -b - to specify the branch name to validate
    --verbose, -v - to show per param validation output
    --quiet, -q - to suppress error messages and only show the final result
    --mute, -m - to suppress all output

  Examples
    $ branch-name-lint
    Use default configuration or the configuration specified in package.json to validate & lint the branch name.
    $ branch-name-lint [configuration-file.json]
    Use configuration file to validate & lint the branch name.
    $ branch-name-lint -b feature/branch-name
    Validate & lint the branch name feature/branch-name.
```

### CLI options.json

Any Valid JSON file with `branchNameLinter` attribute.

```json
{
  "branchNameLinter": {
    "banned": [
      "wip"
    ],
    "skip": [
      "skip-ci"
    ],
    "disallowed": [
      "master",
      "main",
      "develop",
      "staging"
    ],
    "separator": "/",
    "params": {
      "prefix": {
        "description": "The prefix for the branch",
        "required": true,
        "position": 0,
        "options": [
          "feature",
          "hotfix",
          "release",
          "bugfix",
          "issue"
        ],
        "suggestions": {
          "features": "feature",
          "feat": "feature",
          "fix": "hotfix",
          "releases": "release"
        }
      },
      "description": {
        "description": "The description of the branch",
        "required": true,
        "position": 1,
        "regex": "[a-z0-9.-]+",
        "regexOptions": "i",
        "suggestions": {
          "regex": [
            "awesome-feature",
            "fix-bug",
            "release-1.0"
          ]
        }
      }
    },
    "messages": {
      "lintSuccess": {
        "scope": "branchNameLint",
        "message": "Branch name \"%b\" lint success!",
        "chalk": {
          "background": "bgGreen",
          "color": "white"
        },
        "indentations": 1
      },
      "lintError": {
        "scope": "branchNameLint",
        "message": "Branch name \"%b\" lint error!",
        "chalk": {
          "background": "bgRed",
          "color": "white"
        },
        "indentations": 1
      },
      "branchSkipped": {
        "scope": "SUCCESS",
        "message": "Branch \"%b\" is skipped.",
        "chalk": {
          "background": "bgGreen",
          "color": "white"
        },
        "indentations": 1
      },
      "separatorRequired": {
        "scope": "ERROR",
        "message": "Branch \"%b\" must contain a separator \"%s\".",
        "chalk": {
          "background": "bgRed",
          "color": "white"
        },
        "indentations": 1
      },
      "branchBanned": {
        "scope": "ERROR",
        "message": "Branches with the name \"%b\" are not allowed.",
        "chalk": {
          "background": "bgRed",
          "color": "white"
        },
        "indentations": 1
      },
      "branchDisallowed": {
        "scope": "ERROR",
        "message": "Pushing to \"%b\" is not allowed, use git-flow.",
        "chalk": {
          "background": "bgRed",
          "color": "white"
        },
        "indentations": 1
      },
      "paramsMissing": {
        "scope": "ERROR",
        "message": "The branch name must contain at least %pn params.",
        "chalk": {
          "background": "bgRed",
          "color": "white"
        },
        "indentations": 1
      },
      "nthParamNotValid": {
        "scope": "ERROR",
        "message": "The parameter at position %i is not valid. All previous parameters in branch name already validated.",
        "chalk": {
          "background": "bgRed",
          "color": "white"
        },
        "indentations": 1
      },
      "validatingBranch": {
        "scope": "INFO",
        "message": "Validating branch \"%b\".",
        "chalk": {
          "background": "bgBlue",
          "color": "white"
        },
        "indentations": 1
      },
      "validatingParam": {
        "scope": "INFO",
        "message": "Validating \"%pv\" against \"%p\" settings.",
        "chalk": {
          "background": "bgBlue",
          "color": "white"
        },
        "indentations": 1
      },
      "defaultMissingParam": {
        "scope": "ERROR",
        "message": "A valid branch \"%p\" parameter value is missing in the expected position (%pi).",
        "chalk": {
          "background": "bgRed",
          "color": "white"
        },
        "indentations": 1
      },
      "defaultNotAllowedParam": {
        "scope": "ERROR",
        "message": "Branch %p parameter \"%pv\" is not allowed. Valid options are: %po",
        "chalk": {
          "background": "bgRed",
          "color": "white"
        },
        "indentations": 1
      },
      "defaultSuggestionParam": {
        "scope": "WARNING",
        "message": "Did you mean \"%pvs\"?. Other suggestions are: %ps",
        "chalk": {
          "background": "bgYellow",
          "color": "black"
        },
        "indentations": 1
      },
      "defaultRegexParam": {
        "scope": "ERROR",
        "message": "The parameter \"%p\" value \"%pv\" does not match the allowed pattern: \"%pr\". %prs",
        "chalk": {
          "background": "bgRed",
          "color": "white"
        },
        "indentations": 1
      },
      "defaultValidParam": {
        "scope": "SUCCESS",
        "message": "Parameter \"%p\" with value \"%pv\" is valid.",
        "chalk": {
          "background": "bgGreen",
          "color": "white"
        },
        "indentations": 1
      }
    },
    "scopeChalks": {
      "ERROR": {
        "background": "bgRed",
        "color": "white"
      },
      "SUCCESS": {
        "background": "bgGreen",
        "color": "white"
      },
      "INFO": {
        "background": "bgBlue",
        "color": "white"
      },
      "WARNING": {
        "background": "bgYellow",
        "color": "black"
      },
      "branchNameLint": {
        "background": "bgWhite",
        "color": "black"
      }
    },
    "indentation": "\t"
  }
}
```

## Usage with regex for all branch name

In order to check the branch name with a single regex you can add a single param. This will not require the branch name to have the `options.separator` option but this param must be required.

```json
{
  "branchNameLinter": {
    // ...
    "params": {
      "branch": {
        "regex": "([A-Z]+-[0-9]+.{5,70})",
        "regexOptions": "i",
        "position": 0,
        "required": true,
        // ...
      }
    }
    // ...
  }
}
```

## Husky usage

After installation, just add in any husky hook as node modules call.

```
"husky": {
    "hooks": {
        "pre-push": "npx branch-name-lint [sample-configuration.json]"
    }
},
```

## API

### **branchLintName.options**

Type: `object`
Default:

```json
{
  "banned": [
    "wip"
  ],
  "skip": [
    "skip-ci"
  ],
  "disallowed": [
    "master",
    "main",
    "develop",
    "staging"
  ],
  "separator": "/",
  "params": {
    "prefix": {
      "description": "The prefix for the branch",
      "required": true,
      "position": 0,
      "options": [
        "feature",
        "hotfix",
        "release",
        "bugfix",
        "issue"
      ],
      "suggestions": {
        "features": "feature",
        "feat": "feature",
        "fix": "hotfix",
        "releases": "release"
      }
    },
    "description": {
      "description": "The description of the branch",
      "required": true,
      "position": 1,
      "regex": "[a-z0-9.-]+",
      "regexOptions": "i",
      "suggestions": {
        "regex": [
          "awesome-feature",
          "fix-bug",
          "release-1.0"
        ]
      }
    }
  },
  "messages": {
    "lintSuccess": {
      "scope": "branchNameLint",
      "message": "Branch name \"%b\" lint success!",
      "chalk": {
        "background": "bgGreen",
        "color": "white"
      },
      "indentations": 1
    },
    "lintError": {
      "scope": "branchNameLint",
      "message": "Branch name \"%b\" lint error!",
      "chalk": {
        "background": "bgRed",
        "color": "white"
      },
      "indentations": 1
    },
    "branchSkipped": {
      "scope": "SUCCESS",
      "message": "Branch \"%b\" is skipped.",
      "chalk": {
        "background": "bgGreen",
        "color": "white"
      },
      "indentations": 1
    },
    "separatorRequired": {
      "scope": "ERROR",
      "message": "Branch \"%b\" must contain a separator \"%s\".",
      "chalk": {
        "background": "bgRed",
        "color": "white"
      },
      "indentations": 1
    },
    "branchBanned": {
      "scope": "ERROR",
      "message": "Branches with the name \"%b\" are not allowed.",
      "chalk": {
        "background": "bgRed",
        "color": "white"
      },
      "indentations": 1
    },
    "branchDisallowed": {
      "scope": "ERROR",
      "message": "Pushing to \"%b\" is not allowed, use git-flow.",
      "chalk": {
        "background": "bgRed",
        "color": "white"
      },
      "indentations": 1
    },
    "paramsMissing": {
      "scope": "ERROR",
      "message": "The branch name must contain at least %pn params.",
      "chalk": {
        "background": "bgRed",
        "color": "white"
      },
      "indentations": 1
    },
    "nthParamNotValid": {
      "scope": "ERROR",
      "message": "The parameter at position %i is not valid. All previous parameters are valid.",
      "chalk": {
        "background": "bgRed",
        "color": "white"
      },
      "indentations": 1
    },
    "validatingBranch": {
      "scope": "INFO",
      "message": "Validating branch \"%b\".",
      "chalk": {
        "background": "bgBlue",
        "color": "white"
      },
      "indentations": 1
    },
    "validatingParam": {
      "scope": "INFO",
      "message": "Validating \"%pv\" against \"%p\" settings.",
      "chalk": {
        "background": "bgBlue",
        "color": "white"
      },
      "indentations": 1
    },
    "defaultMissingParam": {
      "scope": "ERROR",
      "message": "A valid branch \"%p\" parameter value is missing in the expected position (%pi).",
      "chalk": {
        "background": "bgRed",
        "color": "white"
      },
      "indentations": 1
    },
    "defaultNotAllowedParam": {
      "scope": "ERROR",
      "message": "Branch %p parameter \"%pv\" is not allowed. Valid options are: %po",
      "chalk": {
        "background": "bgRed",
        "color": "white"
      },
      "indentations": 1
    },
    "defaultSuggestionParam": {
      "scope": "WARNING",
      "message": "Did you mean \"%pvs\"?. Other suggestions are: %ps",
      "chalk": {
        "background": "bgYellow",
        "color": "black"
      },
      "indentations": 1
    },
    "defaultRegexParam": {
      "scope": "ERROR",
      "message": "The parameter \"%p\" value \"%pv\" does not match the allowed pattern: \"%pr\". %prs",
      "chalk": {
        "background": "bgRed",
        "color": "white"
      },
      "indentations": 1
    },
    "defaultValidParam": {
      "scope": "SUCCESS",
      "message": "Parameter \"%p\" with value \"%pv\" is valid.",
      "chalk": {
        "background": "bgGreen",
        "color": "white"
      },
      "indentations": 1
    }
  },
  "scopeChalks": {
    "ERROR": {
      "background": "bgRed",
      "color": "white"
    },
    "SUCCESS": {
      "background": "bgGreen",
      "color": "white"
    },
    "INFO": {
      "background": "bgBlue",
      "color": "white"
    },
    "WARNING": {
      "background": "bgYellow",
      "color": "black"
    },
    "branchNameLint": {
      "background": "bgWhite",
      "color": "black"
    }
  },
  "indentation": "\t"
}
```

### **branchLintName.options.banned**
- Type: `Array<string>`
- Default:
```json
["wip"]
```
- Description: List of banned branch names.

### **branchLintName.options.skip**
- Type: `Array<string>`
- Default:
```json
["skip-ci"]
```
- Description: List of branch names to skip linting.

### **branchLintName.options.disallowed**
- Type: `Array<string>`
- Default:
```json
[
  "master",
  "main",
  "develop",
  "staging"
]
```
- Description: List of branch names to skip linting.

### **branchLintName.options.separator**
- Type: `string`
- Default: "/"
- Required: only when using more than 1 parameter.
- Description: The separator used in branch names.

### **branchLintName.options.params**
- Type: `object`
  - paramName
    - Type: `branchLintName.param`
    - Required: `true`
    - Description: The branch parameter.

### **branchLintName.param**
- Type: `object`
  - description:
    - Type: `string`
    - Required: `false`
    - Description: The parameter description.
  - required:
    - Type: `boolean`
    - Required: `true`
    - Description: Indicates if this parameter is mandatory for the branch name.
  - position
    - Type: `number | Array<number>`
    - Required: `true`
    - Description: The position of the parameter in the branch name, defining where the parameter could appear.
  - options
    - Type: `Array[string]`
    - Required: `true || this.regex`
    - Description: A list of valid options for this parameter. This is required unless a regex pattern is provided.
  - suggestions
    - Type: `object`
    - Required: `true`
    - Description: Suggested values for the parameter, offering alternatives or corrections to the user.
  - regex
    - Type: `string`
    - Required: `true || this.options`
    - Description: A regex pattern that the parameter value must match. This is required unless valid options are provided.
  - regexOptions
    - Type: `string`
    - Required: `this.regex || false`
    - Description: Additional options for the regex pattern, such as case insensitivity ("i").
  - messages
    - Type: `branchLintName.paramMessages`
    - Required: `true`
    - Description: Custom messages for validation states, including errors, warnings, and successes.

### **branchLintName.paramMessages**
- Type: `object`
  - `branchLintName.paramMessageName`: `branchLintName.message`

### **branchLintName.paramMessageName**
- Type: `string`
- Values:
`valid` |
`missing` |
`notAllowed` |
`suggestion` |
`regex`

### **branchLintName.options.messages**
- Type: `object`
  - `branchLintName.messageName`: `branchLintName.message`

### **branchLintName.options.scopeChalks**
- Type: `object`
  - `branchLintName.scopes`: `branchLintName.message`

### **branchLintName.scopes**
- Type: `string`
- Values:
`ERROR` |
`SUCCESS` |
`INFO` |
`WARNING` |
`branchNameLint`

### **branchLintName.messageName**
- Type: `string`
- Values:
`lintSuccess` |
`lintError` |
`branchSkipped` |
`separatorRequired` |
`branchBanned` |
`branchDisallowed` |
`paramsMissing` |
`nthParamNotValid` |
`validatingBranch` |
`validatingParam` |
`defaultMissingParam` |
`defaultNotAllowedParam` |
`defaultSuggestionParam` |
`defaultRegexParam` |
`defaultValidParam`

### **branchLintName.message**
- Type: `object`
  - scope
    - Type: `string`
    - Required: `true`
    - Description: The scope of the message, indicating the context or category to which the message belongs.
  - message
    - Type: `string`
    - Required: `true`
    - Description: The actual message text to be displayed, which can include `branchLintName.placeholders` for dynamic content.
  - chalk
    - Type: `branchLintName.chalkOptions`
    - Required: `options.scopeChalks[this.scope] || true`
    - Description: Chalk options for styling the message, including background and text colors.
  - indentations
    - Type: `number`
    - Required: `true`
    - Description: The number of indentations to apply to the message, helping to format the output for better readability.

### **branchLintName.options.chalkOptions**
- Type: `object`
  - background
    - Type: [`string`](https://github.com/chalk/chalk?tab=readme-ov-file#colors)
    - Required: `true`
    - Description: The background color for the message text.
  - color
    - Type: `string`
    - Required: `true`
    - Description: The text color for the message.

### **branchLintName.options.indentation**
- Type: [`string`](https://github.com/chalk/chalk?tab=readme-ov-file#background-colors)
- Default: `\t`
- Required: `true`
- Description: The character to use for indentations.

### **branchLintName.placeholders**
- **`%b`**
  - Description: The current branch name.
  - Example: `feature/new-feature`

- **`%bb`**
  - Description: A comma-separated list of banned branch names.
  - Example: `wip`

- **`%bd`**
  - Description: A comma-separated list of disallowed branch names.
  - Example: `master, main, develop, staging`

- **`%bs`**
  - Description: A comma-separated list of branch names to skip linting.
  - Example: `skip-ci`

- **`%s`**
  - Description: The separator used in branch names.
  - Example: `/`

- **`%pn`**
  - Description: The number of required parameters in the branch name.
  - Example: `2`

- **`%prs`**
  - Description: A message indicating valid values for the parameter based on regex suggestions.
  - Example: `This is valid when the value is for example: feature, hotfix, release, bugfix, issue`

- **`%pvs`**
  - Description: Suggested value for the parameter.
  - Example: `feature`

- **`%pv`**
  - Description: The actual value of the parameter from the branch name.
  - Example: `feat`

- **`%po`**
  - Description: A comma-separated list of valid options for the parameter.
  - Example: `feature, hotfix, release, bugfix, issue`

- **`%ps`**
  - Description: A comma-separated list of suggestions for the parameter, formatted as "For {foundWord} => {value}".
  - Example: `For features => feature, For feat => feature, For fix => hotfix, For releases => release`

- **`%pi`**
  - Description: The expected position of the parameter in the branch name. If the position is an array, it will be formatted as "pos1 || pos2".
  - Example: `1` or `1 || 2`

- **`%pr`**
  - Description: The regex pattern that the parameter value must match.
  - Example: `[a-z0-9.-]+`

- **`%p`**
  - Description: The name of the parameter.
  - Example: `description`

- **`%i`**
  - Description: The index of the parameter in the branch name (1-based).
  - Example: `2`


## License

MIT © [Ran Bar-Zik](https://internet-israel.com)
