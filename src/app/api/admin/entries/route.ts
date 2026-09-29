import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { EntryLink } from "@/types/database";

function sanitizeLinks(links: unknown): EntryLink[] {
  if (!Array.isArray(links)) return [];
  const valid: EntryLink[] = [];
  for (const item of links) {
    if (item && typeof item === "object") {
      const label = typeof item.label === "string" ? item.label.trim() : "Link";
      const url = typeof item.url === "string" ? item.url.trim() : "";
      if (url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:"))) {
        valid.push({ label: label || "Link", url });
      }
    }
  }
  return valid;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get("section_id");

    let query = supabaseAdmin.from("entries").select("*").order("display_order", { ascending: true });
    if (sectionId) {
      query = query.eq("section_id", sectionId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ entries: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch entries";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      section_id,
      title,
      subtitle = null,
      date_range = null,
      description = null,
      tags = [],
      links = [],
    } = body;

    if (!section_id || !title || typeof title !== "string") {
      return NextResponse.json(
        { error: "section_id and title are required fields." },
        { status: 400 }
      );
    }

    const { data: maxOrderData } = await supabaseAdmin
      .from("entries")
      .select("display_order")
      .eq("section_id", section_id)
      .order("display_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxOrderData?.display_order || 0) + 1;
    const sanitizedLinks = sanitizeLinks(links);
    const sanitizedTags = Array.isArray(tags)
      ? tags.map((t: string) => String(t).trim()).filter(Boolean)
      : [];

    const baseInsert: Record<string, unknown> = {
      section_id,
      title: title.trim(),
      subtitle: subtitle ? String(subtitle).trim() : null,
      date_range: date_range ? String(date_range).trim() : null,
      description: description ? String(description).trim() : null,
      tags: sanitizedTags,
      display_order: nextOrder,
    };

    // Try inserting with `links` (JSONB) first
    let insertResult = await supabaseAdmin
      .from("entries")
      .insert({ ...baseInsert, links: sanitizedLinks })
      .select()
      .single();

    // If `links` column doesn't exist yet on live DB, fallback to legacy `link` column
    if (insertResult.error && insertResult.error.message.includes("links")) {
      insertResult = await supabaseAdmin
        .from("entries")
        .insert({ ...baseInsert, link: sanitizedLinks[0]?.url || null })
        .select()
        .single();
    }

    if (insertResult.error) throw insertResult.error;

    revalidatePath("/");
    return NextResponse.json({ success: true, entry: insertResult.data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create entry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, subtitle, date_range, description, tags, links, display_order } = body;

    if (!id) {
      return NextResponse.json({ error: "Entry ID is required." }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = String(title).trim();
    if (subtitle !== undefined) updates.subtitle = subtitle ? String(subtitle).trim() : null;
    if (date_range !== undefined) updates.date_range = date_range ? String(date_range).trim() : null;
    if (description !== undefined) updates.description = description ? String(description).trim() : null;
    if (tags !== undefined) {
      updates.tags = Array.isArray(tags)
        ? tags.map((t: string) => String(t).trim()).filter(Boolean)
        : [];
    }
    if (display_order !== undefined) updates.display_order = Number(display_order);

    let sanitizedLinks: EntryLink[] | null = null;
    if (links !== undefined) {
      sanitizedLinks = sanitizeLinks(links);
    }

    let updateResult;
    if (sanitizedLinks !== null) {
      // Try updating with `links`
      updateResult = await supabaseAdmin
        .from("entries")
        .update({ ...updates, links: sanitizedLinks })
        .eq("id", id)
        .select()
        .single();

      // If `links` column does not exist yet, fallback to `link`
      if (updateResult.error && updateResult.error.message.includes("links")) {
        updateResult = await supabaseAdmin
          .from("entries")
          .update({ ...updates, link: sanitizedLinks[0]?.url || null })
          .eq("id", id)
          .select()
          .single();
      }
    } else {
      updateResult = await supabaseAdmin
        .from("entries")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
    }

    if (updateResult.error) throw updateResult.error;

    revalidatePath("/");
    return NextResponse.json({ success: true, entry: updateResult.data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update entry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Entry ID is required." }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("entries").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Entry deleted successfully." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete entry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
