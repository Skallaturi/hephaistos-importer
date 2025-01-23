export interface HephaistosImporterPluginSettings {
	// ids of characters to import
	characterIds: string[];
	// folder containing character markdown files
	charactersFolder: string;
	// should data be added as Obsidian links rather than strings
	createLinks: boolean;
}

export const DEFAULT_SETTINGS: HephaistosImporterPluginSettings = {
	characterIds: [],
	charactersFolder: "Characters",
	createLinks: false,
};
