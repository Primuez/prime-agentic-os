import os
import json
import time
import subprocess
import requests
import threading
from datetime import datetime

# Read config
CONFIG_PATH = "agent.config.json"
def load_config():
    with open(CONFIG_PATH, "r") as f:
        return json.load(f)

config = load_config()

OBSIDIAN_VAULT = os.path.expanduser(config.get("obsidian_vault", "~/Universal-Agent-OS/memory"))
ARTIFACT_VAULT = os.path.expanduser(config.get("artifacts_dir", "~/Universal-Agent-OS/artifacts"))

os.makedirs(OBSIDIAN_VAULT, exist_ok=True)
os.makedirs(ARTIFACT_VAULT, exist_ok=True)

class ExecutionAdapter:
    def execute(self, prompt, workdir):
        pass

class CLISpawnAdapter(ExecutionAdapter):
    def __init__(self, binary_cmd):
        self.cmd = binary_cmd
        
    def execute(self, prompt, workdir):
        command = [c.replace("{prompt}", prompt) for c in self.cmd]
        process = subprocess.Popen(command, cwd=workdir, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        for line in process.stdout:
            yield line.decode('utf-8', errors='replace')

class GatewayHTTPAdapter(ExecutionAdapter):
    def __init__(self, endpoint):
        self.endpoint = endpoint
        
    def execute(self, prompt, workdir):
        payload = {"messages": [{"role": "user", "content": prompt}], "stream": True}
        try:
            with requests.post(self.endpoint, json=payload, stream=True) as r:
                for chunk in r.iter_content(chunk_size=1024):
                    if chunk:
                        yield chunk.decode('utf-8', errors='replace')
        except Exception as e:
            yield f"Error calling HTTP Gateway: {e}"

def get_adapter():
    if config.get("engine_type") == "cli":
        return CLISpawnAdapter(config.get("exec_command"))
    elif config.get("engine_type") == "http":
        return GatewayHTTPAdapter(config.get("endpoint"))
    else:
        raise ValueError("Unknown engine_type")

def push_state(agent_id, status, current_task=None):
    payload = {
        "agent_id": agent_id,
        "status": status,
        "current_task": current_task
    }
    try:
        requests.post("http://localhost:3000/api/webhooks/agent-state", json=payload)
    except Exception as e:
        print(f"Failed to push state: {e}")

def run_task(agent_id, prompt):
    push_state(agent_id, "THINKING", prompt)
    adapter = get_adapter()
    
    output_log = ""
    push_state(agent_id, "EXECUTING", prompt)
    
    for chunk in adapter.execute(prompt, ARTIFACT_VAULT):
        output_log += chunk
        print(chunk, end="")
        
    push_state(agent_id, "SUCCESS", prompt)
    
    # Save log
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    log_path = os.path.join(ARTIFACT_VAULT, f"{timestamp}_task.log")
    with open(log_path, "w") as f:
        f.write(output_log)

def dream_sequence():
    print("Initiating Nightly Dream Sequence...")
    push_state("OS_DREAM", "THINKING", "Dream Sequence")
    time.sleep(2)
    # Placeholder for actual analysis
    artifact_path = os.path.join(ARTIFACT_VAULT, f"Morning_Briefing_{datetime.now().strftime('%Y-%m-%d')}.md")
    with open(artifact_path, "w") as f:
        f.write("# Morning Briefing\n\nDream sequence ran successfully.")
    
    push_state("OS_DREAM", "SUCCESS", "Dream Sequence Generated")
    print(f"Saved to {artifact_path}")

def scheduler_loop():
    import schedule
    schedule.every().day.at("02:00").do(dream_sequence)
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    print("Universal Agent OS Daemon started.")
    # Run scheduler in background
    threading.Thread(target=scheduler_loop, daemon=True).start()
    
    # Keep alive or host basic input loop
    while True:
        time.sleep(3600)
