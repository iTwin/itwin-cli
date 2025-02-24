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

# iTwin and iModel IDs
ITWIN_ID="cea7a915-7b36-4ceb-aaf1-19529821b329"
IMODEL_ID="5c5d9d4c-1d17-466b-bebb-9db773ab487c"

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

```batch
@echo off

:: iTwin and iModel IDs
set ITWIN_ID=your-itwin-id
set IMODEL_ID="your-imodel-id"

:: List all repositories in the iTwin
echo Listing Repositories:
itp itwin repository list --itwin-id %ITWIN_ID% --json | jq .

:: List all iModels in the iTwin
echo Listing iModels:
for /f "delims=" %%A in ('itp imodel list --itwin-id %ITWIN_ID% --json ^| jq -r ".[].id"') do (
  set IMODEL_ID=%%A
  echo Tracking progress for iModel ID: %IMODEL_ID%
  
  :: List all connections in the iModel
  echo Listing Connections:
  itp imodel connection list --imodel-id %IMODEL_ID% --json | jq .
  
  :: Loop through connections and list files
  for /f "delims=" %%B in ('itp imodel connection list --imodel-id %IMODEL_ID% --json ^| jq -r ".connections[].id"') do (
    set CONNECTION_ID=%%B
    echo Files for Connection ID: %CONNECTION_ID%
    
    :: List files in this connection
    RESPONSE=$(itp imodel connection sourcefile list --connection-id %CONNECTION_ID% --json)
    
    :: Check if there are files in the response
    if not "%RESPONSE%"=="" (
      echo "%RESPONSE%" | jq -r '.[] | "\(.lastKnownFileName) (ID: \(.id))"'
    ) else (
      echo No files found for Connection ID: %CONNECTION_ID%
    )
  )
  
  :: List named versions in the iModel
  echo Listing Named Versions:
  itp imodel named-version list --imodel-id %IMODEL_ID% --json | jq .
)

:: List all users in the iTwin
echo Listing Users:
itp access-control member user list --itwin-id %ITWIN_ID% --json | jq .

:: List all groups in the iTwin
echo Listing Groups:
itp access-control member group list --itwin-id %ITWIN_ID% --json | jq .

:: List all owners in the iTwin
echo Listing Owners:
itp access-control member owner list --itwin-id %ITWIN_ID% --json | jq .
```

## Expected Outcome

This script will give you a full snapshot of your project's current state, including:

- A complete list of repositories and iModels.
- Detailed information on all connections and synchronized files.
- A list of all changesets and named versions for the iModel.
- All users, groups, and owners involved in the iTwin.

## Next Steps

- **Logging**: Store the output in a log file for record-keeping and auditing.
- **Alerts**: Set up notifications when certain conditions are met, like when there are no new changesets or files in a given week.
- **Dashboard Integration**: Integrate the output with a dashboard to provide real-time project tracking.
