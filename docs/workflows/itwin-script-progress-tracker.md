# Track iTwin project progress

## Scenario

As a user, I want to monitor key aspects of my iTwin at a glance. This includes tracking repositories, iModels, connections, synchronized files, user roles, and named versions in an iModel.

## Steps

1. **List repositories**: Track the repositories associated with the iTwin.
2. **List iModels**: Track all iModels within the iTwin.
3. **List connections and synchronized files**: Loop through all iModel connections and get the associated files for each connection.
4. **List named versions**: Monitor named versions to understand the history and progress of design updates.
5. **List user information**: Get all users, groups, and owners for the iTwin.

## Commands Used

- `itp itwin repository list`  
  Lists all repositories in the iTwin.

- `itp imodel list`  
  Lists all iModels associated with the iTwin.

- `itp imodel connection list`  
  Lists all connections for each iModel.

- `itp imodel connection sourcefile list`  
  Lists all source files in a connection.

- `itp imodel connection sourcefile info`  
  Retrieves information about a specific file.

- `itp imodel named-version list`  
  Lists all named versions for an iModel.

- `itp access-control member user list`  
  Lists all users in the iTwin.

- `itp access-control member group list`  
  Lists all groups in the iTwin.

- `itp access-control member owner list`  
  Lists all owners in the iTwin.

## Script

This script requires the `jq` command-line tool to process JSON responses. Make sure it is installed on your system.

  - **Linux**:
  ```
  sudo apt-get install jq  # For Debian/Ubuntu-based systems
  ```
  - **macOS** (via Homebrew):
  ```
  brew install jq
  ```
  - **Windows**: Download the jq executable from the official jq GitHub releases or install via Chocolatey with:
  ```
  choco install jq
  ```

#### Linux/MacOS Solution

```bash
#!/bin/bash

# iTwin ID
ITWIN_ID="your-itwin-id"

# List all repositories in the iTwin
echo "Listing Repositories:"
itp itwin repository list --itwin-id $ITWIN_ID --json | jq .

# List all iModels in the iTwin
echo "Listing iModels:"
itp imodel list --itwin-id $ITWIN_ID --json | jq .

# For each iModel, perform additional tracking
IMODELS=$(itp imodel list --itwin-id $ITWIN_ID --json | jq -r '.[].id')
for IMODEL_ID in $IMODELS; do
  echo "Tracking progress for iModel ID: $IMODEL_ID"
  
  # List all connections in the iModel
  echo "Listing Connections:"
  itp imodel connection list --imodel-id $IMODEL_ID --json | jq .
  
  # Loop through all connections and list files for each connection
  echo "Listing Files for Each Connection:"
  CONNECTIONS=$(itp imodel connection list --imodel-id $IMODEL_ID --json | jq -r '.connections[].id')
  for CONNECTION_ID in $CONNECTIONS; do
    echo "Files for Connection ID: $CONNECTION_ID"
    
    # Get the source files in this connection
    RESPONSE=$(itp imodel connection sourcefile list --connection-id $CONNECTION_ID --json)
    
    # Check if there are files in the response
    if [ "$(echo "$RESPONSE" | jq 'length')" -eq 0 ]; then
      echo "No files found for Connection ID: $CONNECTION_ID"
    else
      # Loop through each file and extract the relevant information
      echo "$RESPONSE" | jq -r '.[] | "\(.lastKnownFileName) (ID: \(.id))"'
    fi
  done

  # List all named versions in the iModel
  echo "Listing Named Versions:"
  itp imodel named-version list --imodel-id $IMODEL_ID --json | jq .
done

# List all users in the iTwin
echo "Listing Users:"
itp access-control member user list --itwin-id $ITWIN_ID --json | jq .

# List all groups in the iTwin
echo "Listing Groups:"
itp access-control member group list --itwin-id $ITWIN_ID --json | jq .

# List all owners in the iTwin
echo "Listing Owners:"
itp access-control member owner list --itwin-id $ITWIN_ID --json | jq .
```

#### Windows Solution

```ps1
# Using PowerShell

# iTwin
$ITWIN_ID="your-itwin-id"

# List all repositories in the iTwin
Write-Output "Listing Repositories:"
$repositories = itp itwin repository list --itwin-id $ITWIN_ID --json | ConvertFrom-Json
if ($repositories) {
    $repositories | ConvertTo-Json -Depth 10 | Write-Output
} else {
    Write-Output "No repositories found."
}

# List all iModels in the iTwin
Write-Output "Listing iModels:"
$imodelsJson = itp imodel list --itwin-id $ITWIN_ID --json
$imodels = $imodelsJson | ConvertFrom-Json

if ($imodels) {
    Write-Output "Full JSON Response:"
    $imodelsJson | Write-Output  # Print raw JSON output
   
    $IMODEL_IDS = $imodels.id
} else {
    Write-Output "No iModels found."
    exit
}

# Process each iModel
foreach ($IMODEL_ID in $IMODEL_IDS) {
    Write-Output "Tracking progress for iModel ID: $IMODEL_ID"

    # List all connections in the iModel
    Write-Output "Listing Connections:"
    $connectionsJson = itp imodel connection list --imodel-id $IMODEL_ID --json
    $connectionsResponse = $connectionsJson | ConvertFrom-Json

    if ($connectionsResponse -and $connectionsResponse.connections) {
        Write-Output "Full JSON Response:"
        $connectionsJson | Write-Output  # Print raw JSON output
    } else {
        Write-Output "No connections found for iModel ID: $IMODEL_ID"
        continue
    }

    # Loop through connections and list files
    foreach ($CONNECTION in $connectionsResponse.connections) {
        $CONNECTION_ID = $CONNECTION.id
        Write-Output "Files for Connection ID: $CONNECTION_ID"

        # List files in this connection
        $filesJson = itp imodel connection sourcefile list --connection-id $CONNECTION_ID --json
        $files = $filesJson | ConvertFrom-Json

        if ($files -and $files.Count -gt 0) {
            Write-Output "Full JSON Response:"
            $filesJson | Write-Output  # Print raw JSON output
        } else {
            Write-Output "No files found for Connection ID: $CONNECTION_ID"
        }
    }

    # List named versions in the iModel
    Write-Output "Listing Named Versions:"
    $namedVersionsJson = itp imodel named-version list --imodel-id $IMODEL_ID --json
    $namedVersions = $namedVersionsJson | ConvertFrom-Json

    if ($namedVersions) {
        Write-Output "Full JSON Response:"
        $namedVersionsJson | Write-Output  # Print raw JSON output
    } else {
        Write-Output "No named versions found for iModel ID: $IMODEL_ID"
    }
}

# List all users in the iTwin
Write-Output "Listing Users:"
$usersJson = itp access-control member user list --itwin-id $ITWIN_ID --json
$users = $usersJson | ConvertFrom-Json
if ($users) {
    Write-Output "Full JSON Response:"
    $usersJson | Write-Output  # Print raw JSON output
} else {
    Write-Output "No users found."
}

# List all groups in the iTwin
Write-Output "Listing Groups:"
$groupsJson = itp access-control member group list --itwin-id $ITWIN_ID --json
$groups = $groupsJson | ConvertFrom-Json
if ($groups) {
    Write-Output "Full JSON Response:"
    $groupsJson | Write-Output  # Print raw JSON output
} else {
    Write-Output "No groups found."
}

# List all owners in the iTwin
Write-Output "Listing Owners:"
$ownersJson = itp access-control member owner list --itwin-id $ITWIN_ID --json
$owners = $ownersJson | ConvertFrom-Json
if ($owners) {
    Write-Output "Full JSON Response:"
    $ownersJson | Write-Output  # Print raw JSON output
} else {
    Write-Output "No owners found."
}
```

## Expected Outcome

This script will give you a full snapshot of your project's current state, including:

- A complete list of repositories and iModels.
- Detailed information on all connections and synchronized files.
- A list of all the named versions for the iModels.
- All users, groups, and owners involved in the iTwin.

## Next Steps

- **Logging**: Store the output in a log file for record-keeping and auditing.
- **Alerts**: Set up notifications when certain conditions are met, like when there are no new changesets or files in a given week.
- **Dashboard Integration**: Integrate the output with a dashboard to provide real-time project tracking.
