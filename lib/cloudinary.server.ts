import "server-only";
import { v2 as cloudinary } from "cloudinary";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

cloudinary.config({
  cloud_name: mustEnv("CLOUDINARY_CLOUD_NAME"),
  api_key: mustEnv("CLOUDINARY_API_KEY"),
  api_secret: mustEnv("CLOUDINARY_API_SECRET"),
});

export type CloudImage = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  created_at?: string;

  // ✅ voor lightbox + SEO
  caption?: string;
  alt?: string;
};

function normalize(resources: any[]): CloudImage[] {
  return (resources ?? []).map((r: any) => ({
    public_id: r.public_id,
    secure_url: r.secure_url,
    width: r.width,
    height: r.height,
    created_at: r.created_at,

    // ✅ komt uit Cloudinary: context → custom
    caption: r?.context?.custom?.caption,
    alt: r?.context?.custom?.alt,
  }));
}

export async function listImagesByFolder(folder: string, maxResults = 80): Promise<CloudImage[]> {
  const res = await cloudinary.search
    .expression(`folder:${folder}/*`)
    .with_field("context") // ✅ nodig om caption/alt mee te krijgen
    .sort_by("created_at", "desc")
    .max_results(maxResults)
    .execute();

  return normalize((res as any)?.resources);
}
