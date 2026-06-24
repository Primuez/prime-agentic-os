import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { agent_id, status, current_task } = data;

    await prisma.agentState.upsert({
      where: { id: agent_id },
      update: { status, current_task },
      create: { id: agent_id, status, current_task }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
