import http.server
import socketserver
import webbrowser
import os
 
PORT = 3000
DIRECTORY = os.path.join(os.path.dirname(__file__), "public")
 
class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
 
    def log_message(self, format, *args):
        print(f"  [{self.address_string()}] {format % args}")
 
print(f"✅  Server đang chạy tại http://localhost:{PORT}")
print(f"📁  Thư mục: {DIRECTORY}")
print(f"🛑  Nhấn Ctrl+C để dừng\n")
 
webbrowser.open(f"http://localhost:{PORT}")
 
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
 