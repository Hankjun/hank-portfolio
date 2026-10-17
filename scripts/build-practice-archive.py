"""Rebuild the public WORK 16 practice ZIP from versioned sources."""
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parents[1]
destination = root / "downloads" / "work16-practice-v1.zip"
destination.parent.mkdir(exist_ok=True)
prefix = "WORK16-工作诊断练习包-V1.0/"
files = [(root / "work16" / "practice.html", "练习工具.html")]
files += [(p, p.name) for p in sorted((root / "work16" / "practice-kit").iterdir()) if p.is_file()]
with zipfile.ZipFile(destination, "w", zipfile.ZIP_DEFLATED) as archive:
    for source, name in files:
        entry = zipfile.ZipInfo(prefix + name, (2026, 10, 17, 0, 0, 0))
        entry.compress_type = zipfile.ZIP_DEFLATED
        archive.writestr(entry, source.read_bytes())
print(f"Created {destination.name}: {len(files)} files")
