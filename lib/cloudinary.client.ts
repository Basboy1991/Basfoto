export function cloudinaryImg(publicId: string, w: number, h: number) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto:eco,c_fill,w_${w},h_${h}/${publicId}`;
}
