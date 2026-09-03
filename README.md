# USB File Preview

> A local-first browser workbench for browsing USB folders, previewing common files, and working with Python projects in one calm workspace.

**Live demo:** [usbpreview-oqx3nys8.manus.space](https://usbpreview-oqx3nys8.manus.space)

**Developer:** [Diwas Khatri](https://github.com/DiwasKhatri07)

## 💡 Why this project exists

USB drives often contain mixed media, office documents, archives, source code, and project folders. USB File Preview gives those files a single readable register instead of forcing people to open several applications just to identify what is on a drive. The browser layer is intentionally honest: it previews formats the browser can render and explains when a native converter or desktop runtime is required.

## ✨ Features

| Area | Included in this project |
|---|---|
| USB and folders | User-approved USB-folder selection, file selection, drag-and-drop, recursive nested-folder indexing, relative-path preservation |
| Browser previews | Video, audio, image, PDF, Markdown, plain text, JSON, XML, YAML, HTML, CSS, JavaScript, TypeScript, Python, and related source files |
| File intelligence | Extension and MIME detection, browser-ready versus converter-needed states, file size, modified time, folder path, search, filters, and sorting |
| Python workspace | Editable Python and Markdown tabs, project explorer, line numbers, save-state feedback, run-state presentation, output console, and a native-runtime handoff point |
| Product design | Responsive workbench layout, local-only status, tactile archive-inspired visual system, generated brand mark, and developer credit surfaces |
| Privacy posture | Files are read only after a user action and remain in the current browser session; the static interface does not upload selected file contents |

## 🗂️ Supported file families

The current browser layer recognizes a broad set of extensions. Browser-native previews include common video, audio, image, PDF, and text/code files. Office documents, presentation files, spreadsheets, archives, fonts, ebooks, CAD files, and 3D models are identified in the register and marked for a future converter or native renderer rather than being presented as falsely supported.

| Family | Examples |
|---|---|
| Video | `.mp4`, `.webm`, `.mov`, `.m4v`, `.mkv`, `.avi`, `.ogv`, `.flv`, `.wmv`, `.mpeg` |
| Audio | `.mp3`, `.wav`, `.m4a`, `.aac`, `.ogg`, `.flac`, `.opus`, `.wma`, `.mid`, `.midi` |
| Images | `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`, `.bmp`, `.tif`, `.tiff`, `.heic`, `.avif`, `.ico` |
| Text and code | `.txt`, `.md`, `.json`, `.xml`, `.yaml`, `.yml`, `.csv`, `.html`, `.css`, `.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.ipynb`, `.sql`, `.toml`, `.ini`, `.r`, `.java`, `.c`, `.cpp`, `.rs`, `.sh` |
| Office and slides | `.pdf`, `.doc`, `.docx`, `.odt`, `.rtf`, `.ppt`, `.pptx`, `.odp`, `.key`, `.xls`, `.xlsx`, `.ods` |
| Archives and models | `.zip`, `.rar`, `.7z`, `.tar`, `.gz`, `.bz2`, `.glb`, `.gltf`, `.obj`, `.fbx`, `.stl` |

## 🧭 Live tutorial

### 1. Open the workspace

Open the [live demo](https://usbpreview-oqx3nys8.manus.space) or start the project locally. The demo initially shows representative sample files so the interface can be explored without connecting a drive.

### 2. Open a USB folder

Connect a USB drive, choose **Open USB folder**, and select the drive or a folder inside it. In supported browsers, the app recursively indexes the selected directory and keeps nested paths visible. In browsers without the directory picker, use **Add files** or the fallback folder picker.

### 3. Inspect a file

Select a row in the register. Video, audio, images, PDFs, and text files render in the preview stage. PowerPoint, Word, Excel, archives, and 3D formats show their metadata and a clear converter-needed state.

### 4. Use the Python IDE

Choose **Python IDE** from the workspace actions. Open `usb_scan.py`, edit the code, save the browser-session state, and use **Run** to see the runtime handoff message. Browser editing is available now; safe local execution against a selected USB folder belongs in the native desktop runtime stage.

## 🚀 Run locally

### Requirements

Node.js 20 or newer and pnpm are recommended. The project is a React 19 + Vite + TypeScript static frontend.

```bash
git clone https://github.com/DiwasKhatri07/usb-file-preview.git
cd usb-file-preview
pnpm install
pnpm dev
```

Open the local URL printed by Vite. For a production build:

```bash
pnpm check
pnpm build
pnpm start
```

## 🧱 Architecture

The interface is a static React application. The browser layer handles user-approved file and directory access, creates temporary object URLs for previews, detects format families, and renders honest capability states. The Python workspace is intentionally split from execution: an eventual Electron or Tauri bridge can provide sandboxed Python execution, package management, and OS-level volume events without changing the core preview UI.

> A normal browser page cannot silently enumerate every mounted drive or watch arbitrary USB storage insertion events. Automatic drive detection requires a native desktop bridge and operating-system volume APIs.

## 🛣️ Roadmap

| Stage | Goal |
|---|---|
| Current | Browser preview, USB-folder selection, recursive indexing, search/filter/sort, and Python editing surface |
| Next | Native desktop wrapper, automatic USB insertion/removal detection, drive allowlists, and local Python runtime |
| Later | Office rendering, archive browsing, 3D preview, thumbnail caching, large-drive indexing workers, and portable offline packaging |

## 🛡️ Privacy and security

Only files selected by the user are read by the browser layer. The current static application does not provide a server upload endpoint. Native execution should remain sandboxed, require explicit project approval, and keep package installation and filesystem writes visible to the user.

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Feature proposals should explain the file family, runtime dependency, privacy impact, and fallback behavior when a browser cannot render the format.

## 👤 Credits

Designed and developed by **Diwas Khatri**. The project uses React, Vite, TypeScript, Tailwind CSS, Lucide icons, and browser File System APIs. The design direction is called **Library Card / Tactile Utility**: a workbench inspired by archive labels, paper registers, and careful desktop tools.

## 📄 License

This project is released under the [MIT License](LICENSE).

## 🏷️ Repository tags

`usb` `file-preview` `browser-file-system` `local-first` `offline-ready` `python-ide` `python-editor` `react` `typescript` `vite` `file-manager` `media-preview` `developer-tools` `desktop-app` `electron` `tauri`

## References

[1]: https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker "MDN: showDirectoryPicker()"

[2]: https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle "MDN: FileSystemDirectoryHandle"

[3]: https://www.python.org/doc/ "Python documentation"
