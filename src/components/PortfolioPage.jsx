import React from 'react';
import Chatbot from './Chatbot';

function PortfolioPage() {
  // 챗봇 이벤트 핸들러
  const handleUserMessage = (text, raw) => {
    console.log('👤 사용자 입력:', text);
  };

  const handleBotMessage = (text, raw) => {
    console.log('🤖 챗봇 응답:', text);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gray-50">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/interacivefile/VQFile/MainImg/VQ-Main-Title.png')`,
          filter: 'brightness(0.8)',
        }}
      />

      {/* 오버레이 */}
      <div className="absolute inset-0 bg-white bg-opacity-60" />

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* 헤더 */}
        <header className="flex justify-between items-center p-8">
          {/* 로고 */}
          <div className="flex items-center">
            <button
              onClick={() => (window.location.pathname = '/vq-main')}
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
              onClick={() => (window.location.pathname = '/company')}
              className="text-gray-700 hover:text-red-600 hover:font-bold transition-all duration-200 font-medium cursor-pointer"
            >
              회사소개
            </button>
            <button
              onClick={() => (window.location.pathname = '/contact')}
              className="text-gray-700 hover:text-red-600 hover:font-bold transition-all duration-200 font-medium cursor-pointer"
            >
              문의하기
            </button>
            <button
              onClick={() => (window.location.pathname = '/portfolio')}
              className="text-red-600 hover:text-red-600 hover:font-bold transition-all duration-200 font-medium cursor-pointer"
            >
              포트폴리오
            </button>
          </nav>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 flex items-center py-16">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">포트폴리오</h1>
              <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                VQ 스튜디오의 다양한 영상 제작 프로젝트를 확인해보세요.
              </p>
            </div>

            {/* 포트폴리오 카테고리 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  기업 홍보 영상
                </h3>
                <p className="text-gray-600 text-center">
                  기업의 브랜드 가치와 비전을 효과적으로 전달하는 홍보 영상
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  사회적 가치 영상
                </h3>
                <p className="text-gray-600 text-center">
                  사회적기업의 임팩트와 사회적 가치를 보여주는 영상
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">교육 영상</h3>
                <p className="text-gray-600 text-center">효과적인 학습을 위한 교육 콘텐츠 영상</p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">모션그래픽</h3>
                <p className="text-gray-600 text-center">창의적이고 역동적인 모션그래픽 영상</p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">3D VFX</h3>
                <p className="text-gray-600 text-center">현실적인 3D 효과와 VFX가 적용된 영상</p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  인터뷰 영상
                </h3>
                <p className="text-gray-600 text-center">전문적이고 감동적인 인터뷰 영상 제작</p>
              </div>
            </div>

            {/* CTA 섹션 */}
            <div className="text-center bg-white p-12 rounded-lg border border-gray-200 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">프로젝트 문의하기</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                관심 있는 프로젝트가 있으시거나 새로운 영상 제작을 원하시면 언제든지 연락주세요.
              </p>
              <div className="flex justify-center space-x-6">
                <button
                  onClick={() => (window.location.pathname = '/contact')}
                  className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors duration-200 shadow-lg"
                >
                  문의하기
                </button>
                <button
                  onClick={() => (window.location.pathname = '/catalog')}
                  className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-700 transition-colors duration-200 shadow-lg"
                >
                  E-카탈로그 보기
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 챗봇 컴포넌트 */}
      <Chatbot onUserMessage={handleUserMessage} onBotMessage={handleBotMessage} />
    </div>
  );
}

export default PortfolioPage;
