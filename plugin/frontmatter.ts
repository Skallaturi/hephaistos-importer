import { App, normalizePath } from "obsidian";
import { Character } from "./character";

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

	await app.fileManager.processFrontMatter(
		file,
		(frontmatter: Record<string, unknown>) =>
			processFrontMatter(frontmatter, character)
	);
}

function processFrontMatter(
	frontmatter: Record<string, unknown>,
	character: Character
) {
	frontmatter.name = character.name;
	frontmatter["hephaistos link"] =
		"https://hephaistos.online/character/" + character.id;

	frontmatter.abilities = {
		str: character.abilityScores.strength.total,
		dex: character.abilityScores.dexterity.total,
		con: character.abilityScores.constitution.total,
		int: character.abilityScores.intelligence.total,
		wis: character.abilityScores.wisdom.total,
		cha: character.abilityScores.charisma.total,
	};

	const classes: Record<string, number> = {};
	for (const c of character.classes) classes[c.name] = c.levels;
	frontmatter.classes = classes;
	frontmatter.theme = `[[${character.theme.name}]]`;

	frontmatter.init = modifier(character.initiative.total);

	frontmatter.eac = character.armorClass.eac.total;
	frontmatter.kac = character.armorClass.kac.total;
	frontmatter.cmd = character.armorClass.acVsCombatManeuver.total;

	frontmatter.saves = {
		fort: modifier(character.saves.fortitude.total),
		ref: modifier(character.saves.reflex.total),
		will: modifier(character.saves.will.total),
	};

	frontmatter.sp =
		character.vitals.stamina.max - character.vitals.stamina.damage;
	frontmatter.hp =
		character.vitals.health.max - character.vitals.health.damage;

	const conditions = [];
	for (const key in character.conditions)
		if (character.conditions[key].active)
			conditions.push(`[[Conditions#${key}|${key}]]`);
	frontmatter.conditions = conditions;

	const afflictions: Record<string, unknown> = {};
	for (const affliction of character.afflictions)
		afflictions[affliction.name] = affliction.progression.last()?.name;
	frontmatter.afflictions = afflictions;

	const speed: Record<string, unknown> = {};
	for (const key in character.speed)
		if (character.speed[key]) speed[key] = character.speed[key];
	frontmatter.speed = speed;

	frontmatter.languages = character.languages;

	const skills: Record<string, unknown> = {};
	for (const skill of character.skills) skills[skill.skill] = skill.total;
	frontmatter.skills = skills;
}

function modifier(input: number): string {
	if (input >= 0) return "+" + input;
	return input.toString();
}
