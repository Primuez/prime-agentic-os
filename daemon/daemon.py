import os
import json
import time
import subprocess
import requests
import threading
import glob
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
SKILLS_DIR = os.path.expanduser(config.get("skills_dir", "~/Universal-Agent-OS/skills"))
PERSONAS_DIR = os.path.expanduser(config.get("personas_dir", "~/Universal-Agent-OS/personas"))

for path in [OBSIDIAN_VAULT, ARTIFACT_VAULT, SKILLS_DIR, PERSONAS_DIR]:
    os.makedirs(path, exist_ok=True)

class ExecutionAdapter:
    def execute(self, prompt, workdir, model=None, system=None): pass

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
        payload = {"messages": [{"role": "user", "content": prompt}], "stream": False}
        if model: payload["model"] = model
        if system: payload["messages"].insert(0, {"role": "system", "content": system})
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
    payload = {"agent_id": agent_id, "status": status, "current_task": current_task}
    try:
        requests.post("http://localhost:3000/api/webhooks/agent-state", json=payload)
    except:
        pass

def auto_group_skills_to_personas():
    """
    Dynamically scans the host's skills folder, asks the local model to cluster them 
    by theme (e.g. debugging, designing), and automatically stores them as Persona JSONs.
    """
    print("Scanning available skills for dynamic Persona generation...")
    skills_files = glob.glob(os.path.join(SKILLS_DIR, "*"))
    skill_names = [os.path.basename(f) for f in skills_files]
    
    if not skill_names:
        print("No local skills found. Falling back to default archetypes.")
        skill_names = ["frontend_dev", "backend_api", "system_design", "debugging", "copywriting"]

    prompt = f"""
I have the following skills available: {', '.join(skill_names)}
Group these skills into distinct, cohesive Agent Personas (e.g., 'The Architect' for system design/debugging; 'The Artist' for frontend/copywriting). 
Return exactly JSON in this format: 
{{"personas": [{{"name": "...", "role": "...", "skills": ["..."], "system_prompt": "..."}}]}}
"""
    adapter = get_adapter()
    response = "".join(adapter.execute(prompt, ARTIFACT_VAULT, system="You are the Identity Manager. Output pure JSON."))
    
    try:
        # Extract JSON if markdown wrapped
        json_content = response
        if "```json" in response:
            json_content = response.split("```json")[1].split("```")[0]
        data = json.loads(json_content.strip())
        
        # Save to persona dir
        for p in data.get("personas", []):
            p_path = os.path.join(PERSONAS_DIR, f"{p['name'].replace(' ','_')}.json")
            with open(p_path, "w") as f:
                json.dump(p, f, indent=2)
        print(f"Dynamically generated {len(data.get('personas', []))} personas from skills.")
    except Exception as e:
        print(f"Failed to parse generated personas: {e}. Output was: {response}")

def get_available_personas():
    """Loads personas created either manually by the user or dynamically by auto_group_skills_to_personas()."""
    personas = []
    files = glob.glob(os.path.join(PERSONAS_DIR, "*.json"))
    for f in files:
        with open(f, "r") as file:
            personas.append(json.load(file))
    
    if not personas:
        # Fallback if no files exist
        return [
            {"name": "Socrates", "role": "Philosopher & Architect", "system_prompt": "You are Socrates, a highly logical architect."},
            {"name": "Da Vinci", "role": "Creative & UI Genius", "system_prompt": "You are Da Vinci, an elite UI/UX artist and creative genius."}
        ]
    return personas

def dream_sequence():
    """
    Overnight Cron: The DYANMIC LLM Council Debate.
    Instead of hardcoded personas, loads dynamic personalities grouped from local skills.
    """
    print("Initiating Nightly Dream Sequence & Dynamic LLM Council Debate...")
    push_state("OS_DREAM_COUNCIL", "THINKING", "Gathering Yesterday's Context")
    
    # Optionally re-group skills to ensure we have fresh personas based on new skills
    auto_group_skills_to_personas()
    
    adapter = get_adapter()
    context = "Goal: Expand market reach and optimize user workflows. Yesterday's logs: OS setup complete."
    
    personas = get_available_personas()
    council_transcripts = []
    
    for p in personas:
        name = p.get("name", "Agent")
        push_state(name.upper(), "THINKING", f"Formulating {p.get('role')} critique")
        
        prompt = f"Previous debate context:\n{chr(10).join(council_transcripts)}\n\nNow, analyze the master context logically and add your unique perspective.\nMaster Context: {context}"
        response = "".join(adapter.execute(prompt, ARTIFACT_VAULT, system=p.get('system_prompt', 'You are an expert.')))
        council_transcripts.append(f"### {name}'s View\n{response}\n")

    # Orchestrator Synthesis
    push_state("ORCHESTRATOR", "EXECUTING", "Perfecting Morning Briefing from Council Debate")
    final_prompt = f"Synthesize the debate perfectly into a final implementation plan:\n\n{chr(10).join(council_transcripts)}"
    final_plan = "".join(adapter.execute(final_prompt, ARTIFACT_VAULT, system="You are the Orchestrator. Finalize the optimal plan from the council."))
    
    # Save Artifact
    timestamp = datetime.now().strftime('%Y-%m-%d')
    artifact_path = os.path.join(ARTIFACT_VAULT, f"Morning_Briefing_Council_{timestamp}.md")
    
    briefing_content = f"# Morning Briefing: {timestamp}\n\n## The Dynamic Council Debate\n\n{chr(10).join(council_transcripts)}\n\n## 🚀 Final Implementation Plan\n{final_plan}"
    
    with open(artifact_path, "w") as f:
        f.write(briefing_content)
    
    push_state("OS_DREAM_COUNCIL", "SUCCESS", f"Morning Briefing saved")
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
