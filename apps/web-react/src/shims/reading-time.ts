export default function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return {
    text: `${minutes} min read`,
    minutes: minutes,
    time: minutes * 60000,
    words: words
  };
}
