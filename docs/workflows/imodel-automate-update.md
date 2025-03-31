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
itp itwin create --class Thing --sub-class Asset --name "New Infrastructure Project" 
```

**Step 2: Create an iModel**
```bash
itp imodel create --itwin-id your-itwin-id --name "Building Design" --description "iModel for design updates"
```

**Step 3: Populate the iModel with initial design data**
```bash
itp imodel populate --imodel-id your-imodel-id --file initial-design.dwg --connector-type DWG
```

**Step 4: Monitor file system events**

#### Linux/MacOS Solution (Bash)

```bash
#!/bin/bash

# Define variables
WATCH_DIR="/path/to/design/files"
IMODEL_ID="your-imodel-id"

EXTENSIONS="*.dgn *.dwg *.i.dgn *.otxml *.3ds *.dxf *.nwd *.nwc *.rvt *.3dm *.skp *.sat *.geodb *.dae *.hln *.fbx *.geojson *.ifc *.igs *.jt *.kml *.land.xml *.obj *.x_t *.shp *.stp *.stl *.vue"

ITP_PATH=$(command -v itp)
if [ -z "$ITP_PATH" ]; then
  echo "❌ ERROR: 'itp' CLI not found! Make sure it's installed and in your PATH."
  exit 1
fi

echo "💻 Watching directory: $WATCH_DIR 💻"

HASH_FILE="/tmp/file_hashes.txt"
TEMP_MODIFIED="/tmp/modified_files.txt"
touch "$HASH_FILE"
touch "$TEMP_MODIFIED"

compute_hash() {
  sha256sum "$1" | cut -d ' ' -f 1
}

encode_path() {
  printf "%s" "$1" | base64
}

decode_path() {
  printf "%s" "$1" | base64 --decode
}

# 🛠️ Initial hash baseline
echo "📌 Establishing initial file hashes..."
> "$HASH_FILE"
for ext in $EXTENSIONS; do
  find "$WATCH_DIR" -type f -name "$ext" 2>/dev/null | while read -r file; do
    [ -f "$file" ] || continue
    hash=$(compute_hash "$file")
    encoded=$(encode_path "$file")
    echo "$encoded|$hash" >> "$HASH_FILE"
  done
done
echo "✅ Baseline established. Monitoring for changes..."

while true; do
  > "$TEMP_MODIFIED"

  for ext in $EXTENSIONS; do
    find "$WATCH_DIR" -type f -name "$ext" 2>/dev/null | while read -r file; do
      [ -f "$file" ] || continue
      current_hash=$(compute_hash "$file")
      encoded=$(encode_path "$file")
      previous_hash=$(grep "^$encoded|" "$HASH_FILE" | cut -d '|' -f 2)

      if [ -z "$previous_hash" ]; then
        echo "🆕 New file detected: $file"
        echo "$file" >> "$TEMP_MODIFIED"
      elif [ "$current_hash" != "$previous_hash" ]; then
        echo "🛠️ Modified file detected: $file"
        echo "$file" >> "$TEMP_MODIFIED"
      fi
    done
  done

  if [ -s "$TEMP_MODIFIED" ]; then
    echo "⏳ Waiting 1 second for additional changes..."
    sleep 1

    # Update hashes for modified files
    while read -r file; do
      current_hash=$(compute_hash "$file")
      encoded=$(encode_path "$file")
      grep -v "^$encoded|" "$HASH_FILE" > "$HASH_FILE.tmp" && mv "$HASH_FILE.tmp" "$HASH_FILE"
      echo "$encoded|$current_hash" >> "$HASH_FILE"
      echo "🔄 Updated hash for: $file"
    done < "$TEMP_MODIFIED"

    # 🚀 Run populate with individual -f flags for each file
    cmd="$ITP_PATH imodel populate -m \"$IMODEL_ID\""
    while read -r file; do
      cmd="$cmd -f \"$file\""
    done < "$TEMP_MODIFIED"

    echo "🚀 Running: $cmd"
    eval "$cmd"
    exit_code=$?

    if [ "$exit_code" -eq 0 ]; then
      echo "✅ iModel update successful"
    else
      echo "❌ ERROR: iModel update failed! Exit code: $exit_code"
    fi
  fi

  sleep 2
done
```

#### Windows Solution (PowerShell)

```powershell
# Define variables
$WATCH_DIR = "/path/to/design/files"
$IMODEL_ID = "your-imodel-id"

# Supported file extensions
$EXTENSIONS = @("*.dgn", "*.dwg", "*.i.dgn", "*.otxml", "*.3ds", "*.dxf", "*.nwd", "*.nwc", "*.rvt", "*.3dm", "*.skp", "*.sat", "*.geodb", "*.dae", "*.hln", "*.fbx", "*.geojson", "*.ifc", "*.igs", "*.jt", "*.kml", "*.land.xml", "*.obj", "*.x_t", "*.shp", "*.stp", "*.stl", "*.vue")

# Auto-detect iTwin CLI path
$ITP_PATH = Get-Command itp | Select-Object -ExpandProperty Source

if (-not $ITP_PATH) {
    Write-Host "❌ ERROR: 'itp' CLI not found! Make sure it's installed and added to your system's PATH."
    exit 1
}

Write-Host "💻 Watching directory: $WATCH_DIR 💻"

# Dictionary to store previous file hashes
$FileHashes = @{}

# Function to compute file hash
function Get-FileHashValue($FilePath) {
    return (Get-FileHash -Path $FilePath -Algorithm SHA256).Hash
}

# 🛠️ Establish baseline hashes
Write-Host "📌 Establishing initial file hashes..."
foreach ($ext in $EXTENSIONS) {
    Get-ChildItem -Path $WATCH_DIR -Filter $ext | ForEach-Object {
        $FileHashes[$_.FullName] = Get-FileHashValue $_.FullName
    }
}
Write-Host "✅ Baseline established. Monitoring for changes..."

while ($true) {
    $modifiedFiles = @()

    foreach ($ext in $EXTENSIONS) {
        Get-ChildItem -Path $WATCH_DIR -Filter $ext | ForEach-Object {
            $filePath = $_.FullName
            $currentHash = Get-FileHashValue $filePath

            if (-not $FileHashes.ContainsKey($filePath) -or $FileHashes[$filePath] -ne $currentHash) {
                Write-Host "🛠️ Detected new/modified file: $filePath"
                $modifiedFiles += $filePath
            }
        }
    }

    if ($modifiedFiles.Count -gt 0) {
        Write-Host "⏳ Waiting 1 second for additional changes..."
        Start-Sleep -Seconds 1

        # Capture additional changes
        foreach ($ext in $EXTENSIONS) {
            Get-ChildItem -Path $WATCH_DIR -Filter $ext | ForEach-Object {
                $filePath = $_.FullName
                $currentHash = Get-FileHashValue $filePath

                if (-not $FileHashes.ContainsKey($filePath) -or $FileHashes[$filePath] -ne $currentHash) {
                    Write-Host "🛠️ Additional change detected: $filePath"
                    $modifiedFiles += $filePath
                }
            }
        }

        # ✅ Update hashes BEFORE calling populate
        foreach ($file in $modifiedFiles) {
            $FileHashes[$file] = Get-FileHashValue $file
        }

        # 🚀 Construct the populate command with individual -f flags
        $populateArgs = @(
            "imodel",
            "populate",
            "-m",
            "`"$IMODEL_ID`""
        )
        
        # Add each file with its own -f flag
        foreach ($file in $modifiedFiles) {
            $populateArgs += "-f"
            $populateArgs += "`"$file`""
        }

        $populateCommand = $populateArgs -join " "

        Write-Host "🚀 Running: $ITP_PATH $populateCommand"

        # Start the process and capture exit code
        $process = Start-Process -FilePath $ITP_PATH -ArgumentList $populateArgs -NoNewWindow -PassThru -Wait
        $exitCode = $process.ExitCode

        if ($exitCode -eq 0) {
            Write-Host "✅ iModel update successful for: $($modifiedFiles -join ', ')"
        } else {
            Write-Host "❌ ERROR: iModel update failed! Exit code: $exitCode"
        }
    }

    Start-Sleep -Seconds 2  # Prevent excessive CPU usage
}
```

## Expected Outcome

By following these steps, you will have a script that listens for file changes in a specific directory and automatically updates the iModel with the latest design files whenever changes are detected.

## Next Steps

- **Extend Monitoring**: You can expand the monitoring process to cover multiple directories or different types of design files as your project evolves.
