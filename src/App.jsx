import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Book from './components/Book';
import VQBook from './components/VQBook';
import IntroScreen from './components/IntroScreen';
import Chatbot from './components/Chatbot';

/**
 * App
 * - URL 경로로 초기 화면 결정
 * - Header를 통한 라우팅 전환
 * - Chatbot에서 나오는 "이벤트" 응답/요청을 콜백으로 받아서 사용
 *   - onUserMessage: 사용자가 df-messenger에 입력했을 때
 *   - onBotMessage  : Dialogflow가 응답을 보냈을 때
 */
function App() {
  /** 대화 로그를 전역(최상단)에서 관리 */
  const [logs, setLogs] = useState([]);

  /** 최초 진입 시 URL에 따라 화면 분기 */
  const getInitialBookType = () => {
    const path = window.location.pathname;
    if (path === '/friender') return 'friender';
    if (path === '/vq') return 'vq';
    return 'intro';
  };

  /** 현재 화면 상태 */
  const [selectedBook, setSelectedBook] = useState(getInitialBookType());

  /** 화면(라우팅) 전환 핸들러 */
  const handleBookChange = (bookType) => {
    setSelectedBook(bookType);
    const newPath = bookType === 'intro' ? '/' : `/${bookType}`;
    window.history.pushState({}, '', newPath);
  };

  /**
   * [이벤트 콜백] 사용자가 메시지를 보냈을 때
   * - Chatbot 컴포넌트 내부에서 window/df-messenger의 df-request-sent 이벤트를 듣고
   *   → onUserMessage(text, raw)로 전달해줌
   */
  const handleUserMessage = (text, raw) => {
    // 예: 사용자가 "go vq"라고 입력하면 /vq로 이동
    if (text?.toLowerCase() === 'go vq') {
      handleBookChange('vq');
    }

    // 콘솔 확인 + 로그 누적
    console.log('👤 사용자 입력:', text);
    // 필요 시 원본 이벤트(detail) 전체 확인
    // console.log('🔍 User Raw:', raw);

    setLogs((prev) => [...prev, { role: 'user', text, raw }]);
  };

  /**
   * [이벤트 콜백] 봇이 응답을 보냈을 때
   * - Chatbot 컴포넌트 내부에서 window/df-messenger의 df-response-received 이벤트를 듣고
   *   → onBotMessage(text, raw)로 전달해줌
   */
  const handleBotMessage = (text, raw) => {
    // 콘솔 확인 (텍스트 / 원본)
    console.log('🤖 챗봇 응답:', text);
    // console.log('🔍 Bot Raw:', raw);

    // 예: 특정 인텐트/키워드에 따라 화면 전환/액션 수행 가능
    // const intentEs = raw?.queryResult?.intent?.displayName; // ES 예시
    // if (intentEs === 'GoToFriender') handleBookChange('friender');

    setLogs((prev) => [...prev, { role: 'bot', text, raw }]);
  };

  /**
   * (선택) logs가 갱신될 때마다 최신 상태를 보고 싶다면 useEffect로 출력
   * setLogs 직후에 logs를 console.log 하면 "이전 값"이 보일 수 있음에 주의!
   */
  useEffect(() => {
    // console.log('🧾 최신 로그 상태:', logs);
  }, [logs]);

  // Intro 화면에서는 챗봇을 띄우고, 이벤트만 받아서(응답만 가져와) 사용
  if (selectedBook === 'intro') {
    return (
      <div className="relative">
        <IntroScreen />

        {/* 
          Chatbot 컴포넌트 설명:
          - Messenger UI는 그대로 유지
          - 내부에서 df-messenger의 이벤트(df-request-sent/df-response-received)를 구독
          - 텍스트 응답/요청을 콜백으로 올려보냄(onUserMessage/onBotMessage)
        */}
        <Chatbot onUserMessage={handleUserMessage} onBotMessage={handleBotMessage} />

        {/*
        // (선택) 디버그 패널: 최근 로그 확인용
        <div
          style={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            background: '#fff',
            padding: 8,
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            fontSize: 12,
            maxWidth: 360,
            maxHeight: 200,
            overflow: 'auto',
            zIndex: 10000,
          }}
        >
          {logs.slice(-8).map((m, i) => (
            <div key={i}>
              <b>{m.role === 'user' ? '👤' : '🤖'}</b> {m.text}
            </div>
          ))}
        </div>
        */}
      </div>
    );
  }

  // 그 외 화면
  return (
    <div className="w-full min-h-screen bg-[#0e1a26]">
      <Header selectedBook={selectedBook} onBookChange={handleBookChange} />
      <div className="flex-1">{selectedBook === 'friender' ? <Book /> : <VQBook />}</div>

      {/*
      // 필요하다면 다른 화면에서도 챗봇 고정 노출 가능
      <Chatbot
        onUserMessage={handleUserMessage}
        onBotMessage={handleBotMessage}
      />
      */}
    </div>
  );
}

export default App;
