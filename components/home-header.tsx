export default function HomeHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold text-black">CriptoMaxi Tracker</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/comunicacao-interna" className="text-sm text-gray-600 hover:text-black transition-colors">
              Comunicação Interna
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
