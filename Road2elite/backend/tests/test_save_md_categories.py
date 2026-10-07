"""Regression checks for persistent Save MD category deletion."""

from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from flask import Flask

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))
from apps.save_md import routes  # noqa: E402


class SaveMdCategoryTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.data_dir = Path(self.temporary.name)
        patches = [
            patch.object(routes, "DATA_DIR", self.data_dir),
            patch.object(routes, "CATEGORIES_FILE", self.data_dir / "categories.json"),
            patch.object(routes, "METADATA_FILE", self.data_dir / "metadata.json"),
        ]
        for item in patches:
            item.start()
            self.addCleanup(item.stop)
        app = Flask(__name__)
        app.register_blueprint(routes.bp, url_prefix="/api/save-md")
        app.testing = True
        self.client = app.test_client()

    def test_deleted_default_categories_stay_deleted_after_refresh(self) -> None:
        initial = self.client.get("/api/save-md/library").get_json()
        self.assertIn("english", {category["id"] for category in initial["categories"]})
        for category_id in ("english", "spanish"):
            response = self.client.delete(f"/api/save-md/categories/{category_id}")
            self.assertEqual(response.status_code, 200)
        for _ in range(3):
            library = self.client.get("/api/save-md/library").get_json()
            self.assertFalse({"english", "spanish"} & {item["id"] for item in library["categories"]})
        self.assertFalse((self.data_dir / "english").exists())
        self.assertFalse((self.data_dir / "spanish").exists())
        stored = json.loads((self.data_dir / "categories.json").read_text(encoding="utf-8"))
        self.assertFalse({"english", "spanish"} & {item["id"] for item in stored})

    def test_existing_folder_is_imported_without_seeding_defaults(self) -> None:
        folder = self.data_dir / "notes"
        folder.mkdir()
        (folder / "keep.md").write_text("# Keep", encoding="utf-8")
        library = self.client.get("/api/save-md/library").get_json()
        self.assertEqual([item["id"] for item in library["categories"]], ["notes"])
        self.assertFalse((self.data_dir / "english").exists())

    def test_failed_folder_removal_does_not_claim_success(self) -> None:
        self.client.get("/api/save-md/library")
        with patch.object(routes.shutil, "rmtree", side_effect=OSError("locked")):
            response = self.client.delete("/api/save-md/categories/english")
        self.assertEqual(response.status_code, 500)
        self.assertIn("locked", response.get_json()["error"])
        self.assertTrue((self.data_dir / "english").exists())
        library = self.client.get("/api/save-md/library").get_json()
        self.assertIn("english", {item["id"] for item in library["categories"]})


if __name__ == "__main__":
    unittest.main()
