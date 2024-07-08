import chalk from 'chalk'
import { execFileSync } from 'child_process'

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
          },
        },
        description: {
          description: 'The description of the branch',
          required: true,
          position: 1,
          regex: '[a-z0-9.-]+',
          regexOptions: 'i',
          suggestions: {
            regex: ['awesome-feature', 'fix-bug', 'release-1.0'],
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
          message: 'The parameter at position %i is not valid. All previous parameters in branch name already validated.',
          chalk: ERROR_CHALK_OPTIONS,
          indentations: 1,
        },
        validatingBranch: {
          scope: 'INFO',
          message: 'Validating branch "%b".',
          chalk: INFO_CHALK_OPTIONS,
          indentations: 1,
        },
        validatingParam: {
          scope: 'INFO',
          message: 'Validating "%pv" against "%p" settings.',
          chalk: INFO_CHALK_OPTIONS,
          indentations: 1,
        },
        defaultMissingParam: {
          scope: 'ERROR',
          message: 'A valid branch "%p" parameter value is missing in the expected position (%pi).',
          chalk: ERROR_CHALK_OPTIONS,
          indentations: 1,
        },
        defaultNotAllowedParam: {
          scope: 'ERROR',
          message: 'Branch %p parameter "%pv" is not allowed. Valid options are: %po',
          chalk: ERROR_CHALK_OPTIONS,
          indentations: 1,
        },
        defaultSuggestionParam: {
          scope: 'WARNING',
          message: 'Did you mean "%pvs"?. Other suggestions are: %ps',
          chalk: WARNING_CHALK_OPTIONS,
          indentations: 1,
        },
        defaultRegexParam: {
          scope: 'ERROR',
          message: 'The parameter "%p" value "%pv" does not match the allowed pattern: "%pr". %prs',
          chalk: ERROR_CHALK_OPTIONS,
          indentations: 1,
        },
        defaultValidParam: {
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
    Object.entries(defaultOptions.params).forEach(([_paramName, paramValue]) => {
      if (!paramValue.messages) { paramValue.messages = this.buildParamDefaultMessages() }
    })
    this.validateOptions()
    this.branch = flags.branch ? flags.branch : this.getCurrentBranch()
    this.verbose = flags.verbose && !flags.quiet
    this.quiet = flags.quiet || flags.mute
    this.mute = flags.mute
    this.paramValidations = []
    this.ERROR_CODE = 1
    this.SUCCESS_CODE = 0
  }

  validateOptions () {
    if (!this.options.separator && Object.keys(this.options.params).length > 1) {
      throw new Error('Separator is required.')
    }

    if (!this.options.params) {
      throw new Error('Params are required.')
    }

    if (!this.options.messages) {
      throw new Error('Messages are required')
    }

    if (Object.keys(this.options.params).length === 1 && !Object.values(this.options.params)[0].required) {
      throw new Error('Unique param must be required')
    }

    Object.entries(this.options.params).forEach(([paramName, paramSettings]) => {
      if (paramSettings.position === undefined || paramSettings === null || paramSettings.position > Object.values(this.options.params).filter(p => p.required === true).length - 1) {
        throw new Error(`Valid position is required for parameter '${paramName}'`)
      }
      if (!paramSettings.regex && !paramSettings.options) {
        throw new Error(`Options or regex are required for '${paramName}'`)
      }
    })
  }

  buildParamDefaultMessages () {
    return {
      valid: this.options.messages.defaultValidParam,
      missing: this.options.messages.defaultMissingParam,
      notAllowed: this.options.messages.defaultNotAllowedParam,
      suggestion: this.options.messages.defaultSuggestionParam,
      regex: this.options.messages.defaultRegexParam,
    }
  }

  validateWithRegex (value, regex, regexOptions) {
    const REGEX = new RegExp(`^${regex}$`, regexOptions)
    return REGEX.test(value)
  }

  validateParam (paramFromBranch, foundAt) {
    const filterParamsByPosition = (params) => {
      return Object.entries(params).filter(([paramName, paramSettings]) => {
        return Array.isArray(paramSettings.position) ? paramSettings.position.includes(foundAt) : paramSettings.position === foundAt
      })
    }

    let posibleApplicableParamsSettings = filterParamsByPosition(this.options.params)
    const alreadyValidParams = new Set(this.paramValidations.filter(p => p.valid).map(p => p.param))
    posibleApplicableParamsSettings = posibleApplicableParamsSettings.filter(([paramName]) => !alreadyValidParams.has(paramName))

    if (posibleApplicableParamsSettings.length === 0) {
      const expectedParams = filterParamsByPosition(this.options.params)
      const expectedParamNames = expectedParams.map(p => p[0])
      this.consoleMessage({
        message: this.options.messages.nthParamNotValid,
        index: foundAt,
        expected: expectedParamNames,
        log: !this.quiet,
      })
      return {
        valid: false,
        message: this.buildMessage({
          message: this.options.messages.nthParamNotValid.message,
          index: foundAt,
          expected: expectedParamNames,
        }),
      }
    }

    for (const [paramName, paramSettings] of posibleApplicableParamsSettings) {
      this.consoleMessage({
        message: this.options.messages.validatingParam,
        param: paramName,
        paramValue: paramFromBranch,
        log: this.verbose,
      })

      const requiredAtPosition = paramSettings.required && (paramSettings.position === foundAt || Array.isArray(paramSettings.position))
      if (paramSettings.options?.length > 0 && !paramSettings.options?.includes(paramFromBranch)) {
        requiredAtPosition && this.consoleMessage({
          message: paramSettings.messages.notAllowed || this.options.messages.defaultNotAllowedParam,
          param: paramName,
          paramValue: paramFromBranch,
          log: !this.quiet,
        })
        if (paramSettings.suggestions && paramSettings.suggestions[paramFromBranch]) {
          requiredAtPosition && this.consoleMessage({
            message: paramSettings.messages.suggestion || this.options.messages.defaultSuggestionParam,
            param: paramName,
            paramValue: paramFromBranch,
            log: this.verbose,
          })
        }
        continue
      }
      if (paramSettings.regex && !this.validateWithRegex(paramFromBranch, paramSettings.regex, paramSettings.regexOptions)) {
        requiredAtPosition && this.consoleMessage({
          message: paramSettings.messages.regex || this.options.messages.defaultRegexParam,
          param: paramName,
          paramValue: paramFromBranch,
          log: !this.quiet,
        })
        continue
      }
      const successMessage = paramSettings.messages.valid || this.options.messages.defaultValidParam
      this.consoleMessage({
        message: successMessage,
        param: paramName,
        paramValue: paramFromBranch,
        log: this.verbose,
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
    this.verbose && this.consoleMessage({
      message: this.options.messages.validatingBranch,
      log: this.verbose,
    })

    const checkAndReturnError = (list, message) => {
      if (list.includes(this.branch)) {
        return this.error({
          messages: [message],
        })
      }
    }

    const errorChecks = [
      { list: this.options.skip, message: this.options.messages.branchSkipped },
      { list: this.options.banned, message: this.options.messages.branchBanned },
      { list: this.options.disallowed, message: this.options.messages.branchDisallowed },
    ]

    for (const { list, message } of errorChecks) {
      const error = checkAndReturnError(list, message)
      if (error) {
        return error
      }
    }

    if (Object.keys(this.options.params).length > 1 && !this.branch.includes(this.options.separator)) {
      return this.error({
        messages: [this.options.messages.separatorRequired],
      })
    }

    let paramsFromBranch = []
    if (Object.keys(this.options.params).length > 1) {
      paramsFromBranch = this.branch.split(this.options.separator)
    } else {
      paramsFromBranch = [this.branch]
    }

    if (Object.values(this.options.params).filter(p => p.required === true).length > paramsFromBranch.length) {
      return this.error({
        messages: [this.options.messages.paramsMissing],
      })
    }

    for (const [index, paramBranchValue] of paramsFromBranch.entries()) {
      this.paramValidations.push(this.validateParam(paramBranchValue, index, this.verbose))
    }

    const validParams = new Set(this.paramValidations.filter(p => p.valid === true).map(p => p.param))
    const requiredParamsMissing = Object.entries(this.options.params).filter(([paramName, paramSettings]) => {
      return paramSettings.required === true && !validParams.has(paramName)
    })

    for (const [paramName, paramSettings] of requiredParamsMissing) {
      this.consoleMessage({
        message: paramSettings.messages.missing,
        param: paramName,
        log: !this.quiet,
      })
    }
    if (requiredParamsMissing.length > 0 || validParams.size !== paramsFromBranch.length) {
      return this.error()
    }
    return this.success()
  }

  consoleMessage ({ message, param = '', paramValue = '', index = -1, expected = [], log = !this.quiet && this.verbose }) {
    const indentation = this.options.indentation.repeat(message.indentations)
    const scopeOutput = chalk[this.options.scopeChalks[message.scope].color][this.options.scopeChalks[message.scope].background](`[${message.scope}]`)
    const messageChalk = message.chalk || this.options.scopeChalks[message.scope]
    const messageOutput = chalk[messageChalk.color][messageChalk.background](this.buildMessage({
      message: message.message,
      param,
      paramValue,
      index,
      expected,
    }))

    const output = `${scopeOutput}\n${indentation}${messageOutput}`

    if (log) {
      console.log(output)
    }
  }

  success ({ messages = [], param = '', paramValue = '' } = {}) {
    if (this.mute) {
      return this.SUCCESS_CODE
    }
    this.consoleMessage({ message: this.options.messages.lintSuccess, param, paramValue })
    for (const message of messages) {
      this.consoleMessage({ message, param, paramValue })
    }
    return this.SUCCESS_CODE
  }

  error ({ messages = [], param = '', paramValue = '' } = {}) {
    if (this.mute) {
      return this.ERROR_CODE
    }
    this.consoleMessage({ message: this.options.messages.lintError, param, paramValue, log: true })
    for (const message of messages) {
      this.consoleMessage({ message, param, paramValue, log: !this.quiet })
    }
    return this.ERROR_CODE
  }

  getCurrentBranch () {
    const branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD']).toString()
    this.branch = branch
    return this.branch.trim()
  }

  buildSuggestions (suggestions) {
    if (!suggestions) {
      return ''
    }

    return Object.entries(suggestions)
      .filter(([foundWord]) => foundWord !== 'regex')
      .map(([foundWord, value]) => `For ${foundWord} => ${value}`)
      .join(', ')
  }

  buildMessage ({ message, param = '', paramValue = '', index = -1, expected = [] }) {
    const paramOptions = this.options.params[param]
    const replacements = {
      '%b': this.branch,
      '%bb': this.options.banned.join(', '),
      '%bd': this.options.disallowed.join(', '),
      '%bs': this.options.skip.join(', '),
      '%s': this.options.separator,
      '%pn': Object.values(this.options.params).filter(p => p.required === true).length,
      '%prs': param && Object.keys(paramOptions).length > 0 ? `This is valid when the value is for example: ${paramOptions.suggestions.regex?.join(', ')}` : '',
      '%pvs': paramOptions?.suggestions[paramValue] || '',
      '%pv': paramValue,
      '%po': paramOptions?.options?.join(', ') || '',
      '%ps': this.buildSuggestions(paramOptions?.suggestions),
      '%pi': Array.isArray(paramOptions?.position) ? paramOptions.position.map(p => p + 1).join(' || ') : (paramOptions?.position + 1) || '',
      '%pr': paramOptions?.regex || '',
      '%p': param,
      '%i': index !== -1 ? index + 1 : '',
    }

    return message.replace(/%b|%bb|%bd|%bs|%s|%pn|%prs|%pvs|%pv|%po|%ps|%pi|%pr|%p|%i/g, match => replacements[match])
  }
}

export default BranchNameLint
