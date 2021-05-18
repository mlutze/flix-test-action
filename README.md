Github action for running flix tests


### Example configurations
```yml
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    name: Test

    steps:
    - uses: actions/checkout@v2
    - name: Set up JDK 1.11
      uses: actions/setup-java@v1
      with:
        java-version: 1.11
    - uses: mlutze/flix-test-action@v0.2.16
      with:
        version-type: 'nightly'
        nightly-date: '2021-05-16'
```

```yml

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    name: Test

    steps:
    - uses: actions/checkout@v2
    - name: Set up JDK 1.11
      uses: actions/setup-java@v1
      with:
        java-version: 1.11
    - uses: mlutze/flix-test-action@v0.2.16
      with:
        type: 'release'
        release-tag: 'v0.14.5'
```
