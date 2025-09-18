import React from 'react';

function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0e1a26] to-[#0e1a26]/95 p-6 z-40 shadow-2xl">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {/* Friender 버튼 */}
        <button
          onClick={() => {
            // Friender로 전환 (현재 페이지)
            window.location.href = '/friender';
          }}
          className="flex flex-col items-center gap-2 text-white hover:text-blue-400 transition-colors"
        >
          <span className="text-sm font-medium">Friender</span>
        </button>

        {/* PDF 다운로드 버튼 */}
        <button
          onClick={() => {
            const link = document.createElement('a');
            link.href = '/func-file/FrienderFile/프랜더-소개-책자.pdf';
            link.download = '프랜더-소개-책자.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="flex flex-col items-center gap-2 text-white hover:text-blue-400 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </button>

        {/* 프린트 버튼 */}
        <button
          onClick={() => {
            const pdfUrl = '/func-file/FrienderFile/프랜더-소개-책자.pdf';
            const pdfWindow = window.open(pdfUrl, '_blank');
            if (pdfWindow) {
              pdfWindow.onload = () => {
                pdfWindow.print();
              };
            }
          }}
          className="flex flex-col items-center gap-2 text-white hover:text-blue-400 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
        </button>
      </div>
    </footer>
  );
}

export default Footer;
