Set-Location "$PSScriptRoot/../.."

npx mocha --forbid-only integration-tests/main-cases/service-client-serial.test.ts
npx mocha --forbid-only --parallel integration-tests/main-cases/service-client-parallel/*.test.ts