import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Map to the Agent OS Artifacts vault
  // Using os.homedir() fallback to match our desktop/vps deployment model
  const targetDir = path.join(process.env.HOME || '/opt/data', 'Universal-Agent-OS', 'artifacts');
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  try {
    const files = fs.readdirSync(targetDir);
    const documentCards = files.map((file, index) => {
      const filePath = path.join(targetDir, file);
      const stats = fs.statSync(filePath);
      
      // Read first 200 chars for preview
      let content = "";
      if (stats.isFile()) {
         try {
           content = fs.readFileSync(filePath, 'utf-8').slice(0, 200);
         } catch(e) {
           content = "Binary or unreadable artifact...";
         }
      }

      return {
        id: index.toString(),
        title: file.replace(/\.[^/.]+$/, "").slice(0, 30),
        description: content || "Empty output asset...",
        type: path.extname(file).replace('.', '').toUpperCase() || 'SYS',
        date: stats.mtime.toLocaleDateString() + " " + stats.mtime.toLocaleTimeString(),
        path: filePath
      };
    }).filter(f => f.type !== 'SYS'); // Filter out directories if any

    // Sort by newest
    documentCards.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(documentCards);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read data directory" }, { status: 500 });
  }
}
