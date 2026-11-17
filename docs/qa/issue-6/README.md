# Issue 6 validation

Validated with Bun 1.4.4, Chromium via standalone Playwright, and Vite on `http://127.0.0.1:5179/` (`bun run dev --port 5179 --strictPort`). No configured Playwright MCP was available; the installed Playwright runtime drove real Chromium instead.

`bun run lint`, `bun run format:check`, `bun test` (29 pass), and `bun run build` pass. Build retains the existing large-bundle advisory. No benchmark suite or design image is supplied, so screenshots are rendering/readability sanity checks rather than a design-fidelity comparison.

Browser observations:

- The Dockyard 07 header, 8×8 board, four player figures and enemy sentry render. Canvas and roster use the same encounter snapshot.
- At 1280×1100, clicked Bulwark's tile `(2,4)` and raised figure. Both selected Bulwark and displayed HP 10/10, AP 2; empty `(0,0)` and outside-canvas-board ground `(10,480)` cleared selection. Coordinates here are logical canvas coordinates.
- Resized to 390×1100 and clicked Breacher at logical canvas `(356,239)`. Selection and roster inspection agreed. Reset encounter cleared selection. The DOM inspection remains readable on mobile where the canvas scales down.
- Mounted App with an injected session under StrictMode. Replaced state with encounter `Replacement`, Bulwark at `(0,0)`, HP 6/10, AP 1. Header, HUD and battlefield refreshed; clicking the raised figure at the top board corner selected Bulwark correctly.
- Replaced the session object: header reverted to Dockyard 07, stale selection cleared and exactly one canvas remained. Repeated four unmount/remount cycles under StrictMode; each mounted instance had one canvas and unmount removed it.
- Scrolling the page refreshes Phaser canvas bounds; picking remained correct after scrolling between mounted views.
- Reset with a knocked-out Bulwark and living Breacher sharing `(2,4)`; clicking the visible body selected Breacher. A focused picking regression covers both unit-array orders.
- No browser console errors or page errors occurred throughout the final run. Synchronous subscription/dispatch, ownership, gating and removal/knockout reconciliation are covered by focused Bun tests, including accepted resolutions via a test resolver.
- Screenshot inspection caught per-unit text obscuring neighboring figures. Final screenshots verify that the fixed canvas inspection strip leaves all four operatives visible; the HUD presents full values independently.

Screenshots were inspected during QA and retained outside Git; temporary captures are not maintained documentation or regression baselines.
