// app/page.tsx or pages/index.tsx (depending on App or Pages Router)
import HomeComponent from "@/components/pages/home-component";

export default async function HomePage() {
  async function getPageData() {
    try {
      const response = await fetch(
        'https://api.mangadex.org/manga?limit=10&order[followedCount]=desc&includes[]=cover_art',
        {
          headers: {
            'User-Agent': 'comickun/1.0',
          },
        }
      );

      if (!response.ok) return null;

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching manga data:', error);
      return null;
    }
  }

  const data = await getPageData();
  if (!data || !data.data) return <div>Failed to load data</div>;

  const mangaWithCovers = await Promise.all(
    data.data.map(async (manga) => {
      const coverArt = manga.relationships.find((rel) => rel.type === 'cover_art');
      const coverFileName = coverArt?.attributes?.fileName;

      if (!coverFileName) return null;

      try {
        const response = await fetch(`https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}.256.jpg`, {
          headers: {
            'User-Agent': 'comickun/1.0',
          },
        });

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const coverUrl = `data:${contentType};base64,${base64}`;

        return {
          id: manga.id,
          title: manga.attributes.title.en || 'No Title',
          coverUrl,
        };
      } catch (err) {
        console.error(`Failed to fetch cover for manga ${manga.id}`);
        return null;
      }
    })
  );

  const validMangaList = mangaWithCovers.filter(Boolean); // remove nulls

  return <HomeComponent mangaList={validMangaList} />;
}
