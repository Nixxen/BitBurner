// TODO:
// - [ ] Make backdoor deploy script for any known servers, based on previous runs (faction invites, cost decreases, etc)
//     - Servers (server (faction)):
//         - [ ] CSEC (CSEC faction)
//         - [ ] avmnite-02h (NiteSec faction)
//         - [ ] I.I.I.I (The Black Hand faction)
//         - [ ] iron-gym (Or any other gym. Cheaper workout cost)
//         - [ ] run4theh111z (Bitrunners faction, requires deep scanning > 10 hops)
//      - Edit: Turns out I can not backdoor servers through scripts yet, and that is apparently something that is unlocked later... Just use this list for manual deployment on resets.
// - [ ] Make fleet hack script
// - [x] Make "get server path" helper script (see find server)
// - [ ] Make a script to scan for, and solve contracts (if possible)
// - [ ] Make a script to find duplicate scripts (failed VScode sync and removal, etc)
// - [ ] Make a script to store player info in a text file before a reset, allowing for easy access to player info before the formulas has been unlocked on a new run.
// - [x] Make "early attack" launchpad script, that automates deployment targets
//       of the first few minutes of the game and boots up all the "grind scripts"
// - [ ] Extend find target script to find all targets matching keyword.
// - [ ] Stock exchange script that runs without 4s market data. Rough plan:
//      - Needs predictive history matching.
//      - Read market data
//      - Prime algorithm on stored data
//          - Fourier transforms? Need to look at different predictions
//      - Make predictions on primed algorithm

// Completed factions:
// - [x] CSEC (Hacking.)
//      - No faction lock
// - [x] NiteSec (Hacking.)
//      - Faction lock: Hacking exp and skill
// - [x] The Black Hand (Hacking.)
//      - Faction lock: Hacking, dex, and str skill, hack power, hack speed
// - [x] Bitrunners (Hacking.)
//      - Faction lock: Hacking, dex, and str skill, hack power, hack speed
//      - Start with FTPCrack and relaySMTP
// - [x] Four Sigma (Job/Work related + hacking + faction/rep boosts etc.)
//      - No faction lock
// - [x] Tian Di Hui (Job/Work related + faction/rep boosts etc.)
//      - Faction lock: Rep + money from work. Removes focus penalty from tasks.
// - [x] Netburners (Hacknet nodes)
//      - Faction lock: Hacknet related
// - [x] Slum Snakes (Crime and combat related)
//      - Faction lock: Dex skill, dex exp, and crime money
// - [ ] Chongquin
// - [x] Sector-12 (??)
//      - Faction lock: ??
// - [x] Aevum (Mixed bag)
//      - Faction lock: Deepscanv1, Autolink when installing
// - [x] Volhaven
//      - Faction lock: +40% defense skill
// - [x] New Tokyo (Mixed bag.)
//      - Faction lock: +20% combat exp
// - [x] Ishima (Combat skill related)
//      - Faction lock: Dex skill, crime money and crime success rate
// - [ ] NSA?
// - [x] Blade Industries (Combat skill related, some hacking) - From Blade
//      - Faction lock: Strength skill, defense skill
// - [x] Megacorp (Mostly hacking related) - From Megacorp
//      - Faction lock: +35% combat exp, +35% combat skills
// - [x] Daedalus (Mostly hacking, some combat)
//      - Faction lock: Red pill
// - [ ] Shadows of Anarchy (Infiltration cheats)
//      - Faction lock: Everything they have are faction locks.
// - [x] Clarke Incorporated (Mixed bag) - From Clarke
//      - Faction lock: +hacking exp, +hacking skill, +hacking speed, +20% all skills
// - [x] Silhouette (Company rep related) - From LexoCorp
//      - Faction lock: charisma skill, charisma exp
// - [x] Tetrads (Combat related)
//      - Faction lock: +30% dex skill, +30% strength skill
// - [x] The Covenant (Combat related)
//      - Faction lock: +15% hacking skill, +75% combat skills
// - [x] The Illuminati (Mixed bag) - From NSA or combat skills?
//     - Faction lock: +75% hacking skill, +100% faster hack, +150% hack chance, +300% hack power
