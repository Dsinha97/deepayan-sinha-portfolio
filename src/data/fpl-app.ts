/*
 * The FPL Decision case study's screen tour and analytics map (showcase:
 * "fpl-app"). One source for both: each app surface names the engines whose
 * output it shows, the tour's chips and the engine x screen matrix are both
 * derived from that list, so the two can't disagree.
 *
 * Facts come from the fpl-app repo (README, docs/wiki/, lib/, supabase/) as of
 * 2026-09-27; see docs/wiki/case-study-fpl-decision.md for the sourcing and the
 * stale claims in that repo's own docs that were deliberately not repeated.
 * Nothing here is an accuracy claim: numbers visible inside a screenshot are
 * the app's outputs, not statements this site makes.
 *
 * Screenshots are 1600px WebP pairs, one per site theme, swapped by
 * ThemeImage.astro. Images are not scanned by the build's guards — any new
 * screenshot needs a human look for personal data before it is committed.
 */
import deadlineLight from '../assets/work/fpl/deadline-light.webp';
import deadlineDark from '../assets/work/fpl/deadline-dark.webp';
import builderLight from '../assets/work/fpl/builder-light.webp';
import builderDark from '../assets/work/fpl/builder-dark.webp';
import transfersLight from '../assets/work/fpl/transfers-light.webp';
import transfersDark from '../assets/work/fpl/transfers-dark.webp';
import chipsLight from '../assets/work/fpl/chips-light.webp';
import chipsDark from '../assets/work/fpl/chips-dark.webp';
import scenariosLight from '../assets/work/fpl/scenarios-light.webp';
import scenariosDark from '../assets/work/fpl/scenarios-dark.webp';
import playersLight from '../assets/work/fpl/players-light.webp';
import playersDark from '../assets/work/fpl/players-dark.webp';
import cardLight from '../assets/work/fpl/player-card-light.webp';
import cardDark from '../assets/work/fpl/player-card-dark.webp';
import compareLight from '../assets/work/fpl/player-compare-light.webp';
import compareDark from '../assets/work/fpl/player-compare-dark.webp';

export type EngineId =
  | 'xp'
  | 'lineup'
  | 'optimiser'
  | 'transfers'
  | 'chips'
  | 'squadscore'
  | 'risk'
  | 'price'
  | 'gems'
  | 'compare';

/* Matrix row order. `xp` is the server-side model; the rest run in the browser. */
export const engines: { id: EngineId; name: string }[] = [
  { id: 'xp', name: 'Expected-points model' },
  { id: 'lineup', name: 'Lineup & captain' },
  { id: 'optimiser', name: 'Squad optimiser' },
  { id: 'transfers', name: 'Transfer search' },
  { id: 'chips', name: 'Chip value' },
  { id: 'squadscore', name: 'SquadScore' },
  { id: 'risk', name: 'Risk' },
  { id: 'price', name: 'Price watch' },
  { id: 'gems', name: 'Hidden Gems' },
  { id: 'compare', name: 'Player comparison' },
];

/* Short chip labels; the model gets the accent chip, engines the teal one. */
export const engineChip: Record<EngineId, string> = {
  xp: 'xP model',
  lineup: 'Lineup & captain',
  optimiser: 'Squad optimiser',
  transfers: 'Transfer search',
  chips: 'Chip value',
  squadscore: 'SquadScore',
  risk: 'Risk',
  price: 'Price watch',
  gems: 'Hidden Gems',
  compare: 'Player comparison',
};

export type Shot = { light: ImageMetadata; dark: ImageMetadata; alt: string; route: string };

/* A matrix column: one surface of the app and the engines it shows. */
export type Surface = { id: string; short: string; engines: EngineId[] };

export const surfaces: Surface[] = [
  { id: 'deadline', short: 'Deadline', engines: ['xp', 'lineup', 'chips', 'risk'] },
  { id: 'builder', short: 'Builder', engines: ['xp', 'optimiser', 'lineup', 'chips', 'risk', 'gems'] },
  { id: 'transfers', short: 'Transfers', engines: ['xp', 'transfers', 'chips', 'risk', 'price'] },
  { id: 'chips', short: 'Chips', engines: ['xp', 'chips', 'optimiser', 'lineup'] },
  { id: 'scenarios', short: 'Scenarios', engines: ['xp', 'squadscore', 'lineup', 'risk'] },
  { id: 'players', short: 'Players', engines: ['xp', 'price', 'risk', 'gems'] },
  { id: 'card', short: 'Card', engines: ['xp', 'price'] },
  { id: 'compare', short: 'Compare', engines: ['xp', 'compare', 'risk'] },
];

export type Group = 'live' | 'strategy' | 'statistics';

export const groups: { id: Group; name: string }[] = [
  { id: 'live', name: 'Live' },
  { id: 'strategy', name: 'Strategy' },
  { id: 'statistics', name: 'Statistics' },
];

export type TourEntry = {
  id: string;
  group: Group;
  eyebrow: string;
  title: string;
  body: string[];
  /* The surfaces this entry covers; its chips are the union of their engines. */
  surfaces: string[];
  shots: Shot[];
};

export const tour: TourEntry[] = [
  {
    id: 'deadline',
    group: 'live',
    eyebrow: 'Deadline day',
    title: 'Deadline Hub',
    body: [
      'The screen to open before a deadline. A countdown, a legality check, availability flags from the latest news, the recommended captain and XI with the reasons written out — start probability, penalty duty, a hard fixture — and whether this is the week for a chip.',
      "It computes nothing of its own. Its job is to put every engine's answer in one place at the moment the decision is made.",
    ],
    surfaces: ['deadline'],
    shots: [
      {
        light: deadlineLight,
        dark: deadlineDark,
        route: '/deadline',
        alt: 'Deadline Hub: countdown to the gameweek 6 deadline, the imported squad on a pitch, an availability flag, and the recommended captain with its reasons',
      },
    ],
  },
  {
    id: 'builder',
    group: 'strategy',
    eyebrow: 'Build',
    title: 'Team Builder',
    body: [
      "Build or optimise a squad and project it over one gameweek or the rest of the season. The optimiser offers four strategies — maximum points, balanced, value, differential — and a risk level that plans on the cautious end of each projection's range rather than its middle.",
      'The lineup engine picks the XI, armband and bench order, and counts the bench only as far as auto-substitutions are likely to reach it. The budget bar shows money sitting on the bench against the cheapest legal bench.',
    ],
    surfaces: ['builder'],
    shots: [
      {
        light: builderLight,
        dark: builderDark,
        route: '/builder',
        alt: 'Team Builder: a five-gameweek projection of 274.4 expected points, the budget bar, the squad on a pitch, and the gameweek lineup with the recommended captain',
      },
    ],
  },
  {
    id: 'transfers',
    group: 'strategy',
    eyebrow: 'Plan',
    title: 'Transfers',
    body: [
      'One question a week: roll, spend one, spend two, take a hit, or wildcard. The transfer path sequences moves around the chips already planned, and every line is a sum of named terms — expected points, hit, risk, chip bonus — rather than one net figure.',
      "The value of waiting for team news is an input the manager sets, not a constant the app invents. The note under the plan says what the search did and didn't cover.",
    ],
    surfaces: ['transfers'],
    shots: [
      {
        light: transfersLight,
        dark: transfersDark,
        route: '/transfers',
        alt: 'Transfers: a four-gameweek transfer path — wildcard, bench boost, roll, free hit — each line a sum of named terms',
      },
    ],
  },
  {
    id: 'chips',
    group: 'strategy',
    eyebrow: 'Time the chips',
    title: 'Chip Strategy',
    body: [
      "Which gameweek each chip is worth most, and by how much. A chip's value is the squad's expected points with it minus without it, compared across every remaining gameweek, and chips can be pinned to a week and scheduled together.",
      'When the top options sit within a fraction of a point of each other, the screen says it is not a strong recommendation rather than crowning one.',
    ],
    surfaces: ['chips'],
    shots: [
      {
        light: chipsLight,
        dark: chipsDark,
        route: '/transfers?tab=chips',
        alt: 'Chip Strategy: the best gameweek for each chip with its gain over holding it, chip sequences, and a schedule for gameweeks 1 to 19',
      },
    ],
  },
  {
    id: 'scenarios',
    group: 'strategy',
    eyebrow: 'Compare plans',
    title: 'Scenario Lab',
    body: [
      'Every saved draft, ranked by SquadScore: expected points, fixture quality, bench strength and value, less a risk charge — all expressed in points so they can be added. Up to four drafts compare term by term.',
      'A toggle swaps projections for what each draft would actually have scored, and it is labelled as the hypothetical it is.',
    ],
    surfaces: ['scenarios'],
    shots: [
      {
        light: scenariosLight,
        dark: scenariosDark,
        route: '/scenarios',
        alt: 'Scenario Lab: three saved drafts ranked by SquadScore, each with its expected points, legality and captain',
      },
    ],
  },
  {
    id: 'players',
    group: 'statistics',
    eyebrow: 'Explore',
    title: 'Player Explorer',
    body: [
      'Every player in the game, with expected points over 1, 3, 5, 8 or 19 gameweeks or the season — and the range around each projection, not only its middle. Current-season rates, expected minutes and value per million sit alongside.',
      "Price watch reads how far each player is towards a price change, and its labels are positional — close, approaching, far — because crossing the line doesn't guarantee a change that night.",
    ],
    surfaces: ['players'],
    shots: [
      {
        light: playersLight,
        dark: playersDark,
        route: '/players',
        alt: 'Player Explorer: a sortable table of players with price watch, expected points for the next gameweek and the next five with a range, and season statistics',
      },
    ],
  },
  {
    id: 'card',
    group: 'statistics',
    eyebrow: 'One player, then two',
    title: 'Player card and Compare',
    body: [
      "The same card opens from every page: each figure ranked within the player's position, the price and its movement, price watch, and a per-fixture points breakdown checked against the game's own scoring rules. Up to four players then compare side by side over the page's horizon — weighted across expected points, fixtures, value, minutes and form — and the panel names what each player wins, not just a score.",
    ],
    surfaces: ['card', 'compare'],
    shots: [
      {
        light: cardLight,
        dark: cardDark,
        route: 'Player card · opens from every page',
        alt: 'Player card: a snapshot of points, ownership, next-gameweek expected points, form, minutes and price, each ranked within position',
      },
      {
        light: compareLight,
        dark: compareDark,
        route: '/players?panel=compare',
        alt: 'Player comparison: two players ranked over five gameweeks, with the categories each one wins and a metric-by-metric table',
      },
    ],
  },
];

/* The chips for a tour entry: the model first, then each engine once, in matrix order. */
export function chipsFor(entry: TourEntry): EngineId[] {
  const used = new Set(surfaces.filter((s) => entry.surfaces.includes(s.id)).flatMap((s) => s.engines));
  return engines.map((e) => e.id).filter((id) => used.has(id));
}

/* The four lanes of "Where the analytics fits". */
export const sources: { name: string; detail: string }[] = [
  { name: 'FPL public API', detail: 'players, fixtures, live scores, squads, leagues' },
  { name: 'Four seasons of history', detail: 'gameweek data for the backtest' },
  { name: 'Promoted-club priors', detail: 'for players with no Premier League minutes' },
  { name: 'News feeds', detail: 'headlines tagged to players and clubs' },
  { name: 'Your squad', detail: 'pasted from the game: prices paid, bank, free transfers' },
];

export const serverOutputs: { name: string; detail: string }[] = [
  { name: 'Horizon views', detail: '1 gameweek to season end, with a low–high band' },
  { name: 'Change-only snapshots', detail: 'price, ownership, status and news history' },
  { name: 'Prediction archive', detail: 'last pre-deadline projection, scored against results' },
];

export const browserEngines: { name: string; detail: string }[] = [
  { name: 'Squad optimiser', detail: 'knapsack, by points per £m' },
  { name: 'Lineup & captain', detail: 'XI, armband, bench order' },
  { name: 'Transfer search', detail: 'beam search that keeps funding moves' },
  { name: 'Chip value', detail: 'xP with minus xP without' },
  { name: 'SquadScore', detail: 'every term in points' },
  { name: 'Risk', detail: 'rotation, injury, minutes, fixtures' },
  { name: 'Price watch', detail: 'distance to a fitted threshold' },
  { name: 'Effective ownership', detail: 'mini-league and top-1k' },
];
