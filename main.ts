import { importCharacter } from "hephaistos-character";
import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
// TODO Remember to rename these classes and interfaces!

interface HephaistosImporterPluginSettings {
	//ids of characters to import
	characterIds: string[];
}

const DEFAULT_SETTINGS: HephaistosImporterPluginSettings = {
	characterIds: ["683304675"],
};

export default class HephaistosImporter extends Plugin {
	settings: HephaistosImporterPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"hammer",
			"Hephaistos Importer",
			// Called when the user clicks the icon.
			async (evt: MouseEvent) => {
				for (const characterId of this.settings.characterIds) {
					try {
						const character = await importCharacter(characterId);
						new Notice("imported " + character.name());

						// --- for testing
						new Notice(
							"conditions: " +
								character.conditions().toString() +
								"\nStr: " +
								character.AbilityScore("Str") +
								" (modifier " +
								character.AbilityModifier("Str") +
								")" +
								"\nDex: " +
								character.AbilityScore("Dex") +
								" (modifier " +
								character.AbilityModifier("Dex") +
								")" +
								"\nCon: " +
								character.AbilityScore("Con") +
								" (modifier " +
								character.AbilityModifier("Con") +
								")" +
								"\nInt: " +
								character.AbilityScore("Int") +
								" (modifier " +
								character.AbilityModifier("Int") +
								")" +
								"\nWis: " +
								character.AbilityScore("Wis") +
								" (modifier " +
								character.AbilityModifier("Wis") +
								")" +
								"\nCha: " +
								character.AbilityScore("Cha") +
								" (modifier " +
								character.AbilityModifier("Cha") +
								")",

							0
						);
						// ---
					} catch (error) {
						new Notice(error);
					}
				}
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-sample-modal-simple",
			name: "Open sample modal (simple)",
			callback: () => {
				new SampleModal(this.app).open();
			},
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "sample-editor-command",
			name: "Sample editor command",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection("Sample Editor Command");
			},
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-sample-modal-complex",
			name: "Open sample modal (complex)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
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

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
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
						this.plugin.settings.characterIds = value.split(",");
						await this.plugin.saveSettings();
					})
			);
	}
}
