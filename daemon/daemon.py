import os
import json
import time
import subprocess
import requests
import threading
from datetime import datetime
from persona_manager import load_or_create_personas

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
        pass # Silent fail for webhook if UI not running

def dream_sequence():
    """
    Overnight Cron: The Dynamic LLM Council Debate.
    Reads dynamically mapped personas (auto-generated from local skills or manually specified).
    """
    print("Initiating Nightly Dream Sequence & Dynamic LLM Council Debate...")
    push_state("OS_DREAM_COUNCIL", "THINKING", "Gathering Yesterday's Context")
    
    adapter = get_adapter()
    # If HTTP adapter, grab endpoint, else fallback to standard local
    gateway_url = config.get("endpoint", "http://127.0.0.1:8642/v1/chat/completions")
    
    # 1. Fetch active personas (manual overrides or auto-grouped by skill engine)
    personas = load_or_create_personas(gateway_url)
    
    if not personas:
        # Fallback if creation failed
        personas = [
            {"name": "Socrates", "role": "Philosopher", "system_prompt": "You are a logical strategist."},
            {"name": "Da Vinci", "role": "Creative", "system_prompt": "You are a creative UI artist."}
        ]

    # Base context
    context = "Goal: Expand the user's business capabilities. Analyze yesterday's performance logs."
    
    debates = []
    
    # Run loop through each distinct dynamic persona
    for persona in personas:
        push_state(persona['name'].upper(), "THINKING", f"{persona['role']} Review")
        print(f"Council Member {persona['name']} is evaluating...")
        
        prompt = f"Analyze the following context through your specific skillset. Propose an implementation plan.\nContext: {context}"
        response = "".join(adapter.execute(prompt, ARTIFACT_VAULT, system=persona['system_prompt']))
        
        debates.append(f"### {persona['name']} ({persona['role']})\n{response}\n")
    
    # Synthesis by Orchestrator
    push_state("ORCHESTRATOR", "EXECUTING", "Perfecting Morning Briefing")
    final_prompt = "Synthesize the following council debate into a single finalized, perfect implementation plan for the user:\n\n" + "\n".join(debates)
    final_plan = "".join(adapter.execute(final_prompt, ARTIFACT_VAULT, system="You are the Orchestrator. Finalize the optimal plan."))
    
    # Save the Artifact
    timestamp = datetime.now().strftime('%Y-%m-%d')
    artifact_path = os.path.join(ARTIFACT_VAULT, f"Morning_Briefing_Council_{timestamp}.md")
    
    briefing_content = f"# Morning Briefing: {timestamp}\n\n## The Dynamic Council Debate\n\n" + "\n".join(debates) + f"\n\n## 🚀 Final Synthesized Implementation Plan\n{final_plan}"
    
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
    threading.Thread(target=scheduler_loop, daemon=True).start()
    while True:
        time.sleep(3600)
