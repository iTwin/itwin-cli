# itp auth login

Authenticate iTwin CLI with Bentley. This command initiates the login process and obtains the required access tokens. The CLI supports the following authentication workflows:

1. **Native** — interactive user login  
2. **Service** — client credentials for automation/server

## Choosing your workflow

| Workflow | Use Case | Required Flags | Behavior |
|----------|----------|----------------|----------|
| **Native** | Local development, user sessions | None | Prompts browser login |
| **Service** | CI/CD pipelines, headless automation | `--client-id`, `--client-secret` | Uses client credentials flow |

- For details on these auth flows, see the [authentication docs](https://developer.bentley.com/apis/authentication/).  
- You can register your app, and obtain client credentials at [developer.bentley.com/my-apps](https://developer.bentley.com/my-apps/).

## Options

- **`--client-id`**  
  Client ID registered with the iTwin developer portal. Used for both native and service auth workflows.  
  **Type:** `string` &nbsp;&nbsp;**Required:** No

- **`--client-secret`**  
  Secret associated with a service-type client. Only required for service workflow.  
  **Type:** `string` &nbsp;&nbsp;**Required:** No

- **`--env`**  
  iTwin Platform environment to log in to. Overrides the `ITP_ISSUER_URL` and `ITP_API_URL` environment variables. Subsequent commands use the environment of the current login.  
  **Type:** `string` &nbsp;&nbsp;**Required:** No &nbsp;&nbsp;**Valid Values:** `"prod"`, `"qa"`

## Examples

```bash
# Native login (prompts browser login)
itp auth login

# Native login with explicit client id
itp auth login --client-id native-a1254s86d4a5s4d

# Service login using client credentials (headless)
itp auth login --client-id service-a1254s86d4a5s4d --client-secret a456a7s89da46s5f4a6f16a5sdf3as2d1f65a4sdf13

# Native login to the QA environment
itp auth login --env qa
```

## Notes

**Environments**:

- Without `--env`, the CLI logs in to production, unless the `ITP_ISSUER_URL` and `ITP_API_URL` environment variables point elsewhere.
- `--env qa` logs in to `https://qa-ims.bentley.com` and uses `https://qa-api.bentley.com` with the CLI's QA native client.
- A client provided with `--client-id` or the `ITP_NATIVE_CLIENT_ID`, `ITP_SERVICE_CLIENT_ID` and `ITP_SERVICE_CLIENT_SECRET` environment variables must be registered in the selected environment.
- All other commands call the API of the environment used for the current login, so there is no need to repeat `--env` or set `ITP_API_URL`.

**Custom native clients**:

- Native login does not require a `--client-id` by default. 
- You may provide one if you prefer using a custom native client instead of the CLI default.
- You can register a new native client at [developer.bentley.com/my-apps](https://developer.bentley.com/my-apps/). The Redirect URI must be set to `http://localhost:3301/signin-callback`.

**Token expiration:**

- Authentication tokens are cached locally and reused automatically when possible.  
- If your token expires or is invalid, you may be prompted to log in again.