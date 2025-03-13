# Automate iModel updates with latest design

## Scenario

As a user, I want to automatically update an iModel with the latest design files whenever I save design data on my local file system. The script will monitor the directory for file changes and trigger the update process in real time.

## Steps

1. **Create an iTwin and iModel**: Set up an iTwin and iModel for managing design data.
2. **Store directory and file(s) as constants**: Define the directory and files that will be monitored for changes.
3. **Populate the iModel**: Synchronize the initial design files into the iModel.
4. **Listen to file system events**: Use native or external libraries to monitor the directory for file updates.
5. **Trigger script on file changes**: When a design file is updated, execute the iModel update script.

## Commands Used

- `itp itwin create`  
  Creates a new iTwin.

- `itp imodel create`  
  Creates a new iModel within the iTwin.

- `itp imodel populate`  
  Synchronizes design files into the iModel.

## Example

**Step 1: Create an iTwin**
```bash
itp itwin create --class "Thing" --sub-class "Asset" --display-name "New Infrastructure Project" 
```

**Step 2: Create an iModel**
```bash
itp imodel create --itwin-id "your-itwin-id" --name "Building Design" --description "iModel for design updates"
```

**Step 3: Populate the iModel with initial design data**
```bash
itp imodel populate --id "your-imodel-id" --file "initial-design.dwg" --connector-type "DWG"
```

**Step 4: Monitor file system events**

#### Linux/MacOS Solution (using `inotifywait`)

1. Install `inotify-tools` if you don't have it:

   - **Linux**:
     ```bash
     sudo apt-get install inotify-tools
     ```

   - **macOS** (via Homebrew):
     ```bash
     brew install inotify-tools
     ```

2. Set up the script to watch the directory for file changes:

```bash
#!/bin/bash

WATCH_DIR="/path/to/design/files"
IMODEL_ID="your-imodel-id"

# Monitor directory for both modify and delete events
inotifywait -m -e modify -e delete "$WATCH_DIR" |
while read -r directory events filename; do
  if [[ "$events" == *"DELETE"* ]]; then
    echo "File $filename deleted, skipping iModel update."
  else
    echo "Detected change in $filename, updating iModel..."
    itp imodel populate --id "$IMODEL_ID" --file "$WATCH_DIR/$filename"
  fi
done
```

#### Windows Solution (using PowerShell)

```powershell
# Define variables
$watchDir = "C:\path\to\design\files"
$iModelId = "your-imodel-id"

# Create FileSystemWatcher
$watcher = New-Object IO.FileSystemWatcher $watchDir
$watcher.EnableRaisingEvents = $true

# Define the action when a change is detected
$action = {
    $file = $Event.SourceEventArgs.FullPath
    $eventType = $Event.SourceEventArgs.ChangeType
    if ($eventType -eq "Deleted") {
        Write-Host "File $file deleted, skipping iModel update."
    } else {
        Write-Host "Detected change in $file, updating iModel..."
        itp imodel populate --id $iModelId --file $file
    }
}

# Register event handlers
Register-ObjectEvent $watcher 'Changed' -Action $action
Register-ObjectEvent $watcher 'Deleted' -Action $action

# Keep the script running
while ($true) { Start-Sleep 1 }
```

## Expected Outcome

By following these steps, you will have a script that listens for file changes in a specific directory and automatically updates the iModel with the latest design files whenever changes are detected.

## Next Steps

- **Extend Monitoring**: You can expand the monitoring process to cover multiple directories or different types of design files as your project evolves.
