export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return "/images/no-image.png";
  if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("/")) {
    return url;
  }
  // Prepend backend base URL for images
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "https://irendity-backend.onrender.com";
  return `${baseUrl}/uploads/${url}`;
};
