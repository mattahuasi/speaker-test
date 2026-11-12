#!/usr/bin/env python3
"""Static server for local preview with clean URLs (/en instead of /en/)."""

import os
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent


class CleanURLHandler(SimpleHTTPRequestHandler):
    def _redirect(self):
        parts = urlsplit(self.path)
        target = parts.path
        if target.endswith("/index.html"):
            target = target[: -len("index.html")].rstrip("/") or "/"
        else:
            target = target.rstrip("/")
        if parts.query:
            target += "?" + parts.query
        self.send_response(307)
        self.send_header("Location", target)
        self.send_header("Cache-Control", "no-store")
        self.end_headers()

    def _needs_redirect(self):
        path = urlsplit(self.path).path
        return path != "/" and (path.endswith("/") or path.endswith("/index.html"))

    def do_GET(self):
        if self._needs_redirect():
            self._redirect()
            return
        super().do_GET()

    def do_HEAD(self):
        if self._needs_redirect():
            self._redirect()
            return
        super().do_HEAD()

    def translate_path(self, path):
        filesystem_path = super().translate_path(path)
        if os.path.isdir(filesystem_path):
            index = os.path.join(filesystem_path, "index.html")
            if os.path.isfile(index):
                return index
        return filesystem_path


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else int(os.environ.get("PORT", "8000"))
    handler = partial(CleanURLHandler, directory=str(ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    print(f"Serving {ROOT} at http://localhost:{port}/")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
