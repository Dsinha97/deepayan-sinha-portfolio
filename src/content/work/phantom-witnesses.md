---
title: "Phantom Witnesses"
tagline: "When a handoff note says several reports share one source, does an AI reviewer follow the note or the records? A research sprint on what happens when the note is wrong, and when the records cannot settle the question."
role: "Co-author: reviewer prompt, run and scoring code, tuning data, companion site"
period: "November 2026"
stack: ["Python", "Modal", "OpenRouter", "Model fine-tuning", "GitHub", "Next.js", "Vercel"]
cover: "../../assets/work/phantom-witnesses-cover.webp"
kicker: "Research sprint"
bentoSize: "md"
order: 6
section: "research"
published: 2026-11-19
claimScope: "team-research"
star:
  situation: >-
    A handoff note tells a reviewer whether several reports trace to one source. If the note is
    wrong, the reviewer has to choose between the note and the records behind it. This was our
    team's entry to the Apart Research AI x Epistemics Sprint, tested on fictional grievance
    cases.
  task: >-
    My part was the test machinery: write the prompt the reviewer models see, the scripts that
    attach each kind of label and run every model, the code that scores the answers, and the
    data for tuning a small model.
  action: >-
    I wrote the reviewer prompt, the label-form script, the run scripts and the scoring code,
    and a scripted generator, with no language model in it, for the 12,000 preference pairs
    and 12,000 supervised rows used for tuning. I checked the received hashes of the 15 case
    variants, ran the Modal load test of the toy adapter, and designed and built the companion
    site.
  result: >-
    The larger model followed none of its 61 false labels. The smaller one was right on the
    verdict in 97 of 99 rows but on verdict and roots in only 34 of 54 rows told to judge from
    the records. Where the records could not settle the question, four of five untuned models
    rarely or never answered "undetermined". The report, code and site are public. All cases
    are fictional and the cells are small.
metrics:
  - value: "0 of 61"
    label: "false labels followed by the larger model"
    qualifier: "15 fictional cases, 99 rows"
  - value: "34 of 54"
    label: "rows the smaller model got right on verdict and roots"
    qualifier: "untuned 4B, told to judge from records"
  - value: "4 of 5"
    label: "untuned models rarely or never answered \"undetermined\""
    qualifier: "40 exploratory gap cases, 10 mis-keyed"
  - value: "53 of 54"
    label: "alerted rows right after preference tuning"
    qualifier: "ran after the key release"
links:
  - type: "live"
    href: "https://phantom-witnesses.vercel.app/"
    label: "Companion site"
  - type: "document"
    href: "https://apartresearch.com/sprints/projects/phantom-witnesses-when-llm-reviewers-report-a-source-that-isnt-there-htnokj26zf"
    label: "Apart project page"
  - type: "document"
    href: "https://phantom-witnesses.vercel.app/report/phantom-witnesses-submission.pdf"
    label: "Report (PDF)"
  - type: "repo"
    href: "https://github.com/LiezlC/ai-epistemics-sprint"
    label: "Code and data"
---

*Phantom Witnesses: When LLM Reviewers Report a Source That Isn't There* is a team report with
Liezl Coetzee and Prashanth Vijay, submitted to the Apart Research AI x Epistemics Sprint on
15 November 2026. Liezl checked the answer key blind, approved the designs of the exploratory
sets and made the project video. Prashanth engineered the inputs and prompts for Claude to draft
the first three cases, checked twelve further drafts by hand and reviewed the report. This page covers the parts that were mine.

## What the team found

Each test item is a bundle of fictional grievance reports with their records and a handoff
note that says whether the reports share one source. We set a false "independent" or "shared"
label against the records, in three label forms and a no-label baseline, and asked the reviewer
model what the records show.

- The larger model, Qwen3.8-27b, followed none of its 61 false labels and was right on verdict
  and roots in all 99 rows.
- The untuned smaller model, Qwen3.5-4B, was right on the verdict in 97 of 99 rows. On the 54
  rows where it was told to judge from the records it was right on verdict and roots in 34
  (42 with repeated IDs removed).
- Each nonzero label-pull cell rests on one case. With 4 to 9 cases per cell, only a
  near-universal pull is excluded.
- A preference-tuned 4B reached 53 of 54, but it ran after the answer key was released, so we
  do not count it as a blind result.

The consistent weakness was somewhere else. On 40 gap cases, where the records cannot settle
the question, four of five untuned models rarely or never answered "undetermined", with or
without a label. Ten of those cases were later judged mis-keyed, and the pattern holds on the
other 30.

## The prompt, the label forms and the scoring

A reviewer test is only as fair as the prompt and the scorer, so I wrote both. I wrote the
reviewer prompt, the script that builds each label form, the scripts that run the models and
the code that scores their answers against the key.

I also checked the received hashes of the 15 case variants.

## Data for tuning

To test whether tuning could teach a small model to abstain, I wrote a scripted generator for
12,000 preference pairs and 12,000 supervised rows. It uses no language model, so none of the
training text was written by one.

Teaching abstention was fragile. Lopsided data taught the model to abstain everywhere, and
balanced data left it abstaining almost nowhere. Every pilot training round flipped with the
label more often than the untuned model did. These are single-seed pilots, so they show an
association, not a necessary trade-off. I also ran the Modal load test of the toy adapter.

## The companion site

I designed and built the site. It carries the report, the slides, the video and the figures,
and links to the public code and data. The same kind of site accompanies
[Laundered Consensus](/work/laundered-consensus/).

## Limits

Every case is fictional. Many results rest on 4 to 9 cases per cell. The two exploratory sets
were built by models and are reported apart from the 15-case result. We suggest, untested here,
that handoff labels point to records and that reviewers be tested where records cannot settle
the answer. The report's LLM usage statement names the AI tools used and what each did.
