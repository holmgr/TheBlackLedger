# Gameplay core

Working design brief. Confirmed foundations capture the current direction; proposals are starting points for discussion and prototyping, not locked requirements.

## Concept

A 2D isometric tactical squad RPG about a sci-fi mercenary group with a large outstanding bounty and debts to repay. Take contracts, develop the roster, and assemble squads whose abilities work well together.

The main appeal is mastering characters, builds, and team combinations. Narrative gives missions context, but extensive story and character backgrounds are not a development priority.

## Confirmed foundations

- **Fixed roster:** approximately seven characters, with four deployed per mission. Squad composition and synergy are central decisions.
- **No permanent death:** losing a character permanently is not part of the game.
- **Flat tactical space:** elevation has no gameplay effect. Isometric presentation provides the visual perspective.
- **Sci-fi setting:** an original universe with mercenary work, advanced equipment, and financial pressure.
- **No supernatural abilities:** character capabilities come from training, weapons, armor, cybernetics, and technology.
- **Contract-driven premise:** the crew takes missions to pay its debts while carrying a large outstanding bounty.
- **Expandable core:** establish satisfying combat and squad building before adding extensive campaign systems.

## Inspirations

These are creative reference points, not specifications to reproduce their mechanics or settings.

| Reference | Desired influence |
| --- | --- |
| World of Warcraft and Baldur's Gate | Distinct character roles, abilities, equipment, and RPG progression |
| XCOM, Menace, and Star Wars Zero Company | Tactical squad gameplay, deployment decisions, and coordinated combat |
| Star Wars, XCOM, and Warhammer 40,000 | Sci-fi atmosphere, equipment, factions, and visual inspiration |

The mercenary premise draws particularly on the direction discussed around Zero Company. The exact tone and visual style remain open.

## Proposed gameplay loop

1. Review contracts and available mission intel.
2. Select four characters and configure their equipment and abilities.
3. Deploy, complete tactical objectives, and extract.
4. Receive rewards and develop the roster.
5. Allocate earnings between debt repayment and improved capabilities.
6. Prepare for another contract, experimenting with different combinations.

A ship is a proposed home base for contract selection, loadouts, upgrades, and debt management. A small set of screens is sufficient initially.

## Proposed combat direction

Use turn-based combat on a readable grid. The action economy, turn order, and movement rules still need to be selected and tested.

Positioning comes from distance, line of sight, cover, chokepoints, hazards, and objectives. Height grants no bonuses or penalties.

Build synergy through shared mechanics rather than exclusive character-pair bonuses. Examples include suppressing a position so an ally can advance, marking a priority target for focused fire, and disabling a turret before an assault.

Each character should remain useful independently and fit several squads. Avoid making one healer or defender mandatory. Mission intel should help players choose a team without demanding a single correct composition.

### Candidate roster

These seven specialist roles are a working proposal; names, abilities, and final identities remain open.

| Specialist | Main contribution | Potential tools |
| --- | --- | --- |
| Bulwark | Protect allies and hold positions | Heavy armor, interception, portable barriers |
| Breacher | Assault at close range | Close-range weapons, entry tools, displacement |
| Marksman | Eliminate priority targets | Precision fire, target marking, overwatch |
| Engineer | Deploy battlefield tools | Drones, turrets, traps |
| Field Medic | Sustain and support the squad | Treatment, combat stimulants, protective equipment |
| Saboteur | Infiltrate and disrupt | Hacking, concealment tools, equipment sabotage |
| Gunner | Suppress enemies and control firing lanes | Suppressive fire, concussion grenades, braced firing, cover destruction |

The Gunner replaces the rejected Anomaly Adept concept. No supernatural or gravity-power specialist is planned. The Bulwark protects allies; the Gunner restricts enemy options.

## Proposed progression and failure rules

- Share roster progression so undeployed characters remain viable.
- Use compact ability trees, limited equipped abilities, and equipment that changes tactical choices.
- Allow free build and equipment changes between missions to encourage experimentation.
- Let characters be knocked out during missions, potentially with limited revival opportunities.
- Return the full roster after missions without lasting injury downtime.
- Allow retries after defeat; use optional objectives and rewards to create additional stakes.

Only the absence of permanent death is confirmed. Knockouts, revival, retries, and progression details need validation.

## Proposed contracts and economy

Candidate objectives include salvage, extraction, sabotage, capture, and defense. Vary objectives and enemy compositions to reward different squads.

The central spending decision is whether to repay debt or invest in equipment, ship facilities, and optional mission preparation. Repayment should provide visible progress without preventing satisfying upgrades.

One possible explanation connects the debt and bounty: a creditor holds a claim against the crew and its ship, and payments suspend active collection. This explanation, the origin of the debt, and the campaign's ending are not decided.

Prefer recoverable setbacks over economic spirals. Fixed repayment milestones are an initial proposal; interest, deadlines, bounty escalation, and consequences for missed payments remain open.

## First playable prototype

Proposed scope:

- Five playable specialists with four deployment slots, creating an immediate composition choice.
- A small set of complementary abilities for each specialist.
- Two short encounters on flat maps with cover and distinct objectives.
- A simple squad-selection and loadout screen.
- Placeholder art and minimal mission context.

The intended full roster remains approximately seven. The smaller prototype tests whether swapping one character meaningfully changes tactics before building the whole roster.

Success means players can understand combat outcomes, discover useful combinations, and complete encounters using more than one squad composition. Defer extensive narrative, procedural campaigns, crafting, and base construction until this foundation works.

## Next design decisions

1. Combat rules: grid type, turn order, movement, action economy, accuracy, and cover.
2. Specialist kits: starting abilities, overlapping support options, and synergy rules.
3. Mission structure: map size, encounter length, exploration, and extraction.
4. Progression: ability unlocks, equipment structure, and reward pacing.
5. Campaign pressure: relationship between bounty and debt, repayment cadence, and failure recovery.
6. Setting and presentation: tone, technology limits, factions, and art direction.
