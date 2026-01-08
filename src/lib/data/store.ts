// Arc Spirits TTS Data Store
import type {
	TTSExportData,
	HexSpirit,
	Origin,
	Class,
	SpiritWithDetails,
	OriginWithSpirits,
	ClassWithSpirits
} from './types';

const TTS_EXPORT_ENDPOINT =
	'https://gvxfokbptelmvvlxbigh.supabase.co/functions/v1/export-all-tts-json';

// Cache for the fetched data
let cachedData: TTSExportData | null = null;
let fetchPromise: Promise<TTSExportData> | null = null;

/**
 * Fetch TTS export data from the backend
 * Uses caching to avoid redundant fetches
 */
export async function fetchTTSData(): Promise<TTSExportData> {
	// Return cached data if available
	if (cachedData) {
		return cachedData;
	}

	// Return existing promise if fetch is in progress
	if (fetchPromise) {
		return fetchPromise;
	}

	// Start new fetch
	fetchPromise = fetch(TTS_EXPORT_ENDPOINT)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Failed to fetch TTS data: ${response.status}`);
			}
			return response.json();
		})
		.then((data: TTSExportData) => {
			cachedData = data;
			return data;
		})
		.finally(() => {
			fetchPromise = null;
		});

	return fetchPromise;
}

/**
 * Clear the cached data (useful for forcing refresh)
 */
export function clearCache(): void {
	cachedData = null;
	fetchPromise = null;
}

/**
 * Get unique hex spirits (deduplicated by name)
 */
export function getUniqueSpirits(data: TTSExportData): HexSpirit[] {
	const seen = new Set<string>();
	return data.hex_spirits.filter((spirit) => {
		if (seen.has(spirit.name)) {
			return false;
		}
		seen.add(spirit.name);
		return true;
	});
}

/**
 * Get spirits with their full origin and class details
 */
export function getSpiritsWithDetails(data: TTSExportData): SpiritWithDetails[] {
	const originMap = new Map(data.origins.map((o) => [o.id, o]));
	const classMap = new Map(data.classes.map((c) => [c.id, c]));

	return getUniqueSpirits(data).map((spirit) => ({
		...spirit,
		originDetails: spirit.traits.origins
			.map((id) => originMap.get(id))
			.filter((o): o is Origin => o !== undefined),
		classDetails: spirit.traits.classes
			.map((id) => classMap.get(id))
			.filter((c): c is Class => c !== undefined)
	}));
}

/**
 * Get origins with their associated spirits
 */
export function getOriginsWithSpirits(data: TTSExportData): OriginWithSpirits[] {
	const uniqueSpirits = getUniqueSpirits(data);

	return data.origins.map((origin) => {
		const spirits = uniqueSpirits.filter((spirit) => spirit.traits.origins.includes(origin.id));
		return {
			...origin,
			spirits,
			uniqueCount: spirits.length
		};
	});
}

/**
 * Get classes with their associated spirits
 */
export function getClassesWithSpirits(data: TTSExportData): ClassWithSpirits[] {
	const uniqueSpirits = getUniqueSpirits(data);

	return data.classes.map((cls) => {
		const spirits = uniqueSpirits.filter((spirit) => spirit.traits.classes.includes(cls.id));
		return {
			...cls,
			spirits,
			count: spirits.length
		};
	});
}

/**
 * Get random spirits for showcase
 */
export function getRandomSpirits(data: TTSExportData, count: number): HexSpirit[] {
	const unique = getUniqueSpirits(data);
	const shuffled = [...unique].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, count);
}

/**
 * Get spirits grouped by origin
 */
export function getSpiritsByOrigin(data: TTSExportData): Map<string, HexSpirit[]> {
	const result = new Map<string, HexSpirit[]>();
	const uniqueSpirits = getUniqueSpirits(data);

	for (const origin of data.origins) {
		const spirits = uniqueSpirits.filter((s) => s.traits.origins.includes(origin.id));
		result.set(origin.id, spirits);
	}

	return result;
}

/**
 * Get spirits grouped by class
 */
export function getSpiritsByClass(data: TTSExportData): Map<string, HexSpirit[]> {
	const result = new Map<string, HexSpirit[]>();
	const uniqueSpirits = getUniqueSpirits(data);

	for (const cls of data.classes) {
		const spirits = uniqueSpirits.filter((s) => s.traits.classes.includes(cls.id));
		result.set(cls.id, spirits);
	}

	return result;
}

/**
 * Search spirits by name
 */
export function searchSpirits(data: TTSExportData, query: string): HexSpirit[] {
	const lowerQuery = query.toLowerCase();
	return getUniqueSpirits(data).filter((spirit) => spirit.name.toLowerCase().includes(lowerQuery));
}

/**
 * Get statistics about the game data
 */
export function getStats(data: TTSExportData) {
	const uniqueSpirits = getUniqueSpirits(data);

	return {
		totalSpirits: data.hex_spirits.length,
		uniqueSpirits: uniqueSpirits.length,
		origins: data.origins.length,
		classes: data.classes.length,
		artifacts: data.artifacts.length,
		monsters: data.monsters.length,
		locations: data.game_locations.length,
		guardians: data.guardians.length,
		runes: data.runes.length,
		quests: data.traveler_quests.length
	};
}
