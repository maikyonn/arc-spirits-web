import type { LayoutServerLoad } from './$types';
import type { TTSExportData } from '$lib/data/types';

const TTS_EXPORT_ENDPOINT =
	'https://gvxfokbptelmvvlxbigh.supabase.co/functions/v1/export-all-tts-json';

export const load: LayoutServerLoad = async ({ fetch, setHeaders }) => {
	try {
		const res = await fetch(TTS_EXPORT_ENDPOINT, {
			headers: { accept: 'application/json' }
		});

		if (!res.ok) {
			setHeaders({
				'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
			});
			return { tts: null };
		}

		const tts = (await res.json()) as TTSExportData;

		setHeaders({
			'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
		});

		return { tts };
	} catch {
		setHeaders({
			'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
		});
		return { tts: null };
	}
};

