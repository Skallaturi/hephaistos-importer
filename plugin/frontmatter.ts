import { App, normalizePath } from "obsidian";
import { Character } from "./character";
import { HephaistosImporterPluginSettings } from "./settings";

type Frontmatter = {
	name: string;
	"hephaistos link": string;
	gender: string;
	homeworld: string;
	deity: string;
	alignment: string;
	abilities: Record<string, number>;
	race: string;
	classes: Record<string, number>;
	theme: string;
	stamina: number;
	"max stamina": number;
	health: number;
	"max health": number;
	resolve: number;
	resistances: string[];
	initiative: number;
	EAC: number;
	KAC: number;
	CMD: number;
	saves: Record<string, number>;
	conditions: string[];
	afflictions: Record<string, string>;
	speed: Record<string, string>;
	languages: string[];
	senses: Record<string, string>;
	skills: Record<string, number>;
	feats: string[];
	spells: string[];
	weapons: string[];
	armor?: string;
	augmentations: string[];
	inventory: string[];
	"situational bonuses": string[];

	// --- Initiative tracker fields
	level?: number; // total level
	hp?: number; // sum of health and stamina
	ac?: string; // string with EAC and KAC
	modifier?: number; // initiative modifier
};

/** Update the character note in Obsidian */
export async function UpdateFrontmatter(
	app: App,
	character: Character,
	settings: HephaistosImporterPluginSettings
) {
	if (!app.vault.getFolderByPath(settings.charactersFolder)) {
		app.vault.createFolder(settings.charactersFolder);
	}

	const fileName = normalizePath(
		settings.charactersFolder + "/" + character.name + ".md"
	);
	let file = app.vault.getFileByPath(fileName);
	if (!file) file = await app.vault.create(fileName, "");

	await app.fileManager.processFrontMatter(file, (frontmatter: Frontmatter) =>
		processFrontMatter(frontmatter, character, settings)
	);
}

function processFrontMatter(
	frontmatter: Frontmatter,
	character: Character,
	settings: HephaistosImporterPluginSettings
) {
	const link = (text: string) =>
		settings.createLinks && text ? `[[${text}]]` : text;

	const linkToHeading = (file: string, heading: string) =>
		settings.createLinks && heading
			? `[[${file}#${heading}|${heading}]]`
			: heading;

	frontmatter.name = character.name;
	frontmatter["hephaistos link"] =
		"https://hephaistos.online/character/" + character.id;
	frontmatter.gender = character.gender;
	frontmatter.homeworld = link(character.homeworld);
	frontmatter.deity = link(character.deity);
	frontmatter.alignment = character.alignment;

	frontmatter.abilities = {
		strength: character.abilityScores.strength.total,
		dexterity: character.abilityScores.dexterity.total,
		constitution: character.abilityScores.constitution.total,
		intelligence: character.abilityScores.intelligence.total,
		wisdom: character.abilityScores.wisdom.total,
		charisma: character.abilityScores.charisma.total,
	};

	frontmatter.race = character.race.name;

	frontmatter.classes = {};
	for (const c of character.classes)
		frontmatter.classes[link(c.name)] = c.levels;

	frontmatter.theme = link(character.theme.name);

	frontmatter.stamina =
		character.vitals.stamina.max - character.vitals.stamina.damage;
	frontmatter["max stamina"] = character.vitals.stamina.max;
	frontmatter.health =
		character.vitals.health.max - character.vitals.health.damage;
	frontmatter["max health"] = character.vitals.health.max;

	frontmatter.resolve =
		character.vitals.resolve.max - character.vitals.resolve.damage;

	frontmatter.initiative = character.initiative.total;

	frontmatter.EAC = character.armorClass.eac.total;
	frontmatter.KAC = character.armorClass.kac.total;
	frontmatter.CMD = character.armorClass.acVsCombatManeuver.total;

	frontmatter.saves = {
		fortitude: character.saves.fortitude.total,
		reflex: character.saves.reflex.total,
		will: character.saves.will.total,
	};

	frontmatter.resistances = [];
	for (const key in character.resistances.dr)
		frontmatter.resistances.push(
			`${character.resistances.dr[key].value} / ${key} negates`
		);
	for (const key in character.resistances.er)
		frontmatter.resistances.push(
			`${character.resistances.er[key].value} vs ${key}`
		);
	if (character.resistances.sr !== 0)
		frontmatter.resistances.push(`${character.resistances.sr} vs spells`);

	frontmatter.conditions = Object.keys(character.conditions)
		.filter((f) => character.conditions[f].active)
		.map((key) => linkToHeading("Conditions", key));

	frontmatter.afflictions = {};
	for (const affliction of character.afflictions)
		frontmatter.afflictions[link(affliction.name)] =
			affliction.progression.last()?.name || "";

	frontmatter.speed = {};
	for (const key in character.speed)
		if (character.speed[key])
			frontmatter.speed[key] = character.speed[key].toString();

	frontmatter.languages = character.languages.split(",").map((m) => m.trim());

	frontmatter.senses = {};
	for (const sense of character.senses)
		frontmatter.senses[link(sense.senseType)] = sense.range.toString();

	frontmatter.skills = {};
	for (const skill of character.skills)
		frontmatter.skills[link(skill.skill)] = skill.total;

	frontmatter.feats = character.feats.acquiredFeats.map((m) => link(m.name));

	frontmatter.spells = character.classes.flatMap((c) =>
		c.spells.map((m) => link(m.name))
	);

	frontmatter.weapons = character.inventory
		.filter((f) => f.type === "Weapon" && f.isEquipped)
		.map((m) => link(m.name));

	const armor = character.inventory.find(
		(f) => f.type === "Armor" && f.isEquipped
	);
	frontmatter.armor = armor ? link(armor.name) : undefined;

	frontmatter.augmentations = character.inventory
		.filter((f) => f.type === "Augmentation")
		.map((m) => link(m.name));

	frontmatter.inventory = character.inventory
		.filter(
			(f) =>
				f.id !== "Unarmed Strike" &&
				!(f.type === "Weapon" && f.isEquipped) &&
				!(f.type === "Armor" && f.isEquipped) &&
				!(f.type === "Augmentation")
		)
		.map((m) => link(m.name));

	frontmatter["situational bonuses"] = character.situationalBonuses.map(
		(m) => m.bonus
	);

	if (settings.enableInitiativeTracker) {
		frontmatter.ac = `EAC ${character.armorClass.eac.total}, KAC ${character.armorClass.kac.total}`;
		let totalLevel = 0;
		for (const c of character.classes) totalLevel += c.levels;
		frontmatter.level = totalLevel;
		frontmatter.modifier = character.initiative.total;
		frontmatter.hp =
			character.vitals.health.max -
			character.vitals.health.damage +
			character.vitals.stamina.max -
			character.vitals.stamina.damage +
			character.vitals.temporary;
	}
}
