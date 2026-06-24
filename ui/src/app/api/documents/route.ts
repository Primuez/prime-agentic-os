import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const targetDir = path.join(process.env.HOME || '/opt/data', 'Universal-Agent-OS', 'artifacts');
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  try {
    const files = fs.readdirSync(targetDir);
    const documentCards = files.map((file, index) => {
      const filePath = path.join(targetDir, file);
      const stats = fs.statSync(filePath);
      const content = fs.statSync(filePath).isDirectory() ? "Directory" : fs.readFileSync(filePath, 'utf-8').slice(0, 150);

      return {
        id: index.toString(),
        title: file.replace(/\.[^/.]+$/, "").slice(0, 30),
        description: content || "Empty output asset...",
        type: path.extname(file).replace('.', '').toUpperCase() || 'FOLDER',
        date: stats.mtime.toLocaleDateString(),
        path: filePath
      };
    });

    return NextResponse.json(documentCards);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read data directory" }, { status: 500 });
  }
}
