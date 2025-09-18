import { useEffect, useRef } from 'react';

/**
 * Dialogflow Messenger 이벤트(df-request-sent / df-response-received)만 구독해서
 * - 사용자 발화 / 봇 응답을 onMessage로 넘깁니다.
 * - CX와 ES 구조를 모두 안전하게 파싱합니다.
 */
export function useDfMessenger({ onMessage, onRaw } = {}) {
  const unsubRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleRequest = (e) => {
      try {
        const q =
          e?.detail?.data?.query || // CX
          e?.detail?.raw?.queryInput?.text?.text || // CX raw
          e?.detail?.queryResult?.queryText || // ES
          '';
        if (q) {
          onMessage && onMessage({ role: 'user', text: String(q), raw: e.detail });
          onRaw && onRaw(e.detail);
        }
      } catch (_) {}
    };

    const handleResponse = (e) => {
      try {
        // CX: e.detail.data.messages
        let texts = [];
        if (Array.isArray(e?.detail?.data?.messages)) {
          texts = e.detail.data.messages.flatMap((m) => {
            const t = m?.text?.text;
            if (Array.isArray(t)) return t;
            return [];
          });
        }

        // ES fallback: e.detail.queryResult.responseMessages[].text.text[]
        if (texts.length === 0 && Array.isArray(e?.detail?.queryResult?.responseMessages)) {
          texts = e.detail.queryResult.responseMessages.flatMap((m) => {
            const t = m?.text?.text;
            if (Array.isArray(t)) return t;
            return [];
          });
        }

        if (texts.length > 0) {
          texts.forEach(
            (t) => onMessage && onMessage({ role: 'bot', text: String(t), raw: e.detail })
          );
        } else {
          // 텍스트가 없고 chips/card/payload만 온 경우 원본 전달
          onRaw && onRaw(e.detail);
        }
      } catch (_) {}
    };

    window.addEventListener('df-request-sent', handleRequest);
    window.addEventListener('df-response-received', handleResponse);

    unsubRef.current = () => {
      window.removeEventListener('df-request-sent', handleRequest);
      window.removeEventListener('df-response-received', handleResponse);
    };

    return () => {
      unsubRef.current && unsubRef.current();
      unsubRef.current = null;
    };
  }, [onMessage, onRaw]);
}
