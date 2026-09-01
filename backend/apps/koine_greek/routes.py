"""Koine Greek blueprint, mounted at ``/api/koine-greek``."""

from __future__ import annotations

import os
from pathlib import Path

from apps.shared.free_language import create_free_language_blueprint

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "KoineGreek"
DATA_DIR = Path(os.environ.get("KOINE_GREEK_DATA_DIR", DEFAULT_DATA_DIR))

bp, AUDIO_DIR = create_free_language_blueprint(
    blueprint_name="koine_greek",
    data_dir=DATA_DIR,
    audio_slug="koine-greek",
    default_language="el",
    cache_namespace="koine-greek-v1",
)
