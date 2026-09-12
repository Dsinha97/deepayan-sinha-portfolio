/*
 * Profile content: the proof strip, the About paragraphs, the experience
 * timeline, education and skills (DSI-91 to DSI-95). Components read from here
 * so the copy has one home and a guardrail check has one place to look.
 *
 * Every claim below is cleared by docs/wiki/content-guardrails.md and traceable
 * to docs/wiki/{profile,experience,education-and-credentials,skills}.md.
 * Three rules bite hardest here and none of them are style preferences:
 *
 *   1. Wipro is genericized. No client name, no platform or vendor names. The
 *      stack (Azure, Java, JavaScript, React Native) is cleared.
 *   2. The three self-reported Wipro figures carry `selfReported` wherever they
 *      appear. The marker is rendered, not decorative.
 *   3. Engagement outcomes only. What a client did next is not recorded and
 *      writing it is a fabrication however plausible it reads.
 *
 * The $500,000 parking figure is a different site's benchmark and never appears.
 */

export type Stat = { value: string; label: string };

/*
 * Four tiles, each answering a different objection. Deliberately no MBA tile —
 * the degree is already in the headline's vicinity and in Education, and a
 * third mention is the repetition the strip exists to avoid.
 */
export const proof: Stat[] = [
  { value: '6 yrs', label: 'AI/ML product engineering' },
  { value: '226', label: 'survey respondents, designed & analysed' },
  { value: '4 in 7 wks', label: 'consulting deliverables' },
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
  "I'm looking for Product Management and Business Analytics roles where I can turn customer problems into specs engineering can build.",
];

export type Role = {
  org: string;
  title: string;
  place: string;
  period: string;
  summary: string;
  points: string[];
  /* Rendered with a visible "self-reported" marker. Never silently dropped. */
  selfReported?: string[];
  tools?: string[];
  outcome?: string;
  /* Set once the case study exists. See `caseStudies` below. */
  more?: { label: string; href: string };
};

/*
 * Case-study routes are M4 (DSI-99 to DSI-101). Until a route exists, its
 * "See more" link must not render — a link to a page that 404s fails DSI-107's
 * zero-broken-links gate and is worse than no link at all. Flip an entry to
 * true in the same change that adds the page, not before.
 */
export const caseStudies = {
  '/work/fort-monroe/': false,
} as const;

export const roles: Role[] = [
  {
    org: 'William & Mary',
    title: 'Teaching Assistant — Economics',
    place: 'Williamsburg, VA',
    period: 'Aug 2025 – May 2026',
    summary: 'Weekly review sessions for the MBA economics sequence — micro, macro, managerial.',
    points: [],
  },
  {
    org: 'Fort Monroe Authority',
    title: 'MBA Corporate Field Consultancy',
    place: 'Fort Monroe, VA',
    period: 'Sept – Nov 2025',
    summary:
      'Four deliverables in seven weeks, one of five consultants, for an authority mandated to largely pay for itself.',
    points: [
      '226-respondent perception survey, designed and analysed',
      'Parking monetisation modelled against five comparable sites',
      '$20K event plan structured for full cost recovery',
      'Central Park Conservancy benchmark against 1.5M sq ft of vacant space',
    ],
    outcome:
      'Rated highly in an independent post-project review; follow-on engagement commissioned.',
    more: { label: 'See the case study', href: '/work/fort-monroe/' },
  },
  {
    org: 'William & Mary Information Technology',
    title: 'IT Data Strategy & Analytics Intern',
    place: 'Williamsburg, VA',
    period: 'May – Aug 2025',
    summary:
      "Two-person team for the university's chief data officer, asking whether internal measures pointed at anything that moves external rankings.",
    points: [
      'U.S. News methodology decomposed into 17 metrics, each traced to source',
      '19 internal KPIs inventoried across 5 committees',
      'Governance document feeding the Workday rollout and a Fabric governance layer',
    ],
    tools: ['Python', 'Power BI', 'Workday', 'MS Fabric'],
  },
  {
    org: 'Wipro',
    title: 'Project Engineer',
    place: 'Bengaluru, India',
    period: 'Aug 2018 – Aug 2024',
    summary:
      'Six years on a digital health assistant for a European insurance client, after a proof-of-concept I worked on converted the RFP that created it.',
    points: [
      'Led development on a five-person team',
      'Took over the team mid-migration after two departures, still delivered on schedule',
      '"Trail Blazers" recognition, Q3 FY2023-24',
    ],
    selfReported: [
      "Migrated to a platform at half the incumbent's cost, Aug 2022 – Jan 2023, no service disruption",
      'AI/ML module integration cut service calls 30%',
      '4.4 stars across 1,000+ users',
    ],
    tools: ['Azure', 'Java', 'JavaScript', 'React Native'],
  },
];

export type Degree = { school: string; award: string; period: string; notes?: string[] };

export const degrees: Degree[] = [
  {
    school: 'William & Mary, Raymond A. Mason School of Business',
    award: 'MBA — Business Analytics and Supply Chain Management',
    period: 'Aug 2024 – May 2026',
    notes: ['Beta Gamma Sigma inductee (top 20% of the cohort)'],
  },
  {
    school: 'Vellore Institute of Technology',
    award: 'B.Tech — Mechanical Engineering',
    period: 'Jul 2014 – Apr 2018',
  },
];

/* No GPA is recorded in any source material, so none is published. */

export const publication = {
  title:
    'Design and Analysis of Thermal Comfort of a Naturally Ventilated Recreational Vehicle',
  venue: 'International Journal of Energy, Environment and Economics — presented at ICPAT-19',
  href: 'https://www.researchgate.net/publication/334469078_Analysis_of_Thermal_Comfort_of_a_naturally_ventilated_Recreational_Vehicle',
};

export type Certificate = { name: string; issuer: string; date: string; href?: string };

/*
 * Dates read off the certificate files (LSSGB, Aha!) or the issuer's own
 * verification page (LinkedIn Learning, MBA Math). The three Anthropic
 * certificates print no date at all; those dates are the owner's.
 * Titles are the issuers' exact titles, not the shorthand the wiki used.
 */
export const certificates: { group: string; items: Certificate[] }[] = [
  {
    group: 'Process',
    items: [
      {
        name: 'Lean Six Sigma Green Belt (A2026-129)',
        issuer: 'William & Mary',
        date: 'May 2026',
      },
    ],
  },
  {
    group: 'Product',
    items: [
      {
        name: 'Aha! Product Management Professional',
        issuer: 'Aha!',
        date: 'Mar 2025',
      },
    ],
  },
  {
    group: 'AI',
    items: [
      { name: 'Claude Code 101', issuer: 'Anthropic', date: 'Jun 2026' },
      { name: 'AI Fluency: Framework & Foundations', issuer: 'Anthropic', date: 'May 2026' },
      { name: 'AI Capabilities and Limitations', issuer: 'Anthropic', date: 'May 2026' },
    ],
  },
  {
    group: 'Analytics',
    items: [
      {
        name: 'Power BI Data Modeling with DAX',
        issuer: 'LinkedIn Learning',
        date: 'Aug 2025',
        href: 'https://www.linkedin.com/learning/certificates/88e165371499c5e946bb363e6d6a18e9ea60984fea90b9f38059a034cbe25ee3?u=51086953',
      },
      {
        name: 'Power BI Essential Training',
        issuer: 'LinkedIn Learning',
        date: 'Jul 2025',
        href: 'https://www.linkedin.com/learning/certificates/fc6fe15ae3a6ba6e0d049b94956bd86cb375e7a6bcb66ee9cac458607287243d?u=51086953',
      },
      {
        name: 'SQL Essential Training',
        issuer: 'LinkedIn Learning',
        date: 'Jun 2025',
        href: 'https://www.linkedin.com/learning/certificates/3d2e06df96914e928a9405d59467cf20aca13089e5e554fca2b0731cabd374e8?u=51086953',
      },
      {
        name: 'MBA Math',
        issuer: 'MBA Math',
        date: 'Jul 2024',
        href: 'https://www.mbamath.com/Certificate.aspx?id=93t8lyrdThg%3d',
      },
    ],
  },
];

/*
 * No proficiency bars. A self-scored "Python 85%" tells a reader nothing and
 * invites the question of who scored it; the grouping is the information.
 *
 * Every group must be evidenced elsewhere on this page: product by the Wipro
 * entry, analytics by the survey and the internship, engineering by the two
 * shipped sites, process by the credential. A group that fails that test does
 * not go in the list. Frameworks that were studied but never applied are not
 * skills — see docs/wiki/skills.md.
 */
export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Product',
    items: [
      'AI/ML implementation',
      'Product lifecycle management',
      'Backlog prioritisation',
      'Roadmapping',
      'Go-to-market strategy',
      'Cost optimisation',
    ],
  },
  {
    group: 'Analytics',
    items: [
      'SQL',
      'Python',
      'Power BI',
      'Excel',
      'Survey design and analysis',
      'Benchmarking',
      'Data governance',
    ],
  },
  {
    group: 'Engineering',
    items: [
      'TypeScript',
      'JavaScript',
      'Astro',
      'Next.js',
      'React',
      'Tailwind CSS',
      'Supabase and Postgres',
      'Cloudflare Workers',
    ],
  },
  {
    group: 'Process and strategy',
    items: [
      'Lean Six Sigma Green Belt',
      'Process optimisation',
      'Make-or-buy analysis',
      'Stakeholder and C-suite management',
      'Cross-functional delivery',
    ],
  },
];

/* Tools rather than skills — a smaller trailing row, not a fifth group. */
export const tools: string[] = ['JIRA', 'Confluence', 'Tableau', 'Microsoft Fabric', 'Workday'];
