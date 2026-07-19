import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Key,
  Download,
  Cpu,
  Info,
  Layers,
  Search,
} from "lucide-react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// ── CUSTOM MINIMALIST MIND MAP NODES ──

// 1. Center Root Node: Glowing Card with Indigo Border
function CenterNode({ data }) {
  return (
    <div className="relative px-6 py-4.5 rounded-[28px] bg-white dark:bg-slate-900 border-2 border-indigo-600 shadow-[0_10px_30px_rgba(79,70,229,0.22)] w-[240px] min-h-[90px] flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-[1.03] select-none">
      {/* 4 Handles for connections radiating outwards */}
      <Handle type="source" position={Position.Top} id="t" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} id="b" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} id="l" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="r" style={{ opacity: 0 }} />

      <span className="text-[13px] font-black uppercase text-indigo-900 dark:text-indigo-400 leading-none">
        {data.code}
      </span>
      <span className="text-[9.5px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-wide mt-1.5 leading-normal">
        {data.title}
      </span>
    </div>
  );
}

// 2. Outer Node Card: Super-rounded corners, colored drop glow shadow, number badge on left
function OuterNode({ data }) {
  const theme = data.themeColor || "yellow";

  // Glowing shadow and border styling matching the color wheel in your sample
  const themeStyles = {
    yellow: {
      shadow: "shadow-[0_10px_25px_rgba(234,179,8,0.18)]",
      border: "border-yellow-100 dark:border-yellow-900/40",
      badge: "bg-yellow-400 border-yellow-200",
    },
    orange: {
      shadow: "shadow-[0_10px_25px_rgba(249,115,22,0.18)]",
      border: "border-orange-100 dark:border-orange-900/40",
      badge: "bg-orange-400 border-orange-200",
    },
    pink: {
      shadow: "shadow-[0_10px_25px_rgba(236,72,153,0.18)]",
      border: "border-pink-100 dark:border-pink-900/40",
      badge: "bg-pink-500 border-pink-300",
    },
    purple: {
      shadow: "shadow-[0_10px_25px_rgba(168,85,247,0.18)]",
      border: "border-purple-100 dark:border-purple-900/40",
      badge: "bg-purple-500 border-purple-300",
    },
    red: {
      shadow: "shadow-[0_10px_25px_rgba(239,68,68,0.18)]",
      border: "border-red-100 dark:border-red-900/40",
      badge: "bg-red-500 border-red-300",
    },
    teal: {
      shadow: "shadow-[0_10px_25px_rgba(20,184,166,0.18)]",
      border: "border-teal-100 dark:border-teal-900/40",
      badge: "bg-teal-500 border-teal-300",
    },
    cyan: {
      shadow: "shadow-[0_10px_25px_rgba(6,182,212,0.18)]",
      border: "border-cyan-100 dark:border-cyan-900/40",
      badge: "bg-cyan-500 border-cyan-300",
    },
    blue: {
      shadow: "shadow-[0_10px_25px_rgba(59,130,246,0.18)]",
      border: "border-blue-100 dark:border-blue-900/40",
      badge: "bg-blue-500 border-blue-300",
    },
  };

  const style = themeStyles[theme] || themeStyles.yellow;

  return (
    <div className={`relative px-5 py-4 rounded-[32px] bg-white dark:bg-slate-900 border-2 ${style.border} ${style.shadow} w-[240px] min-h-[110px] flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-[1.03] select-none`}>
      <Handle type="target" position={Position.Top} id="t" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} id="b" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="l" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} id="r" style={{ opacity: 0 }} />

      {/* Overlapping Number Badge (Scalloped feel with border) */}
      <div className={`absolute -left-[18px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center font-black text-xs text-white border-[3px] border-white dark:border-slate-900 shadow-md ${style.badge}`}>
        {data.badgeNumber}
      </div>

      {/* Card Content */}
      <h5 className="font-bold uppercase tracking-wider text-[11px] text-slate-800 dark:text-gray-100 mb-1 leading-tight">
        {data.label}
      </h5>
      <p className="text-[9.5px] text-slate-500 dark:text-gray-400 font-normal leading-normal text-center px-1">
        {data.description}
      </p>
    </div>
  );
}

const nodeTypes = {
  centerNode: CenterNode,
  outerNode: OuterNode,
};

// Colors order mapping clockwise
const THEME_COLORS = ["yellow", "orange", "pink", "purple", "red", "teal", "cyan", "blue"];

export default function ConceptMapGenerator({ plan, onUpdateConceptMap }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [genAiThoughts, setGenAiThoughts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // ── GRID SYMMETRIC MIND MAP LAYOUT ENGINE ──
  const computeGridLayout = (rawNodes) => {
    if (!rawNodes || rawNodes.length === 0) return [];
    const nodesCopy = JSON.parse(JSON.stringify(rawNodes));
    
    const rootNode = nodesCopy.find(n => n.type === "centerNode" || n.id === "root");
    if (!rootNode) return nodesCopy;

    // Center root at origin
    rootNode.x = 0;
    rootNode.y = 0;

    const outerNodes = nodesCopy.filter(n => n.id !== rootNode.id);
    
    // 8 Grid coordinates radiating from center (X: 340px spacing, Y: 200px spacing)
    const dx = 340;
    const dy = 200;
    const slots = [
      { x: 0, y: -dy },    // 1. Top-Center
      { x: dx, y: -dy },   // 2. Top-Right
      { x: dx, y: 0 },     // 3. Middle-Right
      { x: dx, y: dy },    // 4. Bottom-Right
      { x: 0, y: dy },     // 5. Bottom-Center
      { x: -dx, y: dy },   // 6. Bottom-Left
      { x: -dx, y: 0 },    // 7. Middle-Left
      { x: -dx, y: -dy },  // 8. Top-Left
    ];

    outerNodes.forEach((node, idx) => {
      // Symmetrical cross if <= 4 nodes, otherwise fill grid slots clockwise
      let slotIdx = idx % slots.length;
      if (outerNodes.length <= 4) {
        slotIdx = (idx * 2) % slots.length;
      }
      
      node.x = slots[slotIdx].x;
      node.y = slots[slotIdx].y;
    });

    return nodesCopy;
  };

  // Convert raw node plan to React Flow nodes/edges
  useEffect(() => {
    if (plan?.conceptMap?.nodes) {
      const rawNodes = plan.conceptMap.nodes;
      const lowerQuery = searchQuery.toLowerCase().trim();
      const isSearchActive = lowerQuery !== "";

      // Position nodes symmetrically
      const positioned = computeGridLayout(rawNodes);

      const rfNodes = positioned.map((n) => {
        const nodeLabel = n.label || n.title || "";
        const nodeDesc = n.description || "";
        const isMatch = nodeLabel.toLowerCase().includes(lowerQuery) || nodeDesc.toLowerCase().includes(lowerQuery);
        let opacityVal = 1;
        if (isSearchActive) {
          opacityVal = isMatch ? 1 : 0.25;
        }

        return {
          id: n.id,
          type: n.type === "root" ? "centerNode" : "outerNode",
          position: { x: n.x, y: n.y },
          data: { 
            label: n.label, 
            description: n.description,
            badgeNumber: n.badgeNumber,
            themeColor: n.themeColor,
            code: n.code,
            title: n.title,
          },
          style: { 
            opacity: opacityVal,
            transition: "opacity 200ms ease"
          }
        };
      });

      // Construct Edges (thin black straight links with arrowheads radiating from center)
      const rfEdges = [];
      positioned.forEach((node) => {
        if (node.parentId) {
          const parent = positioned.find((n) => n.id === node.parentId);
          if (parent) {
            // Determine the closest handles dynamically to prevent top-left alignment bugs
            let sourceHandle = "b";
            let targetHandle = "t";

            if (node.x === 0 && node.y < 0) {
              sourceHandle = "t";
              targetHandle = "b";
            } else if (node.x === 0 && node.y > 0) {
              sourceHandle = "b";
              targetHandle = "t";
            } else if (node.x > 0) {
              sourceHandle = "r";
              targetHandle = "l";
            } else if (node.x < 0) {
              sourceHandle = "l";
              targetHandle = "r";
            }

            rfEdges.push({
              id: `edge-${parent.id}-${node.id}`,
              source: parent.id,
              target: node.id,
              sourceHandle,
              targetHandle,
              style: { stroke: "#1e293b", strokeWidth: 1.5 },
              type: "straight",
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#1e293b",
                width: 10,
                height: 10,
              }
            });
          }
        }
      });

      setNodes(rfNodes);
      setEdges(rfEdges);
    }
  }, [plan?.conceptMap?.nodes, searchQuery, setNodes, setEdges]);

  // Selected Node computed helper
  const selectedNode = useMemo(() => {
    if (!plan?.conceptMap?.nodes || !selectedNodeId) return null;
    return plan.conceptMap.nodes.find((n) => n.id === selectedNodeId);
  }, [plan?.conceptMap?.nodes, selectedNodeId]);

  // Sync rendered view to HTML for A4 document printing
  const syncRenderedSvgState = () => {
    const rfViewport = document.querySelector(".react-flow__viewport");
    if (!rfViewport || !plan?.conceptMap?.nodes) return;
    
    const clone = rfViewport.cloneNode(true);
    
    // Clean interactive markers
    clone.querySelectorAll(".react-flow__handle, .react-flow__edge-interaction").forEach(el => el.remove());
    
    const svgInnerHtml = clone.innerHTML;
    const finalHtml = `
      <div class="concept-map-print-wrapper" style="position: relative; width: 100%; height: 420px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 20px; overflow: hidden; transform: scale(0.85); transform-origin: top center;">
        <style>
          .react-flow__edge-path { fill: none; stroke: #1e293b; stroke-width: 1.5; }
          .react-flow__edge-text { font-family: Arial, sans-serif; font-size: 8px; font-weight: bold; fill: #6366f1; }
        </style>
        <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 800px; height: 600px;">
          ${svgInnerHtml}
        </div>
      </div>
    `;

    if (plan.conceptMap.renderedSvg !== finalHtml) {
      onUpdateConceptMap({
        ...plan.conceptMap,
        renderedSvg: finalHtml
      });
    }
  };

  // Trigger HTML sync when nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      const timer = setTimeout(syncRenderedSvgState, 800);
      return () => clearTimeout(timer);
    }
  }, [nodes]);

  // ── MOCK SYLLABUS ANALYZER (GenAI Fallback) ──
  const runMockGeneration = async () => {
    setIsGenerating(true);
    setGenAiThoughts([]);
    
    const addThought = (msg, delay) => new Promise(res => {
      setTimeout(() => {
        setGenAiThoughts(prev => [...prev, msg]);
        res();
      }, delay);
    });

    await addThought("Inspecting Course Delivery Plan Outcomes (COs) and mappings...", 600);
    await addThought(`Identified course: ${plan.courseMetadata?.name || 'C Programming'}`, 400);
    await addThought(`Found Course Outcomes and mapped Program Outcomes (POs)...`, 500);
    await addThought("Structuring grid layout outward cards clock-wise around center...", 500);

    const courseCode = plan.courseMetadata?.code || "23CSE201";
    const courseName = plan.courseMetadata?.name || "Procedural Programming Using C";

    // Central Node structure
    const rawNodes = [
      { 
        id: "root", 
        type: "root", 
        code: courseCode, 
        title: courseName.toUpperCase(), 
        parentId: null 
      },
    ];

    const outcomes = plan.courseOutcomes || [
      { id: "CO1", description: "Understand typical C constructs" },
      { id: "CO2", description: "Trace and debug programs" },
      { id: "CO3", description: "Apply arrays and structure parameters" },
      { id: "CO4", description: "Develop physical computing programs" }
    ];

    // Determine how many outcomes we have. Clamp to at most 6 outcomes.
    const maxCOs = Math.min(outcomes.length, 6);
    const coNodesCount = maxCOs;
    const poNodesCount = 8 - coNodesCount;

    // Card 1 to coNodesCount: Course Outcomes
    outcomes.slice(0, coNodesCount).forEach((co, idx) => {
      const desc = co.description || "Course outcome objective mapping.";
      const shortDesc = desc.split(" thereby")[0]?.split(",")[0] || desc;
      const themeColor = THEME_COLORS[idx % THEME_COLORS.length];
      rawNodes.push({
        id: co.id,
        label: co.id,
        description: shortDesc,
        type: "main",
        badgeNumber: idx + 1,
        themeColor,
        parentId: "root",
      });
    });

    // Card (coNodesCount + 1) to 8: Mapped Program Outcomes & Key Focus Mappings
    const matrixRow = plan.coPoMappings || [];
    const activePOs = Array.from(
      new Set(matrixRow.flatMap(m => 
        Object.keys(m).filter(k => k !== "co" && m[k] !== "-" && m[k] !== "")
      ))
    ).map(po => po.toUpperCase()).slice(0, poNodesCount);

    const fallbackPos = ["PO1", "PO2", "PO5", "PSO1"].slice(0, poNodesCount);
    const displayPos = activePOs.length >= poNodesCount ? activePOs : fallbackPos;

    const poDescriptions = {
      PO1: "Engineering Knowledge: Apply optimization principles to engineering problems.",
      PO2: "Problem Analysis: Formulate and analyze mathematical gradients and optimality search criteria.",
      PO3: "Design/development of solutions: Design computational algorithms for multivariable constraints.",
      PO5: "Modern Tool Usage: Implement iterative optimization algorithms using software/MATLAB.",
      PSO1: "Skillset: Formulate and solve complex interdisciplinary models.",
    };

    displayPos.forEach((po, idx) => {
      const themeColor = THEME_COLORS[(idx + coNodesCount) % THEME_COLORS.length];
      const desc = poDescriptions[po] || `Builds specialized capacity mapped to course unit segments.`;
      
      rawNodes.push({
        id: po,
        label: `Accreditation ${po}`,
        description: desc,
        type: "sub",
        badgeNumber: idx + coNodesCount + 1,
        themeColor,
        parentId: "root",
      });
    });

    onUpdateConceptMap({
      nodes: rawNodes,
      renderedSvg: plan?.conceptMap?.renderedSvg || ""
    });
    setIsGenerating(false);
    setSelectedNodeId("root");
  };

  const handleGenerate = () => {
    runMockGeneration();
  };

  // Export SVG
  const handleExportSVG = () => {
    if (!plan?.conceptMap?.renderedSvg) return;
    const blob = new Blob([plan.conceptMap.renderedSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${plan.courseMetadata?.code || "Course"}_MindMap.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!plan?.conceptMap?.nodes) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 p-12 text-center shadow-card min-h-[500px]">
        <div className="grid h-16 w-16 place-items-center rounded-2xl grad-brand shadow-glow animate-pulse-glow mb-5">
          <Layers className="h-7 w-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-gray-100 mb-2">Generate Educational Mind Map</h3>
        <p className="text-sm text-slate-500 dark:text-gray-400 max-w-md mb-8">
          Create a symmetrical concept flowchart radiating outward around the center course code, styled with super-ellipse cards.
        </p>

        <div className="w-full max-w-xs">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl grad-brand px-6 py-3.5 text-sm font-bold text-white shadow-glow hover:shadow-glow-lg transition-all active:scale-95 disabled:opacity-70"
          >
            <Sparkles size={16} />
            {isGenerating ? "Analyzing Syllabus..." : "Generate Map with AI"}
          </button>
        </div>

        {isGenerating && genAiThoughts.length > 0 && (
          <div className="mt-10 w-full max-w-md text-left rounded-xl border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/50 p-4 space-y-2.5 font-mono text-xs text-slate-500">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
              <Cpu size={14} className="animate-spin-slow" />
              <span>GenAI Reasoning Agent:</span>
            </div>
            {genAiThoughts.map((thought, i) => (
              <div key={i} className="flex gap-2 items-start animate-fade-up">
                <span className="text-slate-400">▸</span>
                <span>{thought}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-[600px]">
      {/* ── CANVAS VIEW ── */}
      <div className="flex flex-col border border-slate-200/80 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-gray-950 overflow-hidden shadow-card relative select-none flex-1">
        
        {/* Toolbar */}
        <div className="border-b border-slate-100 dark:border-gray-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-gray-900/20 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-gray-200 uppercase tracking-wider">Symmetric Mind Map</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" size={13} />
              <input
                type="text"
                placeholder="Search outcomes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 pl-8 pr-3 py-1 text-xs outline-none focus:border-indigo-400 w-36 sm:w-44 transition-all focus:w-52"
              />
            </div>

            <button
              onClick={handleExportSVG}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800 text-slate-600 dark:text-gray-300 px-2.5 py-1.5 text-xs font-semibold"
            >
              <Download size={13} />
              SVG
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 rounded-lg grad-brand text-white px-2.5 py-1.5 text-xs font-bold shadow-glow-sm"
            >
              <Sparkles size={13} />
              Re-Gen
            </button>
          </div>
        </div>

        {/* React Flow Board */}
        <div className="flex-1 w-full relative min-h-[500px] bg-[#fafaf9] dark:bg-slate-950">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={(e, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            nodeTypes={nodeTypes}
            fitView
            nodesConnectable={false}
            nodesDraggable={false}
            elementsSelectable={true}
          >
            <Background color="#cbd5e1" gap={20} size={1} className="opacity-20" />
            <Controls className="!bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-gray-800" showInteractive={false} />
          </ReactFlow>

          {/* Premium Loading Overlay for Generation / Re-Generation */}
          {isGenerating && (
            <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 z-20 animate-scale-in">
              <div className="flex flex-col items-center gap-4 max-w-md w-full">
                <div className="grid h-12 w-12 place-items-center rounded-2xl grad-brand shadow-glow animate-pulse text-white">
                  <Sparkles size={20} className="animate-spin-slow" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-gray-100">Generating Educational Mind Map...</h4>
                
                <div className="w-full bg-slate-100 dark:bg-gray-800 rounded-xl p-4 font-mono text-[10px] text-slate-500 space-y-2 text-left max-h-[220px] overflow-y-auto">
                  <div className="text-indigo-600 dark:text-indigo-400 font-semibold mb-1 flex items-center gap-1.5">
                    <Cpu size={12} className="animate-spin-slow" />
                    <span>AI Reasoning Trace:</span>
                  </div>
                  {genAiThoughts.map((thought, i) => (
                    <div key={i} className="flex gap-1.5 items-start animate-fade-up">
                      <span>▸</span>
                      <span>{thought}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
