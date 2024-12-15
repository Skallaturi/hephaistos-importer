import { requestUrl } from "obsidian";
import { Character as CharacterData } from "hephaistos-response";
import { hephaistosQuery } from "hephaistos-query";
import { HephaistosResponse } from "hephaistos-response";

export async function importCharacter(
	id: string
): Promise<HephaistosCharacter> {
	const resp = (await requestUrl({
		url: "https://hephaistos.online/query",
		method: "POST",
		body: JSON.stringify({ query: hephaistosQuery(id) }),
		headers: {
			"content-type": "application/json",
		},
	}).json) as HephaistosResponse;
	const characterData = resp.data?.characters?.find((c) => (c.id = id));
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
class HephaistosCharacter {
	constructor(data: CharacterData) {
		this.data = data;
	}
	protected data: CharacterData;

	name(): string {
		return this.data.name;
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
			const bonus = abilityBonusFromEffect(
				benefit.effect || "",
				abilityName
			);
			score += bonus;

			const options =
				benefit.options?.filter((o) =>
					selectedOptions.contains(o.id)
				) || [];
			for (const option of options) {
				const optionBonus = abilityBonusFromEffect(
					option.effect,
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
			const selectedAdjustment = augmentation.selectedOptions?.[0].value;
			if (!selectedAdjustment) continue;
			const adjustment = augmentation.augmentation?.options.find(
				(a) => a.id === selectedAdjustment
			);
			const bonus = abilityBonusFromEffect(
				adjustment?.effect || "",
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
		let result = {};

		const selectedAdjustment = this.data.race.selectedAdjustment;
		const adjustments = this.data.race.race.abilityAdjustment.find(
			(a) => a.id === selectedAdjustment
		)?.effect;
		if (!adjustments) return result;
		result = dragonscriptAbilityBonuses(adjustments);
		return result;
	}
}

// pull ability bonuses from a dragonscript effect
function dragonscriptAbilityBonuses(
	effect: string
): Partial<Record<Ability, number>> {
	const result: Record<string, number> = {};
	const matches = effect.matchAll(/bonus (-*\d) to character.([a-z]+)/gm);
	for (const match of matches) {
		const bonus = match[1];
		const ability = match[2];
		try {
			result[normalizeAbilityName(ability)] = Number.parseInt(bonus);
		} catch (error) {
			// was not ability
		}
	}
	return result;
}

function abilityBonusFromEffect(effect: string, ability: Ability): number {
	const abilityMap = dragonscriptAbilityBonuses(effect);
	const bonus = abilityMap[ability] || 0;
	return bonus;
}

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
