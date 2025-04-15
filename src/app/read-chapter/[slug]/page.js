import ReadChapterComponent from "@/components/pages/read-chapter-component";

export default async function ReadChapter({ params }) {
    const id = params.slug

    async function getChapterImages(chapterId) {
        try {
            if (!chapterId) {
                return null
            }

            const res = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`, {
                headers: {
                    'User-Agent': 'comickun/1.0',
                },
            });

            if (!res.ok) {
                return null;
            }

            const data = await res.json();
            return data
        } catch (err) {
            console.error(err);
            return null
        }
    }

    async function getChapterMeta(chapterId) {
        try {

            if (!chapterId) {
                return null
            }

            const metaRes = await fetch(`https://api.mangadex.org/chapter/${chapterId}`, {
                headers: {
                    'User-Agent': 'comickun/1.0',
                },
            });

            if (!metaRes.ok) {
                return null
            }

            const metadata = await metaRes.json();
            return metadata
        } catch (err) {
            console.error('Error fetching chapter metadata:', err);
            return null
        }
    }

    const data = await getChapterImages(id)
    const baseUrl = data.baseUrl;
    const hash = data.chapter.hash;
    const imageFiles = data.chapter.data;
    const fullPageUrls = imageFiles.map(file => `${baseUrl}/data/${hash}/${file}`);
    const meta = getChapterMeta(id)

    return <ReadChapterComponent pages={fullPageUrls}/>

}