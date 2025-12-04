import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // 引入您的 StylePocket 核心組件
import './index.css'; // <<< 請新增這一行，導入 Tailwind CSS

// 此檔案是 React 專案的標準入口點。
// 它的職責是將 App 組件渲染到 index.html 中的 <div id="root"> 元素中。

const rootElement = document.getElementById('root');

if (rootElement) {
  // 使用 ReactDOM.createRoot 來啟動 React 18 應用程式
  ReactDOM.createRoot(rootElement).render(
    // React.StrictMode 用於開發時的額外檢查
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  // 如果找不到 root 元素，在控制台報錯
  console.error("無法在 index.html 中找到 <div id='root'> 元素，React 應用程式無法啟動。");
}

import React, { useState, useEffect, useMemo } from 'react';
import { Camera, ShoppingBag, PieChart, Plus, X, Search, Filter, CheckCircle, Circle, Tag, Shirt, ArrowRight, Sparkles } from 'lucide-react';

// --- 模擬數據與類型定義 ---

type StyleTag = '韓系' | '復古' | '極簡' | '歐美' | '日系' | 'Y2K' | '商務';
type ItemCategory = '上衣' | '下裝' | '外套' | '鞋子' | '配件';

interface Outfit {
  id: string;
  imageUrl: string;
  styleTags: StyleTag[];
  itemsDetected: string[]; // AI 偵測到的單品名稱
  date: string;
}

interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  category: ItemCategory;
  styleTags: StyleTag[]; // 繼承自靈感圖
  status: 'tobuy' | 'bought';
  link?: string;
}

// 預設模擬數據
const MOCK_OUTFITS: Outfit[] = [
  {
    id: '1',
    imageUrl: '/api/placeholder/400/500', // 使用 placeholder
    styleTags: ['韓系', '極簡'],
    itemsDetected: ['米色西裝外套', '白色T恤', '直筒牛仔褲'],
    date: '2023-10-01',
  },
  {
    id: '2',
    imageUrl: '/api/placeholder/400/501',
    styleTags: ['復古', '日系'],
    itemsDetected: ['格紋襯衫', '卡其寬褲', '帆布鞋'],
    date: '2023-10-05',
  },
  {
    id: '3',
    imageUrl: '/api/placeholder/400/502',
    styleTags: ['歐美', '街頭'],
    itemsDetected: ['皮衣', '短裙', '長靴'],
    date: '2023-10-12',
  },
];

const MOCK_SHOPPING_LIST: ShoppingItem[] = [
  { id: 's1', name: '米色西裝外套', price: 1580, category: '外套', styleTags: ['韓系', '極簡'], status: 'tobuy' },
  { id: 's2', name: '復古格紋襯衫', price: 890, category: '上衣', styleTags: ['復古'], status: 'tobuy' },
  { id: 's3', name: '高腰直筒褲', price: 1200, category: '下裝', styleTags: ['韓系'], status: 'bought' },
  { id: 's4', name: '銀色粗鏈條項鍊', price: 450, category: '配件', styleTags: ['歐美', '街頭'], status: 'tobuy' },
  { id: 's5', name: 'New Balance 530', price: 2800, category: '鞋子', styleTags: ['韓系', '復古'], status: 'tobuy' },
];

const ALL_STYLES: StyleTag[] = ['韓系', '復古', '極簡', '歐美', '日系', 'Y2K', '商務'];
const ALL_CATEGORIES: ItemCategory[] = ['上衣', '下裝', '外套', '鞋子', '配件'];

// --- 組件 ---

export default function StylePocket() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'shopping' | 'dashboard'>('gallery');
  const [outfits, setOutfits] = useState<Outfit[]>(MOCK_OUTFITS);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(MOCK_SHOPPING_LIST);
  
  // 模擬上傳狀態
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<'idle' | 'scanning' | 'result'>('idle');
  const [newOutfitTemp, setNewOutfitTemp] = useState<Outfit | null>(null);

  // --- 核心功能邏輯 ---

  // 1. 模擬 AI 上傳與分析
  const handleSimulateUpload = () => {
    setUploadStep('scanning');
    
    // 模擬 AI 處理延遲
    setTimeout(() => {
      // 隨機生成 AI 分析結果
      const randomStyles = ALL_STYLES.sort(() => 0.5 - Math.random()).slice(0, 2);
      const newOutfit: Outfit = {
        id: Date.now().toString(),
        imageUrl: `/api/placeholder/400/${500 + Math.floor(Math.random() * 50)}`,
        styleTags: randomStyles,
        itemsDetected: ['AI 偵測上衣', 'AI 偵測褲子'], // 簡化模擬
        date: new Date().toISOString().split('T')[0],
      };
      setNewOutfitTemp(newOutfit);
      setUploadStep('result');
    }, 2000);
  };

  const saveNewOutfit = () => {
    if (newOutfitTemp) {
      setOutfits([newOutfitTemp, ...outfits]);
      setUploadStep('idle');
      setNewOutfitTemp(null);
    }
  };

  const handleAddTag = (tag: StyleTag) => {
    if (newOutfitTemp && !newOutfitTemp.styleTags.includes(tag)) {
      setNewOutfitTemp({
        ...newOutfitTemp,
        styleTags: [...newOutfitTemp.styleTags, tag]
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (newOutfitTemp) {
      setNewOutfitTemp({
        ...newOutfitTemp,
        styleTags: newOutfitTemp.styleTags.filter(t => t !== tag)
      });
    }
  };

  // 2. 購物清單功能
  const toggleItemStatus = (id: string) => {
    setShoppingList(prev => prev.map(item => 
      item.id === id ? { ...item, status: item.status === 'tobuy' ? 'bought' : 'tobuy' } : item
    ));
  };

  // 3. 儀表板計算
  const styleStats = useMemo(() => {
    const stats: Record<string, number> = {};
    // 計算來源：穿搭庫 + 購物清單
    outfits.forEach(o => o.styleTags.forEach(tag => stats[tag] = (stats[tag] || 0) + 1));
    shoppingList.forEach(i => i.styleTags.forEach(tag => stats[tag] = (stats[tag] || 0) + 1));
    
    // 轉為陣列並排序
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [outfits, shoppingList]);


  // --- 畫面渲染 ---

  return (
    <div className="flex flex-col h-screen bg-stone-50 text-stone-800 font-sans">
      {/* 頂部導航 */}
      <header className="bg-white px-4 py-3 shadow-sm flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="bg-stone-900 text-white p-1.5 rounded-lg">
            <Shirt size={20} />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-stone-800">StylePocket</h1>
        </div>
        <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-xs font-bold text-stone-500">
          U
        </div>
      </header>

      {/* 主要內容區 - 可滾動 */}
      <main className="flex-1 overflow-y-auto pb-20">
        
        {/* === 頁面 1: 穿搭圖庫 (Gallery) === */}
        {activeTab === 'gallery' && (
          <div className="p-4 space-y-4">
            {/* 歡迎橫幅 */}
            <div className="bg-gradient-to-r from-stone-200 to-stone-100 p-4 rounded-2xl mb-2">
              <h2 className="font-bold text-lg mb-1">今天想穿什麼風格？</h2>
              <p className="text-sm text-stone-600">AI 已為您分析了 {outfits.length} 套穿搭</p>
            </div>

            {/* 穿搭瀑布流 */}
            <div className="grid grid-cols-2 gap-3">
              {outfits.map(outfit => (
                <div key={outfit.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-[3/4] bg-stone-200">
                    {/* 這裡模擬圖片顯示 */}
                    <div className="absolute inset-0 flex items-center justify-center text-stone-400 bg-stone-200">
                      <img src={outfit.imageUrl} alt="Outfit" className="w-full h-full object-cover" />
                    </div>
                    {/* 標籤浮層 */}
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="flex flex-wrap gap-1">
                        {outfit.styleTags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-stone-800 font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="flex justify-between items-center">
                       <span className="text-xs text-stone-500">{outfit.date}</span>
                       <button className="text-xs text-blue-600 font-medium" onClick={() => setActiveTab('shopping')}>
                         + 購物
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 底部空狀態佔位 */}
            <div className="h-10"></div>
          </div>
        )}

        {/* === 頁面 2: 購物清單 (Shopping) === */}
        {activeTab === 'shopping' && (
          <ShoppingListModule items={shoppingList} onToggle={toggleItemStatus} />
        )}

        {/* === 頁面 3: 儀表板 (Dashboard) === */}
        {activeTab === 'dashboard' && (
          <div className="p-4 space-y-6">
            <h2 className="text-2xl font-bold px-1">您的風格基因</h2>
            
            {/* 主要風格卡片 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg text-stone-700">風格佔比分析</h3>
                <PieChart size={20} className="text-stone-400" />
              </div>
              
              <div className="space-y-4">
                {styleStats.slice(0, 4).map((stat, index) => (
                  <div key={stat.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-stone-700">#{stat.name}</span>
                      <span className="text-stone-500">{stat.count} items</span>
                    </div>
                    <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          index === 0 ? 'bg-stone-800' : 
                          index === 1 ? 'bg-stone-500' : 
                          index === 2 ? 'bg-stone-400' : 'bg-stone-300'
                        }`}
                        style={{ width: `${(stat.count / (styleStats[0]?.count || 1)) * 80 + 20}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-stone-100">
                <p className="text-sm text-stone-500 leading-relaxed">
                  <Sparkles size={14} className="inline mr-1 text-yellow-500"/>
                  AI 分析洞察：您最近非常偏愛 <span className="font-bold text-stone-800">{styleStats[0]?.name}</span> 風格，建議在購物時多留意大地色系的單品。
                </p>
              </div>
            </div>

            {/* 預算卡片 */}
            <div className="bg-stone-800 text-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-semibold text-lg mb-2">本月購物預算</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold">$4,820</span>
                <span className="text-stone-400 text-sm mb-1">/ $10,000</span>
              </div>
              <div className="w-full bg-stone-600 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-white h-full w-[48%] rounded-full"></div>
              </div>
              <p className="text-xs text-stone-400 mt-2">還有 52% 的額度</p>
            </div>
          </div>
        )}

      </main>

      {/* 模擬上傳 Modal */}
      {uploadStep !== 'idle' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            {uploadStep === 'scanning' ? (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-stone-800" size={20} />
                </div>
                <h3 className="text-lg font-bold">AI 正在分析風格...</h3>
                <p className="text-sm text-stone-500">正在識別單品結構與色彩特徵</p>
              </div>
            ) : (
              // AI 分析結果頁面
              <div className="flex flex-col h-[80vh]">
                <div className="h-1/3 bg-stone-100 relative">
                   {newOutfitTemp && <img src={newOutfitTemp.imageUrl} className="w-full h-full object-cover" alt="Preview"/>}
                   <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">AI Detected</div>
                </div>
                <div className="flex-1 p-5 overflow-y-auto">
                  <h3 className="font-bold text-xl mb-1">分析完成！</h3>
                  <p className="text-sm text-stone-500 mb-4">我們發現這張照片屬於以下風格：</p>
                  
                  {/* 風格標籤編輯區 */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {newOutfitTemp?.styleTags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 bg-stone-800 text-white px-3 py-1.5 rounded-full text-sm">
                        #{tag}
                        <button onClick={() => handleRemoveTag(tag)}><X size={12}/></button>
                      </span>
                    ))}
                    {/* 模擬添加標籤 */}
                    <div className="relative group">
                       <button className="flex items-center gap-1 bg-stone-100 text-stone-500 border border-stone-200 px-3 py-1.5 rounded-full text-sm">
                         + 新增
                       </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-stone-700 mb-2">偵測到的單品 (點擊加入購物清單)</h4>
                  <div className="space-y-2">
                    {newOutfitTemp?.itemsDetected.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-100">
                        <span className="text-sm">{item}</span>
                        <button className="text-xs bg-white border border-stone-300 px-2 py-1 rounded shadow-sm">加入清單</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 border-t bg-white flex gap-3">
                  <button 
                    onClick={() => {setUploadStep('idle'); setNewOutfitTemp(null);}}
                    className="flex-1 py-3 text-stone-500 font-medium"
                  >
                    取消
                  </button>
                  <button 
                    onClick={saveNewOutfit}
                    className="flex-1 py-3 bg-stone-800 text-white rounded-xl font-bold shadow-lg shadow-stone-200"
                  >
                    儲存到衣櫥
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 浮動上傳按鈕 (只在 Gallery 顯示) */}
      {activeTab === 'gallery' && (
        <button 
          onClick={handleSimulateUpload}
          className="fixed bottom-24 right-5 w-14 h-14 bg-stone-900 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
        >
          <Camera size={24} />
        </button>
      )}

      {/* 底部導航欄 */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-stone-200 px-6 py-3 flex justify-between items-center z-40 safe-area-bottom">
        <NavButton 
          active={activeTab === 'gallery'} 
          onClick={() => setActiveTab('gallery')} 
          icon={<Shirt size={22} />} 
          label="穿搭庫" 
        />
        <NavButton 
          active={activeTab === 'shopping'} 
          onClick={() => setActiveTab('shopping')} 
          icon={<ShoppingBag size={22} />} 
          label="購物清單" 
        />
        <NavButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<PieChart size={22} />} 
          label="儀表板" 
        />
      </nav>
    </div>
  );
}

// --- 子組件 ---

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active ? 'text-stone-900' : 'text-stone-400'}`}>
      <div className={`p-1 rounded-xl transition-all ${active ? 'bg-stone-100 translate-y-[-2px]' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

// 購物清單模組 (含雙重分類邏輯)
function ShoppingListModule({ items, onToggle }: { items: ShoppingItem[], onToggle: (id: string) => void }) {
  const [viewMode, setViewMode] = useState<'category' | 'style'>('category');

  // 根據選擇的視圖模式進行分組
  const groupedItems = useMemo(() => {
    const groups: Record<string, ShoppingItem[]> = {};
    
    items.forEach(item => {
      if (viewMode === 'category') {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push(item);
      } else {
        // 風格視圖比較特殊，一個單品可能有多個風格，這裡簡化為歸類到第一個主要風格
        const mainStyle = item.styleTags[0] || '未分類';
        if (!groups[mainStyle]) groups[mainStyle] = [];
        groups[mainStyle].push(item);
      }
    });
    return groups;
  }, [items, viewMode]);

  return (
    <div className="flex flex-col h-full bg-stone-50">
      {/* 頂部切換器 */}
      <div className="bg-white p-2 shadow-sm z-20 sticky top-0">
        <div className="flex bg-stone-100 p-1 rounded-lg">
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'category' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500'}`}
            onClick={() => setViewMode('category')}
          >
            依商品類別
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'style' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500'}`}
            onClick={() => setViewMode('style')}
          >
            依風格靈感
          </button>
        </div>
      </div>

      {/* 列表內容 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(groupedItems).map(([groupTitle, groupItems]) => (
          <div key={groupTitle}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`h-2 w-2 rounded-full ${viewMode === 'style' ? 'bg-purple-400' : 'bg-stone-400'}`}></span>
              <h3 className="font-bold text-stone-600 text-sm tracking-wide">
                {viewMode === 'style' ? `#${groupTitle}` : groupTitle}
              </h3>
              <span className="text-xs text-stone-400 bg-stone-200 px-1.5 rounded-full">{groupItems.length}</span>
            </div>
            
            <div className="space-y-2">
              {groupItems.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => onToggle(item.id)}
                  className={`bg-white p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    item.status === 'bought' ? 'border-stone-100 opacity-60' : 'border-stone-200 shadow-sm hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.status === 'bought' ? 'bg-green-100 border-green-500 text-green-600' : 'border-stone-300'}`}>
                      {item.status === 'bought' && <CheckCircle size={14} />}
                    </div>
                    <div>
                      <h4 className={`text-sm font-medium ${item.status === 'bought' ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                        {item.name}
                      </h4>
                      <div className="flex gap-2 mt-1">
                        {/* 在類別視圖顯示風格標籤，反之亦然 */}
                        {viewMode === 'category' 
                          ? item.styleTags.map(t => <span key={t} className="text-[10px] bg-stone-100 text-stone-500 px-1.5 rounded">#{t}</span>)
                          : <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 rounded">{item.category}</span>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-sm text-stone-700">${item.price}</span>
                    {item.link && <ArrowRight size={14} className="ml-auto text-stone-300 mt-1" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-10 text-stone-400">
            清單是空的，去穿搭庫找找靈感吧！
          </div>
        )}
      </div>
    </div>
  );
}

