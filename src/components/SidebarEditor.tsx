import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, Box, Trash2, Plus } from 'lucide-react';

interface SidebarEditorProps {
  selectedId: string | null;
  imgUrl: string | null;
  onImageChange: (newUrl: string) => void;
  onSelectCore: () => void;
  onSelectPool: () => void;
  imagePool: string[];
  onPoolAdd: (url: string) => void;
  onPoolRemove: (idx: number) => void;
}

export function SidebarEditor({ 
  selectedId, 
  imgUrl, 
  onImageChange, 
  onSelectCore,
  onSelectPool,
  imagePool,
  onPoolAdd,
  onPoolRemove
}: SidebarEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const poolFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(URL.createObjectURL(file));
    }
  };

  const handleUrlSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const url = formData.get('url') as string;
    if (url) {
      onImageChange(url);
    }
  };

  const handlePoolFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPoolAdd(URL.createObjectURL(file));
    }
  };

  const handlePoolUrlSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const url = formData.get('url') as string;
    if (url) {
      onPoolAdd(url);
      event.currentTarget.reset();
    }
  };

  const isCore = selectedId === 'core';
  const isPool = selectedId === 'pool';
  const isPanel = selectedId && selectedId.startsWith('panel');

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-800 text-zinc-100 p-6 overflow-y-auto">
      {/* Target Selector Tabs */}
      <div className="flex bg-zinc-800/50 p-1 rounded-lg mb-8 border border-zinc-800 overflow-hidden">
        <button
          onClick={onSelectCore}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
            isCore ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
          }`}
        >
          Core / 内核
        </button>
        <button
          onClick={onSelectPool}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
            isPool ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
          }`}
        >
          Pool / 图库
        </button>
        <button
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-default ${
            isPanel ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-500'
          }`}
        >
          {isPanel ? 'Panel / 切片' : 'Select Panel'}
        </button>
      </div>

      {!selectedId ? (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-8 text-center mt-12">
          <Box className="w-16 h-16 mb-4 opacity-20" />
          <h2 className="text-xl font-medium mb-2">No selection</h2>
          <p className="text-sm">Select the core, the pool, or a specific panel to edit.</p>
        </div>
      ) : isPool ? (
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Random Pool</h2>
            <p className="text-sm text-zinc-400">Total {imagePool.length} images</p>
          </div>

          {/* Pool Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6 border-b border-zinc-800 pb-6">
            {imagePool.map((url, i) => (
              <div key={i} className="relative aspect-video rounded-md overflow-hidden group bg-zinc-950 border border-zinc-800 border-solid">
                <img src={url} alt={`Pool item ${i}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => onPoolRemove(i)}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Pool Add */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-100 mb-2">Add New Image</h3>
            
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={poolFileInputRef}
                onChange={handlePoolFileChange}
              />
              <button
                onClick={() => poolFileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
              >
                <Plus className="w-4 h-4" /> Upload File
              </button>
            </div>

            <div className="flex items-center gap-4 text-zinc-600 text-xs">
              <div className="h-px bg-zinc-800 flex-1"></div>
              <span>OR</span>
              <div className="h-px bg-zinc-800 flex-1"></div>
            </div>

            <form onSubmit={handlePoolUrlSubmit} className="flex gap-2">
              <input
                name="url"
                type="url"
                placeholder="Image URL"
                className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-zinc-600"
              />
              <button
                type="submit"
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
              {isCore ? 'Core Editor' : `Panel Editor`}
            </h2>
            <p className="text-sm text-zinc-400">
              {isCore ? 'Customize the central spheres.' : `Editing panel ID: ${selectedId}`}
            </p>
          </div>

          {/* Preview Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Current Image</label>
            <div className="relative aspect-video bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
              {imgUrl ? (
                <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-zinc-800" />
              )}
            </div>
          </div>

          {/* Upload Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Replace Local Image</label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 px-4 rounded-lg font-medium transition-colors text-sm"
            >
              <Upload className="w-4 h-4" />
              Choose File
            </button>
          </div>

          <div className="flex items-center gap-4 text-zinc-600 text-sm">
            <div className="h-px bg-zinc-800 flex-1"></div>
            <span>OR</span>
            <div className="h-px bg-zinc-800 flex-1"></div>
          </div>

          {/* URL Section */}
          <form onSubmit={handleUrlSubmit} className="space-y-2">
            <label htmlFor="imageUrl" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">External Image URL</label>
            <div className="flex gap-2">
              <input
                id="imageUrl"
                name="url"
                type="url"
                placeholder="https://example.com/image.jpg"
                defaultValue={imgUrl?.startsWith('http') ? imgUrl : ''}
                className="flex-1 w-0 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-zinc-600"
              />
              <button
                type="submit"
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
