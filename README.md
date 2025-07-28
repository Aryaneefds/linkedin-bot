# linkedin-bot


linkedin-bot is a Node.js script that automates accepting LinkedIn connection requests using Puppeteer with a stealth plugin. Here’s a summary of what it does:

Launches a browser session (not headless) with Puppeteer, using a stealth plugin to avoid detection.
Logs into LinkedIn with the provided email and password.
Navigates to the LinkedIn invitation manager page to view incoming connection requests.
Loops through connection requests, checks the number of mutual connections for each, and accepts requests only if the mutual connection count exceeds a specified threshold (default is 50).
Limits the number of processed requests per session and mimics human-like behavior with delays.
Closes the browser after processing.
This script is intended to automate accepting only those connection requests from people who have a significant number of mutual connections with you on LinkedIn.
