import subprocess
import signal
import webbrowser

# Global variables to hold the subprocesses
backend_process = None
frontend_process = None

# Define the IP and port for the backend server
backend_ip = "127.0.0.1"
backend_port = "8000"

def start_backend():
    global backend_process
    # Start the FastAPI server
    backend_process = subprocess.Popen(["python3", "-m", "uvicorn", "backend.server:app", "--host", backend_ip, "--port", backend_port, "--reload"])

def start_frontend():
    global frontend_process
    # Start the Webpack Dev Server
    frontend_process = subprocess.Popen(["npx", "webpack", "serve"])

def signal_handler(sig, frame):
    print('Shutting down...')
    # Terminate the subprocesses
    if backend_process:
        backend_process.terminate()
    if frontend_process:
        frontend_process.terminate()
    exit(0)

if __name__ == "__main__":
    # Setup signal handler to catch Ctrl+C
    signal.signal(signal.SIGINT, signal_handler)

    start_backend()
    start_frontend()

    # Optionally, automatically open the frontend in a web browser
    webbrowser.open("http://localhost:8080")

    # Keep the main thread running
    signal.pause()
