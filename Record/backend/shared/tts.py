"""Unified Edge TTS helper.

Previously, French, Live-Spanish and Language-Output-LAB each carried their
own (slightly different) copy of "call edge_tts, save to mp3, verify the
file is usable". This module collapses that into a single function.

Generated files are written to a per-sub-app *audio_root* the caller picks,
so each sub-app keeps its own cache layout while the generation logic is
shared.
"""

from __future__ import annotations

import asyncio
from pathlib import Path


def audio_file_is_usable(path: Path | None) -> bool:
    """Edge TTS returns the occasional empty/short MP3; reject those."""
    return bool(path and path.exists() and path.is_file() and path.stat().st_size > 1024)


async def _generate(text: str, voice: str, output_path: Path) -> None:
    try:
        import edge_tts
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "edge-tts is not installed. Run `pip install -r backend/requirements.txt`."
        ) from exc

    output_path.parent.mkdir(parents=True, exist_ok=True)
    communicate = edge_tts.Communicate(text, voice=voice)
    await communicate.save(str(output_path))


def generate_audio(text: str, voice: str, output_path: Path) -> Path:
    """Generate *text* with *voice* into *output_path*.

    Raises RuntimeError if the resulting file is missing or unusable.
    """
    asyncio.run(_generate(text, voice, output_path))
    if not audio_file_is_usable(output_path):
        output_path.unlink(missing_ok=True)
        raise RuntimeError("Edge TTS returned an empty or unreadable MP3 file.")
    return output_path
