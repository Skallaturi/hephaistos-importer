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

		frontmatter.EAC = character.ArmorClass("EAC");
		frontmatter.KAC = character.ArmorClass("KAC");

		frontmatter.Str = character.AbilityScore("Str");
		frontmatter.StrModifier = character.AbilityModifier("Str");
		frontmatter.Dex = character.AbilityScore("Dex");
		frontmatter.DexModifier = character.AbilityModifier("Dex");
		frontmatter.Con = character.AbilityScore("Con");
		frontmatter.ConModifier = character.AbilityModifier("Con");
		frontmatter.Int = character.AbilityScore("Int");
		frontmatter.CntModifier = character.AbilityModifier("Int");
		frontmatter.Wis = character.AbilityScore("Wis");
		frontmatter.WisModifier = character.AbilityModifier("Wis");
		frontmatter.Cha = character.AbilityScore("Cha");
		frontmatter.ChaModifier = character.AbilityModifier("Cha");

		frontmatter.conditions = character.conditions();

		frontmatter.link = character.link();
	});
}
