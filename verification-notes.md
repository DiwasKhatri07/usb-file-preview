
## Expanded upgrade verification

The existing public deployment at `https://usbpreview-oqx3nys8.manus.space` remains healthy and still exposes the original USB preview workspace. The new Python IDE and repository-documentation changes are present in the local working tree and require the next project checkpoint before they appear in the public deployment. The local project passes `pnpm check` and `pnpm build`; the build only reports the existing bundle-size advisory.

## Python IDE verification

The current dev preview exposes a Python IDE action. Opening it renders the project explorer, `usb_scan.py` editor, line numbers, save action, Run action with keyboard hint, output console, and the explicit local-runtime bridge message. The existing browser preview remains available through the Back to preview control. The public deployment still points to the previous checkpoint until this revision is saved and published.
