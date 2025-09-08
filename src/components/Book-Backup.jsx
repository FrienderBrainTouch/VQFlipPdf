import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import Model3D from "./Model3D";

/**
 * Friender 프로젝트 플립북 컴포넌트
 * 
 * 이 컴포넌트는 Friender 프로젝트의 인터랙티브 플립북을 구현합니다.
 * 주요 기능:
 * - PDF 페이지를 플립북 형태로 표시
 * - 표지 페이지의 화려한 애니메이션 효과
 * - 인터랙티브 이미지와 GIF 클릭 시 모달 표시
 * - 3D 모델 뷰어 연동
 * - 반응형 디자인 지원
 * - 키보드 및 터치 네비게이션
 */
function Book() {
  // 상태 관리 변수들
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 번호
  const [isMainImageAnimating, setIsMainImageAnimating] = useState(false); // 메인 이미지 애니메이션 상태
  const [mainImageSize, setMainImageSize] = useState(1); // 메인 이미지 크기
  const [mainImageRotation, setMainImageRotation] = useState(0); // 메인 이미지 회전 각도
  const [mainImageOpacity, setMainImageOpacity] = useState(0); // 메인 이미지 투명도
  const [titleOpacity, setTitleOpacity] = useState(0); // 타이틀 투명도
  const [subtitleOpacity, setSubtitleOpacity] = useState(0); // 서브타이틀 투명도
  const [backgroundScale, setBackgroundScale] = useState(1.2); // 배경 이미지 스케일
  const [backgroundBlur, setBackgroundBlur] = useState(0); // 배경 이미지 블러 효과
  const [selectedGif, setSelectedGif] = useState(null); // 선택된 GIF 파일
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [modalSourcePage, setModalSourcePage] = useState(null); // 모달을 연 페이지
  const [is3DModalOpen, setIs3DModalOpen] = useState(false); // 3D 모달 열림 상태
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576); // 모바일 여부
  const [isBookReady, setIsBookReady] = useState(false); // 플립북 준비 상태
  const [isFlipping, setIsFlipping] = useState(false); // 페이지 전환 중 상태

  // ref 변수들
  const animationRef = useRef(null); // 애니메이션 프레임 참조
  const bookRef = useRef(null); // 플립북 컴포넌트 참조
  const flipTimeoutRef = useRef(null); // 페이지 전환 타임아웃 참조
  const isFlippingRef = useRef(false); // ref로 flipping 상태 추적 (성능 최적화)

  /**
   * 플립북 준비 상태 확인 useEffect
   * bookRef가 준비되면 isBookReady 상태를 true로 설정
   */
  useEffect(() => {
    let isMounted = true;
    
    const checkBookReady = () => {
      if (!isMounted) return;
      
      if (bookRef.current && bookRef.current.pageFlip) {
        if (!isBookReady) {
          setIsBookReady(true);
        }
        return true; // 준비 완료
      } else {
        if (isBookReady) {
          setIsBookReady(false);
        }
        return false; // 아직 준비 안됨
      }
    };

    // 초기 체크
    if (checkBookReady()) {
      return; // 이미 준비된 경우 interval 불필요
    }
    
    // 주기적으로 체크 (bookRef가 늦게 준비될 수 있음)
    const interval = setInterval(() => {
      if (checkBookReady()) {
        clearInterval(interval); // 준비 완료되면 interval 정리
      }
    }, 100);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []); // isBookReady 의존성 제거

  /**
   * 화려한 표지 애니메이션 함수
   * @param {number} duration - 애니메이션 지속 시간 (밀리초)
   */
  const animateCover = (duration) => {
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 배경 애니메이션 (0-30%)
      if (progress <= 0.3) {
        const bgProgress = progress / 0.3;
        setBackgroundScale(1.2 - 0.2 * bgProgress);
        setBackgroundBlur(5 * bgProgress);
      }

      // 메인 이미지 등장 애니메이션 (20-50%)
      if (progress >= 0.2 && progress <= 0.5) {
        const imgProgress = (progress - 0.2) / 0.3;
        setMainImageOpacity(imgProgress);
        setMainImageRotation(360 * imgProgress);
        setMainImageSize(1 + 319 * imgProgress);
      }

      // 메인 이미지 크기 조정 및 회전 정리 (50-80%)
      if (progress >= 0.5 && progress <= 0.8) {
        const sizeProgress = (progress - 0.5) / 0.3;
        setMainImageSize(320 + 0 * sizeProgress); // 크기 유지
        setMainImageRotation(360 - 360 * sizeProgress); // 360도에서 0도로 회전 정리
      }

      // 타이틀과 서브타이틀 등장 (70-100%)
      if (progress >= 0.7 && progress <= 1) {
        const textProgress = (progress - 0.7) / 0.3;
        setTitleOpacity(textProgress);
        setSubtitleOpacity(textProgress);
      }

      // 애니메이션 완료 시 회전을 0도로 직접 설정
      if (progress >= 1) {
        setMainImageRotation(0);
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  /**
   * 컴포넌트 마운트 시 표지 페이지 애니메이션 자동 실행
   * 페이지 로드 후 1초 지연 후 애니메이션 시작
   */
  useEffect(() => {
    // 페이지 로드 후 더 긴 지연을 두고 애니메이션 시작
    const timer = setTimeout(() => {
      // 1초 후에 화려한 애니메이션 시작
      const animationTimer = setTimeout(() => {
        setIsMainImageAnimating(true);
        // 화려한 애니메이션 시작 (3초)
        animateCover(3000);
      }, 1000);

      return () => clearTimeout(animationTimer);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  /**
   * 컴포넌트 언마운트 시 애니메이션 정리
   * 메모리 누수 방지를 위한 cleanup 함수
   */
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current);
      }
      isFlippingRef.current = false;
    };
  }, []);

  /**
   * 윈도우 크기 변경 감지
   * 모바일/데스크톱 전환 시 반응형 처리
   */
  useEffect(() => {
    const handleResize = () => {
      const wasMobile = isMobile;
      const newIsMobile = window.innerWidth < 576;
      
      if (wasMobile !== newIsMobile) {
        setIsMobile(newIsMobile);
        
        // 페이지 그룹이 변경된 후 현재 페이지가 유효한지 확인
        setTimeout(() => {
          const newPageGroups = getPageGroups();
          const isValidPage = newPageGroups.some(group => 
            group.pages.includes(currentPage)
          );
          
          // 현재 페이지가 새로운 그룹 구조에서 유효하지 않으면 첫 번째 페이지로 이동
          if (!isValidPage && currentPage !== 0) {
            safePageFlip(0);
          }
        }, 100);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, currentPage]);

  /**
   * 키보드 이벤트 처리
   * 좌우 화살표 키로 페이지 이동
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        if (currentPage > 0) {
          safePageFlip(currentPage - 1);
        }
      } else if (e.key === "ArrowRight") {
        if (currentPage < 7) {
          safePageFlip(currentPage + 1);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentPage]);

  // Friender 프로젝트 페이지 데이터
  const frienderData = [
    {
      id: "2",
      name: "Friender Page 2",
      description: "Friender 프로젝트 두 번째 페이지입니다.",
    },
    {
      id: "3",
      name: "Friender Page 3",
      description: "Friender 프로젝트 세 번째 페이지입니다.",
    },
    {
      id: "4",
      name: "Friender Page 4",
      description: "Friender 프로젝트 네 번째 페이지입니다.",
    },
    {
      id: "5",
      name: "Friender Page 5",
      description: "Friender 프로젝트 다섯 번째 페이지입니다.",
    },
    {
      id: "6",
      name: "Friender Page 6",
      description: "Friender 프로젝트 여섯 번째 페이지입니다.",
    },
    {
      id: "7",
      name: "Friender Page 7",
      description: "Friender 프로젝트 일곱 번째 페이지입니다.",
    },
    {
      id: "8",
      name: "Friender Page 8",
      description: "Friender 프로젝트 여덟 번째 페이지입니다.",
    },
  ];

  // 페이지 묶음 정보 (반응형 구조)
  const getPageGroups = () => {
    if (isMobile) {
      // 576px 이하: 1장씩 보여지는 구조 (표지, 1, 2, 3... 순)
      return [
        { groupId: 1, pages: [0], description: "표지" },
        { groupId: 2, pages: [1], description: "1장" },
        { groupId: 3, pages: [2], description: "2장" },
        { groupId: 4, pages: [3], description: "3장" },
        { groupId: 5, pages: [4], description: "4장" },
        { groupId: 6, pages: [5], description: "5장" },
        { groupId: 7, pages: [6], description: "6장" },
        { groupId: 8, pages: [7], description: "7장" }
      ];
    } else {
      // 576px 이상: 2장씩 보여지는 구조 (기존과 동일)
      return [
        { groupId: 1, pages: [0], description: "표지" },
        { groupId: 2, pages: [1, 2], description: "1-2장" },
        { groupId: 3, pages: [3, 4], description: "3-4장" },
        { groupId: 4, pages: [5, 6], description: "5-6장" },
        { groupId: 5, pages: [7], description: "마지막" }
      ];
    }
  };

  // 현재 페이지 그룹 가져오기
  const pageGroups = getPageGroups();

  /**
   * 현재 페이지가 속한 그룹 찾기
   * @param {number} page - 페이지 번호
   * @returns {Object} 페이지 그룹 정보
   */
  const getCurrentGroup = (page) => {
    const currentPageGroups = getPageGroups();
    return currentPageGroups.find(group => group.pages.includes(page)) || currentPageGroups[0];
  };

  /**
   * 페이지 그룹으로 이동하는 함수
   * @param {number} groupId - 이동할 그룹 ID
   */
  const goToGroup = (groupId) => {
    const currentPageGroups = getPageGroups();
    const targetGroup = currentPageGroups.find(group => group.groupId === groupId);
    if (targetGroup && targetGroup.pages.length > 0) {
      // 그룹의 첫 번째 페이지로 이동
      safePageFlip(targetGroup.pages[0]);
    }
  };

  // GIF 파일 매핑 (환경 관련 애니메이션)
  const gifMapping = {
    1: "/interacivefile/FrienderFile/1-탄소-중립을-통해-지구촌-기후변화를-예방.gif",
    2: "/interacivefile/FrienderFile/2-친환경-에너지-자립마을-만들기.gif",
    3: "/interacivefile/FrienderFile/3-탄소-중립-실천.gif",
    4: "/interacivefile/FrienderFile/4-똑똑한-재활용-쓰레기-분리배출-실천.gif",
    5: "/interacivefile/FrienderFile/5-에너지가-가정에-오기까지의-여정.gif",
    6: "/interacivefile/FrienderFile/6-해양-오염-구조-탐사대-체험.gif",
  };

  // section-img 이미지 매핑 (페이지별 상세 이미지)
  const sectionImgMapping = {
    2: [
      "/interacivefile/FrienderFile/section-img/2-1.png",
      "/interacivefile/FrienderFile/section-img/2-2.png",
      "/interacivefile/FrienderFile/section-img/2-3.png",
    ],
    3: [
      "/interacivefile/FrienderFile/section-img/3-1.png",
      "/interacivefile/FrienderFile/section-img/3-2.png",
      "/interacivefile/FrienderFile/section-img/3-3.png",
    ],
    4: [
      "/interacivefile/FrienderFile/section-img/4-1.png",
      "/interacivefile/FrienderFile/section-img/4-2.png",
      "/interacivefile/FrienderFile/section-img/4-3.png",
      "/interacivefile/FrienderFile/section-img/4-4.png",
    ],
    5: [
      "/interacivefile/FrienderFile/section-img/5-1.png",
      "/interacivefile/FrienderFile/section-img/5-2.png",
      "/interacivefile/FrienderFile/section-img/5-3.png",
    ],
    6: [
      "/interacivefile/FrienderFile/section-img/6-1.png",
      "/interacivefile/FrienderFile/section-img/6-2.png",
      "/interacivefile/FrienderFile/section-img/6-3.png",
      "/interacivefile/FrienderFile/section-img/6-4.png",
    ],
    7: [
      "/interacivefile/FrienderFile/section-img/7-1.png",
      "/interacivefile/FrienderFile/section-img/7-2.png",
      "/interacivefile/FrienderFile/section-img/7-3.png",
      "/interacivefile/FrienderFile/section-img/7-4.png",
    ],
    8: ["/interacivefile/FrienderFile/section-img/8-1.png"],
  };

  // 페이지별 개별 이미지 위치 설정 (절대 위치)
  const individualImagePositions = {
    2: [
      {
        // 2-1번 이미지 - 상단
        position: "absolute",
        top: "3%",
        left: "5%",
        width: "100%",
        maxWidth: "345px",
      },
      {
        // 2-2번 이미지 - 중단
        position: "absolute",
        top: "25%",
        left: "3%",
        width: "100%",
        maxWidth: "340px",
      },
      {
        // 2-3번 이미지 - 하단
        position: "absolute",
        bottom: "0%",
        right: "0%",
        width: "100%",
        maxWidth: "355px",
      },
    ],
    3: [
      {
        // 3-1번 이미지 - 상단 왼쪽
        position: "absolute",
        top: "7%",
        left: "2%",
        width: "100%",
        maxWidth: "353px",
      },
      {
        // 3-2번 이미지 - 상단 오른쪽
        position: "absolute",
        top: "38%",
        right: "2%",
        width: "100%",
        maxWidth: "354px",
      },
      {
        // 3-3번 이미지 - 하단 중앙
        position: "absolute",
        bottom: "0%",
        left: "3%",
        width: "100%",
        maxWidth: "351px",
      },
    ],
    4: [
      {
        // 4-1번 이미지 - 상단 왼쪽
        position: "absolute",
        top: "0%",
        left: "7%",
        width: "100%",
        maxWidth: "340px",
      },
      {
        // 4-2번 이미지 - 상단 오른쪽
        position: "absolute",
        top: "22%",
        right: "2%",
        width: "100%",
        maxWidth: "340px",
      },
      {
        // 4-3번 이미지 - 하단 왼쪽
        position: "absolute",
        bottom: "39%",
        left: "7%",
        width: "100%",
        maxWidth: "340px",
      },
      {
        // 4-4번 이미지 - 하단 오른쪽
        position: "absolute",
        bottom: "3%",
        right: "0%",
        width: "100%",
        maxWidth: "340px",
      },
    ],
    5: [
      {
        // 5-1번 이미지 - 상단
        position: "absolute",
        top: "0%",
        left: "0%",
        width: "100%",
        maxWidth: "340px",
      },
      {
        // 5-2번 이미지 - 중단 왼쪽
        position: "absolute",
        top: "33%",
        left: "0%",
        width: "100%",
        maxWidth: "340px",
      },
      {
        // 5-3번 이미지 - 중단 오른쪽
        position: "absolute",
        bottom: "3%",
        right: "10%",
        width: "100%",
        maxWidth: "340px",
      },
    ],
    6: [
      {
        // 6-1번 이미지 - 상단 중앙
        position: "absolute",
        top: "0%",
        left: "9%",
        width: "100%",
        maxWidth: "305px",
      },
      {
        // 6-2번 이미지 - 중단 왼쪽
        position: "absolute",
        top: "12%",
        left: "6%",
        width: "100%",
        maxWidth: "340px",
      },
      {
        // 6-3번 이미지 - 중단 오른쪽
        position: "absolute",
        bottom: "27%",
        right: "0%",
        width: "100%",
        maxWidth: "340px",
      },
      {
        // 6-4번 이미지 - 하단
        position: "absolute",
        bottom: "3%",
        left: "7%",
        width: "100%",
        maxWidth: "340px",
      },
    ],
    7: [
      {
        // 7-1번 이미지 - 상단 왼쪽
        position: "absolute",
        top: "0%",
        left: "0%",
        width: "100%",
        maxWidth: "340px",
      },
      {
        // 7-2번 이미지 - 상단 오른쪽
        position: "absolute",
        top: "11%",
        right: "8%",
        width: "100%",
        maxWidth: "340px",
      },
      {
        // 7-3번 이미지 - 하단 왼쪽
        position: "absolute",
        bottom: "39%",
        left: "0%",
        width: "100%",
        maxWidth: "340px",
      },
      {
        // 7-4번 이미지 - 하단 오른쪽
        position: "absolute",
        bottom: "4%",
        right: "7%",
        width: "100%",
        maxWidth: "340px",
      },
    ],
    8: [
      {
        // 8-1번 이미지 - 중앙
        position: "absolute",
        bottom: "1%",
        left: "0%",
        width: "100%",
        maxWidth: "340px",
      },
    ],
  };

  /**
   * GIF 클릭 핸들러
   * 환경 관련 애니메이션 GIF를 클릭하면 모달로 표시
   * @param {number} gifNumber - GIF 번호
   * @param {Event} event - 클릭 이벤트
   */
  const handleGifClick = (gifNumber, event) => {
    event.stopPropagation(); // 이벤트 전파 방지
    setSelectedGif(gifMapping[gifNumber]);
    // 4페이지(index === 2)의 environ 이미지들은 페이지 ID 4로 설정
    setModalSourcePage(4);
    setIsModalOpen(true);
  };

  /**
   * section-img 클릭 핸들러
   * 페이지별 상세 이미지를 클릭하면 모달로 표시
   * 특정 이미지(3-3.png)는 3D 모델로 표시
   * @param {string} imgSrc - 이미지 경로
   * @param {Event} event - 클릭 이벤트
   * @param {string} pageId - 페이지 ID
   */
  const handleSectionImgClick = (imgSrc, event, pageId) => {
    event.stopPropagation(); // 이벤트 전파 방지

    // 3-3.png 이미지 클릭 시 3D 모델 표시
    if (imgSrc.includes("3-3.png")) {
      open3DModal();
    } else {
      setSelectedGif(imgSrc);
      setModalSourcePage(parseInt(pageId));
      setIsModalOpen(true);
    }
  };

  /**
   * 모달 닫기 핸들러
   * 모달이 닫힐 때 해당 페이지로 이동
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGif(null);

    // 모달이 닫힐 때 해당 페이지로 이동
    if (modalSourcePage !== null) {
      setTimeout(() => {
        // 페이지 ID를 인덱스로 변환 (표지 페이지는 0, 나머지는 ID-1)
        const pageIndex = modalSourcePage === 1 ? 0 : modalSourcePage - 1;
        safePageFlip(pageIndex);
      }, 100);
    }
    setModalSourcePage(null);
  };

  /**
   * 3D 모달 열기
   */
  const open3DModal = () => {
    setIs3DModalOpen(true);
  };

  /**
   * 3D 모달 닫기
   */
  const close3DModal = () => {
    setIs3DModalOpen(false);
  };

  // 해상도 확인하여 크기 지정
  const bookWidth = isMobile ? 300 : 350;
  const bookHeight = isMobile ? 440 : 510;

  /**
   * 반응형 이미지 크기 계산 함수
   * @param {number} baseSize - 기본 크기
   * @param {boolean} isMobile - 모바일 여부
   * @returns {number} 조정된 크기
   */
  const getResponsiveImageSize = (baseSize, isMobile) => {
    return isMobile ? baseSize * 0.8 : baseSize;
  };

  /**
   * 반응형 이미지 위치 계산 함수
   * @param {Object} baseConfig - 기본 위치 설정
   * @param {boolean} isMobile - 모바일 여부
   * @returns {Object} 조정된 위치 설정
   */
  const getResponsiveImagePosition = (baseConfig, isMobile) => {
    // baseConfig가 없거나 유효하지 않은 경우 기본값 반환
    if (!baseConfig || typeof baseConfig !== 'object') {
      return {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        maxWidth: "200px"
      };
    }

    const scale = isMobile ? 0.9 : 1;
    return {
      ...baseConfig,
      width: `${parseFloat(baseConfig.width || 100) * scale}%`,
      maxWidth: `${getResponsiveImageSize(
        parseInt(baseConfig.maxWidth || 200),
        isMobile
      )}px`,
    };
  };

  /**
   * 페이지 변경 감지
   * 플립북의 페이지가 변경될 때 호출되는 콜백
   * @param {Object} e - 페이지 변경 이벤트
   */
  const handlePageChange = (e) => {
    const newPage = e.data;
    
    // 현재 페이지와 동일한 경우 업데이트하지 않음
    if (newPage === currentPage) {
      return;
    }
    
    setCurrentPage(newPage);
    
    // 페이지 전환 완료 시 flipping 상태 리셋
    isFlippingRef.current = false;
    setIsFlipping(false);

    // 표지 페이지(0번)가 완전히 보일 때 애니메이션 활성화
    if (newPage === 0) {
      setTimeout(() => {
        // 1초 후에 화려한 애니메이션 시작
        setTimeout(() => {
          setIsMainImageAnimating(true);
          animateCover(3000);
        }, 1000);
      }, 500);
    } else {
      setIsMainImageAnimating(false);
      setMainImageSize(1);
      setMainImageRotation(0);
      setMainImageOpacity(0);
      setTitleOpacity(0);
      setSubtitleOpacity(0);
      setBackgroundScale(1.2);
      setBackgroundBlur(0);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  /**
   * 안전한 페이지 전환 함수
   * 중복 호출 방지 및 오류 처리
   * @param {number} targetPage - 이동할 페이지 번호
   */
  const safePageFlip = (targetPage) => {
    if (!isBookReady) {
      return;
    }
    
    // 이미 페이지 전환 중인 경우 무시
    if (isFlippingRef.current) {
      return;
    }
    
    // 이미 해당 페이지에 있는 경우 전환하지 않음
    if (currentPage === targetPage) {
      return;
    }
    
    // 즉시 flipping 상태 설정 (중복 호출 방지)
    isFlippingRef.current = true;
    setIsFlipping(true);
    
    // 이전 타임아웃 정리
    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current);
    }
    
    // 디바운싱: 300ms 후에 실제 페이지 전환 실행
    flipTimeoutRef.current = setTimeout(() => {
      if (bookRef.current) {
        try {
          // HTMLFlipBook의 다양한 페이지 전환 메서드 시도
          if (bookRef.current.pageFlip) {
            const pageFlip = bookRef.current.pageFlip();
            
            // 다양한 페이지 전환 방법 시도
            if (pageFlip && typeof pageFlip.flip === 'function') {
              // 방법 1: 직접 flip 메서드
              pageFlip.flip(targetPage);
            } else if (pageFlip && typeof pageFlip.flipToPage === 'function') {
              // 방법 2: flipToPage 메서드 (일부 버전에서 지원)
              pageFlip.flipToPage(targetPage);
            } else if (pageFlip && typeof pageFlip.goToPage === 'function') {
              // 방법 3: goToPage 메서드 (일부 버전에서 지원)
              pageFlip.goToPage(targetPage);
            } else if (pageFlip && typeof pageFlip.turnToPage === 'function') {
              // 방법 4: turnToPage 메서드 (일부 버전에서 지원)
              pageFlip.turnToPage(targetPage);
            } else if (pageFlip && typeof pageFlip.setPage === 'function') {
              // 방법 5: setPage 메서드 (일부 버전에서 지원)
              pageFlip.setPage(targetPage);
            } else {
              // fallback: currentPage만 업데이트
              setCurrentPage(targetPage);
              isFlippingRef.current = false;
              setIsFlipping(false);
            }
          } else if (bookRef.current.flip) {
            // 직접 flip 메서드가 있는 경우
            bookRef.current.flip(targetPage);
          } else if (bookRef.current.goToPage) {
            // goToPage 메서드가 있는 경우
            bookRef.current.goToPage(targetPage);
          } else {
            // fallback: currentPage만 업데이트
            setCurrentPage(targetPage);
            isFlippingRef.current = false;
            setIsFlipping(false);
          }
        } catch (error) {
          // 오류 발생 시 currentPage만 업데이트
          setCurrentPage(targetPage);
          isFlippingRef.current = false;
          setIsFlipping(false);
        }
      } else {
        isFlippingRef.current = false;
        setIsFlipping(false);
      }
    }, 300);
  };

  /**
   * 이전 페이지로 이동
   */
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      safePageFlip(currentPage - 1);
    }
  };

  /**
   * 다음 페이지로 이동
   */
  const goToNextPage = () => {
    if (currentPage < 7) {
      safePageFlip(currentPage + 1);
    }
  };

  return (
    <div className={`w-full ${isMobile ? 'h-auto min-h-screen' : 'h-full'} flex flex-col ${isMobile ? 'justify-start' : 'justify-center'} items-center`}>
      {/* 플립북 컨테이너 */}
      <div className={`${isMobile ? 'w-full' : 'flex justify-center items-center perspective-1000'}`}>
        {isMobile ? (
          // 모바일: 세로 스크롤로 페이지를 차례대로 표시
          <div className="w-full space-y-0 py-0 pb-16 overflow-y-auto">
            {/* 표지 페이지 */}
            <div className={`${isMobile ? 'relative overflow-hidden' : 'bg-gradient-to-br from-white to-gray-50 rounded shadow-lg relative overflow-hidden'}`} style={{ height: isMobile ? 'auto' : '440px' }}>
              <div className={`${isMobile ? 'w-full h-full flex flex-col justify-center items-center p-0 text-center text-white font-bold relative' : 'w-full h-full flex flex-col justify-center items-center p-0 text-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold relative'}`}>
                {/* 배경 이미지 */}
                <img
                  src="/Pdf-img/Friender/1.jpg"
                  alt="Friender Cover Background"
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(${backgroundScale})`,
                    filter: `blur(${backgroundBlur}px)`,
                    transition: "transform 0.3s ease-out, filter 0.3s ease-out",
                  }}
                />

                {/* main 이미지 오버레이 - 중앙에 배치 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="/interacivefile/FrienderFile/main.png"
                    alt="Friender Main"
                    style={{
                      width: `${mainImageSize}px`,
                      height: `${mainImageSize}px`,
                      opacity: mainImageOpacity,
                      transform: `rotate(${mainImageRotation}deg)`,
                      objectFit: "contain",
                      transition: "transform 0.1s linear",
                    }}
                  />

                  {/* title과 subtitle - main 이미지 위에 오버레이 */}
                  {isMainImageAnimating && mainImageSize > 50 && (
                    <div
                      className="absolute"
                      style={{
                        left: `${mainImageSize * 0.1}px`, // main 이미지 왼쪽에서 10% 위치
                        bottom: `${mainImageSize * 0.1 + 50}px`, // main 이미지 아래에서 10% + 50px 위치
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "10px",
                      }}
                    >
                      {/* title */}
                      <img
                        src="/interacivefile/FrienderFile/title.png"
                        alt="Friender Title"
                        style={{
                          width: `${mainImageSize * 0.8}px`, // main 이미지보다 20% 작게
                          height: "auto",
                          opacity: titleOpacity,
                          transform: `translateY(${20 - titleOpacity * 20}px)`,
                          transition:
                            "opacity 0.3s ease-out, transform 0.3s ease-out",
                        }}
                      />

                      {/* subtitle */}
                      <img
                        src="/interacivefile/FrienderFile/subtitle.png"
                        alt="Friender Subtitle"
                        style={{
                          width: `${mainImageSize * 0.5}px`, // main 이미지의 50% 크기
                          height: "auto",
                          opacity: subtitleOpacity,
                          transform: `translateY(${20 - subtitleOpacity * 20}px)`,
                          transition:
                            "opacity 0.3s ease-out, transform 0.3s ease-out",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* 페이지 그림자 효과 */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* 내부 페이지들 */}
            {frienderData.map((page, index) => (
              <div
                key={page.id}
                className="bg-gradient-to-br from-white to-gray-50 rounded shadow-lg relative"
                style={{ height: isMobile ? 'auto' : '440px' }}
              >
                <div className="w-full h-full flex flex-col justify-center items-center p-0">
                  <div className="w-full h-full relative">
                    {/* 페이지 배경 이미지 */}
                    <img
                      src={`/Pdf-img/Friender/${page.id}.jpg`}
                      alt={page.name}
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    {/* 각 페이지별 section-img 이미지들을 개별적으로 배치 */}
                    {sectionImgMapping[page.id] &&
                      individualImagePositions[page.id] && (
                        <>
                          {sectionImgMapping[page.id].map((imgSrc, imgIndex) => {
                            const imagePosition = individualImagePositions[page.id]?.[imgIndex];
                            
                            // 이미지 위치 설정이 없는 경우 렌더링하지 않음
                            if (!imagePosition) {
                              return null;
                            }
                            
                            return (
                              <div
                                key={imgIndex}
                                className="absolute cursor-pointer hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-500 rounded-lg pointer-events-auto bg-transparent"
                                style={getResponsiveImagePosition(
                                  imagePosition,
                                  isMobile
                                )}
                                onClick={(e) =>
                                  handleSectionImgClick(imgSrc, e, page.id)
                                }
                              >
                                <img
                                  src={imgSrc}
                                  alt={`Section ${page.id}-${imgIndex + 1}`}
                                  className="w-full h-full object-contain opacity-0 hover:opacity-100 transition-opacity duration-300"
                                />
                              </div>
                            );
                          })}
                        </>
                      )}

                    {/* 4페이지(index === 2)에만 기존 environ 이미지들도 추가로 배치 */}
                    {index === 2 && (
                      <div
                        className="absolute flex justify-between items-center pointer-events-auto"
                        style={{
                          top: "13%",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "85%",
                        }}
                      >
                        <img
                          src="/interacivefile/FrienderFile/environ-1.png"
                          alt="Environment 1"
                          className="flex-1 opacity-0 max-w-[calc(15%-2px)] h-auto object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                          onClick={(e) => handleGifClick(1, e)}
                        />
                        <img
                          src="/interacivefile/FrienderFile/environ-2.png"
                          alt="Environment 2"
                          className="flex-1 opacity-0 max-w-[calc(15%-2px)] h-auto object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                          onClick={(e) => handleGifClick(2, e)}
                        />
                        <img
                          src="/interacivefile/FrienderFile/environ-3.png"
                          alt="Environment 3"
                          className="flex-1 opacity-0 max-w-[calc(15%-2px)] h-auto object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                          onClick={(e) => handleGifClick(3, e)}
                        />
                        <img
                          src="/interacivefile/FrienderFile/environ-4.png"
                          alt="Environment 4"
                          className="flex-1 opacity-0 max-w-[calc(15%-2px)] h-auto object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                          onClick={(e) => handleGifClick(4, e)}
                        />
                        <img
                          src="/interacivefile/FrienderFile/environ-5.png"
                          alt="Environment 5"
                          className="flex-1 opacity-0 max-w-[calc(15%-2px)] h-auto object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                          onClick={(e) => handleGifClick(5, e)}
                        />
                        <img
                          src="/interacivefile/FrienderFile/environ-6.png"
                          alt="Environment 6"
                          className="flex-1 opacity-0 max-w-[calc(15%-2px)] h-auto object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                          onClick={(e) => handleGifClick(6, e)}
                        />
                      </div>
                    )}

                    {/* 5페이지(index === 3)에만 비디오 추가 */}
                    {index === 3 && (
                      <div
                        className="absolute flex justify-center items-center"
                        style={{
                          top: "10%",
                          left: "47%",
                          transform: "translateX(-50%)",
                          width: "90%",
                        }}
                      >
                        <video
                          src="/interacivefile/FrienderFile/BlockCoding-VR.mp4"
                          className="w-[200px] h-[100px] object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                          controls
                          muted
                          loop
                          autoPlay={false}
                        />
                      </div>
                    )}

                    {/* 페이지 그림자 효과 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 데스크톱: 기존 HTMLFlipBook 사용
        <HTMLFlipBook
          ref={bookRef}
          width={bookWidth}
          height={bookHeight}
          maxShadowOpacity={0.5}
          drawShadow={true}
          showCover={true}
          flippingTime={800}
          showPageCorners={false}
          size="fixed"
          onFlip={handlePageChange}
          onFlipStart={(e) => {}}
          onFlipEnd={(e) => {}}
          usePortrait={isMobile}
          useMouseEvents={true}
          swipeDistance={50}
          disableFlipByClick={false}
          className="transform-style-preserve-3d"
        >
          {/* 표지 페이지 */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded shadow-lg relative overflow-hidden">
            <div className="w-full h-full flex flex-col justify-center items-center p-0 text-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold relative">
              {/* 배경 이미지 */}
              <img
                src="/Pdf-img/Friender/1.jpg"
                alt="Friender Cover Background"
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${backgroundScale})`,
                  filter: `blur(${backgroundBlur}px)`,
                  transition: "transform 0.3s ease-out, filter 0.3s ease-out",
                }}
              />

              {/* main 이미지 오버레이 - 중앙에 배치 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/interacivefile/FrienderFile/main.png"
                  alt="Friender Main"
                  style={{
                    width: `${mainImageSize}px`,
                    height: `${mainImageSize}px`,
                    opacity: mainImageOpacity,
                    transform: `rotate(${mainImageRotation}deg)`,
                    objectFit: "contain",
                    transition: "transform 0.1s linear",
                  }}
                />

                {/* title과 subtitle - main 이미지 위에 오버레이 */}
                {isMainImageAnimating && mainImageSize > 50 && (
                  <div
                    className="absolute"
                    style={{
                      left: `${mainImageSize * 0.1}px`, // main 이미지 왼쪽에서 10% 위치
                      bottom: `${mainImageSize * 0.1 + 50}px`, // main 이미지 아래에서 10% + 50px 위치
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    {/* title */}
                    <img
                      src="/interacivefile/FrienderFile/title.png"
                      alt="Friender Title"
                      style={{
                        width: `${mainImageSize * 0.8}px`, // main 이미지보다 20% 작게
                        height: "auto",
                        opacity: titleOpacity,
                        transform: `translateY(${20 - titleOpacity * 20}px)`,
                        transition:
                          "opacity 0.3s ease-out, transform 0.3s ease-out",
                      }}
                    />

                    {/* subtitle */}
                    <img
                      src="/interacivefile/FrienderFile/subtitle.png"
                      alt="Friender Subtitle"
                      style={{
                        width: `${mainImageSize * 0.5}px`, // main 이미지의 50% 크기
                        height: "auto",
                        opacity: subtitleOpacity,
                        transform: `translateY(${20 - subtitleOpacity * 20}px)`,
                        transition:
                          "opacity 0.3s ease-out, transform 0.3s ease-out",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 페이지 그림자 효과 */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* 내부 페이지들 */}
          {frienderData.map((page, index) => (
            <div
              key={page.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded shadow-lg relative"
            >
              <div className="w-full h-full flex flex-col justify-center items-center p-0">
                <div className="w-full h-full relative">
                  {/* 페이지 배경 이미지 */}
                  <img
                    src={`/Pdf-img/Friender/${page.id}.jpg`}
                    alt={page.name}
                    className="w-full h-full object-cover pointer-events-none"
                  />

                  {/* 각 페이지별 section-img 이미지들을 개별적으로 배치 */}
                  {sectionImgMapping[page.id] &&
                    individualImagePositions[page.id] && (
                      <>
                        {sectionImgMapping[page.id].map((imgSrc, imgIndex) => {
                          const imagePosition = individualImagePositions[page.id]?.[imgIndex];
                          
                          // 이미지 위치 설정이 없는 경우 렌더링하지 않음
                          if (!imagePosition) {
                            return null;
                          }
                          
                          return (
                            <div
                              key={imgIndex}
                              className="absolute cursor-pointer hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-500 rounded-lg pointer-events-auto bg-transparent"
                              style={getResponsiveImagePosition(
                                imagePosition,
                                isMobile
                              )}
                              onClick={(e) =>
                                handleSectionImgClick(imgSrc, e, page.id)
                              }
                            >
                              <img
                                src={imgSrc}
                                alt={`Section ${page.id}-${imgIndex + 1}`}
                                className="w-full h-full object-contain opacity-0 hover:opacity-100 transition-opacity duration-300"
                              />
                            </div>
                          );
                        })}
                      </>
                    )}

                  {/* 4페이지(index === 2)에만 기존 environ 이미지들도 추가로 배치 */}
                  {index === 2 && (
                    <div
                      className="absolute flex justify-between items-center pointer-events-auto"
                      style={{
                        top: "13%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "85%",
                      }}
                    >
                      <img
                        src="/interacivefile/FrienderFile/environ-1.png"
                        alt="Environment 1"
                        className="flex-1 opacity-0 max-w-[calc(15%-2px)] h-auto object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                        onClick={(e) => handleGifClick(1, e)}
                      />
                      <img
                        src="/interacivefile/FrienderFile/environ-2.png"
                        alt="Environment 2"
                        className="flex-1 opacity-0 max-w-[calc(15%-2px)] h-auto object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                        onClick={(e) => handleGifClick(2, e)}
                      />
                      <img
                        src="/interacivefile/FrienderFile/environ-3.png"
                        alt="Environment 3"
                        className="flex-1 opacity-0 max-w-[calc(15%-2px)] h-auto object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                        onClick={(e) => handleGifClick(3, e)}
                      />
                      <img
                        src="/interacivefile/FrienderFile/environ-4.png"
                        alt="Environment 4"
                        className="flex-1 opacity-0 max-w-[calc(15%-2px)] h-auto object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                        onClick={(e) => handleGifClick(4, e)}
                      />
                      <img
                        src="/interacivefile/FrienderFile/environ-5.png"
                        alt="Environment 5"
                        className="flex-1 opacity-0 max-w-[calc(15%-2px)] h-auto object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                        onClick={(e) => handleGifClick(5, e)}
                      />
                      <img
                        src="/interacivefile/FrienderFile/environ-6.png"
                        alt="Environment 6"
                        className="flex-1 opacity-0 max-w-[calc(15%-2px)] h-auto object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                        onClick={(e) => handleGifClick(6, e)}
                      />
                    </div>
                  )}

                  {/* 5페이지(index === 3)에만 비디오 추가 */}
                  {index === 3 && (
                    <div
                      className="absolute flex justify-center items-center"
                      style={{
                        top: "10%",
                        left: "47%",
                        transform: "translateX(-50%)",
                        width: "90%",
                      }}
                    >
                      <video
                        src="/interacivefile/FrienderFile/BlockCoding-VR.mp4"
                        className="w-[200px] h-[100px] object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                        controls
                        muted
                        loop
                        autoPlay={false}
                      />
                    </div>
                  )}

                  {/* 페이지 그림자 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          ))}
        </HTMLFlipBook>
        )}
      </div>

      {/* 네비게이션 - 모바일에서는 숨김 */}
      {!isMobile && (
      <div className="flex flex-col items-center gap-4 mt-6">
        {/* 페이지 그룹 네비게이션과 이전/다음 버튼을 한 줄에 배치 */}
        <div className="flex items-center gap-3">
          {/* 이전 페이지 버튼 */}
          <button
            onClick={() => {
              if (currentPage > 0) {
                safePageFlip(currentPage - 1);
              }
            }}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            ◀ 이전
          </button>
          
          {/* 다음 페이지 버튼 */}
          <button
            onClick={() => {
              if (currentPage < 7) {
                safePageFlip(currentPage + 1);
              }
            }}
            disabled={currentPage === 7}
            className="px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            다음 ▶
          </button>
        </div>
        
        {/* 현재 그룹 정보 표시 */}
        <div className="text-white text-center">
          <div className="text-sm opacity-75">
            페이지 {currentPage + 1} / 8
          </div>
        </div>
      </div>
      )}
      
      {/* Book 준비 상태 표시 - 모바일에서는 숨김 */}
      {!isMobile && !isBookReady && (
        <div className="mt-2 text-white text-sm opacity-75">
          책을 불러오는 중... 잠시만 기다려주세요.
        </div>
      )}

      {/* 모바일 하단 기능 버튼 */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0e1a26] p-4 z-40">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {/* Friender 버튼 */}
            <button 
              onClick={() => {
                // Friender로 전환 (현재 페이지)
                window.location.href = '/?book=friender';
              }} 
              className="flex flex-col items-center gap-1 text-white hover:text-blue-400 transition-colors"
            >
              <span className="text-sm font-medium">Friender</span>
            </button>
            
            {/* VQ 버튼 */}
            <button 
              onClick={() => {
                // VQ로 전환
                window.location.href = '/?book=vq';
              }} 
              className="flex flex-col items-center gap-1 text-white hover:text-blue-400 transition-colors"
            >
              <span className="text-sm font-medium">VQ</span>
            </button>
            
            {/* PDF 다운로드 버튼 */}
            <button 
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/func-file/FrienderFile/프랜더-소개-책자.pdf";
                link.download = "프랜더-소개-책자.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex flex-col items-center gap-1 text-white hover:text-blue-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            
            {/* 프린트 버튼 */}
            <button 
              onClick={() => {
                const pdfUrl = "/func-file/FrienderFile/프랜더-소개-책자.pdf";
                const pdfWindow = window.open(pdfUrl, "_blank");
                if (pdfWindow) {
                  pdfWindow.onload = () => {
                    pdfWindow.print();
                  };
                }
              }}
              className="flex flex-col items-center gap-1 text-white hover:text-blue-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 개선된 Gif 모달 */}
      {isModalOpen && selectedGif && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* Gif 이미지 */}
            <img
              src={selectedGif}
              alt="Selected Gif"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* 3D 모델 모달 */}
      {is3DModalOpen && <Model3D onClose={close3DModal} />}
    </div>
  );
}

export default Book;
