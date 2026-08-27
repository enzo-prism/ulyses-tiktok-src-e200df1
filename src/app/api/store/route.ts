import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { SEED_STATE, type EngineState } from "@/lib/engine";

const runtimePath = path.join(process.cwd(), "data", "runtime.json");

function isEngineState(value: unknown): value is EngineState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as EngineState;
  return (
    Array.isArray(candidate.assets) &&
    Array.isArray(candidate.cuts) &&
    Array.isArray(candidate.posts) &&
    Array.isArray(candidate.metrics) &&
    Boolean(candidate.meta?.identity)
  );
}

export async function GET() {
  try {
    const raw = await readFile(runtimePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (isEngineState(parsed)) {
      return NextResponse.json({ state: parsed, source: "runtime" });
    }
  } catch {
    // Fall through to seed.
  }

  return NextResponse.json({ state: SEED_STATE, source: "seed" });
}

export async function POST(request: Request) {
  const body = (await request.json()) as unknown;
  if (!isEngineState(body)) {
    return NextResponse.json({ error: "Invalid engine state." }, { status: 400 });
  }

  try {
    await mkdir(path.dirname(runtimePath), { recursive: true });
    await writeFile(runtimePath, `${JSON.stringify(body, null, 2)}\n`, "utf8");
    return NextResponse.json({ ok: true, persisted: "file" });
  } catch {
    return NextResponse.json({
      ok: true,
      persisted: "memory-only",
      note: "Server filesystem is not writable here. The browser store still keeps this session.",
    });
  }
}
