import { importCharacter } from "src/hephaistos-character";
import {
	App,
	normalizePath,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { UpdateCharacter } from "src/update-character";

interface HephaistosImporterPluginSettings {
	//ids of characters to import
	characterIds: string[];
	// folder containing character markdown files
	charactersFolder: string;
}

const DEFAULT_SETTINGS: HephaistosImporterPluginSettings = {
	characterIds: [],
	charactersFolder: "Characters",
};

export default class HephaistosImporter extends Plugin {
	settings: HephaistosImporterPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon(
			"hammer",
			"Hephaistos Importer",
			// Called when the user clicks the icon.
			async (evt: MouseEvent) => this.importAll()
		);

		this.addCommand({
			id: "import-all-characters",
			name: "Import all characters",
			callback: () => this.importAll(),
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new HephaistosImporterSettingTab(this.app, this));
	}

	async importAll() {
		for (const characterId of this.settings.characterIds) {
			try {
				const character = await importCharacter(characterId);
				new Notice("imported " + character.name());

				UpdateCharacter(
					this.app,
					character,
					this.settings.charactersFolder
				);
			} catch (error) {
				new Notice(error);
			}
		}
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class HephaistosImporterSettingTab extends PluginSettingTab {
	plugin: HephaistosImporter;

	constructor(app: App, plugin: HephaistosImporter) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Character IDs")
			.setDesc(
				"Public IDs of Hephaistos Characters to import, separated by comma.\n" +
					"The ID is the last part of the public URL, as found on Character -> edit -> share."
			)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.characterIds.join(","))
					.onChange(async (value) => {
						this.plugin.settings.characterIds = value
							.replace(/[^\d,]/gm, "")
							.split(",");
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Characters folder")
			.setDesc("The Obsidian folder containing your characters")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.charactersFolder)
					.onChange(async (value) => {
						this.plugin.settings.charactersFolder =
							normalizePath(value);
						await this.plugin.saveSettings();
					})
			);
	}
}
