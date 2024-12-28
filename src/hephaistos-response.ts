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
	readOnlyPermalinkId: string;
	inventory: Inventory[];
	shieldOverrides: unknown[];
	armorOverrides: ArmorOverrideElement[];
	theme: CharacterTheme;
	race: CharacterRace;
	save: Save;
	resistance: Resistance;
	defence: Defence;
	initiativeOverride: null;
	speed: Speed;
	vitals: Vitals;
	bonusRanks: number;
	abilityScores: AbilityScores;
	classes: ClassElement[];
	feats: FeatElement[];
	conditions: { [key: string]: Speed };
	name: string;
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

type ArmorOverrideElement = {
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
	levels: number;
	class: ClassClassClass;
};

type ClassClassClass = {
	baseStaminaPoints: number;
	hitPoints: number;
	armorProficiencyDescription: string;
	armorProficiency: string[];
};

type Speed = {
	override: OverrideUnion;
};

type OverrideUnion = unknown[] | boolean | null;

type Defence = {
	cmdCustomBonus: unknown[];
	cmdOverride: null;
	kacCustomBonus: unknown[];
	kacOverride: null;
	eacCustomBonus: unknown[];
	eacOverride: null;
};

type Inventory = {
	__typename: Typename;
	maxDexBonusOverride?: number | null;
	kacBonusOverride?: number | null;
	eacBonusOverride?: number | null;
	isEquipped?: boolean;
	armor?: Armor;
	augmentation?: Augmentation;
	selectedOptions?: SelectedOption[];
	alignedAcBonusOverride?: number | null;
	wieldAcBonusOverride?: null;
	shield?: Shield;
	override?: ArmorOverrideElement;
	armorPerksIds?: string[];
	armorFlawsIds?: string[];
	armorType?: string;
};

type Typename =
	| "CharacterArmor"
	| "CharacterWeapon"
	| "CharacterAmmunition"
	| "CharacterAugmentation"
	| "CharacterItem"
	| "CharacterShield"
	| "CharacterArmorUpgrade"
	| "CharacterCustomItem"
	| "ScalingArmor";

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
	options: AbilityAdjustment[] | null;
	type: string;
};

type AbilityAdjustment = {
	id: string;
	effect: null | string;
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
	srOverride: null;
	erOverride: unknown[];
	drOverride: DROverride[];
};

type DROverride = {
	value: number;
	damageType: string;
};

type Save = {
	fortitudeOverride: null;
	fortitudeCustomBonus: unknown[];
	reflexOverride: null;
	reflexCustomBonus: unknown[];
	willOverride: null;
	willCustomBonus: unknown[];
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
};

type FeatElement = {
	feat: FeatFeat;
};

type FeatFeat = {
	benefit: null | string;
};
