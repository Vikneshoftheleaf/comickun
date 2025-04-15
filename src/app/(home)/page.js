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
  
        const text = await response.text();
        if (!text) return null;
  
        const data = JSON.parse(text);
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
  
        const coverUrl = coverFileName
          ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}.256.jpg`
          : null;
  
        return {
          id: manga.id,
          title: manga.attributes.title.en || 'No Title',
          coverUrl,
        };
      })
    );
  
    return (
      <HomeComponent mangaList={mangaWithCovers} />
    );
  }
  