# Hephaistos Importer for Obsidian.md

A work-in-progress plugin for [Obsidian](https://obsidian.md) allowing for import of characters from [Hephaistos](https://hephaistos.online).

It is completely unaffiliated with either program and all thanks go to the dedicated programmers of those.

## Functionality

Given the public ID for a number of Hephaistos characters (the number at the end of the public share link), clicking on the hammer icon will populate the selected Obsidian folder with a note for each character, filling the frontmatter with data such as KAC, EAC, Ability scores and conditions.

If there is already a note with a character's name, the plugin wil update the frontmatter while leaving the rest of the note untouched.

Creating a frontmatter entry with the name of another entry and ending in `_override` will cause the program to use that value instead.

For instance you can force one character's `KAC` to be 15 by adding the frontmatter `KAC_override: 15`. Delete the override frontmatte to use the plugin's value again.

## Installation

Download and unzip the plugin to your vault's `.obsidian/plugins` folder.

## Limitations

This plugin is _not_ intended to replace Hephaistos in any way. It is merely importing data for convenience's sake -- probably most useful for Game Masters.

## Bugs

Since I am essentially reverse-engineering Hephaistos' calculations, I am absolutely sure that I haven't caught every variable that might influence the stats. Bug reports on specific combinations that doesn't show up would be very welcome. For now, I just know that it works with my group's characters.

## Roadmap

This is still a rough WIP, and my intended improvements are:

-   refinement of the existing data fields
-   HP and SP
-   Initiative
-   Any other ideas?
