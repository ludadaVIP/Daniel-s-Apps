"""Free Spanish blueprint.

Mounted at ``/api/free-spanish`` in the unified backend.
Data lives in ``backend/data/FreeSpanish/``.
"""

from __future__ import annotations

import os
from pathlib import Path

from apps.shared.free_language import create_free_language_blueprint

DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "FreeSpanish"
DATA_DIR = Path(os.environ.get("FREE_SPANISH_DATA_DIR", DEFAULT_DATA_DIR))

bp, AUDIO_DIR = create_free_language_blueprint(
    blueprint_name="free_spanish",
    data_dir=DATA_DIR,
    audio_slug="free-spanish",
    default_language="es",
    cache_namespace="free-spanish-v1",
)
