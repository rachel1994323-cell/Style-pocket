import React, { useState, useEffect, useMemo } from 'react';
import { Camera, ShoppingBag, PieChart, Plus, X, Search, Filter, CheckCircle, Shirt, ArrowRight, Sparkles, Tag, LayoutDashboard, Grid3X3 } from 'lucide-react';

// --- 模擬數據與類型定義 ---

// 樣式標籤 (Style Tags)
const ALL_STYLES = ['韓系', '復古', '極簡', '歐美', '日系', 'Y2K', '商務'];
// 產品分類 (Item Categories)
const ALL_CATEGORIES = ['上衣', '下裝', '外套', '鞋子', '配件'];

// 界面類型定義 (為了保持程式碼結構清晰，雖然是 .jsx，我們仍使用類似 TypeScript 的概念在註釋中輔助理解)
/*
interface Outfit {
  id: string;
  imageUrl: string;
  styleTags: string[];
  itemsDetected: string[];
  date: string;
}

interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  category: string;
  styleTags: string[];
  status: 'tobuy' | 'bought';
  link?: string;
}
*/

// 預設模擬數據
const MOCK_OUTFITS = [
  {
    id: '1',
    // 使用預設佔位圖片，確保部署後也能顯示
    imageUrl: 'https://placehold.co/400x500/A0A0A0/ffffff?text=Outfit+1', 
    styleTags: ['韓系', '極簡'],
    itemsDetected: ['米色西裝外套', '白色T恤', '直筒牛仔褲'],
    date: '2023-10-01',
  },
  {
    id: '2',
    imageUrl: 'https://placehold.co/400x501/C0C0C0/333333?text=Outfit+2',
    styleTags: ['復古', '日系'],
    itemsDetected: ['格紋襯衫', '卡其寬褲', '帆布鞋'],
    date: '2023-10-05',
  },
  {
    id: '3',
    imageUrl: 'https://placehold.co/400x502/707070/eeeeee?text=Outfit+3',
    styleTags: ['歐美', '街頭'],
    itemsDetected: ['皮衣', '短裙', '長靴'],
    date: '2023-10-12',
  },
];

const MOCK_SHOPPING_LIST = [
  { id: 's1', name: '米色西裝外套', price: 1580, category: '外套', styleTags: ['韓系', '極簡'], status: 'tobuy' },
  { id: 's2', name: '復古格紋襯衫', price: 890, category: '上衣', styleTags: ['復古'], status: 'tobuy' },
  { id: 's3', name: '高腰直筒褲', price: 1200, category: '下裝', styleTags: ['韓系'], status: 'bought' },
  { id: 's4', name: '銀色粗鏈條項鍊', price: 450, category: '配件', styleTags: ['歐美', '街頭'], status: 'tobuy' },
  { id: 's5', name: 'New Balance 530', price: 2800, category: '鞋子', styleTags: ['韓系', '復古'], status: 'tobuy' },
];

// --- 組件 ---

export default function App() {
  const [activeTab, setActiveTab] = useState('gallery'); // 導航標籤狀態
  const [outfits, setOutfits] = useState(MOCK_OUTFITS); // 穿搭庫
  const [shoppingList, setShoppingList] = useState(MOCK_SHOPPING_LIST); // 購物清單
  
  // 模擬上傳/AI分析的 Modal 狀態
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState('idle'); // 'idle' | 'scanning' | 'result'
  const [newOutfitTemp, setNewOutfitTemp] = useState(null); // 暫存的新穿搭數據

  // --- 核心功能邏輯 ---

  // 1. 模擬 AI 上傳與分析
  const handleSimulateUpload = () => {
    setUploadStep('scanning');
    
    // 模擬 AI 處理延遲 (2秒)
    setTimeout(() => {
      // 隨機生成 AI 分析結果
      const randomStyles = ALL_STYLES.sort(() => 0.5 - Math.random()).slice(0, 2);
      const newOutfit = {
        id: Date.now().toString(),
        imageUrl: `https://placehold.co/400x500/404040/ffffff?text=AI+Outfit+${Math.floor(Math.random() * 99)}`,
        styleTags: randomStyles,
        itemsDetected: ['AI 偵測到-上衣', 'AI 偵測到-褲子', 'AI 偵測到-鞋子'], // 簡化模擬單品
        date: new Date().toISOString().split('T')[0],
      };
      setNewOutfitTemp(newOutfit);
      setUploadStep('result');
    }, 2000);
  };

  const saveNewOutfit = () => {
    if (newOutfitTemp) {
      // 將新的穿搭圖片加入穿搭庫
      setOutfits([newOutfitTemp, ...outfits]); 
      setUploadStep('idle');
      setNewOutfitTemp(null);
    }
  };
  
  // 2. 購物清單功能：新增單品到清單 (從 AI 偵測結果加入)
  const handleAddItemToShoppingList = (item, styleTags) => {
    const newItem = {
      id: `s${Date.now()}`,
      name: item,
      price: Math.floor(Math.random() * 2000) + 300, // 隨機價格
      category: ALL_CATEGORIES[Math.floor(Math.random() * ALL_CATEGORIES.length)], // 隨機分類
      styleTags: styleTags,
      status: 'tobuy',
    };
    setShoppingList(prev => [newItem, ...prev]);
    // 提示用戶已加入 (用 console 代替 alert)
    console.log(`已將 ${item} 加入購物清單`);
  };

  // 3. 購物清單功能：切換狀態 (待購/已購)
  const toggleItemStatus = (id) => {
    setShoppingList(prev => prev.map(item => 
      item.id === id ? { ...item, status: item.status === 'tobuy' ? 'bought' : 'tobuy' } : item
    ));
  };

  // 4. 儀表板計算：風格統計
  const styleStats = useMemo(() => {
    const stats = {};
    // 計算來源：穿搭庫 (Outfits)
    outfits.forEach(o => o.styleTags.forEach(tag => stats[tag] = (stats[tag] || 0) + 1));
    // 計算來源：購物清單 (Shopping List)
    shoppingList.forEach(i => i.styleTags.forEach(tag => stats[tag] = (stats[tag] || 0) + 1));
    
    // 轉為陣列並排序
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [outfits, shoppingList]);
  
  // 計算待購清單總價
  const totalToBuy = useMemo(() => {
    return shoppingList
      .filter(item => item.status === 'tobuy')
      .reduce((sum, item) => sum + item.price, 0);
  }, [shoppingList]);


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
              <h2 className="font-bold text-lg mb-1">您的專屬風格衣櫥</h2>
              <p className="text-sm text-stone-600">AI 已為您分析了 {outfits.length} 套穿搭</p>
            </div>

            {/* 穿搭瀑布流 */}
            <div className="grid grid-cols-2 gap-3">
              {outfits.map(outfit => (
                <div key={outfit.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="relative aspect-[3/4] bg-stone-200">
                    {/* 圖片顯示 */}
                    <img src={outfit.imageUrl} alt="Outfit" className="w-full h-full object-cover" />
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
                  <div className="p-2 flex justify-between items-center">
                       <span className="text-xs text-stone-500">{outfit.date}</span>
                       <button 
                         className="text-xs text-blue-600 font-medium hover:text-blue-700" 
                         onClick={() => setActiveTab('shopping')}
                       >
                         查看單品 &rarr;
                       </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === 頁面 2: 購物清單 (Shopping) === */}
        {activeTab === 'shopping' && (
          <ShoppingListModule items={shoppingList} onToggle={toggleItemStatus} />
        )}

        {/* === 頁面 3: 儀表板 (Dashboard) === */}
        {activeTab === 'dashboard' && (
          <DashboardModule styleStats={styleStats} totalToBuy={totalToBuy} />
        )}

      </main>

      {/* 模擬上傳 Modal (覆蓋整個畫面) */}
      {uploadStep !== 'idle' && (
        <UploadModal 
          uploadStep={uploadStep} 
          newOutfitTemp={newOutfitTemp} 
          setNewOutfitTemp={setNewOutfitTemp} 
          saveNewOutfit={saveNewOutfit}
          setUploadStep={setUploadStep}
          handleAddItemToShoppingList={handleAddItemToShoppingList}
        />
      )}

      {/* 浮動上傳按鈕 (只在 Gallery 顯示) */}
      {activeTab === 'gallery' && (
        <button 
          onClick={handleSimulateUpload}
          className="fixed bottom-24 right-5 w-14 h-14 bg-stone-900 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform active:scale-95 z-30"
        >
          <Camera size={24} />
        </button>
      )}

      {/* 底部導航欄 */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-stone-200 px-6 py-3 flex justify-around items-center z-40">
        <NavButton 
          active={activeTab === 'gallery'} 
          onClick={() => setActiveTab('gallery')} 
          icon={<Grid3X3 size={22} />} 
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
          icon={<LayoutDashboard size={22} />} 
          label="儀表板" 
        />
      </nav>
    </div>
  );
}

// --- 子組件：導航按鈕 ---

function NavButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active ? 'text-stone-900' : 'text-stone-400'}`}>
      <div className={`p-1 rounded-xl transition-all ${active ? 'bg-stone-100 translate-y-[-2px]' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

// --- 子組件：購物清單模組 (含雙重分類邏輯) ---

function ShoppingListModule({ items, onToggle }) {
  // 雙重分類狀態: 'category' (類別) vs. 'style' (風格)
  const [viewMode, setViewMode] = useState('category'); 

  // 根據選擇的視圖模式進行分組
  const groupedItems = useMemo(() => {
    const groups = {};
    
    items.forEach(item => {
      let groupKey;
      if (viewMode === 'category') {
        groupKey = item.category;
      } else {
        // 風格視圖：以第一個標籤作為主要分類
        groupKey = item.styleTags[0] || '未分類';
      }
      
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
    });
    
    // 將 'tobuy' 的項目排在前面
    const sortedGroups = {};
    Object.keys(groups).forEach(key => {
      sortedGroups[key] = groups[key].sort((a, b) => {
        if (a.status === 'tobuy' && b.status === 'bought') return -1;
        if (a.status === 'bought' && b.status === 'tobuy') return 1;
        return 0;
      });
    });

    return sortedGroups;
  }, [items, viewMode]);

  return (
    <div className="flex flex-col h-full bg-stone-50">
      {/* 頂部切換器 (雙重分類切換) */}
      <div className="bg-white p-3 shadow-md z-20 sticky top-0">
        <h2 className="text-2xl font-bold mb-3 text-stone-800">智慧購物清單</h2>
        <div className="flex bg-stone-100 p-1 rounded-xl">
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${viewMode === 'category' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500'}`}
            onClick={() => setViewMode('category')}
          >
            <Shirt size={16} className="inline mr-1"/> 依商品類別
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${viewMode === 'style' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500'}`}
            onClick={() => setViewMode('style')}
          >
            <Tag size={16} className="inline mr-1"/> 依風格靈感
          </button>
        </div>
      </div>

      {/* 列表內容 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(groupedItems).map(([groupTitle, groupItems]) => (
          <div key={groupTitle}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`h-2 w-2 rounded-full ${viewMode === 'style' ? 'bg-purple-500' : 'bg-stone-500'}`}></span>
              <h3 className="font-bold text-stone-700 text-sm tracking-wide">
                {groupTitle} ({groupItems.filter(i => i.status === 'tobuy').length} 待購)
              </h3>
            </div>
            
            <div className="space-y-2">
              {groupItems.map(item => (
                <div 
                  key={item.id} 
                  className={`bg-white p-3 rounded-xl border transition-all flex items-center justify-between ${
                    item.status === 'bought' ? 'border-green-200 opacity-70 bg-green-50/50' : 'border-stone-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 w-4/5" onClick={() => onToggle(item.id)}>
                    {/* 狀態圖標 (點擊切換) */}
                    <button className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${item.status === 'bought' ? 'bg-green-500 border-green-500 text-white' : 'border-stone-300'}`}>
                      {item.status === 'bought' ? <CheckCircle size={14} /> : null}
                    </button>
                    <div>
                      <h4 className={`text-sm font-medium leading-tight ${item.status === 'bought' ? 'line-through text-stone-500' : 'text-stone-800'}`}>
                        {item.name}
                      </h4>
                      {/* 顯示互補標籤 */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {viewMode === 'category' 
                          ? item.styleTags.map(t => <span key={t} className="text-[10px] bg-stone-100 text-stone-500 px-1.5 rounded-full">#{t}</span>)
                          : <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 rounded-full">{item.category}</span>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`block font-bold text-sm ${item.status === 'bought' ? 'text-stone-400' : 'text-red-600'}`}>
                      ${item.price.toLocaleString()}
                    </span>
                    <ArrowRight size={14} className="ml-auto text-stone-300 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-10 text-stone-400">
            清單是空的，去穿搭庫找找靈感或點擊 "+" 號新增吧！
          </div>
        )}
      </div>
    </div>
  );
}

// --- 子組件：儀表板模組 ---

function DashboardModule({ styleStats, totalToBuy }) {
    
    const maxCount = styleStats.length > 0 ? styleStats[0].count : 1;
    const topStyle = styleStats[0]?.name || '尚無數據';

    return (
        <div className="p-4 space-y-6">
            <h2 className="text-2xl font-bold px-1 mb-4">風格儀表板</h2>
            
            {/* 待購預算卡片 */}
            <div className="bg-stone-800 text-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-semibold text-lg mb-2">待購清單總金額</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold">${totalToBuy.toLocaleString()}</span>
                <span className="text-stone-400 text-sm mb-1"> (待購項目總價)</span>
              </div>
              <div className="w-full bg-stone-600 h-1.5 rounded-full overflow-hidden">
                 <div 
                   className="bg-white h-full rounded-full transition-all duration-700"
                   style={{ width: `${Math.min(totalToBuy / 5000 * 100, 100)}%` }} // 假設預算上限為 5000
                 ></div>
              </div>
              <p className="text-xs text-stone-400 mt-2">
                {totalToBuy > 5000 ? '已超出預算警戒線！' : `預算健康，還有額度可以買！`}
              </p>
            </div>

            {/* 風格佔比分析卡片 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-xl text-stone-800">風格基因佔比</h3>
                <Sparkles size={24} className="text-yellow-500" />
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
                        className={`h-full rounded-full transition-all duration-700 ${
                          index === 0 ? 'bg-stone-800' : 
                          index === 1 ? 'bg-stone-500' : 
                          index === 2 ? 'bg-stone-400' : 'bg-stone-300'
                        }`}
                        style={{ width: `${(stat.count / maxCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-stone-100">
                <p className="text-sm text-stone-500 leading-relaxed">
                  <Tag size={14} className="inline mr-1 text-purple-500"/>
                  **風格洞察：** 目前您最核心的風格是 <span className="font-bold text-stone-800">{topStyle}</span>，佔據了 {maxCount} 個項目。
                </p>
              </div>
            </div>
        </div>
    );
}

// --- 子組件：上傳/AI分析 Modal ---

function UploadModal({ uploadStep, newOutfitTemp, setNewOutfitTemp, saveNewOutfit, setUploadStep, handleAddItemToShoppingList }) {
  
  // 模擬標籤操作
  const handleToggleTag = (tag) => {
    if (newOutfitTemp) {
      const isSelected = newOutfitTemp.styleTags.includes(tag);
      setNewOutfitTemp({
        ...newOutfitTemp,
        styleTags: isSelected 
          ? newOutfitTemp.styleTags.filter(t => t !== tag) 
          : [...newOutfitTemp.styleTags, tag]
      });
    }
  };

  const allStylesMinusSelected = ALL_STYLES.filter(tag => !newOutfitTemp?.styleTags.includes(tag));

  // 渲染不同的步驟畫面
  const renderContent = () => {
    if (uploadStep === 'scanning') {
      return (
        <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-stone-800" size={20} />
          </div>
          <h3 className="text-lg font-bold">AI 正在分析風格...</h3>
          <p className="text-sm text-stone-500">正在識別單品結構與色彩特徵</p>
        </div>
      );
    }

    if (uploadStep === 'result' && newOutfitTemp) {
      return (
        <div className="flex flex-col h-[90vh] max-h-[600px] w-full">
          <div className="h-1/3 bg-stone-100 relative">
             <img src={newOutfitTemp.imageUrl} className="w-full h-full object-cover" alt="Preview"/>
             <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                 <Sparkles size={12}/> AI 智慧分析
             </div>
          </div>
          <div className="flex-1 p-5 overflow-y-auto">
            <h3 className="font-bold text-xl mb-1">分析完成！</h3>
            <p className="text-sm text-stone-500 mb-4">請確認/修改系統偵測到的風格標籤：</p>
            
            {/* 風格標籤編輯區 (已選標籤) */}
            <div className="flex flex-wrap gap-2 mb-4">
              {newOutfitTemp.styleTags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-stone-800 text-white px-3 py-1.5 rounded-full text-sm">
                  #{tag}
                  <button onClick={() => handleToggleTag(tag)}><X size={12}/></button>
                </span>
              ))}
              {/* 可選標籤 */}
              {allStylesMinusSelected.map(tag => (
                <button 
                  key={tag} 
                  onClick={() => handleToggleTag(tag)}
                  className="flex items-center gap-1 bg-stone-100 text-stone-500 border border-stone-200 px-3 py-1.5 rounded-full text-sm hover:bg-stone-200"
                >
                  + {tag}
                </button>
              ))}
            </div>

            <h4 className="font-bold text-sm text-stone-700 mb-2 mt-4 border-t pt-4">AI 偵測到的單品</h4>
            <div className="space-y-2">
              {newOutfitTemp.itemsDetected.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100 shadow-sm">
                  <span className="text-sm font-medium">{item}</span>
                  <button 
                    onClick={() => handleAddItemToShoppingList(item, newOutfitTemp.styleTags)}
                    className="text-xs bg-white text-blue-600 border border-blue-200 px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
                  >
                    + 加入清單
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t bg-white flex gap-3 flex-shrink-0">
            <button 
              onClick={() => {setUploadStep('idle'); setNewOutfitTemp(null);}}
              className="flex-1 py-3 text-stone-500 font-medium rounded-xl border border-stone-200"
            >
              取消
            </button>
            <button 
              onClick={saveNewOutfit}
              className="flex-1 py-3 bg-stone-800 text-white rounded-xl font-bold shadow-lg shadow-stone-300 hover:bg-stone-700 transition-colors"
            >
              儲存到穿搭庫
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {renderContent()}
      </div>
    </div>
  );
}

