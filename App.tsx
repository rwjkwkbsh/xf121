
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Send, 
  History, 
  Printer, 
  Layers, 
  Maximize, 
  Hammer, 
  Settings, 
  AlertTriangle,
  ChevronRight,
  Trash2,
  Package,
  Cpu
} from 'lucide-react';
import { generateDesignScheme } from './services/geminiService';
import { DesignScheme, HistoryItem } from './types';
import { Button } from './components/Button';
import { Card } from './components/Card';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [scheme, setScheme] = useState<DesignScheme | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('3d_phantasm_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (newScheme: DesignScheme, currentPrompt: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      prompt: currentPrompt,
      scheme: newScheme
    };
    const updatedHistory = [newItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('3d_phantasm_history', JSON.stringify(updatedHistory));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await generateDesignScheme(prompt);
      setScheme(result);
      saveToHistory(result, prompt);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('3d_phantasm_history');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <header className="mb-12 text-center relative">
        <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 mb-4 animate-pulse">
          <Cpu size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">AI Core Active</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent mb-4">
          3D幻境 - 设计助理
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          输入您的想法，由 AI 为您打造符合 FDM 工业标准的打印方案。
          <span className="block text-sm mt-2 text-slate-500">喷嘴 0.4mm | 层高 0.2mm | 极简支撑优化</span>
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input & History */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl shadow-xl">
            <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Box size={18} className="text-blue-400" />
              客户需求描述
            </label>
            <textarea
              className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 resize-none"
              placeholder="例如：一个带有齿轮咬合机制的朋克风格名片夹，要求不需要支撑，可以直接整体打印。"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button 
              className="w-full mt-4 py-4 text-lg" 
              onClick={handleGenerate} 
              isLoading={loading}
              disabled={!prompt.trim()}
            >
              <Send size={20} />
              生成设计方案
            </Button>
            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 text-red-400 text-sm rounded-lg flex items-center gap-2">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}
          </div>

          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <History size={16} />
                历史记录
              </h2>
              {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                  title="清空历史"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-slate-600 text-center py-8 text-sm italic">暂无历史记录</p>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setScheme(item.scheme);
                      setPrompt(item.prompt);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-900 group transition-all"
                  >
                    <div className="text-xs text-slate-500 mb-1">{new Date(item.timestamp).toLocaleString()}</div>
                    <div className="text-sm text-slate-300 line-clamp-2 group-hover:text-blue-300 transition-colors">
                      {item.prompt}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8">
          {!scheme && !loading ? (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-3xl p-12 text-center text-slate-500 space-y-6">
              <div className="p-6 bg-slate-800 rounded-full">
                <Printer size={64} className="opacity-20" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-400 mb-2">等待指令输入</h3>
                <p className="max-w-xs mx-auto">请在左侧输入您的 3D 打印模型需求，AI 助手将为您提供完整的工业级设计方案。</p>
              </div>
            </div>
          ) : (
            <div className={`space-y-6 transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              <div className="flex flex-col md:flex-row gap-6">
                <Card title="模型风格" icon={<Package size={18}/>} className="flex-1">
                  {scheme?.style}
                </Card>
                <Card title="建议尺寸" icon={<Maximize size={18}/>} className="flex-1">
                  {scheme?.dimensions}
                </Card>
              </div>

              <Card title="打印友好设计说明" icon={<Printer size={18}/>}>
                {scheme?.friendlyDesign}
              </Card>

              <Card title="建模关键点" icon={<Hammer size={18}/>}>
                {scheme?.modelingKeys}
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="打印参数建议" icon={<Settings size={18}/>} className="border-cyan-500/30">
                  <div className="space-y-2">
                    {scheme?.printParams.split('\n').map((line, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <ChevronRight size={14} className="mt-1 text-cyan-400 shrink-0" />
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card title="失败风险提示" icon={<AlertTriangle size={18}/>} className="border-red-500/30">
                  <div className="space-y-2 text-red-200">
                    {scheme?.failureRisks.split('\n').map((line, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Action for the user */}
              <div className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 p-6 rounded-2xl border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-slate-300">
                  <Layers className="text-blue-400" />
                  <div>
                    <h4 className="font-bold">方案已就绪</h4>
                    <p className="text-sm opacity-70">该方案已针对 0.4mm 喷嘴进行壁厚补偿计算。</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => window.print()} className="bg-white/5">
                  导出 PDF 报告
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} 3D幻境 - 数字化增材制造实验室. All Rights Reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <span className="flex items-center gap-1"><Layers size={14} /> FDM 优化</span>
          <span className="flex items-center gap-1"><Cpu size={14} /> AI 驱动设计</span>
          <span className="flex items-center gap-1"><Box size={14} /> 模块化建模</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
