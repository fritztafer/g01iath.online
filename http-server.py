# FOR DEVELOPMENT ONLY

import http.server
import os

ADDRESS = "localhost"
PORT = 80
DIRECTORY = "public"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def send_error(self, code, message=None, explain=None):
        error_file = os.path.join(DIRECTORY, "error.html")
        if os.path.exists(error_file):
            self.send_response(code)
            self.send_header("Content-type", "text/html; charset=utf-8")
            self.end_headers()
            with open(error_file, "rb") as f:
                self.wfile.write(f.read())

with http.server.HTTPServer((ADDRESS, PORT), Handler) as httpd:
    print(f"serving ./{DIRECTORY}/ at {ADDRESS}:{str(PORT)}")
    httpd.serve_forever()