/*
 * Library Card / Tactile Utility reminder for this local scanner:
 * preserve relative archive paths and return honest browser/converter states;
 * never imply that a browser has silently discovered a drive.
 */

export type LocalFileKind =
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

export interface ScannedLocalFile {
  name: string;
  path: string;
  extension: string;
  kind: LocalFileKind;
  size: string;
  modified: string;
  bytes: number;
  status: "browser" | "converter";
  raw: File;
  url: string;
}

const TEXT_EXTENSIONS = new Set(["md", "markdown", "txt", "log", "json", "xml", "yaml", "yml", "csv", "html", "css", "js", "jsx", "ts", "tsx", "vue", "py", "ipynb", "java", "c", "cpp", "rs", "sh", "sql", "toml", "ini", "r"]);

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = units[0];
  for (let index = 0; index < units.length && value >= 1024; index += 1) {
    value /= 1024;
    unit = units[index + 1] ?? units[index];
  }
  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${unit}`;
};

const extensionFor = (name: string) => name.includes(".") ? name.split(".").pop()?.toLowerCase() ?? "" : "";

const kindFor = (file: File): LocalFileKind => {
  const extension = extensionFor(file.name);
  if (file.type.startsWith("video/") || ["mp4", "webm", "mov", "m4v", "mkv", "avi", "ogv", "flv", "wmv", "mpg", "mpeg", "3gp"].includes(extension)) return "video";
  if (file.type.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tif", "tiff", "heic", "avif", "ico", "raw", "cr2", "nef"].includes(extension)) return "image";
  if (file.type.startsWith("audio/") || ["mp3", "wav", "m4a", "aac", "ogg", "flac", "opus", "wma", "mid", "midi"].includes(extension)) return "audio";
  if (extension === "pdf" || file.type === "application/pdf") return "pdf";
  if (TEXT_EXTENSIONS.has(extension)) return "text";
  if (["ppt", "pptx", "odp", "key"].includes(extension)) return "presentation";
  if (["xls", "xlsx", "ods"].includes(extension)) return "spreadsheet";
  if (["doc", "docx", "odt", "rtf"].includes(extension)) return "document";
  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(extension)) return "archive";
  if (["glb", "gltf", "obj", "fbx", "stl", "3ds", "dae", "blend"].includes(extension)) return "model";
  return "other";
};

const statusFor = (kind: LocalFileKind): "browser" | "converter" => ["video", "image", "audio", "pdf", "text"].includes(kind) ? "browser" : "converter";

type DirectoryEntry =
  | { kind: "file"; getFile(): Promise<File> }
  | { kind: "directory"; entries(): AsyncIterableIterator<[string, DirectoryEntry]> };

export type DirectoryHandleLike = { name: string; entries(): AsyncIterableIterator<[string, DirectoryEntry]> };
type DirectoryContainer = { entries(): AsyncIterableIterator<[string, DirectoryEntry]> };

async function* walkDirectory(handle: DirectoryContainer, parentPath = ""): AsyncGenerator<{ file: File; path: string }> {
  for await (const [name, entry] of handle.entries()) {
    const nextPath = parentPath ? `${parentPath} / ${name}` : name;
    if (entry.kind === "file") {
      const file = await entry.getFile();
      yield { file, path: nextPath };
    } else {
      yield* walkDirectory(entry, nextPath);
    }
  }
}

export async function scanDirectory(handle: DirectoryHandleLike, onProgress?: (count: number) => void): Promise<ScannedLocalFile[]> {
  const result: ScannedLocalFile[] = [];
  let count = 0;
  for await (const { file, path } of walkDirectory(handle, handle.name)) {
    const kind = kindFor(file);
    result.push({
      name: file.name,
      path,
      extension: extensionFor(file.name).toUpperCase() || "FILE",
      kind,
      size: formatBytes(file.size),
      modified: new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(file.lastModified),
      bytes: file.size,
      status: statusFor(kind),
      raw: file,
      url: URL.createObjectURL(file),
    });
    count += 1;
    onProgress?.(count);
  }
  return result;
}

export function hasDirectoryPicker() {
  return typeof window !== "undefined" && "showDirectoryPicker" in window;
}
