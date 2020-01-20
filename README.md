![logo](scope_logo.svg)

# Scope for Python

GitHub Action to run your tests automatically instrumented with the [Scope Python agent](http://home.undefinedlabs.com/goto/python-agent).

## About Scope

[Scope](https://scope.dev) gives developers production-level visibility on every test for every app – spanning mobile, monoliths, and microservices.

## Usage

1. Set Scope DSN inside Settings > Secrets as `SCOPE_DSN`.
2. Add a step to your GitHub Actions workflow YAML that uses this action:

```yml
steps:
  - uses: actions/checkout@v1
  - uses: actions/setup-python@v1
    with:
      python-version: '3.x'
  - name: Install dependencies
    run: pip install -r requirements.txt
  - name: Scope for Python
    uses: undefinedlabs/scope-for-python-action@v1
    with:
      dsn: ${{secrets.SCOPE_DSN}} # required
      command: pytest # optional - default is 'pytest'
```
