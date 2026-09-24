/*
 * The toolkit: named software, grouped, each with its logo. Every entry is the
 * owner's own working experience (confirmed 2026-09-24) — a tool that was only
 * studied does not belong here; see docs/wiki/skills.md.
 *
 * The logos are in src/assets/tools/, optimised copies of the originals in
 * images/Platforms/ (rasters trimmed and capped at 128px; SVGs as supplied).
 * They are other companies' marks, used only to name the tool, so they sit on
 * the fixed `mark-plate` tile in both themes rather than being recoloured —
 * the same rule as the institution marks in Education.astro. Several are black
 * and would vanish on the dark ground without it.
 *
 * `logoFor` lets other components (the case-study stack chips) reuse a mark by
 * tool name without importing it twice.
 */
import api from '../assets/tools/api.png';
import astro from '../assets/tools/astro.png';
import canva from '../assets/tools/canva.png';
import chatgpt from '../assets/tools/chatgpt.svg';
import claude from '../assets/tools/claude.svg';
import cloudflare from '../assets/tools/cloudflare.png';
import deno from '../assets/tools/deno.png';
import postgres from '../assets/tools/postgres.png';
import telegram from '../assets/tools/telegram.png';
import confluence from '../assets/tools/confluence.png';
import css from '../assets/tools/css.png';
import discord from '../assets/tools/discord.svg';
import excel from '../assets/tools/excel.svg';
import gemini from '../assets/tools/gemini.svg';
import github from '../assets/tools/github.svg';
import html from '../assets/tools/html.svg';
import jasp from '../assets/tools/jasp.png';
import javascript from '../assets/tools/javascript.png';
import jira from '../assets/tools/jira.svg';
import linear from '../assets/tools/linear.png';
import microsoftFabric from '../assets/tools/microsoft-fabric.png';
import mysql from '../assets/tools/mysql.svg';
import nextjs from '../assets/tools/nextjs.svg';
import notebooklm from '../assets/tools/notebooklm.svg';
import numpy from '../assets/tools/numpy.png';
import pandas from '../assets/tools/pandas.svg';
import perplexity from '../assets/tools/perplexity.svg';
import postman from '../assets/tools/postman.png';
import powerBi from '../assets/tools/power-bi.svg';
import promptEngineering from '../assets/tools/prompt-engineering.png';
import python from '../assets/tools/python.png';
import react from '../assets/tools/react.svg';
import slack from '../assets/tools/slack.svg';
import sql from '../assets/tools/sql.svg';
import supabase from '../assets/tools/supabase.png';
import tableau from '../assets/tools/tableau.png';
import tailwind from '../assets/tools/tailwind-css.svg';
import trello from '../assets/tools/trello.svg';
import typescript from '../assets/tools/typescript.png';
import vercel from '../assets/tools/vercel.png';
import workday from '../assets/tools/workday.png';

export type Tool = { name: string; logo: ImageMetadata };
export type ToolGroup = { group: string; items: Tool[] };

export const toolGroups: ToolGroup[] = [
  {
    group: 'Product & delivery',
    items: [
      { name: 'JIRA', logo: jira },
      { name: 'Confluence', logo: confluence },
      { name: 'Linear', logo: linear },
      { name: 'Trello', logo: trello },
      { name: 'Slack', logo: slack },
      { name: 'Discord', logo: discord },
      { name: 'Workday', logo: workday },
    ],
  },
  {
    group: 'Data & analytics',
    items: [
      { name: 'SQL', logo: sql },
      { name: 'MySQL', logo: mysql },
      { name: 'Python', logo: python },
      { name: 'NumPy', logo: numpy },
      { name: 'pandas', logo: pandas },
      { name: 'Power BI', logo: powerBi },
      { name: 'Tableau', logo: tableau },
      { name: 'Microsoft Fabric', logo: microsoftFabric },
      { name: 'Excel', logo: excel },
      { name: 'JASP', logo: jasp },
    ],
  },
  {
    group: 'Build',
    items: [
      { name: 'HTML', logo: html },
      { name: 'CSS', logo: css },
      { name: 'JavaScript', logo: javascript },
      { name: 'TypeScript', logo: typescript },
      { name: 'React', logo: react },
      { name: 'Next.js', logo: nextjs },
      { name: 'Astro', logo: astro },
      { name: 'Tailwind CSS', logo: tailwind },
      { name: 'Supabase', logo: supabase },
      { name: 'Cloudflare', logo: cloudflare },
      { name: 'Vercel', logo: vercel },
      { name: 'GitHub', logo: github },
      { name: 'Postman', logo: postman },
      { name: 'APIs', logo: api },
    ],
  },
  {
    group: 'AI',
    items: [
      { name: 'Claude', logo: claude },
      { name: 'ChatGPT', logo: chatgpt },
      { name: 'Gemini', logo: gemini },
      { name: 'Perplexity', logo: perplexity },
      { name: 'NotebookLM', logo: notebooklm },
      { name: 'Prompt engineering', logo: promptEngineering },
    ],
  },
  {
    group: 'Design',
    items: [{ name: 'Canva', logo: canva }],
  },
];

/*
 * Marks for project-specific stack entries that appear only on case-study pages
 * (the stack chips), not in the homepage toolkit — the owner's call,
 * 2026-09-24. They resolve through `logoFor` like any other tool. Deno ships as
 * a PNG: its SVG's integer path coordinates match the phone-number guard.
 */
const projectLogos: Tool[] = [
  { name: 'Postgres', logo: postgres },
  { name: 'Deno', logo: deno },
  { name: 'Telegram', logo: telegram },
];

/* Aliases for names that appear elsewhere in a different form. */
const ALIASES: Record<string, string> = {
  'Cloudflare Workers': 'Cloudflare',
  'Supabase and Postgres': 'Supabase',
  'MS Fabric': 'Microsoft Fabric',
  PostgreSQL: 'Postgres',
};

const byName = new Map(
  [...toolGroups.flatMap((group) => group.items), ...projectLogos].map((tool) => [
    tool.name.toLowerCase(),
    tool.logo,
  ]),
);

export function logoFor(name: string): ImageMetadata | undefined {
  return byName.get((ALIASES[name] ?? name).toLowerCase());
}
