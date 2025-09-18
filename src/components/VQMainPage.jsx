import React from 'react';
import Chatbot from './Chatbot';
import mainImage from '../assets/main.jpg';

function VQMainPage() {
  // 네비게이션 핸들러
  const handleNavigation = (path) => {
    window.location.pathname = path;
  };

  // 챗봇 이벤트 핸들러
  const handleUserMessage = (text, raw) => {
    console.log('👤 사용자 입력:', text);
  };

  const handleBotMessage = (text, raw) => {
    console.log('🤖 챗봇 응답:', text);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-75 opacity-70"
        style={{
          backgroundImage: `url(${mainImage})`,
        }}
      />

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col h-full">
        {/* 헤더 */}
        <header className="flex justify-between items-center p-8 bg-white">
          {/* 로고 */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('/vq-main')}
              className="cursor-pointer hover:scale-105 hover:drop-shadow-lg hover:brightness-110 transition-all duration-200 p-2 -m-2"
            >
              <img
                src="/interacivefile/VQFile/MainImg/Main-Logo.png"
                alt="VQ Studio Logo"
                className="h-12 w-auto"
              />
            </button>
          </div>

          {/* 네비게이션 */}
          <nav className="flex space-x-8">
            <button
              onClick={() => handleNavigation('/company')}
              className="text-gray-700 hover:text-red-600 hover:font-bold transition-all duration-200 font-medium cursor-pointer"
            >
              회사소개
            </button>
            <button
              onClick={() => handleNavigation('/contact')}
              className="text-gray-700 hover:text-red-600 hover:font-bold transition-all duration-200 font-medium cursor-pointer"
            >
              문의하기
            </button>
            <button
              onClick={() => handleNavigation('/portfolio')}
              className="text-gray-700 hover:text-red-600 hover:font-bold transition-all duration-200 font-medium cursor-pointer"
            >
              포트폴리오
            </button>
          </nav>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 flex items-center">
          <div className="max-w-4xl mx-auto px-8">
            {/* 메인 텍스트 블록 */}
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-white leading-tight">브이큐스튜디오는</h1>

              <p className="text-2xl text-white leading-relaxed">
                여성기업, 사회적기업 수의계약이 가능한 영상제작 전문 기업입니다.
              </p>

              <p className="text-lg text-gray-100 leading-relaxed max-w-4xl">
                여성기업 영상제작 및 사회적기업 영상제작과 같은 공공기관과의 계약시 비용 추가 없이
                무제한 수정해드립니다.
              </p>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex space-x-6 mt-12">
              <button
                onClick={() => handleNavigation('/catalog')}
                className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors duration-200 shadow-lg"
              >
                E-카탈로그 보기
              </button>

              <button
                onClick={() => handleNavigation('/portfolio')}
                className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-700 transition-colors duration-200 shadow-lg"
              >
                포트폴리오 보기
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* 챗봇 컴포넌트 */}
      <Chatbot onUserMessage={handleUserMessage} onBotMessage={handleBotMessage} />
    </div>
  );
}

export default VQMainPage;
