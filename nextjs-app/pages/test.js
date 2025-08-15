import Head from 'next/head';

export default function Test() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Head>
        <title>Tailwind CSS 测试</title>
      </Head>

      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Tailwind CSS 测试</h1>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <span className="text-blue-700 font-medium">蓝色按钮</span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              点击
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <span className="text-green-700 font-medium">绿色按钮</span>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              点击
            </button>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-700 text-center">
              如果你能看到颜色和样式，说明 Tailwind CSS 工作正常！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}