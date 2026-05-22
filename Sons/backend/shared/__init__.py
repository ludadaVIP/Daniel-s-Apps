"""Shared utilities for all merged sub-applications.

These modules concentrate the logic that was previously duplicated across
French, Live-Spanish, Language-Output-LAB, and Quiz for Jason. Sub-apps
should import from here rather than re-implementing TTS, JSON I/O, or
voice configuration.
"""
