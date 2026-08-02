# PRODUCT.md — STEM Begins Here

> Derived from `Media/Theme Guide (SBH).html`, `Media/Logo (SBH Rocket Hex).html`,
> `STEMBeginsHere Curriculum.docx`, `501c3 Conversion Checklist.md`, and direction
> given during the August 2026 rebuild. Confirm the marked items before relying on them.

## Register

**Brand.** The site's job is to communicate and build confidence, not to transact.
There is no app surface, no login, no dashboard. Every page is a persuasion surface.

## What this is

An Arizona nonprofit corporation that runs a free, three-day hands-on hardware
engineering bootcamp for students in grades 6 to 12. Ten hours total: four hours of
fundamentals, four hours of open building, two hours of showcase and awards. Built
around the Raspberry Pi Pico. Self-funded, so hosting costs nothing.

## Users & purpose

**Primary: school decision-makers.** Principals, assistant principals, STEM and CTE
coordinators, district curriculum leads. They decide whether an outside group runs
sessions on their campus. They arrive skeptical and are looking for: is this a real
organization, what does it cost, what does it require from us, and who exactly is
standing in front of our students.

**Secondary: teachers and club advisors.** They champion it internally and host it in
their room. They want to know what it looks like in practice and whether they need
hardware expertise themselves. (They do not.)

**Tertiary: parents, students, and prospective volunteers.**

**Critical constraint on voice:** the site must never *say* it is aimed at
administrators, and must never *sound* like it either. Information architecture does
the targeting; the words stay plain. Logistics, cost, supervision, and organizational
status are all present and easy to find, because those are the questions that decide a
yes, but they are written the way a person would say them out loud.

**The failure mode, learned the hard way:** answering an administrator's questions in an
administrator's register. "Per your own site policy", "the host site provides",
"confirmed in writing before anything is scheduled", "division of labor". That language
makes the targeting obvious, and it reads as a procurement document to everyone else who
lands on the page. Say "someone from your side in the room with us", not "a staff member
present per site policy". Same fact, no contract smell.

**Do not foreground the legal status.** Nobody arrives wondering about the federal tax
status of a STEM nonprofit. Repeating "we are not a 501(c)(3)" across every page reads
as anxious rather than candid, and draws attention to a weakness nobody asked about.
Keep the facts accurate and findable in the FAQ and on About; keep them out of the hero,
the footers, and the program pages. Candor means not overclaiming, not volunteering your
own caveats to people who did not ask.

## Desired outcome

One action: a message through the contact form or a direct email. Everything else on
the site exists to make that message feel low-risk to send.

## Brand personality

**Precise. Candid. Unpolished-on-purpose.**

The organization is early and says so. Its credibility comes from specificity, not
polish: naming the actual hardware, the actual hours, the actual pedagogy, and the
actual state of the paperwork. Where a fact is not yet settled, the site says it is not
settled rather than reaching for a comfortable phrase.

## Anti-references

- **Generic nonprofit template.** Stock photos of diverse students high-fiving, a
  "Our Mission / Our Vision / Our Values" triptych, and a donate button.
- **Overclaiming.** The organization does not hold federal 501(c)(3) status and the
  site must never imply it does. No invented statistics, testimonials, partner logos,
  or student counts.
- **Talking about donations at all.** There is no donate button, no "we cannot accept
  donations yet" note, nothing. The site does not raise the subject. If someone asks by
  email, answer them there.
- **EdTech SaaS.** Gradient hero, floating dashboard screenshot, logo wall.
- **Vibecoded default.** The user's stated failure condition: anything that reads as
  cheap or machine-generated to a person deciding whether to trust it with students.

## Strategic design principles

1. **Specificity is the credibility mechanism.** "A Raspberry Pi Pico kit per student"
   beats "cutting-edge technology" every time with this audience.
2. **Never overclaim, but never lead with the caveats either.** Anyone who goes looking
   for the legal status finds it stated accurately in the FAQ and on About. Nobody has
   it pushed at them. Those two things are not in tension.
3. **Answer the logistics question before it is asked.** Time, space, equipment,
   supervision, and cost live on the Program page and in the FAQ, not behind an email.
4. **One accent, used sparingly.** Copper marks the single most important thing in any
   view. When everything is accented, nothing is.

## Accessibility

WCAG 2.1 AA is the floor and is currently met: all text clears 4.5:1, headings run in
order with no skipped levels, the accordion is keyboard operable, motion respects
`prefers-reduced-motion`, and the site is fully usable with JavaScript disabled.

## Open items (confirm before launch)

- Founder and board names, and whether to publish them.
- The founder's origin story (currently a placeholder, and the highest-value gap).
- Maximum students per session and instructors sent per session.
- Arizona IVP fingerprint clearance card status for instructors.
- Liability insurance coverage.
- Whether `stembeginshere@gmail.com` is a monitored inbox.
- Real photography. See DESIGN.md.
