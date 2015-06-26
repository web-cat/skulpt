Instructions
------------

1. Start a SimpleHTTPServer `python -m SimpleHTTPServer 9000`
2. Visit the url `http://127.0.0.1:9000/`

An http server is need to avoid cross-origin tainting of the canvas/sound when testing.
The source code is referenced through symlinks so that they can be accessed by the http server.

Note: These tests are only guaranteed to run on Chrome as each browser interprets colors in a different way.
