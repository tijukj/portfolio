import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("sections")
      .select("*, entries(*)")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ sections: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch sections";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, type = "custom", visible = true } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Section title is required." }, { status: 400 });
    }

    const validTypes = ["experience", "project", "app", "award", "custom"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: `Invalid section type: ${type}` }, { status: 400 });
    }

    // Get highest display_order
    const { data: maxOrderData } = await supabaseAdmin
      .from("sections")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxOrderData?.display_order || 0) + 1;

    const { data, error } = await supabaseAdmin
      .from("sections")
      .insert({
        title: title.trim(),
        type,
        visible: Boolean(visible),
        display_order: nextOrder,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    return NextResponse.json({ success: true, section: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create section";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, type, visible, display_order } = body;

    if (!id) {
      return NextResponse.json({ error: "Section ID is required." }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title.trim();
    if (type !== undefined) updates.type = type;
    if (visible !== undefined) updates.visible = Boolean(visible);
    if (display_order !== undefined) updates.display_order = Number(display_order);

    const { data, error } = await supabaseAdmin
      .from("sections")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    return NextResponse.json({ success: true, section: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update section";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Section ID is required." }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("sections").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Section deleted successfully." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete section";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
