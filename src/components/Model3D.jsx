import React, { useState, useEffect, useRef } from "react";

/**
 * 3D 모델 뷰어 컴포넌트
 * 
 * 이 컴포넌트는 3D 모델을 인터랙티브하게 표시하는 뷰어를 구현합니다.
 * 주요 기능:
 * - 마우스/터치 드래그로 3D 모델 회전
 * - 자동 회전 기능
 * - 반응형 3D 렌더링
 * - 모바일 터치 지원
 */
function Model3D({ onClose }) {
  // 상태 관리 변수들
  const [rotationX, setRotationX] = useState(0); // X축 회전 각도
  const [rotationY, setRotationY] = useState(0); // Y축 회전 각도
  const [isDragging, setIsDragging] = useState(false); // 드래그 중 상태
  const [startX, setStartX] = useState(0); // 드래그 시작 X 좌표
  const [startY, setStartY] = useState(0); // 드래그 시작 Y 좌표
  const [autoRotate, setAutoRotate] = useState(false); // 자동 회전 상태

  // ref 변수들
  const autoRotateInterval = useRef(null); // 자동 회전 인터벌 참조
  const containerRef = useRef(null); // 컨테이너 DOM 참조

  /**
   * 자동 회전 효과 useEffect
   * autoRotate가 true일 때 Y축을 기준으로 자동 회전
   */
  useEffect(() => {
    if (autoRotate) {
      autoRotateInterval.current = setInterval(() => {
        setRotationY((prev) => prev + 2);
      }, 50);
    } else {
      if (autoRotateInterval.current) {
        clearInterval(autoRotateInterval.current);
        autoRotateInterval.current = null;
      }
    }

    return () => {
      if (autoRotateInterval.current) {
        clearInterval(autoRotateInterval.current);
      }
    };
  }, [autoRotate]);

  /**
   * 마우스/터치 이벤트 처리
   * 드래그 시작 시 초기 좌표 설정
   * @param {Event} e - 마우스/터치 이벤트
   */
  const handleMouseDown = (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  /**
   * 마우스/터치 이동 이벤트 처리
   * 드래그 중일 때 3D 모델 회전 계산
   * @param {Event} e - 마우스/터치 이벤트
   */
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    if (e.cancelable) {
      e.preventDefault();
    }

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // Y축 회전 (좌우 드래그)
    setRotationY((prev) => prev + deltaX * 0.5);
    // X축 회전 (상하 드래그) - -90도에서 90도로 제한
    setRotationX((prev) => Math.max(-90, Math.min(90, prev - deltaY * 0.5)));

    // 현재 좌표를 다음 계산을 위한 시작 좌표로 설정
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  /**
   * 마우스/터치 이벤트 종료 처리
   * 드래그 상태 해제
   */
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  /**
   * 터치 이벤트 시작 처리
   * 모바일에서 터치 시작 시 초기 좌표 설정
   * @param {TouchEvent} e - 터치 이벤트
   */
  const handleTouchStart = (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  };

  /**
   * 터치 이동 이벤트 처리
   * 모바일에서 터치 드래그 시 3D 모델 회전 계산
   * @param {TouchEvent} e - 터치 이벤트
   */
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    if (e.cancelable) {
      e.preventDefault();
    }

    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;

    // Y축 회전 (좌우 드래그)
    setRotationY((prev) => prev + deltaX * 0.5);
    // X축 회전 (상하 드래그) - -90도에서 90도로 제한
    setRotationX((prev) => Math.max(-90, Math.min(90, prev - deltaY * 0.5)));

    // 현재 좌표를 다음 계산을 위한 시작 좌표로 설정
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  };

  /**
   * 터치 이벤트 종료 처리
   * 터치 드래그 상태 해제
   */
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  /**
   * 3D 모델 리셋 함수
   * 회전 각도를 0도로 초기화하고 자동 회전 중지
   */
  const resetModel = () => {
    setRotationX(0);
    setRotationY(0);
    setAutoRotate(false);
  };

  /**
   * 자동 회전 토글 함수
   * 자동 회전 상태를 반전시킴
   */
  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };

  /**
   * 전역 마우스/터치 이벤트 리스너 설정
   * 드래그 중일 때 문서 전체에서 이벤트 감지
   */
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    
    // 터치 이벤트를 더 안전하게 설정
    const touchMoveHandler = (e) => handleTouchMove(e);
    const touchEndHandler = (e) => handleTouchEnd(e);
    
    document.addEventListener("touchmove", touchMoveHandler, { 
      passive: false, 
      capture: true 
    });
    document.addEventListener("touchend", touchEndHandler, { 
      passive: true 
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", touchMoveHandler, { 
        capture: true 
      });
      document.removeEventListener("touchend", touchEndHandler);
    };
  }, [isDragging, startX, startY]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-4xl mx-auto max-h-[95vh] overflow-auto relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-2xl sm:text-3xl font-bold text-gray-600 hover:text-black transition-colors z-10"
        >
          ×
        </button>

        {/* 제목 및 설명 */}
        <div className="text-center mb-4 sm:mb-6 mt-8 sm:mt-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            3D 모델 뷰어
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            마우스로 드래그하여 3D 모델을 회전시켜보세요
          </p>
        </div>

        {/* 3D 모델 컨테이너 */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div
            ref={containerRef}
            className="w-24 h-24 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-[16rem] lg:h-[16rem] perspective-1000 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{ 
              perspective: "1000px",
              touchAction: "none" // 모바일에서 스크롤 방지
            }}
          >
            {/* 3D 모델 래퍼 */}
            <div
              className="w-full h-full transform-style-preserve-3d transition-transform duration-300"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
              }}
            >
              {/* 3D 모델의 각 면 - 정면 (앞쪽) */}
              <div
                className="absolute w-full h-full flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold text-white border-2 border-white border-opacity-30"
                style={{
                  background: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
                  transform: "translateZ(calc(50% - 1px))", // 정면을 앞으로 이동
                }}
              >
                3D 모델
              </div>

              {/* 3D 모델의 각 면 - 뒤면 (뒤쪽) */}
              <div
                className="absolute w-full h-full flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold text-white border-2 border-white border-opacity-30"
                style={{
                  background: "linear-gradient(45deg, #4834d4, #686de0)",
                  transform: "translateZ(calc(50% + 1px)) rotateY(180deg)", // 뒤면을 뒤로 이동
                }}
              >
                뒤면
              </div>

              {/* 3D 모델의 각 면 - 오른쪽 */}
              <div
                className="absolute w-full h-full flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold text-white border-2 border-white border-opacity-30"
                style={{
                  background: "linear-gradient(45deg, #00d2d3, #54a0ff)",
                  transform: "translateX(calc(50% - 1px)) rotateY(90deg)", // 오른쪽 면을 오른쪽으로 이동
                }}
              >
                오른쪽
              </div>

              {/* 3D 모델의 각 면 - 왼쪽 */}
              <div
                className="absolute w-full h-full flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold text-white border-2 border-white border-opacity-30"
                style={{
                  background: "linear-gradient(45deg, #ff9ff3, #f368e0)",
                  transform: "translateX(calc(-50% + 1px)) rotateY(-90deg)", // 왼쪽 면을 왼쪽으로 이동
                }}
              >
                왼쪽
              </div>

              {/* 3D 모델의 각 면 - 위쪽 */}
              <div
                className="absolute w-full h-full flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold text-white border-2 border-white border-opacity-30"
                style={{
                  background: "linear-gradient(45deg, #26de81, #20bf6b)",
                  transform: "translateY(calc(-50% + 1px)) rotateX(90deg)", // 위쪽 면을 위로 이동
                }}
              >
                위쪽
              </div>

              {/* 3D 모델의 각 면 - 아래쪽 */}
              <div
                className="absolute w-full h-full flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold text-white border-2 border-white border-opacity-30"
                style={{
                  background: "linear-gradient(45deg, #fd79a8, #e84393)",
                  transform: "translateY(calc(50% - 1px)) rotateX(-90deg)", // 아래쪽 면을 아래로 이동
                }}
              >
                아래쪽
              </div>
            </div>
          </div>
        </div>

        {/* 컨트롤 버튼들 */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          {/* 리셋 버튼 */}
          <button
            onClick={resetModel}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium text-sm sm:text-base"
          >
            🔄 리셋
          </button>

          {/* 자동회전 토글 버튼 */}
          <button
            onClick={toggleAutoRotate}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-colors font-medium text-sm sm:text-base ${
              autoRotate
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            {autoRotate ? "⏸️ 자동회전 중지" : "▶️ 자동회전 시작"}
          </button>
        </div>

        {/* 사용법 안내 */}
        <div className="text-center mt-4 text-xs sm:text-sm text-gray-500">
          <p>마우스 드래그: 회전 | 터치: 모바일에서도 동일하게 작동</p>
        </div>
      </div>
    </div>
  );
}

export default Model3D;
