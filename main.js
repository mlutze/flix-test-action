const core = require('@actions/core');
const github = require('@actions/github');
const http = require('http');
const util = require('util');
const child_process = require('child_process');

const nightly_format = 'https://flix.dev/nightly/flix-%s.jar'
const release_format = 'https://github.com/flix/flix/releases/download/%s/flix.jar'

function handle(f) {
  try {
    f();
  } catch (error) {
    core.setFailed(error.message);
  }
}

function getReleaseJar(versionString) {
  let url = util.format(release_format, versionString);
  return http.request(url);
}

function getNightlyJar(dateString) {
  let url = util.format(nightly_format, dateString);
  return http.request(url);
}

function getJar() {
  let version_type = core.getInput('version-type');
  if (version_type === 'nightly') {
    return getNightlyJar(core.getInput('nightly-date'))
  } else if (version_type === 'release') {
    return getReleaseJar(core.getInput('release-tag'))
  } else {
    throw Error("Illegal version type.")
  }
}

function log_process(ps) {
  ps.stdout.on("data", data => {
      console.log(`stdout: ${data}`);
  });

  ps.stderr.on("data", data => {
      console.log(`stderr: ${data}`);
  });

  ps.on('error', (error) => {
      console.log(`error: ${error.message}`);
  });
}

function runTests() {
  let test_ps = child_process.spawn('java' ['-jar', 'flix.jar', '--test', '*.flix']);
  log_process(test_ps);

  
  test_ps.on("close", code => {
    if (code !== 0) {
      throw Error("Tests failed.")
    }
  });
}

function main() {
  let jar = getJar();
  jar.on('finish', runTests)
}

handle(main)