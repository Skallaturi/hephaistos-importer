import { App, normalizePath } from "obsidian";
import { Character } from "./character";

type Frontmatter = {
	name: string;
	"hephaistos link": string;
	abilities: Record<string, number>;
	race: string;
	classes: Record<string, number>;
	theme: string;
	stamina: number;
	health: number;
	resistances: string[];
	initiative: string;
	EAC: number;
	KAC: number;
	CMD: number;
	saves: Record<string, string>;
	conditions: string[];
	afflictions: Record<string, string>;
	speed: Record<string, string>;
	languages: string;
	senses: Record<string, string>;
	skills: Record<string, string>;
	feats: string[];
	inventory: string[];
};

/** Update the character note in Obsidian */
export async function UpdateFrontmatter(
	app: App,
	character: Character,
	folderName: string
) {
	if (!app.vault.getFolderByPath(folderName)) {
		app.vault.createFolder(folderName);
	}

	const fileName = normalizePath(folderName + "/" + character.name + ".md");
	let file = app.vault.getFileByPath(fileName);
	if (!file) file = await app.vault.create(fileName, "");

	await app.fileManager.processFrontMatter(file, (frontmatter: Frontmatter) =>
		processFrontMatter(frontmatter, character)
	);
}

function processFrontMatter(frontmatter: Frontmatter, character: Character) {
	frontmatter.name = character.name;
	frontmatter["hephaistos link"] =
		"https://hephaistos.online/character/" + character.id;

	frontmatter.abilities = {
		strength: character.abilityScores.strength.total,
		dexterity: character.abilityScores.dexterity.total,
		constitution: character.abilityScores.constitution.total,
		intelligence: character.abilityScores.intelligence.total,
		wisdom: character.abilityScores.wisdom.total,
		charisma: character.abilityScores.charisma.total,
	};

	frontmatter.race = character.race.name;

	const classes: Record<string, number> = {};
	for (const c of character.classes) classes[`[[${c.name}]]`] = c.levels;
	frontmatter.classes = classes;

	frontmatter.theme = `[[${character.theme.name}]]`;

	frontmatter.stamina =
		character.vitals.stamina.max - character.vitals.stamina.damage;
	frontmatter.health =
		character.vitals.health.max - character.vitals.health.damage;

	frontmatter.initiative = modifier(character.initiative.total);

	frontmatter.EAC = character.armorClass.eac.total;
	frontmatter.KAC = character.armorClass.kac.total;
	frontmatter.CMD = character.armorClass.acVsCombatManeuver.total;

	frontmatter.saves = {
		fortitude: modifier(character.saves.fortitude.total),
		reflex: modifier(character.saves.reflex.total),
		will: modifier(character.saves.will.total),
	};

	const resistances = [];
	for (const key in character.resistances.dr)
		resistances.push(`${character.resistances.dr[key]} / ${key} negates`);
	for (const key in character.resistances.er)
		resistances.push(`${character.resistances.er[key]} vs ${key}`);
	if (character.resistances.sr !== 0)
		resistances.push(`${character.resistances.sr} vs spells`);
	frontmatter.resistances = resistances;

	const conditions = [];
	for (const key in character.conditions)
		if (character.conditions[key].active)
			conditions.push(`[[Conditions#${key}|${key}]]`);
	frontmatter.conditions = conditions;

	const afflictions: Record<string, string> = {};
	for (const affliction of character.afflictions)
		afflictions[affliction.name] =
			affliction.progression.last()?.name || "";
	frontmatter.afflictions = afflictions;

	const speed: Record<string, string> = {};
	for (const key in character.speed)
		if (character.speed[key]) speed[key] = character.speed[key].toString();
	frontmatter.speed = speed;

	frontmatter.languages = character.languages;

	const senses: Record<string, string> = {};
	for (const sense of character.senses)
		senses[`[[${sense.senseType}]]`] = sense.range.toString();
	frontmatter.senses = senses;

	const skills: Record<string, string> = {};
	for (const skill of character.skills)
		skills[`[[${skill.skill}]]`] = modifier(skill.total);
	frontmatter.skills = skills;

	frontmatter.feats = character.feats.acquiredFeats.map(
		(m) => `[[${m.name}]]`
	);

	frontmatter.inventory = character.inventory
		.filter((f) => f.id !== "Unarmed Strike")
		.map((m) => `[[${m.name}]]`);
}

function modifier(input: number): string {
	if (input >= 0) return "+" + input;
	return input.toString();
}
