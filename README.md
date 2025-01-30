# Hephaistos Importer for Obsidian.md

For the Starfinder RPG.

A plugin for [Obsidian](https://obsidian.md) allowing for import of characters from [Hephaistos](https://hephaistos.online).

It is completely unaffiliated with either program and all thanks go to the dedicated programmers of those.

## Features

Given the public ID for a number of Hephaistos characters (the number at the end of the public share link), clicking on the **anvil** icon will populate the selected Obsidian folder with a note for each character, filling the frontmatter with data from Hephaistos, such as:

```
name: Mila Imarin
hephaistos link: https://hephaistos.online/character/779575002
abilities:
  - strength: 10
  - dexterity: 14
  - constitution: 12
  - intelligence: 15
  - wisdom: 10
  - charisma: 21
race: Human
classes:
  - Witchwarper: 5
```
etc.

If there is already a note with a character's name, the plugin wil update the frontmatter while leaving the rest of the note untouched.

### Hyperlinks

_Enabled in settings_.

Some fields, such as spell names, can be created either as plain text or Obsidian hyperlinks.
The links are based on the [Community SRD vault](https://github.com/Obsidian-TTRPG-Community/Starfinder-SRD-Markdown)'s structure.

### Initiative Tracker compatibility

_Enabled in settings_.

The importer can generate fields compatible with [Javalent's Initiative Tracker](https://github.com/javalent/initiative-tracker).
These are:

-   **level**: total level
-   **hp**: sum of current health, current stamina, and temporary hp
-   **ac** text with `EAC X, KAC Y`
-   **modifier**: initiative modifier

### Fantasy Statblocks compatibility

_Enabled in settings_.

The importer can format fields to work with [Javalent's Fantasy Statblocks](https://github.com/javalent/fantasy-statblocks).

A simple statblock file, modified from [TheNightMayor](https://github.com/TheNightMayor)'s Starfinder bestiary layout, can be found [here](assets/starfinder-character-layout.json).

## Installation

~~Install via the Obsidian Community Plug-ins~~ when released into the community.

For now, create a folder in your obsidian vault's `.obsidian/plugins/` folder and download the `main.js`and `manifest.json` files from the latest github release into it.

## Limitations

This plugin is _not_ intended to replace Hephaistos in any way. It is merely importing the most important data for convenience's sake -- probably most useful for Game Masters.

## Bugs

The plugin utilizes a feature implemented in Hephaistos on 2025-01-20. It will fail to import characters who haven't been saved since then. To update a character, simply appply a point of damage and remove it again.

## Future

I plan to have this plugin integrate with other Starfinder projects for Obsidian. Please bring any to my knowledge.

## Contact

[Github](https://github.com/Skallaturi/hephaistos-importer)

E-mail: tore@saederup.net

Or tag @Skallaturi on the Obsidian Discord, Obsidian TTRPG Discord, or Starfinder Discord
