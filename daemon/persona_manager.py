import os
import json
import requests
from glob import glob

CONFIG_PATH = "agent.config.json"
PERSONAS_FILE = "personas.json"

def load_config():
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r") as f:
            return json.load(f)
    return {}

config = load_config()
# Users can specify where their skills markdown files live, fallback to a standard hermes path
SKILLS_DIR = os.path.expanduser(config.get("skills_dir", "~/.hermes/skills"))

def fetch_local_skills():
    """Scans the local machine for installed skills and their descriptions."""
    skills = []
    if not os.path.exists(SKILLS_DIR):
        return skills
    
    # Simple parser to fetch skill names and descriptions from markdown files or standard dirs
    for root, dirs, files in os.walk(SKILLS_DIR):
        for file in files:
            if file.endswith('.md') or file.endswith('.yaml'):
                try:
                    with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        description = "".join(lines[:10]) # grab first 10 lines as context
                        skills.append({"name": os.path.basename(root), "details": description[:200]})
                except Exception:
                    pass
                break # Just read one marker file per skill
    return skills

def auto_generate_personas(gateway_endpoint):
    """
    Uses the connected LLM engine to intelligently cluster the machine's available skills 
    into distinct personalities with embedded system prompts.
    """
    skills = fetch_local_skills()
    if not skills:
        skills = [{"name": "web_search", "details": "Search web"}, {"name": "terminal", "details": "Run codebase commands"}] # Fallback mock

    prompt = f"""
    You are the Agent OS Persona Forge. Here is the list of skills/tools available on this machine:
    {json.dumps(skills)}
    
    Categorize and group these skills to invent 3-4 distinct 'Personas' (e.g. The Artist, The Debugger, The Logician).
    Return a strictly formatted JSON array of these personas. Include 'name', 'role', 'system_prompt', and 'skills' (a list of tool names).
    Return ONLY JSON. Do not include markdown formatting like ```json.
    """
    
    payload = {
        "messages": [{"role": "user", "content": prompt}],
        "stream": False
    }
    
    try:
        r = requests.post(gateway_endpoint, json=payload)
        r.raise_for_status()
        content = r.json().get("choices", [{}])[0].get("message", {}).get("content", "")
        # Clean markdown if present
        if content.startswith("```json"):
            content = content[7:-3]
        
        personas = json.loads(content)
        with open(PERSONAS_FILE, "w") as f:
            json.dump(personas, f, indent=2)
        print(f"Successfully auto-generated {len(personas)} personas based on local skills!")
        return personas
    except Exception as e:
        print(f"Error auto-generating personas: {e}")
        return []

def load_or_create_personas(gateway_endpoint):
    """Loads personas from file (manual) or creates them dynamically (automatic)."""
    if os.path.exists(PERSONAS_FILE):
        with open(PERSONAS_FILE, "r") as f:
            return json.load(f)
    print("No personas found. Triggering automated skill-clustering...")
    return auto_generate_personas(gateway_endpoint)
