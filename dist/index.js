/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 450:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 177:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ }),

/***/ 211:
/***/ ((module) => {

"use strict";
module.exports = require("https");;

/***/ }),

/***/ 669:
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(450);
const github = __nccwpck_require__(177);
const https = __nccwpck_require__(211);
const util = __nccwpck_require__(669);
const child_process = __nccwpck_require__(129);

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
})();

module.exports = __webpack_exports__;
/******/ })()
;