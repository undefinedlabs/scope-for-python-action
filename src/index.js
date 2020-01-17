const core = require('@actions/core')
const exec = require('@actions/exec')

const SCOPE_DSN = 'SCOPE_DSN'

const DEFAULT_COMMAND = 'pytest'

async function run() {
  try {
    const command = core.getInput('command') || DEFAULT_COMMAND
    const dsn = core.getInput('dsn') || process.env[SCOPE_DSN]

    if (!dsn) {
      throw Error('Cannot find the Scope DSN')
    }

    let apiEndpoint, apiKey
    try {
      const { username, origin } = new URL(dsn)
      apiEndpoint = origin
      apiKey = username
    } catch (e) {}

    if (!apiEndpoint || !apiKey) {
      throw Error('SCOPE_DSN does not have the correct format')
    }

    console.log(`Command: ${command}`)
    if (dsn) {
      console.log(`DSN has been set.`)
    }

    const result = await exec.exec('pip install scopeagent', null, process.env)
    console.log('Install result', result)

    return ExecScopeRun(`scope-run ${command}`, apiEndpoint, apiKey, dsn)
  } catch (error) {
    core.setFailed(error.message)
  }
}

function ExecScopeRun(command, apiEndpoint, apiKey, dsn) {
  return exec.exec(command, null, {
    env: {
      ...process.env,
      SCOPE_DSN: dsn,
      SCOPE_API_ENDPOINT: apiEndpoint,
      SCOPE_APIKEY: apiKey,
      SCOPE_AUTO_INSTRUMENT: true,
    },
  })
}

run()
