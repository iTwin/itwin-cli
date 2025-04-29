Set-Location "$PSScriptRoot/../.."

npx mocha --forbid-only integration-tests/main-cases/native-client-serial.test.ts
npx mocha --forbid-only --parallel --jobs 4 integration-tests/main-cases/native-client-parallel/*.test.ts