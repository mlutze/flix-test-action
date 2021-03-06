const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');
const util = require('util');
const child_process = require('child_process');
const fs = require('fs');

const nightly_format = 'https://flix.dev/nightly/flix-%s.jar'
const release_format = 'https://github.com/flix/flix/releases/download/%s/flix.jar'

function handle(f) {
  try {
    f();
  } catch (error) {
    core.setFailed(error.message);
  }
}

function downloadToFile(remote, local, cb) {
  console.log(`Downloading ${remote} to ${local}`)
  let file = fs.createWriteStream(local);
  return https.get(remote, response => { 
    response.pipe(file);
    file.on('finish', () => file.close(cb));
  });
}

function getReleaseJar(versionString, cb) {
  let url = util.format(release_format, versionString);
  return downloadToFile(url, "flix.jar", cb)
}

function getNightlyJar(dateString, cb) {
  let url = util.format(nightly_format, dateString);
  return downloadToFile(url, "flix.jar", cb)
}

function getJar(cb) {
  let version_type = core.getInput('version-type');
  if (version_type === 'nightly') {
    return getNightlyJar(core.getInput('nightly-date'), cb)
  } else if (version_type === 'release') {
    return getReleaseJar(core.getInput('release-tag'), cb)
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
  let test_ps = child_process.spawn('java', ['-jar', 'flix.jar', '--test', '*.flix'], { shell: true });
  log_process(test_ps);

  
  test_ps.on("close", code => {
    if (code !== 0) {
      throw Error("Tests failed.")
    }
  });
}

function main() {
  getJar(runTests);
}

handle(main)