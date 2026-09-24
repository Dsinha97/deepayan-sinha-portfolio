/*
 * Profile content that isn't one of the six content collections (DSI-98):
 * the proof strip, the About paragraphs and the closing call to action. The
 * experience, education, certification, skills and recognition data lives in
 * `src/content/*`, and the toolkit in `src/data/tools.ts` — see
 * docs/wiki/site-architecture.md.
 */

/*
 * `unit` renders at half size beside the number, so a figure like "4 in 7 wks"
 * holds one line in a quarter-width tile instead of wrapping its unit.
 */
export type Stat = { value: string; unit?: string; label: string };

/*
 * Four tiles, each answering a different objection. Deliberately no MBA tile —
 * the degree is already in the headline's vicinity and in Education, and a
 * third mention is the repetition the strip exists to avoid.
 */
export const proof: Stat[] = [
  { value: '6', unit: 'yrs', label: 'AI/ML product engineering' },
  { value: '226', label: 'survey respondents, designed & analysed' },
  { value: '4', unit: 'in 7 wks', label: 'consulting deliverables' },
  { value: '2', label: 'production sites shipped' },
];

/*
 * First person, one topic per paragraph, no numbers — every figure here would
 * be its third appearance on the page. See the my-writing-style skill.
 */
export const about: string[] = [
  "I'm an MBA graduate from William & Mary, concentrating in Business Analytics and Supply Chain Management.",
  'Before that, six years at Wipro building AI/ML products — leading development on a small team, then running a platform migration and picking up the team when two people left mid-way.',
  'I still build. This site and fpldecision.com are mine end to end.',
];

/* The one line the rail carries above the name, and the closing band's pitch. */
export const status = 'Open to PM & analytics roles';
export const lookingFor =
  "I'm looking for Product Management and Business Analytics roles where I can turn customer problems into specs engineering can build.";
