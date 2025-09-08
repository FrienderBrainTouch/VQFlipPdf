import React, { useState } from "react";
import Header from "./components/Header";
import Book from "./components/Book";
import VQBook from "./components/VQBook";
import IntroScreen from "./components/IntroScreen";

/**
 * 메인 애플리케이션 컴포넌트
 * 
 * 이 컴포넌트는 플립북 애플리케이션의 루트 컴포넌트입니다.
 * 주요 기능:
 * - Friender와 VQ 프로젝트 간 전환 관리
 * - 헤더와 플립북 컴포넌트 렌더링
 * - 전역 상태 관리
 */
function App() {
  // URL 경로에서 책 타입을 읽어오거나 기본값 사용
  const getInitialBookType = () => {
    const path = window.location.pathname;
    
    // 경로에 따라 다른 컴포넌트 반환
    if (path === '/friender') {
      return 'friender';
    } else if (path === '/vq') {
      return 'vq';
    } else {
      // 기본 경로(/)는 IntroScreen 표시
      return 'intro';
    }
  };

  // 현재 선택된 책 상태
  const [selectedBook, setSelectedBook] = useState(getInitialBookType());

  /**
   * 책 변경 핸들러
   * 사용자가 다른 프로젝트를 선택할 때 호출
   * @param {string} bookType - 선택된 책 타입 ("friender", "vq", "intro")
   */
  const handleBookChange = (bookType) => {
    setSelectedBook(bookType);
    
    // URL 경로 업데이트
    const newPath = bookType === 'intro' ? '/' : `/${bookType}`;
    window.history.pushState({}, '', newPath);
  };

  // IntroScreen인 경우 별도 렌더링
  if (selectedBook === 'intro') {
    return <IntroScreen />;
  }

  return (
    <div className="w-full min-h-screen bg-[#0e1a26]">
      {/* 헤더 컴포넌트 */}
      <Header selectedBook={selectedBook} onBookChange={handleBookChange} />
      
      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1">
        {/* 선택된 책에 따라 적절한 플립북 컴포넌트 렌더링 */}
        {selectedBook === "friender" ? <Book /> : <VQBook />}
      </div>
    </div>
  );
}

export default App;
