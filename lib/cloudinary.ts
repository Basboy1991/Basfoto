import { v2 as cloudinary } from "cloudinary";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

// Config (server-only)
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

/**
 * Haal afbeeldingen op uit een Cloudinary folder.
 * - Probeert eerst Search API (folder:..), daarna fallback op Admin API prefix (prefix:..)
 * - Dit maakt het robuust bij "folder UI vs public_id" verschillen.
 */
export async function listImagesByFolder(folder: string, maxResults = 80): Promise<CloudImage[]> {
  // 1) Search API (vaak het best)
  try {
    const res1 = await cloudinary.search
      // beide varianten proberen: sommige accounts werken beter met folder:PATH dan folder:PATH/*
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
    // negeren en door naar fallback
  }

  // 2) Fallback: Admin API prefix (werkt als public_id het folderpad bevat)
  // Let op: prefix moet eindigen op /
  const prefix = folder.endsWith("/") ? folder : `${folder}/`;

  const res2 = await cloudinary.api.resources({
    type: "upload",
    prefix,
    max_results: Math.min(maxResults, 500),
  });

  return normalize((res2 as any)?.resources);
}

/**
 * Cloudinary URL builder voor snelle, moderne formaten:
 * - f_auto: AVIF/WebP automatisch
 * - q_auto:eco: nette kwaliteit / performance
 * - c_fill + vaste w/h => geen CLS (layout blijft stabiel)
 */
export function cloudinaryImg(publicId: string, w: number, h: number) {
  const cloudName = mustEnv("CLOUDINARY_CLOUD_NAME");
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto:eco,c_fill,w_${w},h_${h}/${publicId}`;
}

/**
 * Variant voor "contain" (geen croppen, wel letterboxing)
 * handig voor sommige portfolio beelden als je niets wil afsnijden.
 */
export function cloudinaryImgContain(publicId: string, w: number, h: number) {
  const cloudName = mustEnv("CLOUDINARY_CLOUD_NAME");
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto:eco,c_contain,w_${w},h_${h}/${publicId}`;
}
