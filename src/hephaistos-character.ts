import { requestUrl } from "obsidian";
import { Character as CharacterData } from "src/hephaistos-response";
import { hephaistosQuery } from "src/hephaistos-query";
import { HephaistosResponse } from "src/hephaistos-response";

// This would probably be faster if we just imported all characters in one grapgQL call,
//  but that makes error handling a bit trickier
export async function importCharacter(
	id: string
): Promise<HephaistosCharacter> {
	const resp = (await requestUrl({
		url: "https://hephaistos.online/query",
		method: "POST",
		body: JSON.stringify({
			query: hephaistosQuery(),
			variables: { characterId: id },
		}),
		headers: {
			"content-type": "application/json",
		},
	}).json) as HephaistosResponse;
	const characterData = resp.data?.characters?.find(
		(c) => (c.readOnlyPermalinkId = id)
	);
	if (!characterData)
		throw new Error("could not access character with id " + id);
	const result = new HephaistosCharacter(characterData);
	return result;
}

/**
 * Attempt to emulate the character calculations made in Hephaistos.
 *
 * NOTE: Since this is reverse-engineerd, there's probably something missing
 */
export class HephaistosCharacter {
	constructor(data: CharacterData) {
		this.data = data;
	}
	protected data: CharacterData;

	name(): string {
		return this.data.name;
	}

	readonlyId(): string {
		return this.data.readOnlyPermalinkId;
	}
	link(): string {
		return "https://hephaistos.online/character/" + this.readonlyId();
	}

	conditions(): string[] {
		const conditions: string[] = [];
		for (const c of Object.keys(this.data.conditions)) {
			if (this.data.conditions[c].override) conditions.push(c);
		}
		return conditions;
	}

	AbilityScore(abilityName: Ability): number {
		if (abilityName === "Str") {
			const equippedPowerArmor = this.data.inventory.find(
				(a) => a.armor?.__typename === "PoweredArmor" && a.isEquipped
			);
			const poweredArmorStrength = equippedPowerArmor?.armor?.strength;
			if (poweredArmorStrength) return poweredArmorStrength;
		}

		return this.calculateAbility(abilityName);
	}

	AbilityModifier(abilityName: Ability): number {
		const score = this.AbilityScore(abilityName);
		let modifier = Math.floor((score - 10) / 2);

		// ABILITY DAMAGE
		// for some reason, ability damage in Starfinder affects only modifier, not ability,
		// but you still only count every second damage point
		const lowercase3letter = lowercase3letterName(abilityName);
		const abilityDamage =
			this.data.abilityScores[lowercase3letter].damage || 0;
		const modifierDamage = Math.floor(abilityDamage / 2);

		modifier -= modifierDamage;

		return modifier;
	}

	ArmorClass(acType: ArmorClass): number {
		let ac = 10;
		let dexBonus = this.AbilityModifier("Dex");

		//ARMOR
		const equippedArmor = this.data.inventory.find(
			(a) => a.armor && a.isEquipped
		);
		if (equippedArmor) {
			let maxDexBonus = null;
			let armorBonus = 0;

			maxDexBonus =
				equippedArmor.maxDexBonusOverride ??
				equippedArmor.armor?.maxDexBonus;

			if (acType === "EAC") {
				armorBonus =
					equippedArmor.eacBonusOverride ??
					equippedArmor.armor?.eacBonus ??
					0;
			} else {
				armorBonus =
					equippedArmor.kacBonusOverride ??
					equippedArmor.armor?.kacBonus ??
					0;
			}

			if (maxDexBonus !== undefined && maxDexBonus < dexBonus) {
				dexBonus = maxDexBonus;
			}

			ac += armorBonus;

			// class.armorProficiency seems to always be ["LIGHT"]
			const armorProficiencies: string[] = [];

			for (const c of this.data.classes) {
				armorProficiencies.push(
					...c.class.armorProficiency.map((a) => a.toUpperCase())
				);
				if (c.class.armorProficiencyDescription) {
					armorProficiencies.push(
						...c.class.armorProficiencyDescription
							.replace(" ", "")
							.toUpperCase()
							.split(",")
					);
				}
			}
			// TODO armor proficiencies from other sources

			const armorType =
				(
					equippedArmor.armorType ?? equippedArmor.armor?.type
				)?.toUpperCase() || "";
			if (!armorProficiencies.contains(armorType)) {
				ac -= 4;
			}
		}

		//SHIELD
		const equippedShield = this.data.inventory.find(
			(a) => a.shield && a.isEquipped
		);
		if (equippedShield) {
			let maxDexBonus = null;
			let armorBonus = 0;

			maxDexBonus =
				equippedShield.maxDexBonusOverride ??
				equippedShield.shield?.maxDexBonus;

			armorBonus =
				equippedShield.wieldAcBonusOverride ??
				equippedShield.shield?.wieldAcBonus ??
				0;

			if (maxDexBonus !== undefined && maxDexBonus < dexBonus) {
				dexBonus = maxDexBonus;
			}

			// class.armorProficiency seems to always be ["LIGHT"]
			const armorProficiencies: string[] = [];

			for (const c of this.data.classes) {
				armorProficiencies.push(
					...c.class.armorProficiency.map((a) => a.toUpperCase())
				);
				if (c.class.armorProficiencyDescription) {
					armorProficiencies.push(
						...c.class.armorProficiencyDescription
							.replace(" ", "")
							.toUpperCase()
							.split(",")
					);
				}
			}
			// TODO armor proficiencies from other sources

			if (armorProficiencies.contains("SHIELD")) {
				ac += armorBonus;
			}
		}
		//TODO overburdened / encumbered
		ac += dexBonus;

		return ac;
	}

	CMD(): number {
		return 8 + this.ArmorClass("KAC");
	}

	MaxHitPoints(): number {
		let hp = this.data.race.race.hitPoints;

		for (const c of this.data.classes) {
			hp += c.class.hitPoints * c.levels;
		}

		return hp;
	}

	CurrentHitPoints(): number {
		const damage = this.data.vitals.health.damage;
		return this.MaxHitPoints() - damage;
	}

	MaxStamina(): number {
		let sp = 0;

		for (const c of this.data.classes) {
			sp +=
				(c.class.baseStaminaPoints + this.AbilityModifier("Con")) *
				c.levels;
		}

		return sp;
	}

	CurrentStamina(): number {
		const damage = this.data.vitals.stamina.damage;
		return this.MaxStamina() - damage;
	}

	TemporaryHitPoints(): number {
		return this.data.vitals.temporary;
	}

	Initiative(): number {
		let init = this.AbilityModifier("Dex");
		for (const feat of this.data.feats) {
			const effects = dragonscriptBonuses(feat.feat.benefit);
			const initBonus = effects["initiative"];
			if (initBonus) init += initBonus;
		}
		return init;
	}

	protected calculateAbility(abilityName: Ability): number {
		const lowercase3letter = lowercase3letterName(abilityName);
		const override = this.data.abilityScores[lowercase3letter].override;

		if (override) return override;

		// BASE
		let score = 10;

		// SELECTED AT GAME START
		switch (this.data.abilityScores.method) {
			case "POINT_BUY":
				score +=
					this.data.abilityScores[lowercase3letter].pointBuy || 0;
			// TODO other methods
		}

		// RACIAL
		const racialbonus = this.racialBonuses()[abilityName] || 0;
		score += racialbonus;

		// THEME
		const benefits = this.data.theme.theme.benefits;
		// some themes allow you to pick which ability to increase
		const selectedOptions = this.data.theme.selectedBenefitOptions.map(
			(o) => o.value
		);
		for (const benefit of benefits) {
			const baseEffects = dragonscriptBonuses(benefit.effect);
			const bonus = abilityBonusFromRecord(baseEffects, abilityName);
			score += bonus;

			const options =
				benefit.options?.filter((o) =>
					selectedOptions.contains(o.id)
				) || [];
			for (const option of options) {
				const optionEffects = dragonscriptBonuses(option.effect);
				const optionBonus = abilityBonusFromRecord(
					optionEffects,
					abilityName
				);
				score += optionBonus;
			}
		}
		// LEVEL INCREASES
		for (const increases of this.data.abilityScores.increases) {
			for (const increase of increases) {
				if (normalizeAbilityName(increase) === abilityName) {
					if (score < 17) score += 2;
					else score += 1;
				}
			}
		}

		// PERSONAL UPGRADE AUGMENTATIONS
		const augmentations = this.data.inventory.filter(
			(a) => a.__typename === "CharacterAugmentation" && a.isEquipped
		);
		for (const augmentation of augmentations) {
			const selectedAdjustment = augmentation.selectedOptions?.[0]?.value;
			if (!selectedAdjustment) continue;
			const adjustment = augmentation.augmentation?.options?.find(
				(a) => a.id === selectedAdjustment
			);
			const augmentationBonuses = dragonscriptBonuses(adjustment?.effect);
			const bonus = abilityBonusFromRecord(
				augmentationBonuses,
				abilityName
			);
			score += bonus;
		}

		// CUSTOM BONUSES
		const customBonuses =
			this.data.abilityScores[lowercase3letter].customBonus;
		for (const bonus of customBonuses) {
			if (bonus.active) {
				score += bonus.value;
			}
		}

		return score;
	}

	protected racialBonuses(): Partial<Record<Ability, number>> {
		const result: Partial<Record<Ability, number>> = {};

		const selectedAdjustment = this.data.race.selectedAdjustment;
		const adjustments = this.data.race.race.abilityAdjustment.find(
			(a) => a.id === selectedAdjustment
		)?.effect;
		if (!adjustments) return result;
		const allBonuses = dragonscriptBonuses(adjustments);
		for (const key in allBonuses) {
			try {
				const normalizedName = normalizeAbilityName(key);
				result[normalizedName] = allBonuses[key];
			} catch (error) {
				// was not ability. Carry on
			}
		}
		return result;
	}
}

/** pull bonuses from a dragonscript effect.
 * @returns a map with [lowercase statistic name]=bonus
 */
function dragonscriptBonuses(
	effect: string | undefined | null
): Record<string, number> {
	const result: Record<string, number> = {};
	if (!effect) return result;
	const matches = effect.matchAll(/bonus (-*\d) to character.([a-z]+)/gm);
	for (const match of matches) {
		const bonus = match[1];
		const statistic = match[2];
		result[statistic.toLowerCase()] = Number.parseInt(bonus);
	}
	return result;
}

function abilityBonusFromRecord(
	record: Record<string, number>,
	ability: Ability
): number {
	for (const key in record) {
		try {
			const normalizedName = normalizeAbilityName(key);
			if (normalizedName === ability) return record[key];
		} catch (error) {
			// was not ability. Carry on
		}
	}
	return 0;
}

type ArmorClass = "EAC" | "KAC";

// Hephaistos uses several different ways of writing ability names.
// Let's make sure we have the right one

/**  Standard way of writing ability names*/
type Ability = "Str" | "Dex" | "Con" | "Int" | "Wis" | "Cha";

type Lowercase3letter = "str" | "dex" | "con" | "int" | "wis" | "cha";

/** When we need "Str"
 * @throws if input is not an ability
 */
function normalizeAbilityName(input: string): Ability {
	const lowercase = input.toLowerCase();
	switch (lowercase) {
		case "strength":
		case "str":
			return "Str";
		case "dexterity":
		case "dex":
			return "Dex";
		case "constitution":
		case "con":
			return "Con";
		case "intelligence":
		case "int":
			return "Int";
		case "wisdom":
		case "wis":
			return "Wis";
		case "charisma":
		case "cha":
			return "Cha";
		default:
			throw Error("Could not normalize name: " + input);
	}
}

/** When we need "str" */
function lowercase3letterName(input: string): Lowercase3letter {
	const normalized = normalizeAbilityName(input);
	return normalized.toLowerCase() as unknown as Lowercase3letter;
}
