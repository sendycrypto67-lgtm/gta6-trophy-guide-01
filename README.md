# Leonida Trophy Guide: GTA VI, all 55 PS5 trophies

An offline web app that guides and tracks all 55 PlayStation 5 trophies of
Grand Theft Auto VI. Static files only: open `app/index.html` in desktop
Chrome with the network off and it works.

What it does:

- Every one of the 55 official trophies with its official name, description
  and grade (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden).
- A guide in our own words for every trophy, each citing its source by name
  and link. Four trophies have no verified trigger yet at launch, and their
  guides say so honestly instead of inventing a method.
- A checklist saved in the browser (localStorage), with export and import.
- Filters by grade and kind (story, missable, collectibles, activities,
  robbery, side quests, exploration, money, combat, misc, online), plus
  search and an earned/remaining view. There are no online trophies.
- A spoiler setting that hides the name, description and guide of hidden
  story trophies until they are earned.
- A three-stage roadmap to the platinum (about 200 hours) and the one
  potentially missable trophy flagged: Positive Mental Attitude.

Sources: PowerPyx GTA 6 Trophy Guide and Roadmap, KeenGamer GTA 6 Trophy
Guide and Platinum Roadmap, and the Planet GTA 6 trophy list (Exophase,
PSNProfiles, TrueAchievements). Trophy names and descriptions are shown as
PlayStation publishes them. Unofficial fan guide, not affiliated with
Rockstar Games or Sony. No Rockstar logo, official artwork, box art or game
screenshots are used.

Run it locally: `node serve.ts`, then open http://localhost:8080.

Build the submission bundle: `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`.

License: MIT.
