import { logoutFromCLI, serviceLoginToCli } from "./helpers";

export async function mochaGlobalSetup() {
    await logoutFromCLI();
    await serviceLoginToCli();
    console.log("\n\nRunning tests with service client")
}