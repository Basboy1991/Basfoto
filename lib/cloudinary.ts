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
};

function normalize(resources: any[]): CloudImage[] {
  return (resources ?? []).map((r: any) => ({
    public_id: r.public_id,
    secure_url: r.secure_url,
    width: r.width,
    height: r.height,
    created_at: r.created_at,
  }));
}

export async function listImagesByFolder(folder: string, maxResults = 80): Promise<CloudImage[]> {
  // 1) Search API
  try {
    const res1 = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by("created_at", "desc")
      .max_results(maxResults)
      .execute();

    const imgs1 = normalize((res1 as any)?.resources);
    if (imgs1.length > 0) return imgs1;

    const res1b = await cloudinary.search
      .expression(`folder:${folder}/*`)
      .sort_by("created_at", "desc")
      .max_results(maxResults)
      .execute();

    const imgs1b = normalize((res1b as any)?.resources);
    if (imgs1b.length > 0) return imgs1b;
  } catch {
    // fallback hieronder
  }

  // 2) Fallback: Admin API prefix
  const prefix = folder.endsWith("/") ? folder : `${folder}/`;

  const res2 = await cloudinary.api.resources({
    type: "upload",
    prefix,
    max_results: Math.min(maxResults, 500),
  });

  return normalize((res2 as any)?.resources);
}

export function cloudinaryImg(publicId: string, w: number, h: number) {
  const cloudName = mustEnv("CLOUDINARY_CLOUD_NAME");
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto:eco,c_fill,w_${w},h_${h}/${publicId}`;
}
