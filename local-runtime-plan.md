# Localhost and USB Runtime Plan

## What is implemented now

The current site is a static React workspace that also runs on a local Vite host. In Chromium-based browsers that expose the File System Access API, the **Open USB folder** action opens a user-approved directory handle and recursively indexes files from that folder, preserving relative paths. The existing preview renderer is reused for the scanned files, including native previews for video, image, audio, PDF, and text/code formats.

The browser must receive an explicit user gesture before opening a directory picker, and the picker is permission-based rather than a silent scan of every mounted drive.[1] The API is also marked as limited availability by MDN, so the fallback folder input remains in place for browsers that do not expose `showDirectoryPicker()`.[2]

## What a browser cannot safely do by itself

A normal browser page cannot silently enumerate every mounted volume, watch the operating system for a USB storage drive insertion, or open the drive without a permission flow. WebUSB is a separate, limited-availability API for compatible USB devices and requires device permission; it is not a general mounted-file-volume API.[3]

Therefore the current localhost system uses this safe workflow:

| User action | Current behavior | Data boundary |
|---|---|---|
| Open USB folder | User chooses the USB volume or a folder on it | Only the selected directory is read |
| Add files | User chooses one or more files | Only chosen files are read |
| Drag and drop | User drops files into the workspace | Only dropped files are read |
| PowerPoint / Office / archive / 3D | File is identified and marked as converter-needed | No false claim of native preview |

## Native system path for automatic USB detection

For automatic insertion/removal detection and full access to mounted drive paths, the next stage should be a desktop wrapper such as Electron or Tauri with a small native bridge. The bridge would watch OS volume events, expose the approved drive list to the React UI, and stream file metadata/content to the preview layer. The UI should still ask for a drive permission or allowlist before indexing sensitive volumes.

Electron documents a separate device-access model from normal browsers, but USB storage volume monitoring is still an operating-system/filesystem concern rather than a generic WebUSB renderer feature.[4] The recommended product sequence is therefore: first stabilize the localhost browser workflow, then package the same React UI inside a desktop runtime, then add platform-specific volume watchers for Windows, macOS, and Linux.

## References

[1]: https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker "MDN: Window.showDirectoryPicker() method"

[2]: https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle "MDN: FileSystemDirectoryHandle"

[3]: https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API "MDN: WebUSB API"

[4]: https://electronjs.org/docs/latest/tutorial/devices "Electron: Device Access"
