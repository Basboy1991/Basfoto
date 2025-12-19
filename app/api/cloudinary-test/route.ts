import { NextResponse } from "next/server";
import { listImagesByFolder } from "@/lib/cloudinary.server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder") || "Portfolio/huisdieren";

  try {
    const images = await listImagesByFolder(folder, 5);

    return NextResponse.json({
      ok: true,
      folder,
      count: images.length,
      sample: images,
    });
  } catch (err: any) {
    // Geef ALLES terug wat handig is voor debug
    const message =
      err?.message || err?.error?.message || err?.response?.data?.error?.message || String(err);

    // Log ook in server console
    console.error("Cloudinary test error:", err);

    return NextResponse.json(
      {
        ok: false,
        folder,
        message,
        raw: {
          name: err?.name,
          http_code: err?.http_code,
          error: err?.error,
        },
      },
      { status: 500 }
    );
  }
}
