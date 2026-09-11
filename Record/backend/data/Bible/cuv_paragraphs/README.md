# CUV New Testament paragraph map

Each JSON file in this directory maps one New Testament book. `chapters` is
keyed by chapter number, and each chapter contains ordered paragraph ranges:

```json
"4": [
  {"start": 1, "end": 16},
  {"start": 17, "end": 24},
  {"start": 25, "end": 32}
]
```

The ranges were derived from the `\\p` paragraph markers in eBible's public-
domain Chinese Union New Punctuation USFM (`cmn-cu89t`). Verse text itself is
always read from the app's existing `cuv_data` files, so this directory stores
only the paragraph boundaries. The map is currently used for the CUV
`Paragraph 1st` practice mode.

Source: https://ebible.org/bible/details.php?all=1&id=cmn-cu89t
