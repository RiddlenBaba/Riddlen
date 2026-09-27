---
layout: default
title: "Archive · The machines"
description: "Which AI models make up the Riddlen panel, how they are asked, and how they are judged."
permalink: /archive/stump/machines/
---

> **Archived.** This page describes Stump the Machine, the game Riddlen ran on Amoy in September
> 2026 and retired the same month. The current game is the hunt: read the
> [whitepaper](/whitepaper/) and [Playing the hunt](/hunt/).

# The machines

Every riddle is tried by a panel of frontier models before any person sees it. The panel is the
thing that makes Riddlen a human game, so it is deliberately strong and deliberately public.

## Who is on the panel

| Lab | Model | Why |
|---|---|---|
| Anthropic | Claude Opus 5 | Strongest general reasoner in the Claude line |
| OpenAI | GPT-6 Astra | Current OpenAI flagship |
| Google | Gemini 3.8 Flash | Newest Gemini generation |

The models are called through Vercel AI Gateway, so one code path covers every lab and the
panel can be changed by editing a list. Three labs, not one, so a riddle can't slip through one
lab's blind spot and so nobody can say "you only asked your own model".

## How they are asked

Each model gets the riddle text and nothing else, with this instruction:

> You are one of several AI models on a panel trying to solve riddles written by humans. Think
> carefully: puns, lateral thinking, wordplay, cultural references and misdirection are all fair
> game. Reply with your 3 best guesses, most likely first, one per line, each just the answer in
> a few words. No numbering, no punctuation, no explanation.

Each model is asked twice, so the panel produces up to 18 guesses. Duplicates are removed after
normalization. The panel gets no hints, no examples, no access to the board, and no second try
after seeing the answer.

## How they are judged

A machine "solved" the riddle if **any** of its guesses matches **any** of the author's accepted
answers after normalization. The bar is intentionally generous to the machines: more guesses
mean the "machines couldn't solve this" claim is worth more when it holds.

## What is on chain

Before the riddle opens, a hash of the full list of panel guesses (plus a secret) is written to
the contract. After the riddle closes, the list is revealed and the contract checks it against
the hash. The site then shows every guess, crossed out if wrong. The full transcripts, including
each model's raw text, are kept by the game master and can be published.

## What they are bad at

As of late 2026, the panel reliably fails riddles whose answers depend on a particular life:
local names, family words, a workplace's private rules, things a body knows. It reliably solves
anything that resembles a riddle it has read. Writers who understand that difference win.
