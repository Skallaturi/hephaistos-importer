/** auto-generated types using https://app.quicktype.io/
 * Don't mind the type names
 */
export type HephaistosResponse = {
	data: Data;
};
type Data = {
	characters: Character[];
};

export type Character = {
	id: string;
	inventory: Inventory[];
	shieldOverrides: unknown[];
	armorOverrides: Override[];
	theme: CharacterTheme;
	race: CharacterRace;
	save: Save;
	resistance: Resistance;
	defence: Defence;
	initiativeNotes: string;
	initiativeOverride: null;
	speed: Speed;
	vitals: Vitals;
	bonusRanks: number;
	abilityScores: AbilityScores;
	conditions: { [key: string]: Condition };
	name: string;
	classes: ClassElement[];
};

type AbilityScores = {
	method: string;
	increases: Array<string[]>;
	cha: Cha;
	wis: Cha;
	int: Cha;
	con: Cha;
	dex: Cha;
	str: Cha;
};

type Cha = {
	customBonus: CustomBonus[];
	notes: string;
	damage: number;
	pointBuy: number;
	base: null;
	override: number | null;
};

type CustomBonus = {
	id: string;
	bonusType: string;
	value: number;
	dice: null;
	source: string;
	active: boolean;
};

type Override = {
	strengthOverride: null;
	proficiencyOverride?: null;
	armorCheckPenaltyOverride: null;
	maxDexBonusOverride: null;
	kacBonusOverride: null;
	eacBonusOverride: null;
	isEquipped: boolean;
	speedAdjustmentOverride?: null;
};

type ClassElement = {
	class: ClassClassClass;
};

type ClassClassClass = {
	armorProficiency: string[];
};

type Condition = {
	override: boolean | null;
};

type Defence = {
	cmdCustomBonus: unknown[];
	cmdNotes: string;
	cmdOverride: null;
	kacCustomBonus: unknown[];
	kacNotes: string;
	kacOverride: null;
	eacCustomBonus: unknown[];
	eacNotes: string;
	eacOverride: null;
};

type Inventory = {
	__typename: string;
	maxDexBonusOverride?: number | null;
	kacBonusOverride?: number | null;
	eacBonusOverride?: number | null;
	isEquipped?: boolean;
	armor?: Armor;
	alignedAcBonusOverride?: null;
	wieldAcBonusOverride?: null;
	shield?: Shield;
	augmentation?: Augmentation;
	selectedOptions?: SelectedOption[];
	override?: Override;
	armorPerksIds?: string[];
	armorFlawsIds?: string[];
	armorType?: string;
};

type Armor = {
	__typename: string;
	type?: string;
	maxDexBonus: number;
	kacBonus: number;
	eacBonus: number;
	strength?: number;
	speed?: Movement[];
};

type Movement = {
	speed: number;
	type: string;
};

type Augmentation = {
	options: AbilityAdjustment[];
	type: string;
};

type AbilityAdjustment = {
	id: string;
	effect: string;
};

type SelectedOption = {
	key: string;
	value: string;
};

type Shield = {
	maxDexBonus: number;
	alignedAcBonus: number;
	wieldAcBonus: number;
};

type CharacterRace = {
	race: RaceRace;
	selectedAdjustment: string;
	selectedTraits: string[];
};

type RaceRace = {
	movement: Movement[];
	abilityAdjustment: AbilityAdjustment[];
	racialTraits: AbilityAdjustment[];
	hitPoints: number;
};

type Resistance = {
	srNotes: string;
	srOverride: null;
	erNotes: string;
	erOverride: unknown[];
	drNotes: string;
	drOverride: unknown[];
};

type Save = {
	fortitudeOverride: null;
	fortitudeNotes: string;
	fortitudeCustomBonus: unknown[];
	reflexOverride: null;
	reflexNotes: string;
	reflexCustomBonus: unknown[];
	willOverride: null;
	willNotes: string;
	willCustomBonus: unknown[];
};

type Speed = {
	override: unknown[];
	notes: string;
};

type CharacterTheme = {
	selectedBenefitOptions: SelectedOption[];
	theme: ThemeTheme;
};

type ThemeTheme = {
	benefits: Benefit[];
};

type Benefit = {
	effect: null | string;
	optionSelection: number | null;
	options: AbilityAdjustment[] | null;
};

type Vitals = {
	temporary: number;
	hardness: Hardness;
	stamina: Hardness;
	health: Hardness;
	resolve: Hardness;
};

type Hardness = {
	damage: number;
	override: null;
	notes: string;
};
