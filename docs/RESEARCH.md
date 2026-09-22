# Portfolio research and content decisions

Reviewed September 22, 2026.

## The goal

A recruiter should quickly understand Jash's role, location, work authorization, relevant experience, and strongest work. A hiring engineer should be able to inspect concrete decisions and find evidence in a resume, a live product, or public code.

## Reference review

| Primary source | What informed this build |
| --- | --- |
| [Brittany Chiang](https://brittanychiang.com/) | Clear role, scannable career history, selected projects, and a direct resume path. |
| [Paco Coursey](https://paco.me/) | Short, concrete descriptions and careful type. The portfolio can stay small while the work carries the substance. |
| [Rauno Freiberg](https://rauno.me/) | Focused visual identity and interaction craft. Distinct details should support the work. |
| [Emil Kowalski](https://emilkowal.ski/) | Projects presented through what they do, with clear paths to working products and code. |
| [Josh W. Comeau](https://www.joshwcomeau.com/) | Showing technical understanding through a real interactive example. |
| [Lee Robinson](https://leerob.com/) | A direct personal introduction and easy access to deeper material. |
| [Nielsen Norman Group: portfolio research](https://www.nngroup.com/articles/ux-design-portfolios/) | Show the problem, individual contribution, constraints, decisions, and results. This research concerns UX hiring; its narrative pattern is applied here as a design judgment, not a claim about software recruiting statistics. |
| [Google Web Vitals](https://web.dev/articles/vitals) | Favor stable layouts, local assets, and little browser work. Field thresholds are not a substitute for measured results, so this portfolio does not claim a field-performance score. |
| [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/) | Semantic structure, contrast, focus visibility, reflow, target sizes, and usable keyboard controls. |

These references informed content and interaction principles. Their source code, wording, visual compositions, and branded assets were not copied.

## GitHub review

The connected profile exposed 31 repositories. Repository metadata, visibility, fork status, available file trees, and relevant READMEs were reviewed. Selected projects received deeper reads of architecture documents and implementation files. This is a portfolio selection audit, not a claim that every line of every repository received a security review.

The review separated employed work, substantive independent products, smaller experiments, resource lists, starter projects, and forks. Forks were not presented as original work. Machine-learning research projects were excluded from the public portfolio to match Jash's requested focus.

### Projects selected for full case studies

| Project | Evidence reviewed | Presentation decision |
| --- | --- | --- |
| ABC Imaging / EPOD | Jash's supplied software-engineer resume and prior career context | Lead employed-work story. Explain service separation, shipping rules, and deployment. Attribute reported metrics. No internal UI or code disclosure. |
| TryApplyNow | Package manifest, search/filter reference, ingestion architecture, resume workflow, search architecture, and repository structure | Prominent homepage feature and full case study. Show the whole product and acknowledge the cost/scope lesson. Present as a past project. |
| SpareMeet | README, package manifest, checkout service, inventory lifecycle module, and test/runbook inventory | Explain the part lifecycle and pending-review checkout. State pre-launch status; do not imply live customer counts or revenue. |
| ReplyProof | README, billing parser, billing/security tests, and live product page | Show web/extension integration, subscription states, access checks, and recovery. State downloadable extension beta status. |
| ONE FAVOR | README, rules, breadth-first solver, starter level definitions, item registry, and original screenshots | Explain shared rules and current-state hints. Adapt three starter boards into a small working demonstration. |
| Network Discovery | README, source tree, architecture, limitations, and AI-use account | Show Python concurrency, interface binding, and graceful fallback. Link public source. |

The index also includes FlipStitch, RIPPLE, Tariff Verify, and Weather App. Their descriptions stay within the available code or README evidence, and their maturity is labeled.

### Other material considered

- Game experiments: Blink Run, Overload, and Echo Tower.
- Early web prototypes: Collaborative Art Creation, Personalized Learning Pathways, Joblio, the Reebootz projects, and Product App.
- Job-search resource repositories and the related content project.
- The two annotation tools.
- The existing business-demo portfolio.
- The Preswald and ApplyAIJobs forks.
- Research and machine-learning projects, excluded from the portfolio's focus.

Including all repositories in the landing page would weaken its recruiting purpose. The public GitHub profile remains one click away.

## Career and LinkedIn

The supplied `Jash_Patel_Software_Engineer_Resume.pdf` was read in full. It supplies the email, profile URL, experience dates, role names, education, and reported ABC Imaging outcomes. The original file is offered as a download, while the HTML resume gives a scannable web version.

The public LinkedIn search result confirmed `linkedin.com/in/jashpatel68` and Software Developer at ABC Imaging. The full profile was behind LinkedIn's sign-in page in the research browser. The site does not pretend that private LinkedIn content was inspected.

## Design choices

- A forest-green and lime identity, with large Manrope type and Instrument Serif emphasis.
- A functional system-layer panel instead of decorative code rain, a fake terminal, or a loading sequence.
- Real screenshots of owned projects and labeled high-level diagrams for private systems.
- Employer work before independent projects, with TryApplyNow prominently featured.
- Six complete deep links for case studies, so each story can be shared directly.
- A working game excerpt with the same trade constraints and state-search behavior as the source.
- An honest AI-use note tied to a documented example. The portfolio does not position Jash as an ML researcher.
- Direct contact and downloadable documents. No nonfunctional contact form or unnecessary backend.

## Scope and privacy

No invented employers, degrees, testimonials, awards, user counts, revenue, or launch claims were added. Employer outcomes remain self-reported resume figures. Private source trees, customer records, operational identifiers, and credentials stay out of the public repository.
