import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // 1. Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit." },
        { status: 400 }
      );
    }

    // 2. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type: ${file.type}. Allowed formats: JPG, PNG, WebP, SVG, GIF.`,
        },
        { status: 400 }
      );
    }

    // 3. Generate randomized unique filename with extension
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const randomHex = crypto.randomBytes(12).toString("hex");
    const sanitizedBase = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 20);
    const filename = `upload-${Date.now()}-${randomHex}-${sanitizedBase}.${extension}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // 4. Upload to Supabase Storage bucket 'portfolio-media'
    const { error: uploadError } = await supabaseAdmin.storage
      .from("portfolio-media")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 5. Get Public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("portfolio-media")
      .getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      filename,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error uploading image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
