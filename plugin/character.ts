export type Character = {
	id: string; // added field
	version: Version;
	type: string;
	name: string;
	description: string;
	gender: string;
	homeworld: string;
	deity: string;
	alignment: string;
	quickNotes: string;
	languages: string;
	campaignNotes: string;
	situationalBonuses: Bonus[];
	conditions: { [key: string]: Condition };
	negativeLevels: NegativeLevels;
	afflictions: Affliction[];
	abilityScores: AbilityScores;
	skills: Skill[];
	vitals: Vitals;
	speed: Speed;
	initiative: Score;
	armorClass: ArmorClass;
	resistances: Resistances;
	saves: Saves;
	attackBonuses: AttackBonuses;
	race: Race;
	theme: Theme;
	classes: ClassElement[];
	freeArchetypes: unknown[];
	feats: Feats;
	inventory: Inventory[];
	bulk: Bulk;
	credits: number;
	upbs: number;
	senses: Sense[];
	counters: Counter[];
	additionalSpells: unknown[];
	drone: null;
};

type Affliction = {
	id: string;
	name: string;
	notes: string;
	track: string;
	progression: Progression[];
};

type Progression = {
	name: string;
	description: string;
};

type Bonus = {
	bonus: string;
	source: string;
};

type AbilityScores = {
	strength: Charisma;
	dexterity: Charisma;
	constitution: Charisma;
	intelligence: Charisma;
	wisdom: Charisma;
	charisma: Charisma;
	increases: Array<string[]>;
	method: string;
};

type Charisma = {
	total: number;
	base: null;
	override: number | null;
	increases: number;
	pointBuy: number;
	damage: number;
	scoreBonuses: ScoreBonusElement[];
	modifierBonuses: unknown[];
	notes: string;
};

type ScoreBonusElement = {
	value: number;
	type: string;
	source: string;
};

type ArmorClass = {
	eac: Score;
	kac: Score;
	acVsCombatManeuver: Score;
};

type Score = {
	total: number;
	override?: null;
	bonuses?: unknown[];
	notes: string;
	ability?: Ability;
	base?: number;
};

type Ability =
	| "Dexterity"
	| "Strength"
	| "Charisma"
	| "Intelligence"
	| "Wisdom"
	| "Constitution";

type AttackBonuses = {
	bab: Bab;
	melee: Score;
	ranged: Score;
	thrown: Score;
	otherBonuses: unknown[];
};

type Bab = {
	total: number;
	base: number;
	notes: string;
};

type Bulk = {
	current: Score;
	encumbered: Encumbered;
	overburdened: Overburdened;
};

type Encumbered = {
	limit: number;
};

type Overburdened = {
	limit: number;
	override: null;
	notes: string;
};

type ClassElement = {
	name: string;
	description: string;
	baseHitPoints: number;
	baseStaminaPoints: number;
	baseSkillRanksPerLevel: number;
	keyAbility: Ability;
	levels: number;
	spells: Spell[];
	spellsUsed: unknown[];
	spellsKnown: number[];
	spellsPerDay: number[];
	baseAttackBonus: number;
	savingThrows: SavingThrows;
	classSkills: string[];
	features: Feature[];
	archetype: null;
};

type Feature = {
	name: string;
	description: string;
	options: Option[];
};

type Option = {
	name: string;
	description: string;
	effects: OptionEffect[];
};

type OptionEffect = {
	name: string;
	description: string;
};

type SavingThrows = {
	fortitude: number;
	reflex: number;
	will: number;
};

type Spell = {
	name: string;
	description: string;
	school: string;
	level: SpellLevel[];
	castingTime: string;
	range: string;
	area: null | string;
	effect: null | string;
	target: null | string;
	duration: string;
	dismissible: boolean;
	savingThrow: SavingThrow[] | null;
	spellResistance: SpellResistance[] | null;
	reference: Reference;
};

type SpellLevel = {
	class: CasterClass;
	level: number;
};

type CasterClass = "Mystic" | "Technomancer" | "Witchwarper" | "Precog";

type Reference = {
	name: string;
	shortName: string;
	page: number;
};

type SavingThrow = {
	save: string;
	effect: string;
};

type SpellResistance = {
	resistance: boolean;
	effect: null | string;
};

type Condition = {
	active: boolean;
	notes: string;
};

type Counter = {
	id: string;
	name: string;
	value: number;
	default: number;
};

type Feats = {
	acquiredFeats: AcquiredFeat[];
	notes: string;
};

type AcquiredFeat = {
	name: string;
	description: string;
	prerequisite: null | string;
	benefit: string;
	benefitEffect: BenefitEffectElement[] | null;
	normal: null | string;
	special: null;
	isCombatFeat: boolean;
	selectedOptions: AcquiredFeatSelectedOption[] | null;
	reference: Reference;
};

type BenefitEffectElement = {
	bonus: BenefitEffectBonus;
};

type BenefitEffectBonus = {
	value: PurpleValue;
	property: string;
	bonusType: string;
};

type PurpleValue = {
	int: number;
};

type AcquiredFeatSelectedOption = {
	name: string;
	descriptions: string;
	effect: PurpleEffect[];
};

type PurpleEffect = {
	bonus: PurpleBonus;
};

type PurpleBonus = {
	value: FluffyValue;
	property: string;
	bonusType: string;
};

type FluffyValue = {
	property: string;
};

type Inventory = {
	type: string;
	id: string;
	name: string;
	description: string;
	level?: number;
	price?: number;
	isEquipped?: boolean;
	installedSystems?: InstalledSystems;
	selectedOptions?: InventorySelectedOption[] | null;
	augmentationType?: string;
	systems?: Array<string[]>;
	notes?: string;
	reference?: Reference;
	quantity: number;
	tags: unknown[];
	bulk?: number;
	isEquippable?: boolean;
	isConsumable?: boolean;
	hands?: number | null;
	capacity?: number | null;
	usage?: Usage;
	itemType?: string;
	stashed?: boolean;
	slots?: number;
	forArmorTypes?: string[];
	ammunitionId?: null | string;
	isInstalled?: boolean;
	upgradeIds?: string[];
	eacBonus?: number;
	kacBonus?: number;
	maxDexBonus?: number;
	armorCheckPenalty?: number;
	speedAdjustment?: number;
	upgradeSlots?: number;
	armorType?: string;
	weaponType?: string;
	handedness?: number;
	category?: null | string;
	toHit?: number;
	damage?: Damage;
	damageBonus?: number;
	critical?: Critical | null;
	special?: Critical[] | null;
	range?: number | null;
	ammunitionType?: null | string;
	accessoryIds?: unknown[];
	fusionIds?: unknown[];
	proficient?: boolean;
	specialization?: boolean;
	speed?: InventorySpeed;
	strength?: number;
	unarmedDamage?: Damage;
	size?: string;
	weaponSlots?: number;
	reach?: number;
	used?: number;
};

type Critical = {
	name: string;
	additionalInfo: null | string;
};

type Damage = {
	dice: Dice;
	damage: string[];
	alternateDamage: unknown[] | null;
};

type Dice = {
	count: number;
	sides: number;
};

type InstalledSystems = InstalledSystem[] | null | string;

type InstalledSystem = {
	type: string;
	id: string;
	name: string;
	description: string;
	price: number;
	selectedOptions: null;
	reference: Reference;
};

type InventorySelectedOption = {
	name: Ability;
	descriptions: string;
	effect: BenefitEffectElement[];
};

type InventorySpeed = {
	land: number;
};

type Usage = number | null | string;

type NegativeLevels = {
	permanent: number;
	temporary: number;
};

type Race = {
	name: string;
	description: string;
	size: string;
	hitPoints: number;
	selectedTraits: SelectedTrait[];
	abilityAdjustment: AbilityAdjustment;
	speed: InventorySpeed;
	reference: Reference;
};

type AbilityAdjustment = {
	name: string;
	description: string;
	adjustment: string[];
};

type SelectedTrait = {
	name: string;
	description: string;
	selectedOptions: SelectedTraitSelectedOption[] | null;
	level?: number;
};

type SelectedTraitSelectedOption = {
	name: string;
	descriptions: string;
};

type Resistances = {
	dr: Record<string, Resistance>;
	er: Record<string, Resistance>;
	sr: number;
};

type Resistance = {
	value: number;
	sources: unknown;
};

type Saves = {
	fortitude: Score;
	reflex: Score;
	will: Score;
};

type Sense = {
	senseType: string;
	additionalInfo: null;
	range: number;
};

type Skill = {
	total: number;
	override: null;
	skill: string;
	name: null | string;
	ranks: number;
	bonuses: ScoreBonusElement[];
	ability: Ability;
	classSkill: boolean;
	trainedOnly: boolean;
	notes: string;
};

type Speed = Record<string, string | number>;

type Theme = {
	name: string;
	bonus: string;
	description: string;
	benefits: SelectedTrait[];
	reference: Reference;
};

type Version = {
	major: number;
	minor: number;
};

type Vitals = {
	temporary: number;
	stamina: Health;
	health: Health;
	resolve: Health;
};

type Health = {
	max: number;
	override: null;
	damage: number;
	bonuses: unknown[];
	notes: string;
};
