import {
	App,
	normalizePath,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { importCharacter } from "plugin/hephaistos-api";
import { UpdateFrontmatter } from "plugin/frontmatter";
import {
	DEFAULT_SETTINGS,
	HephaistosImporterPluginSettings,
} from "plugin/settings";

export default class HephaistosImporter extends Plugin {
	settings: HephaistosImporterPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon(
			"anvil",
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
				new Notice("imported " + character.name);

				UpdateFrontmatter(this.app, character, this.settings);
			} catch (error) {
				new Notice(error, 0);
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
				"Public IDs of Hephaistos Characters to import, one Id per line." +
					"The ID is the last part of the public URL, as found on Character -> edit -> share."
			)
			.addTextArea(
				(text) =>
					(text
						.setValue(this.plugin.settings.characterIds.join("\n"))
						.onChange(async (value) => {
							this.plugin.settings.characterIds = value
								.replace(/[^\d\n]/gm, "")
								.split("\n")
								.filter((f) => f);
							await this.plugin.saveSettings();
						}).inputEl.rows = 10)
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

		new Setting(containerEl)
			.setName("Create links")
			.setDesc(
				"If checked, entries such as spell names will be created as Obsidian links rather than plain text."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.createLinks)
					.onChange(async (value) => {
						this.plugin.settings.createLinks = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Initiative Tracker support")
			.setDesc(
				"If checked, create entries usable by Javalent's Initiative Tracker."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableInitiativeTracker)
					.onChange(async (value) => {
						this.plugin.settings.enableInitiativeTracker = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Fantasy Statblocks support")
			.setDesc(
				"If checked, use a format more easily accessed by Javalent's Fantasy Statblocks."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.statblocksFormat)
					.onChange(async (value) => {
						this.plugin.settings.statblocksFormat = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
