# Consumer Monitoring Notes

## Critical: Meta AI Personalization Risk

**Date noted:** January 4, 2026

Meta has the richest user profile data of any AI platform:

- **Demographics:** Age, location, gender, education, occupation
- **Political signals:** Groups joined, pages liked, content engaged with, posts shared
- **Social graph:** Friends' political leanings, network effects
- **Behavioral patterns:** What content they dwell on, what they skip

### The Risk

If Meta AI begins personalizing political answers based on user profile:

| User Profile | Possible Response |
|--------------|-------------------|
| Progressive voter | "Malinowski is a moderate Democrat with bipartisan credentials" |
| Conservative voter | "Malinowski is a liberal Democrat who supported progressive policies" |
| Swing voter | "Malinowski has positions that appeal to both sides" |

**Same question. Different "facts." Based on who's asking.**

### Why This Matters

1. **Information asymmetry** - Voters in the same district could have fundamentally different understandings of a candidate

2. **Filter bubble amplification** - AI reinforcing existing beliefs rather than providing neutral information

3. **Undetectable influence** - Unlike ads (which are disclosed), AI answers appear as objective facts

4. **Scale** - 3+ billion users across WhatsApp, Instagram, Facebook, Messenger

### Monitoring Implications

If Meta personalizes, monitoring becomes exponentially harder:

- Need diverse user profiles (not just geographic diversity)
- Need demographic panels (age, political affiliation, etc.)
- May need actual human volunteers with real Meta accounts
- Cannot rely on automated monitoring with synthetic profiles

### Watch For

- Differences in responses across user profiles
- A/B testing patterns in political content
- Changes around election periods
- Academic research on Meta AI personalization

### Action Items

- [ ] Design experiment to test personalization (different account types, same questions)
- [ ] Monitor academic literature on AI personalization
- [ ] Consider volunteer panel with diverse Meta accounts
- [ ] Track Meta's public statements on AI personalization

---

## Other Strategic Notes

### APIs Don't Matter (for campaigns)

**Date noted:** January 4, 2026

APIs are what developers see. Voters use consumer interfaces. For political campaigns, API monitoring has minimal value. Focus resources on consumer interface monitoring.

### ToS Considerations

Browser automation likely violates ToS for most platforms. Risks:
- Account bans (likely)
- IP blocks (possible)
- Legal action (very unlikely)

For public claims, use human panel data. Use automation for internal monitoring only.
