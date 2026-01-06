export function toYoutubeEmbed(url: string): string | undefined {
  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.replace("/", "")
      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : undefined
    }

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v")
      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : undefined
    }

    return undefined
  } catch {
    return undefined
  }
}