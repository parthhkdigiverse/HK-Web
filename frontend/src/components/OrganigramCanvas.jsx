import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const GRID_SIZE = 20;

export default function OrganigramCanvas({ 
  people = [], 
  onChange, 
  onSelectNode,
  selectedNodeName,
  isEditMode = false,
  isAddingNode = false,
  onNodeAdded
}) {
  const canvasRef = useRef(null);
  const [pan, setPan] = useState({ x: 100, y: 50 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [linkingSource, setLinkingSource] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Undo/Redo Stacks
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Handle pan drag start
  const handleMouseDown = (e) => {
    // Spacebar or middle click or right click triggers panning
    if (e.button === 1 || e.button === 2 || e.target === canvasRef.current || e.target.tagName === 'svg') {
      setIsPanning(true);
      setDragOffset({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const canvasX = (e.clientX - rect.left - pan.x) / zoom;
    const canvasY = (e.clientY - rect.top - pan.y) / zoom;
    setMousePos({ x: canvasX, y: canvasY });

    if (isPanning) {
      setPan({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    } else if (draggedNode && isEditMode) {
      const node = people.find(p => p.name === draggedNode);
      if (node) {
        let newX = canvasX - dragOffset.x;
        let newY = canvasY - dragOffset.y;

        // Snap to grid
        newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
        newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

        updateNodePosition(draggedNode, newX, newY);
      }
    }
  };

  const handleMouseUp = (e) => {
    if (isPanning) {
      setIsPanning(false);
    } else if (draggedNode) {
      setDraggedNode(null);
      saveStateToHistory();
    } else if (linkingSource) {
      // Find if we dropped on another node to set parent
      const clientX = e.clientX;
      const clientY = e.clientY;
      
      const targetElement = document.elementFromPoint(clientX, clientY);
      const cardElement = targetElement?.closest('[data-node-name]');
      const targetName = cardElement?.getAttribute('data-node-name');
      
      if (targetName && targetName !== linkingSource) {
        // Prevent cyclic parenting
        if (!isDescendant(linkingSource, targetName)) {
          changeParent(linkingSource, targetName);
        }
      }
      setLinkingSource(null);
    } else if (isAddingNode && onNodeAdded && canvasRef.current) {
      // Clicked to add new node
      const rect = canvasRef.current.getBoundingClientRect();
      const canvasX = Math.round(((e.clientX - rect.left - pan.x) / zoom) / GRID_SIZE) * GRID_SIZE;
      const canvasY = Math.round(((e.clientY - rect.top - pan.y) / zoom) / GRID_SIZE) * GRID_SIZE;
      onNodeAdded(canvasX, canvasY);
    }
  };

  // Helper to detect cyclic hierarchy
  const isDescendant = (parentName, childName) => {
    let current = people.find(p => p.name === childName);
    while (current && current.parent_id) {
      if (current.parent_id === parentName) return true;
      current = people.find(p => p.name === current.parent_id);
    }
    return false;
  };

  // Keyboard Shortcuts for Undo/Redo/Delete
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isEditMode) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        performUndo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        performRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeName) {
          // Avoid triggering when user is editing input fields
          if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            deleteNode(selectedNodeName);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [people, selectedNodeName, undoStack, redoStack]);

  const saveStateToHistory = () => {
    setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(people))]);
    setRedoStack([]);
  };

  const performUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(people))]);
    onChange(previous);
  };

  const performRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(people))]);
    onChange(next);
  };

  // Wheel Zoom handler
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    let newZoom = zoom;
    if (e.deltaY < 0) {
      newZoom = Math.min(zoom * zoomFactor, 2);
    } else {
      newZoom = Math.max(zoom / zoomFactor, 0.4);
    }
    setZoom(newZoom);
  };

  const updateNodePosition = (name, x, y) => {
    const nextPeople = people.map(p => {
      if (p.name === name) {
        return { ...p, x, y };
      }
      return p;
    });
    onChange(nextPeople);
  };

  const changeParent = (nodeName, newParentName) => {
    saveStateToHistory();
    const nextPeople = people.map(p => {
      if (p.name === nodeName) {
        return { ...p, parent_id: newParentName };
      }
      return p;
    });
    onChange(nextPeople);
  };

  const deleteNode = (name) => {
    saveStateToHistory();
    const nextPeople = people.filter(p => p.name !== name).map(p => {
      // If deleted node was a parent, orphan its children or set to null
      if (p.parent_id === name) {
        return { ...p, parent_id: null };
      }
      return p;
    });
    onChange(nextPeople);
    if (onSelectNode) onSelectNode(null);
  };

  const duplicateNode = (name) => {
    saveStateToHistory();
    const node = people.find(p => p.name === name);
    if (node) {
      const copy = {
        ...node,
        name: `${node.name} (Copy)`,
        x: (node.x || 100) + 40,
        y: (node.y || 100) + 40
      };
      onChange([...people, copy]);
    }
  };

  // Node Drag Start
  const startDrag = (e, name) => {
    if (!isEditMode) return;
    e.stopPropagation();
    const node = people.find(p => p.name === name);
    if (node) {
      setDraggedNode(name);
      const rect = canvasRef.current.getBoundingClientRect();
      const canvasX = (e.clientX - rect.left - pan.x) / zoom;
      const canvasY = (e.clientY - rect.top - pan.y) / zoom;
      setDragOffset({
        x: canvasX - (node.x || 0),
        y: canvasY - (node.y || 0)
      });
      if (onSelectNode) onSelectNode(node);
    }
  };

  // Helpers to get node coordinates or center offsets
  const getNodeCenter = (node) => {
    const width = 240;
    const height = 80;
    return {
      x: (node.x || 0) + width / 2,
      y: (node.y || 0) + height / 2
    };
  };

  // Fit View / Reset View
  const resetView = () => {
    setPan({ x: 100, y: 50 });
    setZoom(1);
  };

  return (
    <div 
      ref={canvasRef}
      className="relative w-full h-[650px] bg-black/60 rounded-3xl border border-white/5 overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)',
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
      />

      {/* Canvas Elements Wrapper */}
      <div 
        className="absolute inset-0 origin-top-left"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
      >
        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
          {people.map((p, idx) => {
            if (!p.parent_id) return null;
            const parent = people.find(parent => parent.name === p.parent_id);
            if (!parent) return null;

            const from = getNodeCenter(parent);
            const to = getNodeCenter(p);

            // Bézier path calculation
            const dy = to.y - from.y;
            const controlY1 = from.y + dy * 0.45;
            const controlY2 = from.y + dy * 0.55;
            const pathD = `M ${from.x} ${from.y} C ${from.x} ${controlY1}, ${to.x} ${controlY2}, ${to.x} ${to.y}`;

            return (
              <g key={idx}>
                {/* Glowing glow line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeOpacity="0.25"
                  className="blur-[2px]"
                />
                {/* Core line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  strokeOpacity="0.6"
                />
                {/* Flowing animated dot */}
                <circle r="3" fill="#ffffff">
                  <animateMotion dur="4s" repeatCount="indefinite" path={pathD} />
                </circle>
              </g>
            );
          })}

          {/* Render active connection line if linking */}
          {linkingSource && (
            <path
              d={`M ${getNodeCenter(people.find(p => p.name === linkingSource)).x} ${getNodeCenter(people.find(p => p.name === linkingSource)).y} L ${mousePos.x} ${mousePos.y}`}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}
        </svg>

        {/* Nodes Registry */}
        {people.map((node) => {
          const isSelected = selectedNodeName === node.name;
          const x = node.x || 100;
          const y = node.y || 100;

          return (
            <div
              key={node.name}
              data-node-name={node.name}
              className={`absolute w-[240px] h-[80px] p-3 rounded-2xl bg-neutral-900/90 border backdrop-blur-md flex items-center gap-3 transition-all cursor-pointer group ${isSelected ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] ring-2 ring-rose-500/20' : 'border-white/10 hover:border-white/20'}`}
              style={{ left: x, top: y }}
              onMouseDown={(e) => startDrag(e, node.name)}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectNode) onSelectNode(node);
              }}
            >
              {/* Profile Image */}
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-800 border border-white/5 flex-shrink-0">
                {node.image ? (
                  <img src={node.image} alt={node.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm">{node.icon || '👤'}</div>
                )}
              </div>

              {/* Node Details */}
              <div className="flex-1 min-w-0 text-left">
                <h4 className="font-bold text-xs text-white truncate">{node.name}</h4>
                <p className="text-[10px] text-neutral-400 truncate mt-0.5">{node.role}</p>
                <span className="inline-block px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-mono text-neutral-400 uppercase mt-1">
                  Level {node.level || 4}
                </span>
              </div>

              {/* Drag handles for linking parent-child */}
              {isEditMode && (
                <div 
                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center cursor-crosshair opacity-0 group-hover:opacity-100 transition-opacity"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setLinkingSource(node.name);
                  }}
                  title="Drag connection to parent node"
                >
                  <span className="text-[8px] text-white font-bold">+</span>
                </div>
              )}

              {/* Floating Toolbar inside preview canvas */}
              {isSelected && isEditMode && (
                <div 
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-black border border-white/10 rounded-lg p-1.5 flex gap-1 shadow-2xl z-50 pointer-events-auto"
                  onMouseDown={(e) => e.stopPropagation()} // Prevent node dragging on toolbar clicks
                >
                  <button 
                    onClick={() => duplicateNode(node.name)}
                    className="px-2 py-1 text-[9px] font-mono text-neutral-400 hover:text-white hover:bg-white/5 rounded border border-white/5"
                  >
                    Duplicate
                  </button>
                  <button 
                    onClick={() => changeParent(node.name, null)}
                    className="px-2 py-1 text-[9px] font-mono text-neutral-400 hover:text-white hover:bg-white/5 rounded border border-white/5"
                  >
                    Unlink Parent
                  </button>
                  <button 
                    onClick={() => deleteNode(node.name)}
                    className="px-2 py-1 text-[9px] font-mono text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded border border-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Canvas Control Panel (Bottom Left overlay) */}
      <div className="absolute bottom-4 left-4 bg-black/80 border border-white/10 rounded-xl p-2 flex items-center gap-2 z-30">
        <button 
          onClick={() => setZoom(z => Math.min(z + 0.1, 2))}
          className="w-7 h-7 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 flex items-center justify-center font-bold text-xs"
        >
          +
        </button>
        <span className="text-[10px] font-mono text-neutral-400 w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button 
          onClick={() => setZoom(z => Math.max(z - 0.1, 0.4))}
          className="w-7 h-7 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 flex items-center justify-center font-bold text-xs"
        >
          -
        </button>
        <button 
          onClick={resetView}
          className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white hover:bg-white/10 font-mono"
        >
          Reset View
        </button>
      </div>

      {/* Undo/Redo overlay */}
      {isEditMode && (
        <div className="absolute top-4 right-4 bg-black/80 border border-white/10 rounded-xl p-2 flex items-center gap-1 z-30">
          <button 
            disabled={undoStack.length === 0}
            onClick={performUndo}
            className={`px-2 py-1 text-[10px] font-mono rounded ${undoStack.length === 0 ? 'text-neutral-600 cursor-not-allowed' : 'text-neutral-300 hover:text-white hover:bg-white/5 border border-white/5'}`}
          >
            Undo (Ctrl+Z)
          </button>
          <button 
            disabled={redoStack.length === 0}
            onClick={performRedo}
            className={`px-2 py-1 text-[10px] font-mono rounded ${redoStack.length === 0 ? 'text-neutral-600 cursor-not-allowed' : 'text-neutral-300 hover:text-white hover:bg-white/5 border border-white/5'}`}
          >
            Redo (Ctrl+Y)
          </button>
        </div>
      )}
    </div>
  );
}
