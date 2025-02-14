/* eslint-disable no-mixed-spaces-and-tabs */
import { App, normalizePath } from "obsidian";
import { Character } from "./character";
import { HephaistosImporterPluginSettings } from "./settings";

// used by Fantasy Statblocks
type WrappedString = {
	name: string;
	desc: string;
};

type Frontmatter = {
	name: string;
	"hephaistos link": string;
	gender: string;
	homeworld: string;
	deity: string;
	alignment: string;
	abilities: Record<string, number>[];
	race: string;
	racialTraits: string[];
	classes: Record<string, number>[] | WrappedString[];
	classFeatures: string[];
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
	saves: Record<string, number>[];
	conditions: string[];
	afflictions: Record<string, string>[] | WrappedString[];
	speed: Record<string, number>[] | string;
	languages: string[];
	senses: Record<string, string>[] | WrappedString[];
	skills: Record<string, number>[] | WrappedString[];
	feats: string[];
	spells: Record<string, string[]>[] | Record<string, string>[];
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
	// --- Fantasy Statblocks fields
	statblock?: boolean; // parse statblock
	layout?: string; // which statblock layout to use
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
	const link = (text: string) => {
		if (!(settings.createLinks && text)) return text;

		// in the SRD vault, note links do not contain parantheses
		let link = text.replace(/(\(|\))/gm, "");

		// in the SRD vault, items like "Reaction Cannon, light" is in the note "Reaction Cannon" under heading "Reaction Cannon, light"
		if (link.contains(",")) {
			const arr = link.split(",");
			link = `${arr[0].trim()}#${text}|${text}`;
		}
		return `[[${link}]]`;
	};

	const linkToHeading = (file: string, heading: string, name?: string) =>
		settings.createLinks && heading
			? `[[${file}#${heading}|${name ?? heading}]]`
			: heading;

	frontmatter.name = character.name;
	frontmatter["hephaistos link"] =
		"https://hephaistos.online/character/" + character.id;
	frontmatter.gender = character.gender;
	frontmatter.homeworld = link(character.homeworld);
	frontmatter.deity = link(character.deity);
	frontmatter.alignment = character.alignment;

	frontmatter.abilities = [
		{ strength: character.abilityScores.strength.total },
		{ dexterity: character.abilityScores.dexterity.total },
		{ constitution: character.abilityScores.constitution.total },
		{ intelligence: character.abilityScores.intelligence.total },
		{ wisdom: character.abilityScores.wisdom.total },
		{ charisma: character.abilityScores.charisma.total },
	];

	frontmatter.race = link(character.race.name);
	frontmatter.racialTraits = character.race.selectedTraits.flatMap((trait) =>
		trait.selectedOptions?.length
			? trait.selectedOptions.map((option) =>
					linkToHeading(
						trait.name,
						option.name,
						`${trait.name}: ${option.name}`
					)
			  )
			: link(trait.name)
	);

	frontmatter.classes = settings.statblocksFormat
		? character.classes.map((m) => {
				return { name: m.name, desc: m.levels.toString() };
		  })
		: character.classes.map((m) => {
				return { [link(m.name)]: m.levels };
		  });
	frontmatter.classFeatures = character.classes
		.flatMap((c) => c.features)
		.flatMap((feature) =>
			feature.options.length
				? feature.options.map((option) =>
						linkToHeading(
							feature.name,
							option.name,
							`${feature.name}: ${option.name}`
						)
				  )
				: link(feature.name)
		);

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

	frontmatter.saves = [
		{ fortitude: character.saves.fortitude.total },
		{ reflex: character.saves.reflex.total },
		{ will: character.saves.will.total },
	];

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

	frontmatter.afflictions = settings.statblocksFormat
		? character.afflictions.map((affliction) => {
				return {
					name: link(affliction.name),
					desc: affliction.progression.last()?.name || "",
				};
		  })
		: character.afflictions.map((affliction) => {
				return {
					[link(affliction.name)]:
						affliction.progression.last()?.name || "",
				};
		  });

	frontmatter.speed = settings.statblocksFormat
		? Object.keys(character.speed)
				.filter((f) => typeof character.speed[f] === "number")
				.map((key) => {
					return `${key}: ${character.speed[key]}`.toString();
				})
				.join(", ")
		: Object.keys(character.speed)
				.filter((f) => typeof character.speed[f] === "number")
				.map((key) => {
					return { [key]: character.speed[key] as number };
				});

	frontmatter.languages = character.languages
		.split(",")
		.map((m) => m.trim())
		.filter((f) => f);

	frontmatter.senses = settings.statblocksFormat
		? character.senses.map((sense) => {
				return {
					name: sense.senseType,
					desc: sense.range.toString(),
				};
		  })
		: character.senses.map((sense) => {
				return {
					[sense.senseType]: sense.range.toString(),
				};
		  });

	frontmatter.skills = settings.statblocksFormat
		? character.skills.map((skill) => {
				return {
					name: skill.skill,
					desc: skill.total.toString(),
				};
		  })
		: character.skills.map((skill) => {
				return {
					[skill.skill]: skill.total,
				};
		  });

	frontmatter.feats = character.feats.acquiredFeats.flatMap((feat) =>
		feat.selectedOptions?.length
			? feat.selectedOptions.map((option) =>
					linkToHeading(
						feat.name,
						option.name,
						`${feat.name}: ${option.name}`
					)
			  )
			: link(feat.name)
	);

	const spellsPerDay = [0, 0, 0, 0, 0, 0, 0];
	// hephaistos uses -1 spell per day as "at will"
	for (const c of character.classes) {
		for (const i in c.spellsPerDay) {
			if (c.spellsPerDay[i] === -1 || spellsPerDay[i] === -1)
				spellsPerDay[i] = -1;
			else spellsPerDay[i] = spellsPerDay[i] + c.spellsPerDay[i];
		}
	}

	const spells: Record<string, string[]> = {};
	for (const spell of character.classes.flatMap((c) => c.spells)) {
		const level = spell.level.first()?.level ?? 0;
		const label =
			`level ${level}` +
			(spellsPerDay[level] === -1
				? " (at will)"
				: ` (${spellsPerDay[level]}/day)`);
		if (!spells[label]) spells[label] = [];
		spells[label].push(spell.name);
	}
	frontmatter.spells = settings.statblocksFormat
		? Object.keys(spells)
				.sort()
				.map((key) => {
					return {
						[key]: `${spells[key]
							.map((spell) => link(spell))
							.join(", ")}`,
					};
				})
		: Object.keys(spells)
				.sort()
				.map((key) => {
					return { [key]: spells[key].map((spell) => link(spell)) };
				});

	frontmatter.weapons = character.inventory
		.filter((f) => f.type === "Weapon" && f.isEquipped)
		.map((m) => link(m.name));

	const armor = character.inventory.find(
		(f) => f.type === "Armor" && f.isEquipped
	);
	frontmatter.armor = armor ? link(armor.name) : undefined;

	frontmatter.augmentations = character.inventory
		.filter((f) => f.type === "Augmentation")
		.flatMap((augmentation) =>
			augmentation.selectedOptions?.length
				? augmentation.selectedOptions.map((option) =>
						linkToHeading(
							augmentation.name,
							option.name,
							`${augmentation.name}: ${option.name}`
						)
				  )
				: link(augmentation.name)
		);

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

	if (settings.statblocksFormat) {
		if (frontmatter.statblock === undefined) {
			frontmatter.statblock = true;
		}
		if (frontmatter.layout === undefined) {
			frontmatter.layout = settings.statblockLayout;
		}
	}
}
