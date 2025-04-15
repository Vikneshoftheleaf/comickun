// app/manga/[slug]/page.tsx or pages/manga/[slug].tsx
import MangaPageComponent from "@/components/pages/manga-page-component";

export default async function MangaPage({ params }) {
  const id = params.slug;

  async function getMangaDetails(id) {
    if (!id) return null;

    try {
      const mangaUrl = `https://api.mangadex.org/manga/${id}?includes[]=author&includes[]=artist&includes[]=cover_art`;
      const res = await fetch(mangaUrl, {
        headers: { 'User-Agent': 'comickun/1.0' },
      });

      if (!res.ok) return null;

      const { data: mangaInfo } = await res.json();

      const coverRel = mangaInfo.relationships.find(r => r.type === 'cover_art');
      const coverFileName = coverRel?.attributes?.fileName;
      if (!coverFileName) return null;

      const imageRes = await fetch(`https://uploads.mangadex.org/covers/${id}/${coverFileName}.256.jpg`, {
        headers: { 'User-Agent': 'comickun/1.0' },
      });

      const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
      const buffer = await imageRes.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const coverUrl = `data:${contentType};base64,${base64}`;

      return {
        title: mangaInfo.attributes.title.en || 'No Title',
        description: mangaInfo.attributes.description.en || 'No description available.',
        status: mangaInfo.attributes.status || 'Unknown',
        tags: mangaInfo.attributes.tags.map(tag => tag.attributes.name.en),
        author: mangaInfo.relationships.find(r => r.type === 'author')?.attributes?.name || 'Unknown',
        coverImage: coverUrl,
      };
    } catch (error) {
      console.error("Failed to fetch manga details:", error);
      return null;
    }
  }

  async function getChapters(id) {
    if (!id) return null;

    try {
      const chapterUrl = `https://api.mangadex.org/chapter?manga=${id}&translatedLanguage[]=en&order[chapter]=asc&limit=100`;
      const res = await fetch(chapterUrl, {
        headers: { 'User-Agent': 'comickun/1.0' },
      });

      if (!res.ok) return null;

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch chapters:", error);
      return null;
    }
  }

  const manga = await getMangaDetails(id);
  const chapters = await getChapters(id);

  if (!manga) return <div>Failed to load manga details.</div>;

  return <MangaPageComponent manga={manga} chapters={chapters} />;
}
