// Arc Spirits TTS Export Data Types

export interface Edition {
	name: string;
	origin_count: number;
	duplicate_rules: Record<string, number>;
}

export interface Origin {
	id: string;
	name: string;
	icon_url?: string;
	color?: string;
	description?: string;
}

export interface Class {
	id: string;
	name: string;
	icon_url?: string;
	description?: string;
	breakpoints?: ClassBreakpoint[];
}

export interface ClassBreakpoint {
	threshold: number;
	effect: string;
}

export interface HexSpirit {
	id: string;
	name: string;
	cost: number;
	traits: {
		origins: string[];
		classes: string[];
	};
	image_url: string;
	copy_index: number;
	total_copies: number;
}

export interface Artifact {
	id: string;
	name: string;
	description?: string;
	cost?: number;
	effect?: string;
	image_url?: string;
}

export interface Monster {
	id: string;
	name: string;
	type: 'monster' | 'event';
	barrier?: number;
	attack?: number;
	rewards?: MonsterReward[];
	image_url?: string;
}

export interface MonsterReward {
	type: string;
	amount: number;
}

export interface GameLocation {
	id: string;
	name: string;
	gains?: LocationGain[];
	trades?: LocationTrade[];
}

export interface LocationGain {
	resource: string;
	amount: number;
}

export interface LocationTrade {
	give: { resource: string; amount: number };
	receive: { resource: string; amount: number };
}

export interface Traveler {
	id: string;
	name: string;
	image_url?: string;
}

export interface TravelerQuest {
	id: string;
	traveler_id: string;
	name: string;
	description?: string;
	reward?: string;
}

export interface Guardian {
	id: string;
	name: string;
	ability?: string;
	image_url?: string;
	mat_image_url?: string;
	origin_id?: string;
	origin_name?: string;
}

export interface Rune {
	id: string;
	name: string;
	icon_url?: string;
	color?: string;
}

export interface Token {
	id: string;
	name: string;
	icon_url?: string;
}

export interface IconPoolItem {
	id: string;
	name: string;
	icon_url: string;
	category?: string;
}

export interface CustomDice {
	id: string;
	name: string;
	faces: DiceFace[];
}

export interface DiceFace {
	value: number | string;
	icon_url?: string;
}

export interface Board {
	id: string;
	name: string;
	image_url?: string;
}

export interface TTSMenu {
	background_url: string;
}

export interface TTSExportData {
	exported_at: string;
	edition: Edition;
	schema_docs: string;
	origins: Origin[];
	classes: Class[];
	hex_spirits: HexSpirit[];
	artifacts: Artifact[];
	monsters: Monster[];
	game_locations: GameLocation[];
	travelers: Traveler[];
	traveler_quests: TravelerQuest[];
	guardians: Guardian[];
	runes: Rune[];
	tokens: Token[];
	icon_pool: IconPoolItem[];
	custom_dice: CustomDice[];
	tts_menu: TTSMenu;
	boards: Board[];
}

// Derived/computed types for UI
export interface SpiritWithDetails extends HexSpirit {
	originDetails: Origin[];
	classDetails: Class[];
}

export interface OriginWithSpirits extends Origin {
	spirits: HexSpirit[];
	uniqueCount: number;
}

export interface ClassWithSpirits extends Class {
	spirits: HexSpirit[];
	count: number;
}
