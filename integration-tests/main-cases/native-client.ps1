Set-Location "$PSScriptRoot/../.."

./node_modules/.bin/mocha.cmd --forbid-only integration-tests/main-cases/native-client-serial.test.ts

./node_modules/.bin/mocha.cmd --forbid-only --parallel integration-tests/main-cases/native-client-parallel/*.test.ts