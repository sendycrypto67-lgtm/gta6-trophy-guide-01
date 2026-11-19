[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/sendycrypto67-lgtm/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/sendycrypto67-lgtm/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Trophy Guide: GTA VI, all 55 PS5 trophies

An offline web app that guides you through and tracks all 55 PlayStation 5 trophies of
Grand Theft Auto VI. Static files only: open `app/index.html` in desktop
Chrome with the network off and it just works.

What it does:

- Every one of the 55 official trophies with its official name, description
  and grade (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden).
- A guide for every trophy, each naming its source with a link. Two trophies have no verified method at launch, Bad Luck, I
  Guess and Ten Pin, and their guides admit that plainly instead of inventing
  a method.
- A checklist saved in the browser (localStorage), with export and import.
- Filters by grade and kind (story, missable, collectibles, activities,
  robbery, side quests, exploration, money, combat, misc, online), plus
  search and an earned/remaining view. There are no online trophies.
- A spoiler setting that hides the name, description and guide of hidden
  story trophies until they are earned.
- A three-stage roadmap to the platinum (roughly 200 hours), with the one
  potentially missable trophy flagged: Positive Mental Attitude.

Sources: the PowerPyx GTA 6 Trophy Guide and Roadmap, and the GTA 6 trophy
list that checks PSNProfiles and TrueAchievements against each other. Trophy names and
descriptions appear as PlayStation publishes them. Unofficial fan guide,
not affiliated with Rockstar Games or Sony. No Rockstar logo, official
artwork, box art or game screenshots are used.

Run it locally: `node serve.ts`, then open http://localhost:8080.

Build the submission bundle: `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`.

License: MIT.
