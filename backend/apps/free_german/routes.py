"""Free German blueprint.

Mounted at ``/api/free-german`` in the unified backend.
Data lives in ``backend/data/FreeGerman/``.
"""

from __future__ import annotations

import os
from pathlib import Path

from apps.shared.free_language import create_free_language_blueprint

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "FreeGerman"
DATA_DIR = Path(os.environ.get("FREE_GERMAN_DATA_DIR", DEFAULT_DATA_DIR))

bp, AUDIO_DIR = create_free_language_blueprint(
    blueprint_name="free_german",
    data_dir=DATA_DIR,
    audio_slug="free-german",
    default_language="de",
    cache_namespace="free-german-v1",
)
