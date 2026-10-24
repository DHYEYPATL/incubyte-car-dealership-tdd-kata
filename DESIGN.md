# DESIGN.md

Binding design direction for this project. Every UI change reads this first. Fill it in before writing UI code; revise it deliberately, not implicitly.

## Subject
- Product: Car dealership inventory management system (browse, search, purchase, admin CRUD)
- Audience: Dealership staff — admins who manage inventory, regular users who browse and purchase
- Primary job of the main screen: See vehicle stock at a glance and act on it (buy, restock, edit, delete)
- Domain objects/vocabulary to build visuals from: stock sheet, window price sticker, turn-signal amber, showroom steel, spec sheet, lot inventory

## The one memorable thing
The stock gauge — a horizontal fill bar in the stock column showing how many units remain. Green when stocked, amber when low (≤2), empty track when out. A glance from across the room tells you lot status. Lives in the inventory table, every row.

## Palette (6 named colours, each with a role)
| Name | Hex | Role |
|------|-----|------|
| Steel | #ECEEF1 | surface (cool showroom-floor grey) |
| Frost | #FAFBFC | surface-raised (cards, inputs, modals) |
| Asphalt | #1B1E26 | ink (deep blue-black, primary text) |
| Slate | #5A6270 | ink-muted (secondary text, labels) |
| Amber | #FF8A00 | accent (one job only: primary actions — Buy, Add, Save, active states) |
| Signal | #3B8A3B / #C83838 | signal (green = in stock, red = out of stock; amber reused at low threshold) |

Rules: neutrals carry a blue tint, not pure grey. No gradients. Contrast AA minimum across all pairs.

## Type
- Display/headline face + role: Archivo (condensed widths for headings — spec-sheet energy, automotive labels)
- Body face + role: Onest (humanist sans for readability, body copy, UI controls)
- Data/mono: IBM Plex Mono (prices, quantities, vehicle IDs — tabular feel)
- Scale (rem, modular ratio 1.333):
  - 0.75rem — labels, meta, table headers
  - 1rem — body text, form inputs
  - 1.333rem — subhead
  - 1.777rem — section heading
  - 2.369rem — page heading
- Rules: line length < 80ch; tight tracking on headings (-0.02em), normal on body; tabular numerals for all data; weights: 400 (body), 600 (subhead), 700 (display), 500 (mono)

## Shape and elevation
- Radius set: 2px (inputs, buttons), 6px (cards, modals, containers), 0px (tables, data rows — sharp, ledger-like)
- Borders vs shadows rule: 1px solid border in Slate at 20% opacity for separation. Shadows only for modals — one level, tinted Asphalt at 8%.
- Max elevation levels: 2 (flat + modal)

## Layout
- Concept (one sentence): A dealer's inventory ledger — dense data rows with clear stock indicators, no marketing chrome.
- Grid and the one deliberate break: single column, max-width 1100px, left-aligned; the stock gauge column breaks the data grid with a visual bar instead of a number.
- Alignment rule: left-aligned by default; centred only for isolated login/register forms.

```
┌──────────────────────────────────────────────────────────┐
│  Inventory                          [Search vehicles...]  │
├────────┬──────────┬─────────┬────────┬───────────────────┤
│  Make  │  Model   │  Price  │  Stock │  Actions          │
├────────┼──────────┼─────────┼────────┼───────────────────┤
│ Toyota │  Camry   │ $25,000 │ ████░  │  [Buy]            │
│ Honda  │  Civic   │ $22,000 │ ██░░░  │  [Buy]            │
│ Ford   │  Mustang │ $35,000 │ ░░░░░  │  [Buy — disabled]  │
├────────┴──────────┴─────────┴────────┴───────────────────┤
│  Admin only: [Add vehicle]                               │
└──────────────────────────────────────────────────────────┘
```

## Motion budget
- The single orchestrated moment: page load — table rows fade in staggered (each row 40ms after previous), 200ms total, ease-out
- Interaction motion allowed: modal open/close (200ms ease-out), purchase confirmation flash (200ms), row hover highlight (instant)
- Durations/easing: 200ms, cubic-bezier(0.22, 1, 0.36, 1) for orchestrated; instant for state changes
- Reduced motion behaviour: no staggered fade-in, all content appears instantly, modals still open/close (opacity only, no transform)

## Copy voice
- Tone in one line: Direct and plain, like a dealer talking to their inventory manager — no marketing, no filler.
- Button/verb vocabulary: "Add vehicle", "Buy", "Restock", "Delete", "Save changes", "Cancel"
- Placeholder data rule: Use real car names (Toyota Camry, Honda Civic) marked as sample data; never invent stats, testimonials, or user names.

## Defaults deliberately kept (and why)
- Single-column layout: this is an internal tool, not a marketing site — width constraints improve data scanning.
- Table-first structure: the domain object IS a list of vehicles; forcing cards would hide the stock-level signal.

## Slop check (tick before finishing)
- [x] Would a different designer land on the same palette/font/layout for this brief? No — steel + amber + condensed Archivo is specific to automotive inventory, not a generic SaaS template.
- [x] No wave 1 tells (Inter, purple gradient, centred hero + 3 cards, uniform shadow cards, glass, emoji icons, invented stats).
- [x] No wave 2 tells (cream + terracotta, near-black + neon, broadsheet hairlines, all-caps eyebrows everywhere, accent-one-word headlines).
- [ ] Rendered and viewed at 1440 and 390.
- [ ] Focus-visible, reduced motion, contrast checked.
