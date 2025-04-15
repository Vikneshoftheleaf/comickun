import MangaPageComponent from "@/components/pages/manga-page-component";

export default async function MangaPage({ params }) {

    const id = params.slug

    async function getMangaDetails(id) {
        try {

            // Validate the id
            if (!id) {
                return null
            }

            // Construct the URL for the MangaDex API request
            const mangaUrl = `https://api.mangadex.org/manga/${id}?includes[]=author&includes[]=artist&includes[]=cover_art`;

            // Fetch data from the MangaDex API
            const res = await fetch(mangaUrl, {
                headers: {
                    'User-Agent': 'comickun/1.0',
                },
            });

            // If the response is successful, parse and return the data
            if (!res.ok) {
                return null
            }

            const mangaData = await res.json();
            const mangaInfo = mangaData.data;

            const coverRel = mangaInfo.relationships.find(r => r.type === 'cover_art');
            const coverFileName = coverRel?.attributes?.fileName;
            const coverImg = coverFileName
                ? `https://uploads.mangadex.org/covers/${id}/${coverFileName}.512.jpg`
                : null;

            return {
                title: mangaInfo.attributes.title.en || 'No Title',
                coverImage: coverImg,
                description: mangaInfo.attributes.description.en || 'No description',
                status: mangaInfo.attributes.status,
                tags: mangaInfo.attributes.tags.map(tag => tag.attributes.name.en),
                author: mangaInfo.relationships.find(r => r.type === 'author')?.attributes?.name || 'Unknown',
            };


        } catch (error) {
            console.error(error);
            return null
        }
    }

    async function getChapters(id) {
        try {
      
          if (!id) {
            return null
          }
      
          const chapterUrl = `https://api.mangadex.org/chapter?manga=${id}&translatedLanguage[]=en&order[chapter]=asc&limit=100`;
      
          const res = await fetch(chapterUrl, {
            headers: {
              'User-Agent': 'comickun/1.0', // Required by MangaDex
            },
          });
      
          if (!res.ok) {
            return null
          }
      
          const data = await res.json();
          return data
        } catch (error) {
            return null
        }
      }

    const manga = await getMangaDetails(id)
    const chapters = await getChapters(id)
    return <MangaPageComponent manga={manga} chapters={chapters} />
}