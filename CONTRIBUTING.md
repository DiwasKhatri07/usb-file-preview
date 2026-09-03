# Contributing to USB File Preview

Thank you for helping improve USB File Preview. The project values practical local workflows, clear browser limitations, and privacy-aware defaults.

## Before opening an issue

Please check the existing issues and explain the operating system, browser, file family, file extension, and whether the problem happened with a selected USB folder, individual files, or drag-and-drop. Do not upload private files or USB contents to an issue.

## Before opening a pull request

Keep changes focused and document any new runtime dependency. A pull request should include the user-facing behavior, browser support assumptions, fallback behavior, and privacy impact. Run `pnpm check` and `pnpm build` before submitting.

## Design and implementation principles

The interface follows the **Library Card / Tactile Utility** direction: warm paper surfaces, graphite utility panels, Signal Orange action cues, clear status labels, and restrained motion. New features should reinforce that language and should not imply that a browser can silently access a drive or execute code without permission.

## Developer credit

The project is maintained by **Diwas Khatri**. Contributors are welcome to add their name to the relevant release notes or changelog entry when their work is merged.
