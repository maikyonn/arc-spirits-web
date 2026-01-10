// Arc Spirits TTS Export Data Types (aligned to the backend export schema)

export interface Edition {
	name: string;
	origin_count: number;
	duplicate_rules: Record<string, number>;
}

export interface Origin {
	id: string;
	name: string;
	icon_url: string | null;
	color: string | null;
	description: string | null;
}

export interface ClassBreakpoint {
	threshold: number;
	effect: string;
}

export interface Class {
	id: string;
	name: string;
	icon_url: string | null;
	description: string | null;
	breakpoints: ClassBreakpoint[] | null;
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

export interface RecipeEntry {
	rune_id: string;
	quantity: number;
}

export interface Artifact {
	id: string;
	name: string;
	recipe_box: RecipeEntry[];
	guardian_id: string | null;
	image_path: string | null;
	tag_ids: string[];
	tag_names: (string | null)[];
}

export interface RewardIcon {
	id: string;
	name: string;
	image_url: string | null;
}

export type MonsterCardType = 'monster' | 'event';

export interface MonsterRewardRow {
	type:
		| 'all_in_combat'
		| 'all_in_combat_pick_one'
		| 'all_losers'
		| 'all_winners'
		| 'one_winner'
		| 'tournament';
	label: string | null;
	icons: RewardIcon[];
}

export interface Monster {
	id: string;
	name: string;
	type: MonsterCardType;
	state: 'tainted' | 'corrupt' | 'fallen' | 'arcane' | 'inactive' | 'event' | string;
	barrier: number | null;
	damage: number | null;
	order_num: number;
	image_url: string | null;
	effect_ids: string[];
	reward_rows: MonsterRewardRow[];
	copy_index: number;
	total_copies: number;
	// Event-only fields (present when type="event")
	event_name?: string;
	description?: string;
}

export type LocationRewardRow =
	| { type: 'gain'; icons: RewardIcon[] }
	| { type: 'trade'; cost_icons: RewardIcon[]; gain_icons: RewardIcon[] }
	| { type: 'text'; text: string };

export interface GameLocation {
	id: string;
	name: string;
	origin_id: string | null;
	origin_name: string | null;
	image_url: string | null;
	background_image_url: string | null;
	reward_rows: LocationRewardRow[];
}

export interface Traveler {
	id: string;
	name: string;
	image_url: string | null;
}

export interface TravelerQuest {
	id: string;
	traveler_id: string;
	name: string;
	description: string | null;
	reward: string | null;
}

export interface Guardian {
	id: string;
	name: string;
	ability: string | null;
	image_url: string | null;
	chibi_image_url?: string | null;
	mat_image_url: string | null;
	origin_id: string | null;
	origin_name: string | null;
}

export interface Rune {
	id: string;
	name: string;
	icon_url: string | null;
	color: string | null;
	type?: 'origin' | 'class' | string;
	origin_id?: string | null;
	origin_name?: string | null;
	class_id?: string | null;
	class_name?: string | null;
}

export interface Token {
	id: string;
	name: string;
	source_type?: string;
	image_url: string | null;
}

export interface IconPoolItem {
	id: string;
	name: string;
	image_url?: string | null;
	icon_url?: string | null;
	category?: string | null;
	source_type?: string;
	tags?: string[];
	export_as_token?: boolean;
}

export interface DiceFace {
	side_number: number;
	reward_type: string;
	reward_value: string;
	reward_description: string;
	icon_url?: string | null;
}

export interface CustomDice {
	id: string;
	name: string;
	description: string;
	icon: string | null;
	color: string | null;
	dice_type: string;
	prefab_image_url: string | null;
	faces: DiceFace[];
}

export interface Board {
	name: string;
	image_url: string | null;
}

export interface ScreenshotAsset {
	name: string;
	path: string;
	file_type: string;
	file_size: string;
	image_url: string;
	file_url: string;
}

export interface TTSMenu {
	background_url: string;
}

export interface IconGuideIcon {
	id: string;
	position: number;
	group?: string | null;
	name: string;
	description: string | null;
	image_url: string | null;
}

export interface SpecialEffect {
	id: string;
	name: string;
	description: string | null;
	icon: string | null;
	color: string | null;
}

export interface TTSExportData {
	exported_at: string;
	export_language?: string;
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
	icon_guide_png_url: string | null;
	icon_guide_icons: IconGuideIcon[];
	special_effects: SpecialEffect[];
	custom_dice: CustomDice[];
	tts_menu: TTSMenu;
	boards: Board[];
	screenshots?: ScreenshotAsset[];
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
