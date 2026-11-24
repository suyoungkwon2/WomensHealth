/** All numbers used on the Physical stage. Sources are in the step captions. */

// Illustrative lab values (ng/L) — the story is a composite case, not a real patient.
export const TROPONIN = { man: 45, woman: 25 };
export const THRESHOLD = { single: 40, men: 34, women: 16 };

// Women’s share of participants in the average cardiovascular trial
// (Sheikh et al., CJC Open, 2024, Table 1). Last period is partial: Jan 2021–Jul 2023.
export const TRIAL_SHARES = [
  { period: "1986–90", value: 20.3 },
  { period: "1991–95", value: 23.5 },
  { period: "1996–2000", value: 26.0 },
  { period: "2001–05", value: 22.8 },
  { period: "2006–10", value: 30.7 },
  { period: "2011–15", value: 29.3 },
  { period: "2016–20", value: 28.8 },
  { period: "2021–23*", value: 24.6 },
];
export const DISEASE_BURDEN_SHARE_WOMEN = 44.7;

// Type 1 heart attacks identified (Lee et al., JACC, 2019, Figure 1)
export const IDENTIFIED = {
  women: { before: 1609, after: 2010 },
  men: { before: 2904, after: 3018 },
};

/** One entry per scroll step, in order. `title` is optional (pages 1–3 and 11 have none). */
export const STEPS: { title?: string; body: string; variant: "dark" | "light"; source?: string }[] = [
  {
    variant: "dark",
    body: "A man and a woman arrive at the emergency room with the same heart attack symptoms. Both get the same blood test.",
  },
  {
    variant: "dark",
    body: "The blood test measures troponin, a marker of heart damage. The man gets emergency treatment. The woman is sent home.",
    source: "Illustrative numbers: man 45 ng/L, woman 25 ng/L.",
  },
  {
    variant: "dark",
    body: "The man recovers. The woman does not.",
    source: "Illustration of a population-level outcome gap, not a single literal case.",
  },
  {
    variant: "light",
    title: "Why did this happen?",
    body: "Same symptoms. Same test. Different outcome. So what went wrong? Let’s investigate.",
  },
  {
    variant: "light",
    title: "What is troponin? And one threshold for everyone",
    body: "Troponin is a protein inside the heart muscle. When the heart is damaged, it leaks into the blood. As the amount of troponin in the blood increases, so does the likelihood of a heart attack. To decide when treatment is needed, doctors look to an established threshold. At this hospital, it was the same amount for everyone: 40 nanograms per liter.",
    source: "Single diagnostic threshold of 40 ng/L for both sexes. Lee et al., JACC, 2019.",
  },
  {
    variant: "light",
    title: "Where do these thresholds come from?",
    body: "Medical standards are built on clinical trials. Decades of them. Here is who took part in cardiovascular trials from 1986 to 1990.",
    source: "32 trials published in NEJM, Lancet, and JAMA, 1986–1990. Sheikh et al., CJC Open, 2024, Table 1.",
  },
  {
    variant: "light",
    title: "Look closer",
    body: "But look closer. In the average trial, only about 1 in 5 participants was a woman. That is almost four men for every woman.",
    source: "Women made up 20.3% of participants in the average trial, 1986–1990. Sheikh et al., 2024, Table 1.",
  },
  {
    variant: "light",
    title: "And it didn’t go away",
    body: "This pattern has continued up to recent years. Across eight periods, from 1986 to 2023, women never made up more than a third of participants in the average trial.",
    source: "*Jan 2021–Jul 2023 only. Sheikh et al., 2024, Table 1; 44.7% from the paper’s introduction.",
  },
  {
    variant: "light",
    title: "Does one number fit everyone?",
    body: "So the evidence behind medical standards came mostly from men. Yet one cutoff, 40 nanograms per liter, was applied to everyone. Was that ever tested on enough women? Let’s find out.",
  },
  {
    variant: "light",
    title: "What if we adjust by sex?",
    body: "However, when researchers established and tested sex-specific thresholds, setting thresholds at 16 for women and 34 for men, 25 percent more women and 4 percent more men were identified as at risk of experiencing a heart attack.",
    source: "Type 1 heart attacks identified. Lee et al., JACC, 2019, Figure 1.",
  },
  {
    variant: "light",
    body: "Now rewind. Same woman, same test, same number. Thanks to a sex-defined troponin threshold, she is caught and treated.",
    source: "She is identified and treated; the study found better detection, not better outcomes for women.",
  },
];
