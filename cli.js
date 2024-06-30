#!/usr/bin/env node

import { fork } from 'child_process';

process.emitWarning('branch-name-lint will stop using ./cli.js path in the future. Please use npx branch-name-lint');

fork('./bin/branch-name-lint');
