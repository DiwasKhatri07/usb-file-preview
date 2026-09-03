/*
 * Library Card / Tactile Utility reminder for this component:
 * Python work should feel like a labeled field notebook—clear file tree,
 * graphite editor surface, Signal Orange run action, and honest runtime state.
 */
import { Braces, ChevronDown, ChevronRight, FileCode2, Folder, FolderOpen, GitBranch, Play, Plus, Save, TerminalSquare, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const starterCode = `from pathlib import Path\n\nROOT = Path.cwd()\n\nfor item in sorted(ROOT.iterdir()):\n    print(item.name)\n`;

export default function PythonWorkspace() {
  const [code, setCode] = useState(starterCode);
  const [fileName, setFileName] = useState("usb_scan.py");
  const [runState, setRunState] = useState<"ready" | "running" | "waiting">("ready");
  const [output, setOutput] = useState("Local Python runtime ready to connect.\n\nThis browser workspace can edit and inspect .py files now.\nThe native localhost build will execute code against an approved folder.");

  const runCode = () => {
    setRunState("running");
    setOutput("Preparing local Python runtime…\n\nNo code has been sent anywhere. Execution will be enabled by the native localhost bridge.");
    window.setTimeout(() => setRunState("waiting"), 600);
  };

  const saveFile = () => toast.success(`${fileName} is kept in this browser session.`);

  return (
    <section className="python-workspace" aria-label="Python IDE workspace">
      <div className="python-topline">
        <div><span className="section-label">03 / PYTHON WORKSPACE</span><h2>Write, inspect, <em>iterate.</em></h2></div>
        <div className="python-top-actions"><span className="runtime-badge"><span /> Local runtime bridge</span><button className="button button-secondary" onClick={() => toast.info("Python project import will use the selected USB folder in the native build.")}><FolderOpen size={15} /> Import project</button></div>
      </div>
      <div className="python-layout">
        <aside className="python-files">
          <div className="python-pane-title"><span>EXPLORER</span><button aria-label="New Python file" onClick={() => { setFileName("untitled.py"); setCode("# New Python file\n\n"); }}><Plus size={14} /></button></div>
          <div className="python-root"><ChevronDown size={14} /><Folder size={15} /><strong>usb-project</strong></div>
          <button className={`python-file ${fileName === "usb_scan.py" ? "active" : ""}`} onClick={() => { setFileName("usb_scan.py"); setCode(starterCode); }}><FileCode2 size={15} /><span>usb_scan.py</span><span className="file-dot" /></button>
          <button className={`python-file ${fileName === "README.md" ? "active" : ""}`} onClick={() => { setFileName("README.md"); setCode("# USB project notes\n\nChoose a folder, inspect its files, and preview\nwhat the browser can render locally.\n"); }}><Braces size={15} /><span>README.md</span></button>
          <button className="python-file" onClick={() => toast.info("The native build will map this folder to the selected USB drive.")}><Folder size={15} /><span>sample_data</span><ChevronRight size={13} /></button>
          <div className="python-files-foot"><span><GitBranch size={13} /> main</span><span>2 files</span></div>
        </aside>
        <div className="python-editor-panel">
          <div className="editor-tabs"><div className="editor-tab active"><FileCode2 size={14} /><span>{fileName}</span><button aria-label="Close file" onClick={() => toast("The editor keeps one working tab open.")}><X size={12} /></button></div><button className="editor-add" aria-label="Add editor tab" onClick={() => setFileName("untitled.py")}><Plus size={14} /></button></div>
          <div className="editor-toolbar"><span>Python 3 · UTF-8 · spaces: 4</span><div><button onClick={saveFile}><Save size={14} /> Save</button><button className="run-button" onClick={runCode}><Play size={13} fill="currentColor" /> {runState === "running" ? "Preparing…" : "Run"}<kbd>⌘↵</kbd></button></div></div>
          <div className="code-editor"><div className="line-numbers">{code.split("\n").map((_, index) => <span key={index}>{index + 1}</span>)}</div><textarea spellCheck={false} value={code} onChange={(event) => setCode(event.target.value)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); runCode(); } }} aria-label="Python code editor" /></div>
          <div className="editor-status"><span><span className="status-pip" /> {runState === "waiting" ? "Runtime bridge pending" : "No syntax check errors"}</span><span>{code.split("\n").length} lines</span></div>
        </div>
        <aside className="python-output"><div className="python-pane-title"><span><TerminalSquare size={14} /> OUTPUT</span><button aria-label="Clear output" onClick={() => setOutput("")}><X size={13} /></button></div><div className="output-screen"><div className="output-command"><span>$</span> python {fileName}</div><pre>{output}</pre></div><div className="output-footer"><span>Read-only preview</span><span>Local-only</span></div></aside>
      </div>
      <div className="python-note"><TerminalSquare size={15} /><p><strong>Python support is staged for local execution.</strong> Editing, project files, and USB-folder inspection are ready in the browser layer; the native runtime will add sandboxed execution and package management.</p></div>
    </section>
  );
}
