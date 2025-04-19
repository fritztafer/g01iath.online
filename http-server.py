# https://docs.python.org/3/library/http.server.html
# Can run with command after changing to root directory: python -m http.server 80 --bind 127.0.0.1

import http.server
import socketserver

PORT = 80
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at localhost:" + str(PORT))
    httpd.serve_forever()