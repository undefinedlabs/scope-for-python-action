const core = require('@actions/core')
const exec = require('@actions/exec')

const SCOPE_DSN = 'SCOPE_DSN'

const DEFAULT_COMMAND = 'python -m unittest discover'

async function run() {
  try {
    const command = core.getInput('command') || DEFAULT_COMMAND
    const dsn = core.getInput('dsn') || process.env[SCOPE_DSN]

    if (!dsn) {
      throw Error('Cannot find the Scope DSN.')
    }

    try {
      new URL(dsn)
    } catch (e) {
      throw Error('SCOPE_DSN does not have the correct format.')
    }

    console.log(`Command: ${command}`)
    if (dsn) {
      console.log(`DSN has been set.`)
    }

    await exec.exec('pip install scopeagent==0.3.11b1', null, process.env)

    await ExecScopeRun(`scope-run ${command}`, dsn)
  } catch (error) {
    core.setFailed(error.message)
  }
}

function ExecScopeRun(command, dsn) {
  return exec.exec(command, null, {
    env: {
      ...process.env,
      SCOPE_DSN: dsn,
    },
  })
}

run()
