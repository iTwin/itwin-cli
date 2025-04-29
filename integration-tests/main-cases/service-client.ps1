Set-Location "$PSScriptRoot/../.."

./node_modules/.bin/mocha.cmd --forbid-only integration-tests/main-cases/service-client-serial.test.ts

./node_modules/.bin/mocha.cmd --forbid-only --parallel integration-tests/main-cases/service-client-parallel/*.test.ts