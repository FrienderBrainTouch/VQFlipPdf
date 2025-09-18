import React, { useEffect, useRef } from 'react';
import { useDfMessenger } from '../hooks/useDfMessenger';

function Chatbot({ onBotMessage, onUserMessage }) {
  const dfMessengerRef = useRef(null);

  /** 1) df-messenger CSS/Script 로드 (중복 방지) */
  useEffect(() => {
    if (!document.querySelector('link[href*="df-messenger-default.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href =
        'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css';
      document.head.appendChild(link);
    }

    if (!document.querySelector('script[src*="df-messenger.js"]')) {
      const script = document.createElement('script');
      script.src =
        'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  /** 2) (선택) 디버그 이벤트 로깅: 필요할 때만 true 로 켜세요 */
  useEffect(() => {
    const DEBUG = false; // <- 필요할 때만 true
    if (!DEBUG) return;

    let remove = () => {};
    const attachDebug = async () => {
      try {
        if (window.customElements?.whenDefined) {
          await customElements.whenDefined('df-messenger');
        }
      } catch (_) {}

      const el = dfMessengerRef.current || document.querySelector('df-messenger');
      if (!el) {
        console.warn('[DF] df-messenger not found for debug; retrying...');
        const id = setTimeout(attachDebug, 300);
        remove = () => clearTimeout(id);
        return;
      }

      const log = (label) => (e) => {
        const d = e.detail;
        const cxTexts = Array.isArray(d?.data?.messages)
          ? d.data.messages.flatMap((m) => (Array.isArray(m?.text?.text) ? m.text.text : []))
          : [];
        const esTexts = Array.isArray(d?.queryResult?.responseMessages)
          ? d.queryResult.responseMessages.flatMap((m) =>
              Array.isArray(m?.text?.text) ? m.text.text : []
            )
          : [];
        const texts = cxTexts.length ? cxTexts : esTexts;

        console.group(`[DF:${label}] ${e.type}`);
        console.log('detail:', d);
        if (texts.length) console.log('texts:', texts);
        console.groupEnd();
      };

      const onReq = log('REQ');
      const onRes = log('RES');
      const onLoaded = log('SYS');
      const onOpen = log('SYS');
      const onClose = log('SYS');

      // window / element 모두 리스닝 (환경별 편차 커버)
      window.addEventListener('df-request-sent', onReq);
      window.addEventListener('df-response-received', onRes);
      window.addEventListener('df-messenger-loaded', onLoaded);
      el.addEventListener('df-request-sent', onReq);
      el.addEventListener('df-response-received', onRes);
      el.addEventListener('df-messenger-chat-opened', onOpen);
      el.addEventListener('df-messenger-chat-closed', onClose);

      remove = () => {
        window.removeEventListener('df-request-sent', onReq);
        window.removeEventListener('df-response-received', onRes);
        window.removeEventListener('df-messenger-loaded', onLoaded);
        el.removeEventListener('df-request-sent', onReq);
        el.removeEventListener('df-response-received', onRes);
        el.removeEventListener('df-messenger-chat-opened', onOpen);
        el.removeEventListener('df-messenger-chat-closed', onClose);
      };
    };

    attachDebug();
    return () => remove();
  }, []);

  /** 3) 메신저 이벤트 구독 (UI 영향 X) */
  useDfMessenger({
    onMessage: (m) => {
      if (m.role === 'user') {
        onUserMessage?.(m.text, m.raw);
      } else {
        onBotMessage?.(m.text, m.raw);
      }
    },
    onRaw: () => {
      // chips/card/payload 처리가 필요하면 여기서 확장
    },
  });

  /** 4) UI: 메신저는 그대로, 위치/스타일만 제어 */
  return (
    <div
      id="chatbot"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div style={{ pointerEvents: 'auto' }}>
        <df-messenger
          ref={dfMessengerRef}
          project-id="hani-chatbot"
          agent-id="d90a86ac-e04e-4685-80f2-eec780081d87"
          language-code="ko"
          max-query-length="-1"
        >
          <df-messenger-chat-bubble chat-title="VQ" />
        </df-messenger>

        <style>
          {`
            df-messenger {
              z-index: 999;
              position: fixed;
              bottom: 16px;
              right: 16px;

              /* theme tokens */
              --df-messenger-font-color: #000;
              --df-messenger-font-family: Google Sans;
              --df-messenger-chat-background: #f3f6fc;
              --df-messenger-message-user-background: #d3e3fd;
              --df-messenger-message-bot-background: #fff;
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default Chatbot;
