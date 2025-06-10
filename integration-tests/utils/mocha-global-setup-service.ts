import { logoutFromCLI, serviceLoginToCli } from "./helpers";

export async function mochaGlobalSetup() {
  await logoutFromCLI();
  await serviceLoginToCli();

  // eslint-disable-next-line no-console
  console.log("\n\nRunning tests with service client");
}