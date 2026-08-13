# Flutter APK Workspace

This directory is a workspace for independently deployable Flutter Android apps.
The child app folders and build workflow will continue to work unchanged.

## Layout

- `tools/build-apk.sh`: reusable release APK build script.
- `tools/build-apk.ps1`: Windows PowerShell release APK build script.
- `spanish_900_apk/`: the offline Spanish 900 product.

Each future app should live in its own child directory with its own
`pubspec.yaml`, `lib/`, `assets/`, `android/`, and `test/` directories.

## Build an APK

From this workspace directory:

```bash
./tools/build-apk.sh recall_bible_apk
```

The release APK will be written to `<app>/dist/<app>-release.apk`. The `dist/`
folder is intentionally ignored by Git; commit the source code and publish APKs
as GitHub Releases when sharing installable files.

On Windows, use:

```powershell
.\tools\build-apk.ps1 spanish_900_apk
```
