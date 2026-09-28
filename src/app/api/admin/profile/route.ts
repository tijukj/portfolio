import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from("profile").select("*").limit(1).maybeSingle();
    if (error) throw error;
    return NextResponse.json({ profile: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, tagline, intro, email, photo_url } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Profile name is required." }, { status: 400 });
    }

    let result;
    if (id) {
      result = await supabaseAdmin
        .from("profile")
        .update({
          name: name.trim(),
          tagline: (tagline || "").trim(),
          intro: (intro || "").trim(),
          email: (email || "").trim() || null,
          photo_url: photo_url || null,
        })
        .eq("id", id)
        .select()
        .single();
    } else {
      result = await supabaseAdmin
        .from("profile")
        .insert({
          name: name.trim(),
          tagline: (tagline || "").trim(),
          intro: (intro || "").trim(),
          email: (email || "").trim() || null,
          photo_url: photo_url || null,
        })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    // Immediately revalidate the public page
    revalidatePath("/");

    return NextResponse.json({ success: true, profile: result.data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
