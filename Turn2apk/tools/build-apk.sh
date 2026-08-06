#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <flutter-app-directory>" >&2
  exit 1
fi

app_dir="$1"
if [[ ! -f "$app_dir/pubspec.yaml" ]]; then
  echo "Flutter app not found: $app_dir" >&2
  exit 1
fi

app_name="$(basename "$app_dir")"
(
  cd "$app_dir"
  flutter pub get
  flutter build apk --release
  mkdir -p dist
  cp build/app/outputs/flutter-apk/app-release.apk "dist/${app_name}-release.apk"
)

echo "APK created: ${app_dir}/dist/${app_name}-release.apk"
