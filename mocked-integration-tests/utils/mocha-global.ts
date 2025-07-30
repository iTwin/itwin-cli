import { setupMockEnvironment } from "./environment";
import { deleteMockToken, writeMockToken } from "./helpers";

before(async () => {
  writeMockToken();
  setupMockEnvironment();
});

after(async () => {
  deleteMockToken();
});
