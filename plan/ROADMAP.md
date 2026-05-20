# Career directive
- Made a decision: DO NOT WORK ON THIS PROJECT unless there's a blocker on the main focus (career), or if there's a chance to parallel process.

# Features ready to implement
Features in this section have been fully designed and are ready to be implemented.

## Backup and restore character sheets

- There should be a way to download a backup of the character sheet as a JSON file, which can be stored locally and re-uploaded to restore the character sheet to that state. This should be implemented as a menu item titled "Download backup" which will trigger the download of the JSON file. The file should be named with the character name and the date of the backup. There should also be a menu item titled "Upload backup" which will allow the user to select a JSON file from their local storage and upload it to restore the character sheet to that state. The upload process should include validation to ensure that the uploaded file is in the correct format and contains valid data. Tests should be implemented to make sure that the backup and restore functionality works correctly and doesn't lose existing data.

## Restore previous states

Pease implement a way to restore previous states of the character sheets. This would ideally be done by keeping backups for the last 5-10 changes which can be restored at will. 

There should be a dialog which launches from a button titled "Restore old version" placed next to the "Save changes" button. The dialog should allow the user to select to restore any one of 5-10 previous versions, which should be listed with the save time and last item changed. Upon selecting a save point, the state should be updated to the content from the backup. The change should be represented in the history as the latest state change, and indicate in the history that a restore was made. Tests should be implemented to make sure that database operations follow the ACID principles and don't lose existing data.

## Improve layout

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

## Improved tests

- Test should be added to include data for all fields and make sure it's persisted and retreived correctly during a DB change
- Review https://github.com/sleeke/Blades-in-the-dark/pull/4/changes#top
