import { App, normalizePath } from "obsidian";
import { Character } from "./character";

export type CharacterFrontmatter = {
	name: string;
	link: string;
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

	await app.fileManager.processFrontMatter(
		file,
		(frontmatter: CharacterFrontmatter) => {
			frontmatter.name = character.name;
			frontmatter.link =
				"https://hephaistos.online/character/" + character.id;
		}
	);
}
