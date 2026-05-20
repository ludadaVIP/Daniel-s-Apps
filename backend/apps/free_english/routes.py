"""Free English blueprint.

Mounted at ``/api/free-english`` in the unified backend.
Data lives in ``backend/data/FreeEnglish/``.
"""

from __future__ import annotations

import os
from pathlib import Path

from apps.shared.free_language import create_free_language_blueprint

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "FreeEnglish"
DATA_DIR = Path(os.environ.get("FREE_ENGLISH_DATA_DIR", DEFAULT_DATA_DIR))

bp, AUDIO_DIR = create_free_language_blueprint(
    blueprint_name="free_english",
    data_dir=DATA_DIR,
    audio_slug="free-english",
    default_language="en",
    cache_namespace="free-english-v1",
)
