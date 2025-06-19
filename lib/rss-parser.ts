// RSS Feed parser for Brazilian crypto news
interface NewsItem {
  title: string
  description: string
  link: string
  pubDate: string
  image?: string
}

export async function fetchCryptoNews(): Promise<NewsItem[]> {
  try {
    // Using RSS2JSON service to parse RSS feeds
    const feeds = [
      "https://api.rss2json.com/v1/api.json?rss_url=https://portaldobitcoin.uol.com.br/feed/",
      "https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com.br/rss",
    ]

    const allNews: NewsItem[] = []

    for (const feedUrl of feeds) {
      try {
        const response = await fetch(feedUrl, {
          next: { revalidate: 3600 }, // Cache for 1 hour
          headers: {
            Accept: "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.items) {
            const newsItems = data.items.slice(0, 5).map((item: any) => ({
              title: item.title,
              description: item.description?.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
              link: item.link,
              pubDate: item.pubDate,
              image: item.enclosure?.link || item.thumbnail || null,
            }))
            allNews.push(...newsItems)
          }
        }
      } catch (error) {
        console.error("Error fetching feed:", feedUrl, error)
      }
    }

    // Sort by date and return top 6
    return allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()).slice(0, 6)
  } catch (error) {
    console.error("Error fetching crypto news:", error)
    return []
  }
}
