import { HephaistosCharacter } from "hephaistos-character";
import { App } from "obsidian";

/** Update the character note in Obsidian */
export async function UpdateCharacter(
	app: App,
	character: HephaistosCharacter,
	folderName: string
) {
	if (!app.vault.getFolderByPath(folderName)) {
		app.vault.createFolder(folderName);
	}

	console.log(character);

	const fileName = folderName + "/" + character.name() + ".md";
	let file = app.vault.getFileByPath(fileName);
	if (!file) file = await app.vault.create(fileName, "");

	await app.fileManager.processFrontMatter(file, (frontmatter) => {
		frontmatter.name = character.name();

		frontmatter.EAC =
			frontmatter.EAC_override || character.ArmorClass("EAC");
		frontmatter.KAC =
			frontmatter.KAC_override || character.ArmorClass("KAC");
		frontmatter.CMD = frontmatter.CMD_override || character.CMD();

		frontmatter.Str =
			frontmatter.Str_override || character.AbilityScore("Str");
		frontmatter.StrModifier =
			frontmatter.StrModifier_override ||
			character.AbilityModifier("Str");
		frontmatter.Dex =
			frontmatter.Dex_override || character.AbilityScore("Dex");
		frontmatter.DexModifier =
			frontmatter.DexModifier_override ||
			character.AbilityModifier("Dex");
		frontmatter.Con =
			frontmatter.Con_override || character.AbilityScore("Con");
		frontmatter.ConModifier =
			frontmatter.ConModifier_override ||
			character.AbilityModifier("Con");
		frontmatter.Int =
			frontmatter.Int_override || character.AbilityScore("Int");
		frontmatter.CntModifier =
			frontmatter.CntModifier_override ||
			character.AbilityModifier("Int");
		frontmatter.Wis =
			frontmatter.Wis_override || character.AbilityScore("Wis");
		frontmatter.WisModifier =
			frontmatter.WisModifier_override ||
			character.AbilityModifier("Wis");
		frontmatter.Cha =
			frontmatter.Cha_override || character.AbilityScore("Cha");
		frontmatter.ChaModifier =
			frontmatter.ChaModifier_override ||
			character.AbilityModifier("Cha");

		frontmatter.conditions =
			frontmatter.conditions_override || character.conditions();

		frontmatter.link = character.link();
	});
}
