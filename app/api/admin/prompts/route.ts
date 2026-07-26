import { NextResponse } from "next/server";

import { getAdminPromptRows, getAdminStats } from "@/lib/admin";

export async function GET() {
  return NextResponse.json({
    stats: getAdminStats(),
    data: getAdminPromptRows(),
  });
}

export async function POST() {
  return NextResponse.json(
    {
      error: "Database is not configured yet.",
      message: "接入 Supabase 后才会开放新增 Prompt。当前静态 JSON 版本只支持读取。",
    },
    { status: 501 },
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      error: "Database is not configured yet.",
      message: "接入 Supabase 后才会开放修改 Prompt。当前静态 JSON 版本只支持读取。",
    },
    { status: 501 },
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      error: "Database is not configured yet.",
      message: "接入 Supabase 后才会开放删除 Prompt。当前静态 JSON 版本只支持读取。",
    },
    { status: 501 },
  );
}
