import os
import json
import time
import subprocess
import requests
import threading
from datetime import datetime

# Read configs and paths
CONFIG_PATH = "agent.config.json"
def load_config():
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r") as f:
            return json.load(f)
    return {}

config = load_config()

OBSIDIAN_VAULT = os.path.expanduser(config.get("obsidian_vault", "~/Universal-Agent-OS/memory"))
ARTIFACT_VAULT = os.path.expanduser(config.get("artifacts_dir", "~/Universal-Agent-OS/artifacts"))
PERSONAS_DIR = os.path.join(os.path.dirname(__file__), "../personas")

os.makedirs(OBSIDIAN_VAULT, exist_ok=True)
os.makedirs(ARTIFACT_VAULT, exist_ok=True)
os.makedirs(PERSONAS_DIR, exist_ok=True)

def load_persona(persona_name):
    """Loads a persona definition, which acts as a group of skills."""
    filepath = os.path.join(PERSONAS_DIR, f"{persona_name.lower()}.json")
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            data = json.load(f)
            # Combine the systemic worldview with its embedded skills
            skills_list = ", ".join(data.get("skills", []))
            system = data.get("system_prompt", "")
            if skills_list:
                system += f"\n\n[BOUNDED SKILLS]: You possess the following procedural skills and must apply their methodologies: {skills_list}."
            return system
    return f"You are {persona_name}."

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
    return GatewayHTTPAdapter(config.get("endpoint", "http://127.0.0.1:8642/v1/chat/completions"))

def push_state(agent_id, status, current_task=None):
    payload = {
        "agent_id": agent_id,
        "status": status,
        "current_task": current_task
    }
    try:
        requests.post("http://localhost:3000/api/webhooks/agent-state", json=payload)
    except:
        pass

def dream_sequence():
    """
    Overnight Cron: The LLM Council Debate.
    Each personality pulls its specific payload of grouped skills.
    """
    print("Initiating Nightly Dream Sequence & LLM Council Debate...")
    push_state("OS_DREAM_COUNCIL", "THINKING", "Gathering Yesterday's Context")
    
    adapter = get_adapter()
    context = "Goal: Get more high-ticket clients for the user. Identify execution gaps."
    
    # 1. Socrates (Deep Thinker & Debugger - Loads Analytical Skills)
    push_state("SOCRATES", "THINKING", "Philosophical & Logical Debate")
    socrates_sys = load_persona("socrates")
    socrates_prompt = f"Analyze the following logically. Find weaknesses in our strategy and propose a rigorous approach.\nContext: {context}"
    socrates_response = "".join(adapter.execute(socrates_prompt, ARTIFACT_VAULT, system=socrates_sys))
    
    # 2. Da Vinci (Creative & UI Artist - Loads Design Skills)
    push_state("DA_VINCI", "THINKING", "Creative Integration")
    davinci_sys = load_persona("davinci")
    davinci_prompt = f"Socrates just proposed this logical strategy: {socrates_response}. Add creative branding, UI growth hacks, and artistic flair."
    davinci_response = "".join(adapter.execute(davinci_prompt, ARTIFACT_VAULT, system=davinci_sys))
    
    # 3. Orchestrator (Synthesis & Planning - Loads Roadmap Skills)
    push_state("ORCHESTRATOR", "EXECUTING", "Perfecting Morning Briefing")
    orch_sys = load_persona("orchestrator")
    final_prompt = f"Synthesize Socrates and Da Vinci's debate into a finalized implementation plan.\nSocrates: {socrates_response}\nDa Vinci: {davinci_response}"
    final_plan = "".join(adapter.execute(final_prompt, ARTIFACT_VAULT, system=orch_sys))
    
    # Save the Artifact
    timestamp = datetime.now().strftime('%Y-%m-%d')
    artifact_path = os.path.join(ARTIFACT_VAULT, f"Morning_Briefing_Council_{timestamp}.md")
    
    briefing_content = f"# Morning Briefing: {timestamp}\n\n## The Council Debate\n\n### Socrates' Logical Analysis\n{socrates_response}\n\n### Da Vinci's Creative Vision\n{davinci_response}\n\n## Final Implementation Plan\n{final_plan}"
    
    with open(artifact_path, "w") as f:
        f.write(briefing_content)
    
    push_state("OS_DREAM_COUNCIL", "SUCCESS", f"Morning Briefing saved to {artifact_path}")

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
