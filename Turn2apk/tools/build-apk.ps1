param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$AppDirectory
)

$ErrorActionPreference = 'Stop'
$workspaceRoot = Split-Path -Parent $PSScriptRoot
$appPath = Join-Path $workspaceRoot $AppDirectory
$pubspec = Join-Path $appPath 'pubspec.yaml'

if (-not (Test-Path $pubspec)) {
  throw "Flutter app not found: $AppDirectory"
}

Push-Location $appPath
try {
  flutter pub get
  flutter build apk --release
  $dist = Join-Path $appPath 'dist'
  New-Item -ItemType Directory -Force -Path $dist | Out-Null
  Copy-Item 'build\app\outputs\flutter-apk\app-release.apk' (Join-Path $dist "$AppDirectory-release.apk") -Force
  Write-Host "APK created: $AppDirectory\dist\$AppDirectory-release.apk"
} finally {
  Pop-Location
}
