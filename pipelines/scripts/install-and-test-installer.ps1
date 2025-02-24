param (
    [string][Parameter(Mandatory=$true)]$filepath,
    [string][Parameter(Mandatory=$true)]$installLocation
)

$arguments = "/S /D=$installLocation"
Start-Process $filepath $arguments -NoNewWindow -Wait

## Refresh PATH variable
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

$version = & itp --version
if ($version -like "itp/* win32-x64 node-v20.16.0") {
    Write-Output "Version check passed: $version"
} else {
    Write-Error "Unexpected version: $version"
    Exit 1
}

$help = & itp itwin --help
if ($help -like "Create an iTwin*") {
    Write-Output "Help output check passed"
} else {
    Write-Error "Unexpected help output: $help"
    Exit 1
}