# USB File Preview — Design Direction

## Three stylistic approaches

### Theme Name: Library Card / Tactile Utility
Very Brief Intro: A warm, editorial file workspace inspired by archive drawers, index cards, and well-made desktop tools. It makes technical preview work feel calm, legible, and trustworthy.
Probability: 0.073

### Theme Name: Signal Station
Very Brief Intro: A high-contrast operations console with graphite surfaces, amber indicators, and precise status language. It emphasizes speed and confidence while keeping the interface approachable.
Probability: 0.026

### Theme Name: Quiet Glass Workspace
Very Brief Intro: A pale, spacious media desk with translucent panels, soft blue shadows, and a gallery-like preview canvas. It makes file browsing feel lightweight and visual.
Probability: 0.091

## Chosen approach: Library Card / Tactile Utility

### Design Movement
Contemporary editorial software with Swiss International Typographic influence, translated through tactile archive materials: paper, index tabs, label makers, and instrument-panel details.

### Core Principles
1. **Readable before decorative.** File names, type, size, and preview status must scan instantly.
2. **Physical metaphors, digital precision.** Use restrained paper textures, dividers, tabs, and stamped labels without turning the product into a skeuomorphic toy.
3. **Asymmetric workbench composition.** A dark utility rail, broad file list, and generous preview stage establish a clear left-to-right workflow instead of a centered marketing layout.
4. **Honest capability language.** Clearly separate browser-previewable files, files needing conversion, and formats that are unsupported in the current browser.

### Color Philosophy
The base is warm archival paper rather than cold white, which reduces the sterile feeling common to file tools. Graphite is reserved for navigation and high-density controls; a signal-orange accent marks active selection, scanning, and the primary browse action. Muted sage communicates local/offline readiness without implying that every file format is universally supported. Color should explain state, not decorate it.

### Layout Paradigm
A persistent three-zone workbench: a narrow graphite rail for the product identity and workspace actions; a central document register for search, filters, folders, and file rows; and a right preview stage with a high-contrast media canvas and metadata footer. On narrow screens, the rail becomes a compact top strip and the preview stage moves below the register.

### Signature Elements
- **Index tabs:** small orange or sage tags that identify file families and browser support.
- **Stamped status labels:** compact uppercase labels such as LOCAL, READY, and NEEDS CONVERTER with slight tracking and a tactile badge treatment.
- **Paper-edge separators:** hairline rules and subtle inset shadows that make panels feel assembled rather than floating.

### Interaction Philosophy
Every action should answer a practical question: what did I select, what can I preview, and what is the next useful action? Hover states should reveal affordances without changing layout. Selecting a file updates the preview immediately, and unsupported types explain the limitation while offering a clear next step. Drag-and-drop and folder selection are additive; the interface remains usable with a normal file picker and keyboard.

### Animation
Use short, decisive transitions: 160–220ms for row selection, button press, and panel changes. Preview content may crossfade and translate by a few pixels when the selected file changes, like a card being slid into a reader. Stagger only the initial empty-state reveal. Avoid bouncing, floating, and continuous motion. Respect reduced-motion preferences by removing transforms and keeping opacity changes subtle.

### Typography System
Use **Fraunces** for the product title and large preview headings, giving the tool an editorial voice without sacrificing seriousness. Use **IBM Plex Sans** for interface text and **IBM Plex Mono** for file extensions, dimensions, sizes, and status labels. Headings should be compact and sentence-cased; metadata should use tabular-feeling mono labels with deliberate tracking.

### Brand Essence
**USB File Preview is a local-first browser workbench for opening and understanding files from removable drives without hunting through folders or launching five different apps.** Personality: **methodical, reassuring, resourceful**.

### Brand Voice
Headlines are concise and observational. CTAs are direct verbs. Microcopy explains browser limits plainly, without promising unsupported magic.

Example line 1: “Bring the drive into view.”

Example line 2: “This file is identified, but your browser cannot render it yet.”

### Wordmark & Logo
The mark is a simplified orange index card intersected by a graphite USB connector: one bold rectangular silhouette with a single cut-out notch. It should work as a compact app icon, favicon, and rail emblem without relying on typography.

### Signature Brand Color
**Signal Orange — #E9783B.** It is warm enough to belong to an archive-inspired tool and bright enough to guide attention against paper and graphite surfaces.

### Product Scope for the First Preview
This first browser experience will demonstrate local file selection, folder selection where supported, search and filtering, a file register, a preview stage for images, video, audio, PDFs, text/code, and a clear capability state for Office/PowerPoint and other formats that need conversion or a browser-compatible renderer. It will use only files the user explicitly selects; the website cannot inspect a USB drive automatically without browser permission.
