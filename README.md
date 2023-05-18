# CatBurglars

CatBurglars is an online multiplayer party game where you are a team of cats on a mission to rob a house! Communicate and work together to steal a fresh supply of fish before the owners get home! CatBurglars will use Node.js, Sockets, Express, and Phaser.

---

Capstone Project by Boris Bilogur, Camilla Cheng, Christina Buencamino, Hamidou Ballo, Lisani Shrestha, and Shafali Gupta

## To Run CatBurglars Locally:

1. Clone this repo
2. Navigate into the directory of the repo in the terminal.
3. Run the following command in the terminal:

```
$ npm start
```

4. Open 4 different windows and have them fill the 4 corners of your screen simultaneously.
5. Then go to localhost:8080 on all 4 windows.
6. Have fun playing CatBurglars!

## Dev Notes

- If there are any issues building, please let us know. We can substitute with a demo if need be.
- I recommend zooming out on all 4 windows if necessary so the whole game fits the window.
- If there is significant lag in any of the tabs, we recommend closing that window and creating a new client window.
- If the game starts lagging and starts having multiple errors, give your comp some time to rest before retesting please
- The timers were made to accommodate the current “1 user” local structure of the game. If the game were to be hosted online, the timers would be shortened accordingly for 4 different users.
- To disconnect a client, you can reload the window.
-Some parts of the animations/updates to the UI may be slow due to lag. If something hasn't been updated, please wait even if it takes a while. Errors due to not waiting are listed below.
- Switching browsers might help with lag issues

## Current Bugs

Disclaimer: We’ve listed as many bugs as we could but because there are so many variable elements, there will most likely be an error that you run into that isn’t listed.

- If one player has a significant amount of lag, it may disconnect randomly, breaking the game.
- Timers not showing up for other players sometimes
- In Game Disconnect for Player 1 Doesn’t Work
- In Game Disconnect Does Not Work for Introduction-to-Task-One Scenes
- If all 4 players don’t load in all 4 lobbies before “Start Game” is pressed, Task One doesn’t load on the player whose lobby is still loading
- Texture key already in use slowing down the client
- Disconnecting in-game then starting a new game from the resultant lobby causes several copies of the timer and significant slowdown due to error spam
- Disconnecting in game/creating new rooms are not deleted (meaning you can join old room codes through the join room) This error exists because trying to delete the room causes errors with syncing if one player is trying to read the room data but it was deleted prior.
- Disconnecting in the lobby then launching the game from a window that reconnects to the lobby causes a lot of strange behaviors, including but not limited to: crashing the tabs, double layering the font on the sidebar in task 1, random amount of copied timers (and significant slowdown from said timers, might just be running several copies of the task at once?). Trying to disconnect in-game after also definitely crashes all of your tabs as the server loops through an unending amount of join calls
- Disconnecting many times and rejoining clients seems to crash the server and make it start disconnecting sockets at random
- The server can’t keep up with a lot of disconnects and starts slowing down, but it seems to catch up eventually
- Doubled layered names in the sidebar in task 1
- Significant lag on some players’ end causes issues being able to play tasks + receiving socket data about tasks (ex. Player 2 loading into the game extremely slowly causes the “Waiting for Other Players” text to show ABOVE the Task One instructions + causes Task 2 to fail to load”
- Duplicate and null-presenting (using space as username) usernames accepted
- “Not enough players!” and “Room Key Copied” messages can overlap
- Task 1 keys show up for some players while other ones still see “Waiting for players…” and are shown their keys after others have already received them
- Rarely, the introduction scene for a player will be skipped (zoom in on house)
- Winning/losing scene may show over Lobby Scene if player disconnects in Task 2
- Winning/Losing and returning to the homepage does NOT delete the old room, will say "Room is Full" if you try to join an old room key
