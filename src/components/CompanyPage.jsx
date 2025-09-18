import React from 'react';
import Chatbot from './Chatbot';

function CompanyPage() {
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
              className="text-red-600 hover:text-red-600 hover:font-bold transition-all duration-200 font-medium cursor-pointer"
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
              className="text-gray-700 hover:text-red-600 hover:font-bold transition-all duration-200 font-medium cursor-pointer"
            >
              포트폴리오
            </button>
          </nav>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 flex items-center">
          <div className="max-w-6xl mx-auto px-8">
            {/* 회사 개요 */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-900 mb-6">회사소개</h1>
                <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                  VQ 스튜디오는 여성기업, 사회적기업 수의계약이 가능한 영상제작 전문 기업입니다.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-6">우리의 비전</h2>
                  <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                    VQ 스튜디오는 창의적이고 혁신적인 영상 콘텐츠를 통해 고객의 브랜드 가치를
                    극대화하는 것을 목표로 합니다. 특히 여성기업과 사회적기업의 성장을 지원하며,
                    공공기관과의 협력을 통해 사회적 가치를 창출하고 있습니다.
                  </p>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    우리는 고품질의 영상 제작 서비스와 함께 무제한 수정 서비스를 제공하여 고객이
                    완벽한 결과물을 얻을 수 있도록 최선을 다하고 있습니다.
                  </p>
                </div>
                <div className="bg-white rounded-lg h-80 flex items-center justify-center border border-gray-300 shadow-lg">
                  <span className="text-gray-500">회사 이미지 영역</span>
                </div>
              </div>
            </section>

            {/* 주요 서비스 */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">주요 서비스</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">기업 홍보 영상</h3>
                  <p className="text-gray-600">
                    기업의 브랜드 가치와 비전을 효과적으로 전달하는 홍보 영상을 제작합니다.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">사회적 가치 영상</h3>
                  <p className="text-gray-600">
                    사회적기업의 임팩트와 사회적 가치를 보여주는 영상을 제작합니다.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">무제한 수정 서비스</h3>
                  <p className="text-gray-600">
                    공공기관과의 계약 시 비용 추가 없이 무제한 수정 서비스를 제공합니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 팀 소개 */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">우리 팀</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center border border-gray-300 shadow-lg">
                      <span className="text-gray-500">팀원 {i}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">팀원 {i}</h3>
                    <p className="text-gray-600">영상 제작 전문가</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* 챗봇 컴포넌트 */}
      <Chatbot onUserMessage={handleUserMessage} onBotMessage={handleBotMessage} />
    </div>
  );
}

export default CompanyPage;
