# Features ready to implement
Features in this section have been fully designed and are ready to be implemented.

## Add an account menu
- The options currently available in the top menu should be condensed into an account menu which is indicated by a material design icon of a profile/headshot
- This should be the location for other options unless otherwise indicated

## Add a light mode
- There should be a theme toggle which allows light mode
- The light mode should still be moody and befitting of the Blades in the Dark theme
- The theme selector should be in the account menu mentioned in "Add an account menu", above

## Improve layout

- Checkboxes in general should be on the same line as the trigger text, not below it. E.g. for XP Triggers, Items & Equipment and Armor
  - The XP Triggers section has been updated, but this is still needed for Trauma Conditions, Items & Equipment, Friends & rivals and Armor
- X buttons in the Actions area are not needed and should be removed since they throw off the layout and are not actually needed to reset the action rating to 0 (clicking the first dot will do that).
- The "Save Changes" button at the bottom of the character sheet is not needed and should be removed since changes are saved automatically as they are made. This will also help with the layout and make it less cluttered.

# Features which need more information

These features should NOT be implemented until more information is provided about how they should work, and what they should look like.

## There should be a team sheet
- Any player can create a team, after which they are automatically enrolled in the team
- Once created, a join link should be generated which will allow others to join the team
- To join a team, the user must select the character from their list that they want to join with
- If the current user is in a team, the team should appear after login alongside their character(s)
- When clicking into the team, the team view should be displayed, which should be based on the team sheets found here: https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Blank_Crew_Sheet.pdf
- The same visual styling that is applied to the character sheet should apply to the team sheet
- Any member of a team can edit the team sheet

## Data versioning
- Changes should be versioned so that players can return to a previous version
- There should be a dropdown in the character sheet UI which will allow rollback to a previous version
- New versions should be created on a rolling schedule - if there are no changes within the last hour, that version is stored and a new version is created when the next change is made
- Only the last 10 versions should be stored

## All players should have read access to all other players' character sheets

## There should be a GM mode that allows the GM to view all character sheets in one place, and to make notes on each character sheet that only the GM can see.

## The GM sheet should be added

## Improve informational aspect of inteface

- There should be explanations of what each stat does, and how it affects the game. This could be done through tooltips or a help section. 
  - Examples TBD


