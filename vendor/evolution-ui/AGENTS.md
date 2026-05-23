# `@evo/evolution-ui` — Agent Reference

The single source of truth for UI in this monorepo. **All UI work must compose primitives from this package.** This doc tells coding agents what's available, how to use it, and what to do when nothing fits.

## TL;DR for agents

1. **Read this file before writing UI.**
2. Import from `@evo/evolution-ui` — never copy shadcn into the app, never reach for MUI / Chakra / headless UI / hand-rolled `<div>` recipes.
3. Use the gallery (`/gallery` in the `client` app, source: `client/src/app/gallery/registry.tsx`) as the visual catalog.
4. **If no primitive fits, STOP and ask the user.** Creating a new component is fine but must be intentional — surface the gap, propose the addition, wait for approval. Do not silently ship one-offs.
5. **New components are styled shadcn primitives.** Scaffold from the matching shadcn component (or wrap a Radix / Base UI primitive in the same `cva` + `cn` recipe used by the existing files), match the tokens in `src/styles/`, add the file under `src/components/ui/`, export it from `src/index.ts`, and add a gallery entry.

## Import pattern

```tsx
import { Button, Card, CardHeader, CardTitle, Input, ChatSession, cn } from "@evo/evolution-ui";
```

Always import from the package root. Don't deep-import (`@evo/evolution-ui/src/components/ui/button`).

## What's exported

Source of truth: `packages/evolution-ui/src/index.ts`. The list below is grouped — read the file directly to verify export names before importing.

### Foundations
`cn` (tailwind-merge wrapper), `useIsMobile`.

### Buttons & inputs
`Button` (variants: `default`, `destructive`, `secondary`, `ghost`, `link`, `field-trigger`; sizes: `default`, `sm`, `lg`, `icon`, `icon-sm`, `icon-lg`), `Input`, `Textarea`, `AutoGrowTextarea`, `Label`, `Checkbox`, `RadioGroup` / `RadioGroupItem`, `Switch`, `NumberField`, `Combobox`, `DatePicker`, `Calendar`, `Select` (and group/value/trigger/content/label/item/separator/scroll up & down), `Form` / `FormField` / `FormItem` / `FormLabel` / `FormControl` / `FormDescription` / `FormMessage` / `useFormField`.

### Display & layout
`Card` (variants: `default`, `flat`, `elevated`) + `CardHeader` (`row` prop) / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`, `Stat` / `StatLabel` / `StatValue` / `StatDelta` / `StatSub`, `List` / `ListItem` / `ListItemLeading` / `ListItemContent` / `ListItemTitle` / `ListItemDescription` / `ListItemTrailing`, `KeyValue` / `KeyValueList`, `Separator`, `Skeleton`, `Avatar` / `AvatarImage` / `AvatarFallback`, `Chip` (the unified inline lozenge — see "Chip presets" below), `Progress`, `EmptyState` (+ `Icon` / `Title` / `Description` / `Actions`), `TruncatedText`.

### Navigation & overlays
`Tabs` / `TabsList` / `TabsTrigger` / `TabsContent`, `AnimatedTabs` / `AnimatedTabContent` (+ `useTabs`, `Tab` type), `Breadcrumb` (+ list/item/link/page/separator/ellipsis), `Sidebar` family (`SidebarProvider`, `SidebarInset`, `SidebarTrigger`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarGroupLabel`, `SidebarInput`, `SidebarMenu`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubButton`, `SidebarMenuSubItem`, `SidebarRail`, `SidebarSeparator`, `useSidebar`), `Dialog` family, `AlertDialog` family, `Drawer` family, `Sheet` family, `ResponsiveSheet`, `Popover`, `Tooltip` (+ provider/trigger/content), `DropdownMenu` family (incl. `Sub`, `RadioGroup`, `Checkbox`, `Shortcut`), `Command` palette (+ dialog/input/list/empty/group/item/separator/shortcut), `Collapsible`, `ScrollArea` / `ScrollBar`, `BaseScrollArea` / `BaseScrollBar`.

### Tables
`Table` / `TableHeader` / `TableBody` / `TableFooter` / `TableHead` / `TableRow` / `TableCell` / `TableCaption`.

### Charts
`ChartContainer`, `ChartTooltip` / `ChartTooltipContent`, `ChartLegend` / `ChartLegendContent`, `ChartStyle`, `ChartConfig` type.

### Toast
`Toaster`, `ToastProvider`, `toast`, `useToast`, `ToastProps`.

### Agentic / chat primitives
`Message`, `MessageStream`, `MessageThread` (collapses runs of consecutive agent turns into one continuous message), `UserBubble` / `UserTurn` (right-aligned user message with optional edit-pencil affordance), `ToolCall`, `Reasoning`, `ProgressCard`, `PreviewCard`, `PromptCard` (+ `PromptCardLabel` / `PromptCardBody` / `PromptCardActions` / `PromptCardHelper` — generic inline input prompt; thinner shell than the pre-built `Prompt`), `Cite`, `CodeBlock`, `SlashMenu`, `Prompt`, `TodoList`, `Compose`, `ChatSession` (single-line, with-preview, status dots, kebab menu — pass `hideDot`, `active`, `menu`, `asChild`, `trailing`), `MD` / `TypewriterMD` / `TypewriterGate` (markdown renderer + typewriter streaming variant + a gate that runs an effect once a typewriter finishes).

### Auth layouts
`SignInScreen` (full-bleed editorial sign-in shell — dot grid + teal washes + centered column, used across Evolution apps) plus the slot sub-components: `SignInScreenBrand` (logo + optional teal mark like "EOS"), `SignInScreenHeader` (eyebrow / serif title / description), `SignInScreenAction` (surface-backed wrapper for the auth button so the dot grid doesn't show through translucent hovers), `SignInScreenDivider` (eyebrow-labeled hr, e.g. "Need access?"), `SignInScreenFooterText` (small description after the divider), `SignInScreenTerms` (caption-sized terms paragraph). Spacing is baked into each sub-component's top margin — drop them in order, no manual spacing required.

## Chip presets

`Chip` is the canonical inline tinted lozenge — the only primitive for status lozenges, category tags, counts, and billing chips. There is no separate `Badge` or `Pill`; combine `tone`, `size`, `weight`, `bordered`, and `dot` for the right look.

| Use case | Recipe |
|---|---|
| In-list state lozenge (engagement / account / coachee status) | `<Chip tone="...">` — defaults: medium weight, borderless |
| Emphasized callout / category tag (counts, "New", "Default billing") | `<Chip weight="semibold" bordered tone="...">` |
| Invoice / billing status (paid, pending, overdue, scheduled, sent, draft) | `<Chip weight="semibold" tone="paid">` etc. — use the billing-specific tones |
| Status indicator with leading dot ("Live", "In Progress") | add `dot` |
| Sizes | `size="sm" \| "md" \| "lg"` (default `md`) |

Tones: hue tones are `neutral`, `teal`, `amber`, `info`, `error`. Billing tones are `paid` (teal-light), `pending` (amber-light), `overdue` (error-light), `scheduled` / `sent` (info-light), `draft` (neutral-light). Use the billing tones only on invoice / PO surfaces — they pop more than the hue tints.

## Decision flow when building UI

```
need a UI element
    │
    ▼
does evolution-ui export something that fits?
    │
    ├── yes ──▶ use it. compose with cn for spacing/layout overrides.
    │
    └── no  ──▶ STOP. tell the user:
                  • what you're trying to build
                  • which existing primitives you considered
                  • what new component you'd add (name, props, where it lives)
                wait for approval. do not silently render a one-off.

approved to build new?
    │
    ▼
1. start from a shadcn primitive (https://ui.shadcn.com/) or, if shadcn
   has nothing, wrap the appropriate Radix / Base UI / lucide primitive.
2. match the existing recipe: cva + cn, --eu-* tokens, the same focus/
   hover/active/disabled treatments visible in neighboring files.
3. file lives in packages/evolution-ui/src/components/ui/<name>.tsx.
4. export from packages/evolution-ui/src/index.ts.
5. add a gallery entry in client/src/app/gallery/registry.tsx so the
   next agent sees it.
6. type-check passes (cd client && pnpm type-check).
```

## Style & token rules

- Tokens live in `packages/evolution-ui/src/styles/`. Use semantic class names (`bg-surface`, `bg-surface-background`, `text-ink`, `text-secondary`, `text-tertiary`, `border-border`, `border-separator`, `text-primary`, `text-error`, `text-warning`, `--eu-radius-sm/md/lg`, `--eu-ease-out`, etc.). Never hard-code colors or spacing magic numbers when a token covers it.
- Spacing: prefer Tailwind utilities (`p-2`, `gap-3`). Use arbitrary values (`pt-[18px]`) only when matching the eui spec for a specific component.
- Icons: `lucide-react`. Place leading icons before text and trailing icons after — `Button` auto-detects via `data-leading-icon` / `data-trailing-icon`. Default sizing is handled by the button's size variant; only set `className="size-X"` on the icon when overriding.
- Animation: use `transition-[…]` + `duration-200` + `ease-[var(--eu-ease-out)]` for the standard motion curve.

## Where things are used (so you can grep for examples)

- Buttons & icon buttons: `client/src/components/message-actions.tsx`, `client/src/components/eos-sidebar/ChatHistoryNav.tsx`.
- Cards (default vs elevated): `client/src/components/vector-search-sidebar.tsx`, `client/src/components/engagements/EngagementCard.tsx`.
- ChatSession (single line, no dot): `client/src/components/sidebar-history.tsx`, `client/src/components/clients/client-list.tsx`.
- Stats grid: `packages/evolution-ui/src/components/ui/portal/portal-stats.tsx` (uses `grid-cols-[repeat(auto-fit,minmax(140px,1fr))]` for container-fluid reflow — copy this pattern when stat tiles need to live inside a constrained workspace).
- Sidebar with search + items: `client/src/components/clients/client-list.tsx`.
- Dialog/dropdown patterns: see `client/src/components/sidebar-history.tsx` (sub-menus), `client/src/components/resource-rating.tsx` (feedback dialog).

## Gallery

`/gallery` in the `client` app (source: `client/src/app/gallery/registry.tsx`) is the canonical visual catalog. Every primitive should appear there with at least one realistic story, and every new component you add must include a registry entry.

## What NOT to do

- ❌ Don't copy a shadcn component directly into `client/src/components/ui/` — it has to land in `packages/evolution-ui/src/components/ui/` and go through the export.
- ❌ Don't use `<button className="px-3 py-2 rounded …">` when `Button` exists. Don't use a hand-rolled card div when `Card` exists. Same for inputs, tabs, dialogs, dropdowns, tables, etc.
- ❌ Don't pull in another UI lib (MUI, Chakra, Mantine, Ant, Headless UI, react-aria-components on its own, etc.).
- ❌ Don't ship a new component without a gallery entry.
- ❌ Don't ship a new component without first asking the user. This is the rule that distinguishes "reusing the system" from "drift" — keep it strict.
