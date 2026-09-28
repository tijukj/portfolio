import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("social_links")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ socialLinks: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch social links";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, url } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { error: "Platform and URL are required fields." },
        { status: 400 }
      );
    }

    const trimmedUrl = String(url).trim();
    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://") && !trimmedUrl.startsWith("mailto:")) {
      return NextResponse.json(
        { error: "Invalid URL. Must start with https://, http://, or mailto:" },
        { status: 400 }
      );
    }

    const { data: maxOrderData } = await supabaseAdmin
      .from("social_links")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxOrderData?.display_order || 0) + 1;

    const { data, error } = await supabaseAdmin
      .from("social_links")
      .insert({
        platform: String(platform).trim(),
        url: trimmedUrl,
        display_order: nextOrder,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    return NextResponse.json({ success: true, socialLink: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create social link";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, platform, url, display_order } = body;

    if (!id) {
      return NextResponse.json({ error: "Social link ID is required." }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (platform !== undefined) updates.platform = String(platform).trim();
    if (url !== undefined) {
      const trimmedUrl = String(url).trim();
      if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://") && !trimmedUrl.startsWith("mailto:")) {
        return NextResponse.json(
          { error: "Invalid URL. Must start with https://, http://, or mailto:" },
          { status: 400 }
        );
      }
      updates.url = trimmedUrl;
    }
    if (display_order !== undefined) updates.display_order = Number(display_order);

    const { data, error } = await supabaseAdmin
      .from("social_links")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    return NextResponse.json({ success: true, socialLink: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update social link";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Social link ID is required." }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("social_links").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Social link deleted." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete social link";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
