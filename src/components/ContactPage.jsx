import React, { useState } from 'react';
import Chatbot from './Chatbot';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('문의 폼 제출:', formData);
    alert('문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      message: '',
    });
  };

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
              className="text-red-600 hover:text-red-600 hover:font-bold transition-all duration-200 font-medium cursor-pointer"
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
        <main className="flex-1 flex items-center py-16">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">문의하기</h1>
              <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                영상 제작 문의나 상담이 필요하시면 언제든지 연락주세요. 빠른 시일 내에
                답변드리겠습니다.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* 문의 폼 */}
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">문의 폼</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        이름 *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        이메일 *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        회사명
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        연락처
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      문의 내용 *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="문의하실 내용을 자세히 적어주세요..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
                  >
                    문의하기
                  </button>
                </form>
              </div>

              {/* 연락처 정보 */}
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">연락처 정보</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">이메일</p>
                        <p className="text-gray-600">contact@vqstudio.com</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">전화</p>
                        <p className="text-gray-600">02-1234-5678</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">주소</p>
                        <p className="text-gray-600">서울특별시 강남구 테헤란로 123</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 자주 묻는 질문 */}
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">자주 묻는 질문</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Q. 영상 제작 기간은 얼마나 걸리나요?
                      </h3>
                      <p className="text-gray-600 text-sm">
                        A. 프로젝트 규모에 따라 다르지만, 일반적으로 2-4주 정도 소요됩니다.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Q. 수정 횟수에 제한이 있나요?
                      </h3>
                      <p className="text-gray-600 text-sm">
                        A. 공공기관과의 계약 시 무제한 수정이 가능합니다.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Q. 어떤 형태의 영상을 제작하나요?
                      </h3>
                      <p className="text-gray-600 text-sm">
                        A. 기업 홍보영상, 제품 소개영상, 교육영상 등 다양한 형태의 영상을
                        제작합니다.
                      </p>
                    </div>
                  </div>
                </div>
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

export default ContactPage;
