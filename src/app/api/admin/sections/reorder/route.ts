import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "orderedIds must be an array of IDs." }, { status: 400 });
    }

    // Update display_order for each ID
    const updatePromises = orderedIds.map((id: string, index: number) =>
      supabaseAdmin
        .from("sections")
        .update({ display_order: index + 1 })
        .eq("id", id)
    );

    await Promise.all(updatePromises);

    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Sections reordered successfully." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to reorder sections";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
