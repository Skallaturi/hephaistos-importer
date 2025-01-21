import { requestUrl } from "obsidian";
import { Character } from "./character";
/** This would probably be faster if we just imported all characters in one grapgQL call,
 *   but that makes error handling a bit trickier
 */
export async function importCharacter(id: string): Promise<Character> {
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

	const character = JSON.parse(characterData.json) as Character;
	// Hephaistos doesn't trim excess spaces from name
	// For our purposes, it needs to be
	character.name = character.name.trim();
	character.id = id;
	return character;
}

function hephaistosQuery(): string {
	return `query($characterId:String!) {
  characters(readOnlyPermalinkId: [$characterId]) {
    readOnlyPermalinkId
    name
    json
  }
}`;
}

type HephaistosResponse = {
	data: HephaistosData;
};

type HephaistosData = {
	characters: HephaistosCharacter[];
};

export type HephaistosCharacter = {
	readOnlyPermalinkId: string;
	json: string;
};
