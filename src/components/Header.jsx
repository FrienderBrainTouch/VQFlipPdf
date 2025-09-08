import React from "react";

/**
 * 헤더 컴포넌트
 * 
 * 이 컴포넌트는 플립북 애플리케이션의 상단 헤더를 구현합니다.
 * 주요 기능:
 * - 현재 선택된 프로젝트 정보 표시
 * - 모든 해상도에서 모바일 스타일 적용
 */
function Header({ selectedBook }) {
  return (
    <header className="w-full px-6 py-8 flex flex-col items-center gap-4 bg-gradient-to-b from-[#0e1a26] to-transparent">
      {/* 모든 해상도에서 프로젝트 이름 중앙 표시 */}
      <div className="text-white text-3xl font-bold text-center drop-shadow-lg">
        {selectedBook === "friender" ? "Friender" : "VQ"}
      </div>
    </header>
  );
}

export default Header;
