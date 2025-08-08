# FOR DEVELOPMENT ONLY

import http.server

ADDRESS = "localhost"
PORT = 80
DIRECTORY = "public"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

with http.server.HTTPServer((ADDRESS, PORT), Handler) as httpd:
    print(f"serving ./{DIRECTORY}/ at {ADDRESS}:{str(PORT)}")
    httpd.serve_forever()