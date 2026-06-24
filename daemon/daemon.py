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
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r") as f:
            return json.load(f)
    return {}

config = load_config()

OBSIDIAN_VAULT = os.path.expanduser(config.get("obsidian_vault", "~/Universal-Agent-OS/memory"))
ARTIFACT_VAULT = os.path.expanduser(config.get("artifacts_dir", "~/Universal-Agent-OS/artifacts"))

os.makedirs(OBSIDIAN_VAULT, exist_ok=True)
os.makedirs(ARTIFACT_VAULT, exist_ok=True)

class ExecutionAdapter:
    def execute(self, prompt, workdir, model=None, system=None):
        pass

class CLISpawnAdapter(ExecutionAdapter):
    def __init__(self, binary_cmd):
        self.cmd = binary_cmd
        
    def execute(self, prompt, workdir, model=None, system=None):
        command = [c.replace("{prompt}", prompt) for c in self.cmd]
        process = subprocess.Popen(command, cwd=workdir, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        for line in process.stdout:
            yield line.decode('utf-8', errors='replace')

class GatewayHTTPAdapter(ExecutionAdapter):
    def __init__(self, endpoint):
        self.endpoint = endpoint
        
    def execute(self, prompt, workdir, model=None, system=None):
        # Allow custom model override for council members, fallback to config/default
        payload = {
            "messages": [{"role": "user", "content": prompt}], 
            "stream": False
        }
        if model:
            payload["model"] = model
        if system:
            payload["messages"].insert(0, {"role": "system", "content": system})
            
        try:
            r = requests.post(self.endpoint, json=payload)
            r.raise_for_status()
            yield r.json().get("choices", [{}])[0].get("message", {}).get("content", "")
        except Exception as e:
            yield f"Error calling HTTP Gateway: {e}"

def get_adapter():
    if config.get("engine_type") == "cli":
        return CLISpawnAdapter(config.get("exec_command"))
    elif config.get("engine_type") == "http":
        # Fallback to local 8642 if not provided
        return GatewayHTTPAdapter(config.get("endpoint", "http://127.0.0.1:8642/v1/chat/completions"))
    else:
        return GatewayHTTPAdapter("http://127.0.0.1:8642/v1/chat/completions")

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

def dream_sequence():
    """
    Overnight Cron: The LLM Council Debate.
    Instead of just dreaming alone, the Orchestrator initiates a council session.
    1. Reads memory/goals.
    2. Socrates critiques and provides analytical strategy.
    3. Da Vinci provides creative implementation & UI flair.
    4. Orchestrator synthesizes into the final Morning Brief.
    """
    print("Initiating Nightly Dream Sequence & LLM Council Debate...")
    push_state("OS_DREAM_COUNCIL", "THINKING", "Gathering Yesterday's Context")
    
    adapter = get_adapter()
    
    # Base context
    context = "Goal: Get more high-ticket clients for the user. Yesterday's logs: Built Universal OS architecture."
    
    # 1. Socrates (Philosopher/Logician)
    push_state("SOCRATES", "THINKING", "Philosophical & Logical Debate")
    socrates_prompt = f"Analyze the following context logically. Find weaknesses in our acquisition strategy and propose a rigorous philosophical/systematic approach.\nContext: {context}"
    socrates_response = "".join(adapter.execute(socrates_prompt, ARTIFACT_VAULT, system="You are Socrates, a highly logical architect."))
    
    # 2. Da Vinci (Artist/Creative)
    push_state("DA_VINCI", "THINKING", "Creative Integration")
    davinci_prompt = f"Socrates just proposed this logical strategy: {socrates_response}. Now, add creative, artistic flair and unique UI/UX growth hacks to this plan."
    davinci_response = "".join(adapter.execute(davinci_prompt, ARTIFACT_VAULT, system="You are Da Vinci, an elite UI/UX artist and creative genius."))
    
    # 3. Hermes/Orchestrator (Synthesis)
    push_state("ORCHESTRATOR", "EXECUTING", "Perfecting Morning Briefing")
    final_prompt = f"Synthesize the debate between Socrates and Da Vinci perfectly into a finalized implementation plan for the user.\nSocrates: {socrates_response}\nDa Vinci: {davinci_response}"
    final_plan = "".join(adapter.execute(final_prompt, ARTIFACT_VAULT, system="You are the Orchestrator. Finalize the optimal plan."))
    
    # Save the Artifact
    timestamp = datetime.now().strftime('%Y-%m-%d')
    artifact_path = os.path.join(ARTIFACT_VAULT, f"Morning_Briefing_Council_{timestamp}.md")
    
    briefing_content = f"# Morning Briefing: {timestamp}\n\n## The Council Debate\n\n### Socrates' Logical Analysis\n{socrates_response}\n\n### Da Vinci's Creative Vision\n{davinci_response}\n\n## 🚀 Final Implementation Plan\n{final_plan}"
    
    with open(artifact_path, "w") as f:
        f.write(briefing_content)
    
    push_state("OS_DREAM_COUNCIL", "SUCCESS", f"Morning Briefing saved to {artifact_path}")
    print(f"Council finished. Saved to {artifact_path}")

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
    
    while True:
        time.sleep(3600)
