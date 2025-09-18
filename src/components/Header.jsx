import React from 'react';

function Header({ selectedBook }) {
  return (
    <header className="w-full px-6 py-8 flex flex-col items-center gap-4 bg-gradient-to-b from-[#0e1a26] to-transparent">
      {/* 모든 해상도에서 프로젝트 이름 중앙 표시 */}
      <div className="text-white text-3xl font-bold text-center drop-shadow-lg">
        {selectedBook === 'friender' ? 'Friender' : 'VQ'}
      </div>
    </header>
  );
}

export default Header;
