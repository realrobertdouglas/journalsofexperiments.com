#!/usr/bin/env python3
"""Check an entry before it is published or put up for review.

    _tools/check-entry.py _posts/2026-10-18-sixteen-reindeer.md
    _tools/check-entry.py _posts/2026-10-18-sixteen-reindeer.md --no-links   # skip fetching the sources

Reads the rules in AGENTS.md as code: the front matter, the subtitle, the length, the sections, the figures, the
younger-readers version, the companion pieces, the audio lines and the source links. Prints one line per check,
"ok", "WARN" or "FAIL", and exits 1 if anything failed. A WARN is a judgement call to look at, not a stop.
Needs only Python 3 and, for picture sizes, macOS `sips` (skipped where it is missing).
"""
import os, re, subprocess, sys, pathlib, urllib.request, urllib.error

ROOT = pathlib.Path(__file__).resolve().parent.parent
MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December"
results = {"ok": 0, "WARN": 0, "FAIL": 0}

def say(level, text):
    results[level] += 1
    print(f"{level:5s} {text}")

def front_matter(md):
    if not md.startswith("---"):
        return {}, md
    fm_text, body = md.split("---", 2)[1:]
    fm = {}
    for line in fm_text.splitlines():
        if ":" in line and not line.startswith(" "):
            k, v = line.split(":", 1)
            fm[k.strip()] = v.split("#")[0].strip().strip('"') if k.strip() != "subtitle" else v.strip().strip('"')
    return fm, body

def words(text):
    text = re.sub(r"<figure>.*?</figure>", "", text, flags=re.S)
    text = re.sub(r"<[^>]+>", "", text)
    return len(text.split())

def body_before_sources(body):
    return body.split("\n## Sources", 1)[0]

def fetch(url, timeout=12):
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "Mozilla/5.0 (journalofexperiments.com link check)"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status
    except urllib.error.HTTPError as e:
        if e.code in (405, 501):      # HEAD refused: try GET
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (journalofexperiments.com link check)"})
            try:
                with urllib.request.urlopen(req, timeout=timeout) as r:
                    return r.status
            except urllib.error.HTTPError as e2:
                return e2.code
            except Exception:
                return None
        return e.code
    except Exception:
        return None

def image_width(path):
    try:
        out = subprocess.run(["sips", "-g", "pixelWidth", str(path)], capture_output=True, text=True, timeout=20).stdout
        m = re.search(r"pixelWidth: (\d+)", out)
        return int(m.group(1)) if m else None
    except Exception:
        return None

def check_entry(post_path, links=True):
    post = pathlib.Path(post_path).resolve()
    md = post.read_text()
    fm, body = front_matter(md)
    slug = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", post.stem)
    print(f"\n{post.relative_to(ROOT)}  ({slug})")

    # Front matter
    for key in ("layout", "title", "subtitle", "date", "categories"):
        say("ok" if fm.get(key) else "FAIL", f"front matter has {key}" + ("" if fm.get(key) else " (missing)"))
    if fm.get("layout") not in (None, "post"):
        say("FAIL", f"layout is {fm['layout']}, not post")
    sub = fm.get("subtitle", "")
    say("ok" if sub.startswith("The story of") else "FAIL", 'subtitle begins "The story of"' + ("" if sub.startswith("The story of") else f": {sub[:50]}"))
    say("ok" if re.search(r"\b1[0-9]{3}|20[0-9]{2}\b", sub) else "WARN", "subtitle names the years")
    date = fm.get("date", "")
    say("ok" if re.match(r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \+0000$", date) else "FAIL", f"date is UTC in the house form: {date}")
    others = [p for p in (ROOT / "_posts").glob("*.md") if p.resolve() != post]
    clash = [p.name for p in others if front_matter(p.read_text())[0].get("date") == date]
    say("ok" if not clash else "FAIL", "date is not shared with another entry" + (f" (same as {clash})" if clash else ""))
    cats = re.findall(r"[\w-]+", fm.get("categories", ""))
    for c in cats:
        has = any((ROOT / "category" / f"{c}{ext}").exists() for ext in (".md", ".html"))
        say("ok" if has else "FAIL", f"category page exists for {c}")
    if fm.get("comments", "false").lower() != "false":
        say("WARN", "comments is not false")

    # Length and sections
    main = body_before_sources(body)
    n = words(main)
    level = "ok" if 4000 <= n <= 6500 else ("WARN" if 3500 <= n <= 7000 else "FAIL")
    say(level, f"length before Sources: {n:,} words (4,000 to 6,500)")
    heads = re.findall(r"^## (.+)$", body, flags=re.M)
    say("ok" if any(h.lower() == "sources" for h in heads) else "FAIL", "has a Sources section")
    say("ok" if any(h.lower().startswith("who ran it") for h in heads) else "WARN", 'has "Who ran it"')
    say("ok" if any(h.lower().startswith("what it taught") for h in heads) else "WARN", 'has "What it taught"')
    sources = body.split("\n## Sources", 1)[1] if "\n## Sources" in body else ""
    bullets = re.findall(r"^- ", sources, flags=re.M)
    say("ok" if len(bullets) >= 5 else "WARN", f"Sources has {len(bullets)} items (5 or more)")
    markers = re.findall(r"\bTODO\b|\bTBD\b|\bTK\b|\?\?|\[citation|lorem ipsum", md, flags=re.I)
    say("ok" if not markers else "FAIL", "no leftover markers" + (f": {sorted(set(markers))}" if markers else ""))

    # Figures
    figs = re.findall(r"<figure>(.*?)</figure>", body, flags=re.S)
    say("ok", f"{len(figs)} figure(s)")
    for f in figs:
        src = re.search(r'src="([^"]+)"', f)
        alt = re.search(r'alt="([^"]*)"', f)
        cap = re.search(r"<figcaption>(.*?)</figcaption>", f, flags=re.S)
        if not src:
            say("FAIL", "figure without an image"); continue
        path = ROOT / src.group(1).lstrip("/")
        name = src.group(1).split("/")[-1]
        say("ok" if path.exists() else "FAIL", f"figure file exists: {name}")
        say("ok" if alt and alt.group(1).strip() else "FAIL", f"figure has alt text: {name}")
        say("ok" if cap and cap.group(1).strip() else "WARN", f"figure has a caption with a credit: {name}")
        if path.exists():
            w = image_width(path)
            if w is not None:
                say("ok" if w <= 1700 else "WARN", f"figure width {w} px (about 1,600): {name}")
            kb = path.stat().st_size // 1024
            say("ok" if kb <= 700 else "WARN", f"figure size {kb} KB (compressed): {name}")
            if not str(path).startswith(str(ROOT / "static" / "img" / slug)):
                say("WARN", f"figure is outside static/img/{slug}/: {src.group(1)}")

    # Younger readers
    young = fm.get("young")
    if not young:
        say("WARN", "no younger-readers version (young:) yet; every entry has one")
    else:
        ypath = ROOT / "_includes" / young
        say("ok" if ypath.exists() else "FAIL", f"younger version exists: _includes/{young}")
        if ypath.exists():
            ymd = ypath.read_text()
            say("ok" if not ymd.startswith("---") else "FAIL", "younger version has no front matter")
            first = ymd.strip().split("\n\n", 1)[0]
            say("ok" if "button" in first.lower() else "WARN", "younger version opens with the line about the button")
            yn = words(ymd)
            ratio = yn / n if n else 0
            say("ok" if 0.25 <= ratio <= 0.55 else "WARN", f"younger version is {yn:,} words, {ratio:.0%} of the entry (a third to a half, 2,000 to 2,800 words)")
            teaches = "## What it teaches" in ymd
            say("ok" if teaches else "WARN", 'younger version ends with "What it teaches"')
            if teaches:
                tail = ymd.split("## What it teaches", 1)[1]
                say("ok" if "A few plain things" in tail and "So the lesson is simple" in tail else "WARN",
                    'younger lessons are in the plain form ("A few plain things." … "So the lesson is simple.")')
            bad_dates = re.findall(rf"\b\d{{1,2}} (?:{MONTHS}) \d{{4}}\b", re.sub(r"<figure>.*?</figure>", "", ymd, flags=re.S))
            say("ok" if not bad_dates else "WARN", 'younger dates are written "February 3rd 1898"' + (f" (found {bad_dates[:3]})" if bad_dates else ""))
            ylinks = re.findall(r"\]\((/deeper/[^)]+)\)", ymd)
            bad = [l for l in ylinks if not l.endswith("#young")]
            say("ok" if not bad else "WARN", "companion links in the younger version carry #young" + (f" ({bad})" if bad else ""))

    # Companion pieces
    deeper = sorted((ROOT / "_deeper" / slug).glob("*.md")) if (ROOT / "_deeper" / slug).exists() else []
    for piece in deeper:
        pfm, pbody = front_matter(piece.read_text())
        okp = pfm.get("parent") == slug and pfm.get("title") and pfm.get("subtitle") and pfm.get("order")
        say("ok" if okp else "FAIL", f"companion {piece.stem}: parent, title, subtitle, order")
        pn = words(body_before_sources(pbody))
        say("ok" if 600 <= pn <= 3000 else "WARN", f"companion {piece.stem}: {pn:,} words")
        if not pfm.get("audio"):
            say("WARN", f"companion {piece.stem}: no narration yet")

    # Audio lines
    for key in ("audio", "audio_young"):
        have = [k for k in (key, key + "_length", key + "_duration") if fm.get(k)]
        if not have:
            say("WARN", f"no {key} lines yet (narration comes after the text is final)"); continue
        say("ok" if len(have) == 3 else "FAIL", f"{key} lines complete ({len(have)} of 3)")
        if len(have) == 3 and links:
            try:
                req = urllib.request.Request(fm[key], method="HEAD", headers={"User-Agent": "Mozilla/5.0 (journalofexperiments.com link check)"})
                with urllib.request.urlopen(req, timeout=15) as r:
                    cl = r.headers.get("Content-Length")
                say("ok" if cl == fm[key + "_length"] else "WARN", f"{key} file is served with the length in the front matter ({cl} vs {fm[key + '_length']})")
            except Exception as e:
                say("FAIL", f"{key} file could not be fetched: {e}")

    # Source links
    if links and sources:
        urls = sorted(set(re.findall(r"\((https?://(?:[^()\s]|\([^()\s]*\))+)\)", sources)))   # allows one level of ( ) in the address
        for u in urls:
            st = fetch(u)
            if st is None:
                say("WARN", f"source link did not answer: {u}")
            elif st == 404 or st == 410:
                say("FAIL", f"source link is gone ({st}): {u}")
            elif st >= 400:
                say("WARN", f"source link answered {st} (may just refuse robots): {u}")
            else:
                say("ok", f"source link answers: {u}")

def main(argv):
    links = "--no-links" not in argv
    paths = [a for a in argv if not a.startswith("--")]
    if not paths:
        sys.exit(__doc__)
    for p in paths:
        check_entry(p, links=links)
    print(f"\n{results['ok']} ok, {results['WARN']} to look at, {results['FAIL']} failed")
    sys.exit(1 if results["FAIL"] else 0)

if __name__ == "__main__":
    main(sys.argv[1:])
