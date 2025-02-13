export interface HephaistosImporterPluginSettings {
	// ids of characters to import
	characterIds: string[];
	// folder containing character markdown files
	charactersFolder: string;
	// should data be added as Obsidian links rather than strings
	createLinks: boolean;
	// create Initiative Tracker fields
	enableInitiativeTracker: boolean;
	// format for Fantasy Statblocks
	statblocksFormat: boolean;
	// layout to add if none is defined
	statblockLayout: string;
}

export const DEFAULT_SETTINGS: HephaistosImporterPluginSettings = {
	characterIds: [],
	charactersFolder: "Characters",
	createLinks: false,
	enableInitiativeTracker: false,
	statblocksFormat: false,
	statblockLayout: "Starfinder Character Layout",
};
