import chalk from 'chalk'
import { execFileSync } from 'child_process'

// const messageParams = {
//   b: 'branch',
//   bb: 'branchBanned',
//   bd: 'branchDisallowed',
//   bs: 'branchSkipped',
//   s: 'separator',
//   pn: 'paramsNumber',
//   p: 'paramName',
//   pv: 'paramValue',
//   po: 'paramOptions',
//   ps: 'paramSuggestions',
//   pvs: 'paramValueSuggestion',
//   pr: 'regex',
//   prs: 'paramRegexSuggestion',
//   pi: 'paramIndex',
//   pex: 'paramExpected',
//   str: 'string',
// }

const ERROR_CHALK_OPTIONS = {
  background: 'bgRed',
  color: 'white',
}

const SUCCESS_CHALK_OPTIONS = {
  background: 'bgGreen',
  color: 'white',
}

const INFO_CHALK_OPTIONS = {
  background: 'bgBlue',
  color: 'white',
}

const WARNING_CHALK_OPTIONS = {
  background: 'bgYellow',
  color: 'black',
}

const APP_CHALK_OPTIONS = {
  background: 'bgWhite',
  color: 'black',
}

export class BranchNameLint {
  constructor (options, flags) {
    const defaultOptions = {
      banned: [
        'wip',
      ],
      skip: [
        'skip-ci',
      ],
      disallowed: [
        'master',
        'main',
        'develop',
        'staging',
      ],
      separator: '/',
      params: {
        prefix: {
          description: 'The prefix for the branch',
          required: true,
          position: 0,
          regex: '[a-z0-9-]+',
          options: ['feature', 'hotfix', 'release', 'bugfix', 'issue'],
          suggestions: {
            features: 'feature',
            feat: 'feature',
            fix: 'hotfix',
            releases: 'release',
            regex: ['feature', 'hotfix', 'release', 'bugfix', 'issue'],
          },
          messages: {
            notAllowed: {
              scope: 'ERROR',
              message: 'Branch %p "%pv" is not allowed. Valid prefixes are: %po',
              chalk: ERROR_CHALK_OPTIONS,
              indentations: 1,
            },
            suggestion: {
              scope: 'WARNING',
              message: 'Instead of "%pv" try "%pvs". Other suggestions are: %ps',
              chalk: WARNING_CHALK_OPTIONS,
              indentations: 1,
            },
            missing: {
              scope: 'ERROR',
              message: 'Branch "%p" parameter is missing in the expected position (%pi).',
              chalk: ERROR_CHALK_OPTIONS,
              indentations: 1,
            },
            regex: {
              scope: 'ERROR',
              message: 'The "%p" value "%pv" does not match the allowed pattern: "%pr". %prs',
              chalk: ERROR_CHALK_OPTIONS,
              indentations: 1,
            },
            valid: {
              scope: 'SUCCESS',
              message: 'Branch prefix "%pv" is valid.',
              chalk: SUCCESS_CHALK_OPTIONS,
              indentations: 1,
            },
          },
        },
        ticket: {
          description: 'The ticket related to the branch',
          required: false,
          position: 1,
          regex: 'SITIM[0-9]{4}-[0-9]{1,4}|SPRINT-[0-9]+',
          options: [],
          suggestions: {
            regex: ['SITIM2024-1234', 'SPRINT-10'],
          },
          messages: {
            notAllowed: {},
            suggestion: {},
            missing: {
              scope: 'ERROR',
              message: 'Branch "%p" parameter is missing in the expected position (%pi).',
              chalk: ERROR_CHALK_OPTIONS,
              indentations: 1,
            },
            regex: {
              scope: 'ERROR',
              message: 'The "%p" value "%pv" does not match the allowed pattern: "%pr". %prs',
              chalk: ERROR_CHALK_OPTIONS,
              indentations: 1,
            },
            valid: {
              scope: 'SUCCESS',
              message: 'Branch ticket "%pv" is valid.',
              chalk: SUCCESS_CHALK_OPTIONS,
              indentations: 1,
            },
          },
        },
        description: {
          description: 'The description of the branch',
          required: true,
          position: [1, 2],
          regex: '[a-z0-9.-]+',
          options: [],
          suggestions: {
            regex: ['awesome-feature', 'fix-bug', 'release-1.0'],
          },
          messages: {
            notAllowed: {},
            suggestion: {},
            missing: {
              scope: 'ERROR',
              message: 'Branch "%p" parameter is missing in one of the expected positions (%pi).',
              chalk: ERROR_CHALK_OPTIONS,
              indentations: 1,
            },
            regex: {
              scope: 'ERROR',
              message: 'The "%p" value "%pv" does not match the allowed pattern: "%pr". %prs',
              chalk: ERROR_CHALK_OPTIONS,
              indentations: 1,
            },
            valid: {
              scope: 'SUCCESS',
              message: 'Branch description "%pv" is valid.',
              chalk: SUCCESS_CHALK_OPTIONS,
              indentations: 1,
            },
          },
        },
      },
      messages: {
        lintSuccess: {
          scope: 'branchNameLint',
          message: 'Branch name "%b" lint success!',
          chalk: SUCCESS_CHALK_OPTIONS,
          indentations: 1,
        },
        lintError: {
          scope: 'branchNameLint',
          message: 'Branch name "%b" lint error!',
          chalk: ERROR_CHALK_OPTIONS,
          indentations: 1,
        },
        branchSkipped: {
          scope: 'SUCCESS',
          message: 'Branch "%b" is skipped.',
          chalk: SUCCESS_CHALK_OPTIONS,
          indentations: 1,
        },
        separatorRequired: {
          scope: 'ERROR',
          message: 'Branch "%b" must contain a separator "%s".',
          chalk: ERROR_CHALK_OPTIONS,
          indentations: 1,
        },
        branchBanned: {
          scope: 'ERROR',
          message: 'Branches with the name "%b" are not allowed.',
          chalk: ERROR_CHALK_OPTIONS,
          indentations: 1,
        },
        branchDisallowed: {
          scope: 'ERROR',
          message: 'Pushing to "%b" is not allowed, use git-flow.',
          chalk: ERROR_CHALK_OPTIONS,
          indentations: 1,
        },
        paramsMissing: {
          scope: 'ERROR',
          message: 'The branch name must contain position least %pn params.',
          chalk: ERROR_CHALK_OPTIONS,
          indentations: 1,
        },
        nthParamNotValid: {
          scope: 'ERROR',
          message: 'The parameter at position %i is not valid. Expected: %pex.',
          chalk: ERROR_CHALK_OPTIONS,
          indentations: 1,
        },
        validating: {
          scope: 'INFO',
          message: 'Validating "%pv" against "%p" settings.',
          chalk: INFO_CHALK_OPTIONS,
          indentations: 1,
        },
        defaultValid: {
          scope: 'SUCCESS',
          message: 'Parameter "%p" with value "%pv" is valid.',
          chalk: SUCCESS_CHALK_OPTIONS,
          indentations: 1,
        },
      },
      scopeChalks: {
        ERROR: ERROR_CHALK_OPTIONS,
        SUCCESS: SUCCESS_CHALK_OPTIONS,
        INFO: INFO_CHALK_OPTIONS,
        WARNING: WARNING_CHALK_OPTIONS,
        branchNameLint: APP_CHALK_OPTIONS,
      },
      indentation: '\t',
    }
    this.options = { ...defaultOptions, ...options }
    this.branch = flags.branch ? flags.branch : this.getCurrentBranch()
    this.verbose = flags.verbose && !flags.quiet && !flags.mute
    this.quiet = flags.quiet || flags.mute
    this.mute = flags.mute
    this.paramValidations = []
    this.ERROR_CODE = 1
    this.SUCCESS_CODE = 0
  }

  validateWithRegex (value, regex, regexOptions) {
    const REGEX = new RegExp(`^${regex}$`, regexOptions)
    return REGEX.test(value)
  }

  validateParam (paramFromBranch, foundAt, log = true) {
    let posibleApplicableParamsSettings = Object.entries(this.options.params).filter(([paramName, paramSettings]) => {
      if (Array.isArray(paramSettings.position)) {
        return paramSettings.position.includes(foundAt)
      }
      return paramSettings.position === foundAt
    })
    const alreadyValidParams = this.paramValidations.filter(p => p.valid === true)
    posibleApplicableParamsSettings = posibleApplicableParamsSettings.filter(([paramName, paramSettings]) => {
      return !alreadyValidParams.map(p => p.param).includes(paramName)
    })
    if (posibleApplicableParamsSettings.length === 0) {
      const expectedParams = Object.entries(this.options.params).filter(([paramName, paramSettings]) => {
        if (Array.isArray(paramSettings.position)) {
          return paramSettings.position.includes(foundAt)
        }
        return paramSettings.position === foundAt
      })
      this.message({
        message: this.options.messages.nthParamNotValid,
        index: foundAt,
        expected: expectedParams.map(p => p[0]),
      })
      return {
        valid: false,
        message: this.buildMessage({
          message: this.options.messages.nthParamNotValid.message,
          index: foundAt,
          expected: expectedParams.map(p => p[0]),
        }),
      }
    }
    for (const [paramName, paramSettings] of posibleApplicableParamsSettings) {
      log && this.message({
        message: this.options.messages.validating,
        param: paramName,
        paramValue: paramFromBranch,
      })
      const requiredAtPosition = paramSettings.required && (paramSettings.position === foundAt || Array.isArray(paramSettings.position))
      if (paramSettings.options.length > 0 && !paramSettings.options.includes(paramFromBranch)) {
        requiredAtPosition && this.message({
          message: paramSettings.messages.notAllowed,
          param: paramName,
          paramValue: paramFromBranch,
          log,
        })
        if (paramSettings.suggestions && paramSettings.suggestions[paramFromBranch]) {
          requiredAtPosition && this.message({
            message: paramSettings.messages.suggestion,
            param: paramName,
            paramValue: paramFromBranch,
            log,
          })
        }
        continue
      }
      if (paramSettings.regex && !this.validateWithRegex(paramFromBranch, paramSettings.regex, 'i')) {
        log && requiredAtPosition && this.message({
          message: paramSettings.messages.regex,
          param: paramName,
          paramValue: paramFromBranch,
          log,
        })
        continue
      }
      const successMessage = paramSettings.messages.valid ? paramSettings.messages.valid : this.options.messages.defaultValid
      log && this.message({
        message: successMessage,
        param: paramName,
        paramValue: paramFromBranch,
      })
      return {
        valid: true,
        message: successMessage,
        param: paramName,
        paramValue: paramFromBranch,
      }
    }
    return {
      valid: false,
      message: posibleApplicableParamsSettings[0][1].messages.missing,
      param: posibleApplicableParamsSettings[0][0],
      paramValue: paramFromBranch,
    }
  }

  doValidation () {
    if (this.options.skip.length > 0 && this.options.skip.includes(this.branch)) {
      return this.success({
        messages: [
          this.options.messages.branchSkipped,
        ],
      })
    }

    if (this.options.banned.includes(this.branch)) {
      return this.error({
        messages: [this.options.messages.branchBanned],
      })
    }

    if (this.options.disallowed.includes(this.branch)) {
      return this.error({
        messages: [this.options.messages.branchDisallowed],
      })
    }

    if (this.branch.includes(this.options.separator) === false) {
      return this.error({
        messages: [this.options.messages.separatorRequired],
      })
    }

    const paramsFromBranch = this.branch.split(this.options.separator)

    if (Object.values(this.options.params).filter(p => p.required === true).length > paramsFromBranch.length) {
      return this.error({
        messages: [this.options.messages.paramsMissing],
      })
    }

    for (const [index, paramBranchValue] of paramsFromBranch.entries()) {
      this.paramValidations.push(this.validateParam(paramBranchValue, index, this.verbose))
    }

    const validParams = this.paramValidations.filter(p => p.valid === true)
    const requiredParamsMissing = Object.entries(this.options.params).filter(([paramName, paramSettings]) => {
      return paramSettings.required === true && !validParams.map(p => p.param).includes(paramName)
    })

    for (const [paramName, paramSettings] of requiredParamsMissing) {
      this.message({
        message: paramSettings.messages.missing,
        param: paramName,
      })
    }
    if (requiredParamsMissing.length > 0 || validParams.length !== paramsFromBranch.length) {
      return this.error({
        messages: [],
      })
    }
    return this.success({
      messages: [],
    })
  }

  message ({ message, param = '', paramValue = '', quiet = this.quiet, index = -1, expected = [] }) {
    let output = ''
    output += chalk[this.options.scopeChalks[message.scope].color][this.options.scopeChalks[message.scope].background](`[${message.scope}]`)
    output += '\n'
    for (let i = 0; i < message.indentations; i++) {
      output += this.options.indentation
    }
    output += chalk[message.chalk.color][message.chalk.background](this.buildMessage({
      message: message.message,
      param,
      paramValue,
      index,
      expected,
    }))
    !quiet && console.log(output)
  }

  success ({ messages, param = '', paramValue = '', log = true }) {
    if (log) {
      this.message({ message: this.options.messages.lintSuccess, param, paramValue, quiet: this.mute })
      for (const message of messages) {
        this.message({ message, param, paramValue })
      }
    }
    return this.SUCCESS_CODE
  }

  error ({ messages, param = '', paramValue = '', log = true }) {
    if (log) {
      this.message({ message: this.options.messages.lintError, param, paramValue, quiet: this.mute })
      for (const message of messages) {
        this.message({ message, param, paramValue })
      }
    }
    return this.ERROR_CODE
  }

  getCurrentBranch () {
    const branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD']).toString()
    this.branch = branch
    return this.branch.trim()
  }

  buildSuggestions (suggestions) {
    const suggestionsArray = []
    for (const foundWord of Object.keys(suggestions)) {
      if (foundWord === 'regex') {
        continue
      }
      suggestionsArray.push(`For ${foundWord} => ${suggestions[foundWord]}`)
    }
    return suggestionsArray.join(', ')
  }

  buildExpectedParams (expectedParams) {
    const output = []
    for (const expected of expectedParams) {
      const settings = this.options.params[expected]
      let message = `${expected} (`
      if (settings.options.length > 0) {
        message += `${settings.options.join(', ')}`
      } else if (settings.regex) {
        message += `${settings.regex}`
      }
      message += ')'
      output.push(message)
    }
    return output.join(', ')
  }

  buildMessage ({ message, param = '', paramValue = '', index = -1, expected = [] }) {
    let built = message
    built = built.replace(/%b/g, this.branch)
    built = built.replace(/%bb/g, this.options.banned.join(', '))
    built = built.replace(/%bd/g, this.options.disallowed.join(', '))
    built = built.replace(/%bs/g, this.options.skip.join(', '))
    built = built.replace(/%s/g, this.options.separator)
    built = built.replace(/%pn/g, Object.values(this.options.params).filter(p => p.required === true).length)
    const paramOptions = this.options.params[param]
    if (param && Object.keys(paramOptions).length > 0) {
      built = built.replace(/%prs/g, `This is valid when the value is for example: ${paramOptions.suggestions.regex.join(', ')}`)
      built = built.replace(/%pvs/g, paramOptions.suggestions[paramValue])
      built = built.replace(/%pv/g, paramValue)
      built = built.replace(/%po/g, paramOptions.options.join(', '))
      built = built.replace(/%ps/g, this.buildSuggestions(paramOptions.suggestions))
      built = built.replace(/%pi/g, Array.isArray(paramOptions.position) ? paramOptions.position.map(p => p + 1).join(' || ') : paramOptions.position + 1)
      built = built.replace(/%pr/g, paramOptions.regex)
      built = built.replace(/%p/g, param)
    }
    if (index !== -1) {
      built = built.replace(/%i/g, index + 1)
    }
    if (expected.length > 0) {
      built = built.replace(/%pex/g, this.buildExpectedParams(expected))
    }
    return built
  }
}

export default BranchNameLint
