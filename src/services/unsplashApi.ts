// Unsplash Source URL for random images based on keyword
// This is a simple approach that doesn't require API key

const UNSPLASH_SOURCE_URL = 'https://source.unsplash.com';

export function getUnsplashImageUrl(
  keyword: string,
  width: number = 800,
  height: number = 400
): string {
  const encodedKeyword = encodeURIComponent(keyword);
  return `${UNSPLASH_SOURCE_URL}/${width}x${height}/?${encodedKeyword}`;
}

export function getUnsplashFeaturedImageUrl(
  keyword: string,
  width: number = 800,
  height: number = 400
): string {
  const encodedKeyword = encodeURIComponent(keyword);
  return `${UNSPLASH_SOURCE_URL}/featured/${width}x${height}/?${encodedKeyword}`;
}

// Alternative: Using Unsplash random photo endpoint
export function getRandomUnsplashUrl(
  keyword: string,
  width: number = 800,
  height: number = 400
): string {
  const encodedKeyword = encodeURIComponent(keyword);
  // Using random with keyword for variety
  return `${UNSPLASH_SOURCE_URL}/random/${width}x${height}/?${encodedKeyword}&sig=${Date.now()}`;
}
