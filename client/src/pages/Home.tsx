/**
 * Library Card / Tactile Utility reminder for this page:
 * Keep the left-to-right workbench composition, paper surfaces, graphite rail,
 * Signal Orange action color, index-tab labels, and plain capability language.
 */
import {
  AlertCircle,
  Archive,
  AudioLines,
  Box,
  Braces,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  File,
  FileCode2,
  FileImage,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderOpen,
  HardDrive,
  Image as ImageIcon,
  LayoutGrid,
  ListFilter,
  Maximize2,
  MoreHorizontal,
  PanelLeft,
  Play,
  Presentation,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Upload,
  Usb,
  Video,
  Volume2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const EMPTY_STAGE_IMAGE = "/manus-storage/usb-preview-empty-stage_b1aada90.png";
const FORMAT_STACK_IMAGE = "/manus-storage/usb-preview-format-stack_0735ac48.png";
const PRESENTATION_SAMPLE_IMAGE = "/manus-storage/usb-preview-presentation-sample_29efb212.png";
const MARK_IMAGE = "/manus-storage/usb-preview-mark_5b2d5fcf.png";

type FileKind =
  | "video"
  | "image"
  | "audio"
  | "pdf"
  | "text"
  | "presentation"
  | "spreadsheet"
  | "document"
  | "archive"
  | "model"
  | "other";

type SupportFilter = "all" | "browser" | "converter";
type SortMode = "recent" | "name" | "type";

interface PreviewFile {
  id: string;
  name: string;
  path: string;
  extension: string;
  kind: FileKind;
  size: string;
  modified: string;
  bytes: number;
  status: "browser" | "converter";
  raw?: File;
  url?: string;
}

const DEMO_FILES: PreviewFile[] = [
  {
    id: "demo-video",
    name: "Launch Reel.mp4",
    path: "Media / Launch Reel.mp4",
    extension: "MP4",
    kind: "video",
    size: "182.4 MB",
    modified: "Today, 10:42",
    bytes: 182400000,
    status: "browser",
  },
  {
    id: "demo-pdf",
    name: "Brand System.pdf",
    path: "Documents / Brand System.pdf",
    extension: "PDF",
    kind: "pdf",
    size: "8.9 MB",
    modified: "Today, 10:38",
    bytes: 8900000,
    status: "browser",
  },
  {
    id: "demo-ppt",
    name: "Q4 Product Story.pptx",
    path: "Presentations / Q4 Product Story.pptx",
    extension: "PPTX",
    kind: "presentation",
    size: "24.1 MB",
    modified: "Yesterday, 17:06",
    bytes: 24100000,
    status: "converter",
  },
  {
    id: "demo-text",
    name: "Field Notes.md",
    path: "Notes / Field Notes.md",
    extension: "MD",
    kind: "text",
    size: "12 KB",
    modified: "Yesterday, 14:22",
    bytes: 12000,
    status: "browser",
  },
  {
    id: "demo-audio",
    name: "Audio brief.m4a",
    path: "Media / Audio brief.m4a",
    extension: "M4A",
    kind: "audio",
    size: "4.7 MB",
    modified: "Mon, 09:14",
    bytes: 4700000,
    status: "browser",
  },
  {
    id: "demo-image",
    name: "Cover Image.tiff",
    path: "Media / Cover Image.tiff",
    extension: "TIFF",
    kind: "image",
    size: "18.6 MB",
    modified: "Sun, 18:41",
    bytes: 18600000,
    status: "browser",
  },
  {
    id: "demo-sheet",
    name: "Inventory.xlsx",
    path: "Operations / Inventory.xlsx",
    extension: "XLSX",
    kind: "spreadsheet",
    size: "1.3 MB",
    modified: "Sun, 16:20",
    bytes: 1300000,
    status: "converter",
  },
  {
    id: "demo-archive",
    name: "Camera RAW.zip",
    path: "Archive / Camera RAW.zip",
    extension: "ZIP",
    kind: "archive",
    size: "1.8 GB",
    modified: "Sat, 11:03",
    bytes: 1800000000,
    status: "converter",
  },
];

const kindLabels: Record<FileKind, string> = {
  video: "Video",
  image: "Image",
  audio: "Audio",
  pdf: "PDF",
  text: "Text",
  presentation: "Presentation",
  spreadsheet: "Spreadsheet",
  document: "Document",
  archive: "Archive",
  model: "3D model",
  other: "File",
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = units[0];
  for (let index = 0; index < units.length && value >= 1024; index += 1) {
    value /= 1024;
    unit = units[index + 1] ?? units[index];
  }
  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${unit}`;
}

function extensionFor(name: string) {
  return name.includes(".") ? name.split(".").pop()?.toLowerCase() ?? "" : "";
}

function kindForFile(file: File): FileKind {
  const extension = extensionFor(file.name);
  if (file.type.startsWith("video/") || ["mp4", "webm", "mov", "m4v", "mkv", "avi", "ogv"].includes(extension)) return "video";
  if (file.type.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tif", "tiff", "heic", "avif"].includes(extension)) return "image";
  if (file.type.startsWith("audio/") || ["mp3", "wav", "m4a", "aac", "ogg", "flac", "opus"].includes(extension)) return "audio";
  if (extension === "pdf" || file.type === "application/pdf") return "pdf";
  if (["md", "markdown", "txt", "log", "json", "xml", "yaml", "yml", "csv", "html", "css", "js", "jsx", "ts", "tsx", "vue", "py", "java", "c", "cpp", "rs", "sh"].includes(extension)) return "text";
  if (["ppt", "pptx", "odp", "key"].includes(extension)) return "presentation";
  if (["xls", "xlsx", "ods"].includes(extension)) return "spreadsheet";
  if (["doc", "docx", "odt", "rtf"].includes(extension)) return "document";
  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(extension)) return "archive";
  if (["glb", "gltf", "obj", "fbx", "stl"].includes(extension)) return "model";
  return "other";
}

function browserStatus(kind: FileKind) {
  return ["video", "image", "audio", "pdf", "text"].includes(kind) ? "browser" : "converter";
}

function iconForKind(kind: FileKind) {
  const props = { size: 17, strokeWidth: 1.7 };
  switch (kind) {
    case "video": return <Video {...props} />;
    case "image": return <FileImage {...props} />;
    case "audio": return <AudioLines {...props} />;
    case "pdf": return <FileText {...props} />;
    case "text": return <FileCode2 {...props} />;
    case "presentation": return <Presentation {...props} />;
    case "spreadsheet": return <FileSpreadsheet {...props} />;
    case "document": return <FileText {...props} />;
    case "archive": return <Archive {...props} />;
    case "model": return <Box {...props} />;
    default: return <File {...props} />;
  }
}

function localFiles(files: FileList | File[]) {
  return Array.from(files).map((file, index): PreviewFile => {
    const kind = kindForFile(file);
    const extension = extensionFor(file.name).toUpperCase() || "FILE";
    return {
      id: `${file.name}-${file.lastModified}-${index}`,
      name: file.name,
      path: file.webkitRelativePath || file.name,
      extension,
      kind,
      size: formatBytes(file.size),
      modified: new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(file.lastModified),
      bytes: file.size,
      status: browserStatus(kind),
      raw: file,
      url: URL.createObjectURL(file),
    };
  });
}

function FileTypeIcon({ kind }: { kind: FileKind }) {
  return <span className={`file-type-icon file-type-${kind}`}>{iconForKind(kind)}</span>;
}

function CapabilityBadge({ status }: { status: PreviewFile["status"] }) {
  return status === "browser" ? (
    <span className="capability-badge capability-ready"><Check size={12} /> Browser ready</span>
  ) : (
    <span className="capability-badge capability-converter"><AlertCircle size={12} /> Needs converter</span>
  );
}

function DemoPlayer() {
  return (
    <div className="demo-player">
      <div className="demo-player-sky" />
      <div className="demo-player-card">
        <span className="eyebrow">USB FILE PREVIEW / 001</span>
        <strong>Motion for the<br />everyday brief.</strong>
        <div className="demo-player-rule" />
        <span className="mono-label">00:42 / 02:18</span>
      </div>
      <div className="demo-play"><Play size={20} fill="currentColor" /></div>
      <div className="demo-player-controls">
        <span className="mono-label">00:42</span>
        <div className="player-track"><span /></div>
        <Volume2 size={14} />
        <Maximize2 size={14} />
      </div>
    </div>
  );
}

function DemoAudio() {
  const bars = [12, 24, 18, 34, 20, 48, 32, 25, 42, 17, 31, 52, 39, 22, 44, 28, 18, 35, 26, 50, 34, 20, 28, 16, 38, 22, 30, 18, 42, 26, 16, 35, 25, 44, 18, 29];
  return (
    <div className="audio-demo">
      <div className="audio-art"><AudioLines size={38} strokeWidth={1.3} /></div>
      <div className="audio-waveform">{bars.map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div>
      <div className="audio-meta"><strong>Audio brief</strong><span>Field recording · 04:18</span></div>
      <div className="audio-controls"><div className="demo-play"><Play size={16} fill="currentColor" /></div><div className="player-track"><span style={{ width: "37%" }} /></div><span className="mono-label">01:34</span></div>
    </div>
  );
}

function DemoDocument({ kind }: { kind: "pdf" | "text" | "spreadsheet" }) {
  if (kind === "text") {
    return (
      <div className="text-preview">
        <div className="text-preview-head"><span className="mono-label">FIELD NOTES / MD</span><span className="text-preview-dot" /></div>
        <pre>{`# Field Notes\n\nThe best preview tools keep the\nfile close and the interface quiet.\n\n- check the media first\n- name the limitation plainly\n- keep the next action visible\n\nThis is a local browser read.`}</pre>
        <div className="text-preview-foot"><span>UTF-8</span><span>7 lines</span></div>
      </div>
    );
  }
  return (
    <div className={`document-preview document-${kind}`}>
      <div className="document-topline"><span className="mono-label">{kind === "pdf" ? "PDF / PAGE 01" : "XLSX / SHEET 01"}</span><span className="document-page">1 / 1</span></div>
      <div className="document-paper">
        <div className="document-title-bar" />
        <div className="document-heading">{kind === "pdf" ? "Brand system" : "Inventory register"}</div>
        <div className="document-line short" /><div className="document-line" /><div className="document-line medium" />
        {kind === "pdf" ? <div className="document-blocks"><div /><div /><div /></div> : <div className="document-grid">{Array.from({ length: 18 }).map((_, index) => <span key={index} />)}</div>}
        <div className="document-footer-line" />
      </div>
    </div>
  );
}

function PreviewCanvas({ file, onBrowse }: { file: PreviewFile | null; onBrowse: () => void }) {
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    let active = true;
    if (file?.raw && file.kind === "text") {
      file.raw.text().then((text) => active && setTextContent(text.slice(0, 18000))).catch(() => active && setTextContent("Unable to read this text file in the browser."));
    } else {
      setTextContent("");
    }
    return () => { active = false; };
  }, [file]);

  if (!file) {
    return (
      <div className="empty-preview">
        <div className="empty-preview-image" style={{ backgroundImage: `url(${EMPTY_STAGE_IMAGE})` }} />
        <div className="empty-preview-copy">
          <span className="eyebrow">PREVIEW STAGE / IDLE</span>
          <h2>Bring a file<br /><em>into view.</em></h2>
          <p>Select a file from the register, or open a USB folder to start a local preview session.</p>
          <button className="button button-primary" onClick={onBrowse}><Upload size={15} /> Browse files</button>
        </div>
      </div>
    );
  }

  if (file.kind === "video") {
    return file.url ? <video className="native-video" controls src={file.url} /> : <DemoPlayer />;
  }
  if (file.kind === "audio") {
    return file.url ? <div className="native-audio"><AudioLines size={40} /><audio controls src={file.url} /><span>Native browser audio preview</span></div> : <DemoAudio />;
  }
  if (file.kind === "image") {
    return file.url ? <img className="native-image" src={file.url} alt={file.name} /> : <div className="image-demo"><img src={FORMAT_STACK_IMAGE} alt="Abstract file format stack" /></div>;
  }
  if (file.kind === "pdf" && file.url) {
    return <iframe className="native-pdf" title={`Preview of ${file.name}`} src={file.url} />;
  }
  if (file.kind === "text" && file.url) {
    return <div className="raw-text-preview"><div className="raw-text-bar"><span className="mono-label">LIVE TEXT / {file.extension}</span><span>{textContent.length.toLocaleString()} chars loaded</span></div><pre>{textContent || "Reading file…"}</pre></div>;
  }
  if (file.kind === "presentation" && !file.raw) {
    return <div className="presentation-demo"><img src={PRESENTATION_SAMPLE_IMAGE} alt="Abstract presentation preview" /><span className="presentation-page-label">COVER / 01</span></div>;
  }
  if (file.kind === "pdf" || file.kind === "text" || file.kind === "spreadsheet") {
    return <DemoDocument kind={file.kind === "spreadsheet" ? "spreadsheet" : file.kind} />;
  }
  return (
    <div className="unsupported-preview">
      <div className="unsupported-symbol">{iconForKind(file.kind)}</div>
      <span className="eyebrow">IDENTIFIED / NOT RENDERED</span>
      <h3>{kindLabels[file.kind]} file detected.</h3>
      <p>This browser can read the file name and metadata, but this format needs a converter or a desktop renderer for full content preview.</p>
      <button className="button button-secondary" onClick={() => toast.info("Converter workflow is planned for the offline version.")}><Sparkles size={15} /> Plan converter workflow</button>
    </div>
  );
}

export default function Home() {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SupportFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [showSort, setShowSort] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);

  const sourceFiles = files.length ? files : DEMO_FILES;
  const activeFile = sourceFiles.find((file) => file.id === selectedId) ?? null;

  const visibleFiles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const next = sourceFiles.filter((file) => {
      const matchesQuery = !normalized || `${file.name} ${file.path} ${file.extension}`.toLowerCase().includes(normalized);
      const matchesFilter = filter === "all" || (filter === "browser" ? file.status === "browser" : file.status === "converter");
      return matchesQuery && matchesFilter;
    });
    return [...next].sort((a, b) => {
      if (sortMode === "name") return a.name.localeCompare(b.name);
      if (sortMode === "type") return a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name);
      return b.bytes - a.bytes;
    });
  }, [filter, query, sortMode, sourceFiles]);

  const browserCount = sourceFiles.filter((file) => file.status === "browser").length;
  const converterCount = sourceFiles.length - browserCount;

  const importFiles = (picked: FileList | null) => {
    if (!picked?.length) return;
    const next = localFiles(picked);
    setFiles(next);
    setSelectedId(next[0]?.id ?? null);
    toast.success(`${next.length} ${next.length === 1 ? "file" : "files"} added to the local workspace.`);
  };

  const clearWorkspace = () => {
    files.forEach((file) => file.url && URL.revokeObjectURL(file.url));
    setFiles([]);
    setSelectedId(null);
    setQuery("");
    toast("Demo workspace restored.");
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    importFiles(event.dataTransfer.files);
  };

  const actionComingSoon = (label: string) => toast.info(`${label} is mapped for the offline build discussion.`);

  return (
    <main className="preview-app">
      <aside className="utility-rail">
        <div className="rail-brand">
          <img src={MARK_IMAGE} alt="USB File Preview mark" />
          <span>USB<br />FP</span>
        </div>
        <div className="rail-rule" />
        <nav className="rail-nav" aria-label="Workspace navigation">
          <button className="rail-nav-item active" aria-label="Preview workspace" onClick={() => toast("You are in the preview workspace.")}><PanelLeft size={19} /></button>
          <button className="rail-nav-item" aria-label="Recent files" onClick={() => actionComingSoon("Recent files")}><Clock3 size={19} /></button>
          <button className="rail-nav-item" aria-label="Storage devices" onClick={() => actionComingSoon("Storage devices")}><HardDrive size={19} /></button>
        </nav>
        <div className="rail-bottom">
          <button className="rail-nav-item" aria-label="Help" onClick={() => actionComingSoon("Help center")}><CircleHelp size={19} /></button>
          <button className="rail-nav-item" aria-label="Settings" onClick={() => actionComingSoon("Settings")}><Settings2 size={19} /></button>
          <div className="rail-status" title="Runs in your browser"><span />Local</div>
        </div>
      </aside>

      <section className="workspace-shell">
        <header className="topbar">
          <div className="breadcrumb"><span className="breadcrumb-home"><Usb size={14} /></span><ChevronRight size={14} /><span>Preview workspace</span><ChevronRight size={14} /><strong>{files.length ? "USB drive" : "Demo drive"}</strong></div>
          <div className="topbar-actions">
            <span className="local-pill"><span /> Local only</span>
            <button className="icon-button" aria-label="More workspace actions" onClick={() => actionComingSoon("Workspace actions")}><MoreHorizontal size={19} /></button>
            <button className="avatar-button" aria-label="Workspace profile">A</button>
          </div>
        </header>

        <div className="workspace-content">
          <div className="workspace-heading">
            <div>
              <div className="eyebrow heading-eyebrow">BROWSER PREVIEW LAB <span>·</span> {files.length ? "USB SET LOADED" : "DEMO CONTENT"}</div>
              <h1>Browse what’s<br /><em>on the drive.</em></h1>
              <p className="heading-copy">A quiet place to inspect media, documents, and the formats your browser can or cannot render.</p>
            </div>
            <div className="heading-actions">
              <button className="button button-secondary" onClick={clearWorkspace}><HardDrive size={15} /> {files.length ? "Reset workspace" : "Reset demo"}</button>
              <button className="button button-primary" onClick={() => fileInput.current?.click()}><Upload size={15} /> Add files</button>
            </div>
          </div>

          <div className="stat-strip">
            <div className="stat-card stat-card-primary"><span className="stat-kicker">FILES INDEXED</span><strong>{sourceFiles.length.toString().padStart(2, "0")}</strong><span className="stat-note">{files.length ? "from selected folder" : "sample workspace"}</span></div>
            <div className="stat-card"><span className="stat-kicker">BROWSER READY</span><strong>{browserCount.toString().padStart(2, "0")}</strong><span className="stat-note"><Check size={12} /> video · image · audio · PDF</span></div>
            <div className="stat-card"><span className="stat-kicker">CONVERTER QUEUE</span><strong>{converterCount.toString().padStart(2, "0")}</strong><span className="stat-note"><AlertCircle size={12} /> office · archive · 3D</span></div>
            <div className="stat-card stat-card-image"><img src={FORMAT_STACK_IMAGE} alt="File format stack" /><div><span className="stat-kicker">ONE WORKSPACE</span><span className="stat-note">Many file families.<br />One readable register.</span></div></div>
          </div>

          <div className="workbench" onDrop={onDrop} onDragOver={(event) => event.preventDefault()}>
            <section className="file-register">
              <div className="register-header">
                <div><span className="section-label">01 / FILE REGISTER</span><h2>{files.length ? "Selected drive" : "Demo drive"}<span className="slash"> / </span><em>root</em></h2></div>
                <button className="folder-button" onClick={() => folderInput.current?.click()}><FolderOpen size={15} /> Open folder</button>
              </div>
              <div className="register-toolbar">
                <label className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search files, folders, extensions" aria-label="Search files" />{query && <button aria-label="Clear search" onClick={() => setQuery("")}><X size={14} /></button>}</label>
                <div className="filter-group" aria-label="File support filter">
                  <button className={filter === "all" ? "filter-button active" : "filter-button"} onClick={() => setFilter("all")}>All <span>{sourceFiles.length}</span></button>
                  <button className={filter === "browser" ? "filter-button active" : "filter-button"} onClick={() => setFilter("browser")}>Ready <span>{browserCount}</span></button>
                  <button className={filter === "converter" ? "filter-button active" : "filter-button"} onClick={() => setFilter("converter")}>Convert <span>{converterCount}</span></button>
                </div>
                <div className="sort-wrap">
                  <button className="sort-button" onClick={() => setShowSort((value) => !value)}><SlidersHorizontal size={14} /> Sort <ChevronDown size={13} /></button>
                  {showSort && <div className="sort-menu"><button onClick={() => { setSortMode("recent"); setShowSort(false); }}>Largest first {sortMode === "recent" && <Check size={13} />}</button><button onClick={() => { setSortMode("name"); setShowSort(false); }}>Name {sortMode === "name" && <Check size={13} />}</button><button onClick={() => { setSortMode("type"); setShowSort(false); }}>Type {sortMode === "type" && <Check size={13} />}</button></div>}
                </div>
                <button className="view-toggle" aria-label="List view selected"><ListFilter size={15} /><LayoutGrid size={15} /></button>
              </div>
              <div className="register-columns"><span>Name</span><span>Type</span><span>Size</span><span>Preview</span></div>
              <div className="file-list">
                {visibleFiles.length ? visibleFiles.map((file, index) => (
                  <button key={file.id} className={`file-row ${activeFile?.id === file.id ? "selected" : ""}`} onClick={() => setSelectedId(file.id)} style={{ "--row-index": index } as React.CSSProperties}>
                    <span className="file-name-cell"><FileTypeIcon kind={file.kind} /><span><strong>{file.name}</strong><small>{file.path}</small></span></span>
                    <span className="file-kind-cell"><span className="file-extension">.{file.extension.toLowerCase()}</span><span>{kindLabels[file.kind]}</span></span>
                    <span className="file-size-cell">{file.size}<small>{file.modified}</small></span>
                    <span className="file-status-cell"><span className={`status-dot ${file.status}`} />{file.status === "browser" ? "Ready" : "Convert"}<ChevronRight size={14} /></span>
                  </button>
                )) : <div className="no-results"><Search size={20} /><strong>No files match that search.</strong><span>Try another name or clear the filter.</span></div>}
              </div>
              <div className="register-footer"><span><ShieldCheck size={14} /> Files stay in this browser session</span><span>{visibleFiles.length} of {sourceFiles.length} shown</span></div>
            </section>

            <section className="preview-panel">
              <div className="preview-panel-header"><div><span className="section-label">02 / PREVIEW STAGE</span><span className="preview-stage-status"><span className={activeFile ? activeFile.status : "idle"} />{activeFile ? (activeFile.status === "browser" ? "Browser renderer" : "Metadata only") : "Waiting for selection"}</span></div><div className="preview-actions"><button className="icon-button" aria-label="Zoom out" onClick={() => actionComingSoon("Zoom controls")}><ZoomOut size={15} /></button><button className="icon-button" aria-label="Zoom in" onClick={() => actionComingSoon("Zoom controls")}><ZoomIn size={15} /></button><button className="icon-button" aria-label="More preview actions" onClick={() => actionComingSoon("Preview actions")}><MoreHorizontal size={17} /></button></div></div>
              <div className="preview-canvas"><PreviewCanvas file={activeFile} onBrowse={() => fileInput.current?.click()} /></div>
              {activeFile ? <div className="preview-meta"><div><span className="meta-label">SELECTED FILE</span><strong>{activeFile.name}</strong><span>{activeFile.path}</span></div><CapabilityBadge status={activeFile.status} /></div> : <div className="preview-meta preview-meta-idle"><div><span className="meta-label">NO FILE SELECTED</span><strong>Choose a row to inspect its preview.</strong></div><button className="text-button" onClick={() => folderInput.current?.click()}>Open a folder <ChevronRight size={14} /></button></div>}
            </section>
          </div>

          <div className="bottom-note"><div><span className="note-mark"><Usb size={14} /></span><p><strong>Designed for local-first browsing.</strong> This first pass proves the browser workflow. PowerPoint, Office, archive, and 3D rendering can be added in the offline build with dedicated converters.</p></div><button className="text-button" onClick={() => actionComingSoon("Offline architecture notes")}>Discuss offline mode <ChevronRight size={14} /></button></div>
        </div>
      </section>

      <input ref={fileInput} className="visually-hidden" type="file" multiple onChange={(event) => { importFiles(event.target.files); event.target.value = ""; }} />
      <input ref={folderInput} className="visually-hidden" type="file" multiple onChange={(event) => { importFiles(event.target.files); event.target.value = ""; }} {...({ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement> & { webkitdirectory: string; directory: string })} />
    </main>
  );
}
