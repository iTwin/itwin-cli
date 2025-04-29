Set-Location "$PSScriptRoot/../.."

npx mocha --forbid-only integration-tests/main-cases/service-client-serial.test.ts
npx mocha --forbid-only --parallel --jobs 4 integration-tests/main-cases/service-client-parallel/*.test.ts