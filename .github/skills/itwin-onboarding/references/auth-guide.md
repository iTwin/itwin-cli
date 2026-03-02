# Authentication Guide

The iTwin CLI supports two authentication flows. Choose based on the environment.

## Decision Guide

- **Is a human present at a desktop?** → Interactive login (default)
- **Is this CI, automation, or a headless AI agent?** → Service credentials
- **Already logged in?** → Verify with `itp auth info --json` and skip

## Interactive Login (Browser)

Default flow. Opens a browser to Bentley IMS, user signs in, callback completes on `localhost:3301`.

```bash
itp auth login
```

- Requires a human to complete the browser sign-in
- Token cached at `~/Library/Caches/itp/token.json` (macOS) or equivalent
- Token does **not** auto-refresh on expiry — re-run `itp auth login`
- Uses built-in client ID by default — zero configuration needed

To use a custom native client ID:
```bash
itp auth login --client-id <your-native-client-id>
```
Or set env var `ITP_NATIVE_CLIENT_ID`.

## Service Login (Headless)

Client credentials flow. No browser needed. Ideal for CI, scripts, and AI agents.

**Option A — env vars (recommended for persistent environments):**
```bash
export ITP_SERVICE_CLIENT_ID="service-xxxxx"
export ITP_SERVICE_CLIENT_SECRET="your-secret"
itp auth login --json
```

**Option B — flags (one-off):**
```bash
itp auth login --client-id service-xxxxx --client-secret your-secret --json
```

- No browser interaction required
- Token auto-refreshes when env vars are set and token expires
- If env vars are not set when the token expires, you'll get an error prompting re-login or env var setup

**Getting service credentials:** Register an application at the [iTwin Developer Portal](https://developer.bentley.com/register/) with the `itwin-platform` scope and client credentials grant type.

## Checking Auth Status

```bash
itp auth info --json
```

**Authenticated** — response includes `authorizationType`, `clientId`, and `expirationDate`:
```json
{
  "apiUrl": "https://api.bentley.com",
  "authorizationType": "Interactive",
  "clientId": "native-abc123",
  "expirationDate": "2026-02-24T12:00:00.000Z",
  "issuerUrl": "https://ims.bentley.com/"
}
```

**Not authenticated** — response has only `apiUrl` and `issuerUrl`:
```json
{
  "apiUrl": "https://api.bentley.com",
  "issuerUrl": "https://ims.bentley.com/"
}
```

**Rule**: If the response lacks `authorizationType`, the user is not logged in. If `expirationDate` is in the past, the token is expired.

## Token Expiration Behavior

| Auth Type | What happens on expiry |
|-----------|----------------------|
| Interactive | Error: "Please run `itp auth login` to re-authenticate." Must re-login manually. |
| Service (env vars set) | Auto-refreshes silently using cached credentials. No action needed. |
| Service (env vars not set) | Error with instructions to re-login or set `ITP_SERVICE_CLIENT_ID` + `ITP_SERVICE_CLIENT_SECRET`. |

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `ITP_SERVICE_CLIENT_ID` | Service client ID → enables headless auth |
| `ITP_SERVICE_CLIENT_SECRET` | Service client secret (required with service client ID) |
| `ITP_NATIVE_CLIENT_ID` | Override the default native client ID for interactive login |
| `ITP_ISSUER_URL` | Override Bentley IMS URL (default: `https://ims.bentley.com/`) |
| `ITP_API_URL` | Override API base URL (default: `https://api.bentley.com`) |

## AI Agent Strategy

When an AI agent needs to authenticate:

1. Run `itp --version` to verify the CLI is installed and version is `1.0.0` or later. If the command fails or the version is outdated, run the automated install script from `getting-started.md` Step 0 (detects OS and architecture, downloads latest `.pkg`/`.deb`/`.exe` from GitHub Releases).
2. Run `itp auth info --json` to check current state.
3. If authenticated and token is valid → proceed.
4. If not authenticated, check if `ITP_SERVICE_CLIENT_ID` and `ITP_SERVICE_CLIENT_SECRET` are set in the environment.
   - **Yes** → run `itp auth login --json` (service flow, fully automatic).
   - **No** → ask the user: "You're not authenticated. Do you have service credentials (client ID + secret) for headless auth, or would you prefer to sign in through your browser?"
     - Service creds provided → set env vars and run `itp auth login --json`.
     - Browser preferred → run `itp auth login` and wait for the user to complete sign-in.
5. After login, verify with `itp auth info --json` before proceeding.

## Logout

```bash
itp auth logout
```

Clears the cached token. For Interactive sessions, also signs out of the browser session.
