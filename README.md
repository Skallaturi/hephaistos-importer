# Hephaistos Importer for Obsidian.md

For Game Masters of the Starfinder RPG.

A plugin for [Obsidian](https://obsidian.md) allowing for import of characters from [Hephaistos](https://hephaistos.online).

It is completely unaffiliated with either program and all thanks go to the dedicated programmers of those.

## Features

Given the public ID for a number of Hephaistos characters (the number at the end of the public share link), clicking on the hammer icon will populate the selected Obsidian folder with a note for each character, filling the frontmatter with data for:

-   name
-   link to hephaistos page
-   gender
-   homeworld
-   deity
-   alignment
-   abilities
-   race
-   classes
-   theme
-   stamina
-   max stamina
-   health
-   max health
-   resistances
-   initiative
-   EAC
-   KAC
-   CMD
-   saves
-   conditions
-   afflictions
-   speed
-   languages
-   senses
-   skills
-   feats
-   spells
-   weapons
-   armor
-   augmentations
-   inventory
-   situational bonuses

If there is already a note with a character's name, the plugin wil update the frontmatter while leaving the rest of the note untouched.

Some fields, such as spell names, can be created either as plain text or Obsidian hyperlinks. This can be toggled in the settings. The links are based on the [Community SRD vault](https://github.com/Obsidian-TTRPG-Community/Starfinder-SRD-Markdown)

## Installation

Install via the Obsidian Community Plug-ins.

## Limitations

This plugin is _not_ intended to replace Hephaistos in any way. It is merely importing the most important data for convenience's sake -- probably most useful for Game Masters.

## Bugs

The plugin utilizes a feature implemented in Hephaistos on 2025-01-20. It will fail to import characters who haven't been saved since then. To update a character, simply appply a point of damage and remove it again.

## Future

I plan to have this plugin integrate with other Starfinder projects for Obsidian. Please bring any to my knowledge.

I also want to provide some kind of css template for better access to the fields. Maybe using another plugin.
