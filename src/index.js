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

    await exec.exec('pip install scopeagent==0.3.7', null, process.env)
    await exec.exec('pip install pyyaml', null, process.env)

    const result = await exec.exec('scope-run -v')
    console.log('Scope run version', result)

    await ExecScopeRun(`scope-run -D ${command}`, apiEndpoint, apiKey, dsn)

    throw Error('can call it again')
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
      SCOPE_INSTRUMENTATION_HTTP_PAYLOADS: false,
    },
  })
}

run()
