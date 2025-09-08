import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import Model3D from "./Model3D";

/**
 * VQ 프로젝트 플립북 컴포넌트
 * 
 * 이 컴포넌트는 VQ 프로젝트의 인터랙티브 플립북을 구현합니다.
 * 주요 기능:
 * - PDF 페이지를 플립북 형태로 표시
 * - 표지 페이지의 애니메이션 효과
 * - 인터랙티브 이미지와 비디오 클릭 시 모달 표시
 * - 3D 모델 뷰어 연동
 * - 반응형 디자인 지원
 * - 키보드 및 터치 네비게이션
 */
function VQBook() {
  // 상태 관리 변수들
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 번호
  const [isCoverVisible, setIsCoverVisible] = useState(false); // 표지 표시 상태
  const [isMainImageAnimating, setIsMainImageAnimating] = useState(false); // 메인 이미지 애니메이션 상태
  const [mainImageSize, setMainImageSize] = useState(1); // 메인 이미지 크기
  const [selectedGif, setSelectedGif] = useState(null); // 선택된 미디어 파일
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

  // PDF 경로 설정
  const pdfPath = "/func-file/VQFile/(주)브이큐스튜디오_소개 카달로그.pdf";

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
   * main 이미지 애니메이션 함수
   * @param {number} startSize - 시작 크기
   * @param {number} endSize - 종료 크기
   * @param {number} duration - 애니메이션 지속 시간 (밀리초)
   */
  const animateMainImage = (startSize, endSize, duration) => {
    const startTime = performance.now();
    const sizeDiff = endSize - startSize;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 일정한 선형 애니메이션 (ease-out 효과 제거)
      const currentSize = startSize + sizeDiff * progress;

      setMainImageSize(currentSize);

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
      setIsCoverVisible(true);

      // 2초 후에 main 이미지 애니메이션 시작
      const mainImageTimer = setTimeout(() => {
        setIsMainImageAnimating(true);
        // 애니메이션 시작
        const endSize = Math.min(window.innerWidth < 576 ? 320 : 320, 320); // 100px 작은 크기
        animateMainImage(1, endSize, 1000);
      }, 2000);

      return () => clearTimeout(mainImageTimer);
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
        if (currentPage < 24) {
          safePageFlip(currentPage + 1);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentPage]);

  // VQ 프로젝트 페이지 데이터 (24페이지)
  const vqData = [
    {
      id: "2",
      name: "VQ Page 2",
      description: "VQ 프로젝트 두 번째 페이지입니다.",
    },
    {
      id: "3",
      name: "VQ Page 3",
      description: "VQ 프로젝트 세 번째 페이지입니다.",
    },
    {
      id: "4",
      name: "VQ Page 4",
      description: "VQ 프로젝트 네 번째 페이지입니다.",
    },
    {
      id: "5",
      name: "VQ Page 5",
      description: "VQ 프로젝트 다섯 번째 페이지입니다.",
    },
    {
      id: "6",
      name: "VQ Page 6",
      description: "VQ 프로젝트 여섯 번째 페이지입니다.",
    },
    {
      id: "7",
      name: "VQ Page 7",
      description: "VQ 프로젝트 일곱 번째 페이지입니다.",
    },
    {
      id: "8",
      name: "VQ Page 8",
      description: "VQ 프로젝트 여덟 번째 페이지입니다.",
    },
    {
      id: "9",
      name: "VQ Page 9",
      description: "VQ 프로젝트 아홉 번째 페이지입니다.",
    },
    {
      id: "10",
      name: "VQ Page 10",
      description: "VQ 프로젝트 열 번째 페이지입니다.",
    },
    {
      id: "11",
      name: "VQ Page 11",
      description: "VQ 프로젝트 열한 번째 페이지입니다.",
    },
    {
      id: "12",
      name: "VQ Page 12",
      description: "VQ 프로젝트 열두 번째 페이지입니다.",
    },
    {
      id: "13",
      name: "VQ Page 13",
      description: "VQ 프로젝트 열세 번째 페이지입니다.",
    },
    {
      id: "14",
      name: "VQ Page 14",
      description: "VQ 프로젝트 열네 번째 페이지입니다.",
    },
    {
      id: "15",
      name: "VQ Page 15",
      description: "VQ 프로젝트 열다섯 번째 페이지입니다.",
    },
    {
      id: "16",
      name: "VQ Page 16",
      description: "VQ 프로젝트 열여섯 번째 페이지입니다.",
    },
    {
      id: "17",
      name: "VQ Page 17",
      description: "VQ 프로젝트 열일곱 번째 페이지입니다.",
    },
    {
      id: "18",
      name: "VQ Page 18",
      description: "VQ 프로젝트 열여덟 번째 페이지입니다.",
    },
    {
      id: "19",
      name: "VQ Page 19",
      description: "VQ 프로젝트 열아홉 번째 페이지입니다.",
    },
    {
      id: "20",
      name: "VQ Page 20",
      description: "VQ 프로젝트 스물 번째 페이지입니다.",
    },
    {
      id: "21",
      name: "VQ Page 21",
      description: "VQ 프로젝트 스물한 번째 페이지입니다.",
    },
    {
      id: "22",
      name: "VQ Page 22",
      description: "VQ 프로젝트 스물두 번째 페이지입니다.",
    },
    {
      id: "23",
      name: "VQ Page 23",
      description: "VQ 프로젝트 스물세 번째 페이지입니다.",
    },
    {
      id: "24",
      name: "VQ Page 24",
      description: "VQ 프로젝트 스물네 번째 페이지입니다.",
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
        { groupId: 8, pages: [7], description: "7장" },
        { groupId: 9, pages: [8], description: "8장" },
        { groupId: 10, pages: [9], description: "9장" },
        { groupId: 11, pages: [10], description: "10장" },
        { groupId: 12, pages: [11], description: "11장" },
        { groupId: 13, pages: [12], description: "12장" },
        { groupId: 14, pages: [13], description: "13장" },
        { groupId: 15, pages: [14], description: "14장" },
        { groupId: 16, pages: [15], description: "15장" },
        { groupId: 17, pages: [16], description: "16장" },
        { groupId: 18, pages: [17], description: "17장" },
        { groupId: 19, pages: [18], description: "18장" },
        { groupId: 20, pages: [19], description: "19장" },
        { groupId: 21, pages: [20], description: "20장" },
        { groupId: 22, pages: [21], description: "21장" },
        { groupId: 23, pages: [22], description: "22장" },
        { groupId: 24, pages: [23], description: "23장" },
        { groupId: 25, pages: [24], description: "24장" }
      ];
    } else {
      // 576px 이상: 2장씩 보여지는 구조 (기존과 동일)
      return [
        { groupId: 1, pages: [0], description: "표지" },
        { groupId: 2, pages: [1, 2], description: "1-2장" },
        { groupId: 3, pages: [3, 4], description: "3-4장" },
        { groupId: 4, pages: [5, 6], description: "5-6장" },
        { groupId: 5, pages: [7, 8], description: "7-8장" },
        { groupId: 6, pages: [9, 10], description: "9-10장" },
        { groupId: 7, pages: [11, 12], description: "11-12장" },
        { groupId: 8, pages: [13, 14], description: "13-14장" },
        { groupId: 9, pages: [15, 16], description: "15-16장" },
        { groupId: 10, pages: [17, 18], description: "17-18장" },
        { groupId: 11, pages: [19, 20], description: "19-20장" },
        { groupId: 12, pages: [21, 22], description: "21-22장" },
        { groupId: 13, pages: [23, 24], description: "23-24장" }
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

  // VQ section-img 이미지 매핑 (페이지별 상세 이미지)
  const vqSectionImgMapping = {
    2: [
      "/interacivefile/VQFile/sectionimg/2-1.png",
      "/interacivefile/VQFile/sectionimg/2-2.png",
      "/interacivefile/VQFile/sectionimg/2-3.png",
    ],
    3: [
      "/interacivefile/VQFile/sectionimg/3-1.png",
      "/interacivefile/VQFile/sectionimg/3-2.png",
    ],
    4: ["/interacivefile/VQFile/sectionimg/4-1.png"],
    5: ["/interacivefile/VQFile/sectionimg/5-1.png"],
    6: ["/interacivefile/VQFile/sectionimg/6-1.png"],
    7: ["/interacivefile/VQFile/sectionimg/7-1.png"],
    8: ["/interacivefile/VQFile/sectionimg/8-1.png"],
    9: ["/interacivefile/VQFile/sectionimg/9-1.png"],
    10: ["/interacivefile/VQFile/sectionimg/10-1.png"],
    11: ["/interacivefile/VQFile/sectionimg/11-1.png"],
    12: ["/interacivefile/VQFile/sectionimg/12-1.png"],
    13: ["/interacivefile/VQFile/sectionimg/13-1.png"],
    14: ["/interacivefile/VQFile/sectionimg/14-1.png"],
    15: ["/interacivefile/VQFile/sectionimg/15-1.png"],
    16: ["/interacivefile/VQFile/sectionimg/16-1.png"],
    17: ["/interacivefile/VQFile/sectionimg/17-1.png"],
    18: ["/interacivefile/VQFile/sectionimg/18-1.png"],
    19: [
      "/interacivefile/VQFile/19-1-video.mp4", // 19페이지는 비디오
      "/interacivefile/VQFile/19-2-video.mp4", // 19페이지는 비디오
    ],
    20: ["/interacivefile/VQFile/sectionimg/20-1.png"],
    21: ["/interacivefile/VQFile/sectionimg/21-1.png"],
    22: ["/interacivefile/VQFile/sectionimg/22-1.png"],
    23: ["/interacivefile/VQFile/sectionimg/23-1.png"],
    24: ["/interacivefile/VQFile/sectionimg/24-1.png"],
  };

  // VQ 페이지별 개별 이미지 위치 설정 (절대 위치)
  const vqIndividualImagePositions = {
    2: [
      {
        position: "absolute",
        top: "17%",
        left: "9%",
        width: "100%",
        maxWidth: "300px",
      },
      {
        position: "absolute",
        top: "48%",
        left: "8%",
        width: "100%",
        maxWidth: "320px",
      },
      {
        position: "absolute",
        bottom: "8%",
        left: "9%",
        width: "100%",
        maxWidth: "320px",
      },
    ],
    3: [
      {
        position: "absolute",
        top: "17%",
        left: "4%",
        width: "100%",
        maxWidth: "310px",
      },
      {
        position: "absolute",
        bottom: "4%",
        right: "12%",
        width: "100%",
        maxWidth: "310px",
      },
    ],
    4: [
      {
        position: "absolute",
        top: "9%",
        left: "8%",
        width: "100%",
        maxWidth: "300px",
      },
    ],
    5: [
      {
        position: "absolute",
        bottom: "6%",
        right: "7%",
        width: "100%",
        maxWidth: "180px",
      },
    ],
    6: [
      {
        position: "absolute",
        top: "19%",
        left: "25%",
        width: "100%",
        maxWidth: "190px",
      },
    ],
    7: [
      {
        position: "absolute",
        top: "19%",
        left: "9%",
        width: "100%",
        maxWidth: "300px",
      },
    ],
    8: [
      {
        position: "absolute",
        top: "20%",
        left: "25%",
        width: "100%",
        maxWidth: "190px",
      },
    ],
    9: [
      {
        position: "absolute",
        top: "19%",
        left: "16%",
        width: "100%",
        maxWidth: "245px",
      },
    ],
    10: [
      {
        position: "absolute",
        top: "20%",
        left: "25%",
        width: "100%",
        maxWidth: "190px",
      },
    ],
    11: [
      {
        position: "absolute",
        top: "17%",
        left: "24%",
        width: "100%",
        maxWidth: "184px",
      },
    ],
    12: [
      {
        position: "absolute",
        top: "20%",
        left: "24%",
        width: "100%",
        maxWidth: "195px",
      },
    ],
    13: [
      {
        position: "absolute",
        top: "11%",
        left: "0%",
        width: "100%",
        maxWidth: "292px",
      },
    ],
    14: [
      {
        position: "absolute",
        top: "20%",
        left: "25%",
        width: "100%",
        maxWidth: "190px",
      },
    ],
    15: [
      {
        position: "absolute",
        top: "30%",
        left: "14%",
        width: "100%",
        maxWidth: "268px",
      },
    ],
    16: [
      {
        position: "absolute",
        top: "20%",
        left: "25%",
        width: "100%",
        maxWidth: "190px",
      },
    ],
    17: [
      {
        position: "absolute",
        top: "8%",
        left: "0%",
        width: "100%",
        maxWidth: "288px",
      },
    ],
    18: [
      {
        position: "absolute",
        top: "10%",
        left: "9%",
        width: "100%",
        maxWidth: "298px",
      },
    ],
    19: [
      {
        position: "absolute",
        top: "10%",
        left: "25%",
        width: "100%",
        maxWidth: "175px",
      },
      {
        position: "absolute",
        top: "10%",
        right: "25%",
        width: "100%",
        maxWidth: "175px",
      },
    ],
    20: [
      {
        position: "absolute",
        top: "9%",
        left: "9%",
        width: "100%",
        maxWidth: "308px",
      },
    ],
    21: [
      {
        position: "absolute",
        top: "9%",
        left: "12%",
        width: "100%",
        maxWidth: "264px",
      },
    ],
    22: [
      {
        position: "absolute",
        top: "27%",
        left: "13%",
        width: "100%",
        maxWidth: "284px",
      },
    ],
    23: [
      {
        position: "absolute",
        top: "35%",
        left: "31%",
        width: "100%",
        maxWidth: "134px",
      },
    ],
    24: [
      {
        position: "absolute",
        top: "20%",
        left: "25%",
        width: "100%",
        maxWidth: "200px",
      },
    ],
  };

  /**
   * section-img 클릭 핸들러
   * 페이지별 상세 이미지를 클릭하면 모달로 표시
   * 특정 이미지(2-1.png)는 3D 모델로 표시
   * @param {string} imgSrc - 이미지 경로
   * @param {Event} event - 클릭 이벤트
   * @param {string} pageId - 페이지 ID
   */
  const handleSectionImgClick = (imgSrc, event, pageId) => {
    event.stopPropagation(); // 이벤트 전파 방지

    // 특정 이미지 클릭 시 3D 모델 표시 (예: 2-1.png)
    if (imgSrc.includes("2-1.png")) {
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
  const bookWidth = isMobile ? 320 : 370;
  const bookHeight = isMobile ? 450 : 500;

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
        setIsCoverVisible(true);
        // 2초 후에 main 이미지 애니메이션 시작
        setTimeout(() => {
          setIsMainImageAnimating(true);
          const endSize = Math.min(window.innerWidth < 576 ? 320 : 320, 320);
          animateMainImage(1, endSize, 1000);
        }, 2000);
      }, 500);
    } else {
      setIsCoverVisible(false);
      setIsMainImageAnimating(false);
      setMainImageSize(1);

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
    if (currentPage < 24) {
      safePageFlip(currentPage + 1);
    }
  };

  return (
    <div className="w-full flex flex-col justify-start items-center">
      {/* 플립북 컨테이너 */}
      <div className="w-full">
        {/* 모든 해상도에서 세로 스크롤로 페이지를 차례대로 표시 */}
        <div className="w-full space-y-0 py-0 pb-20">
          {/* 표지 페이지 */}
          <div className="relative overflow-hidden" style={{ height: '100vh' }}>
            <div className="w-full h-full flex flex-col justify-center items-center p-0 text-center text-white font-bold relative">
              {/* 배경 이미지 */}
              <img
                src="/Pdf-img/VQ/1.png"
                alt="VQ Cover Background"
                className="w-full h-full object-cover"
              />

              {/* 페이지 그림자 효과 */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* 내부 페이지들 */}
          {vqData.map((page, index) => (
            <div
              key={page.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded shadow-lg relative"
              style={{ height: '100vh' }}
            >
              <div className="w-full h-full flex flex-col justify-center items-center p-0">
                <div className="w-full h-full relative">
                  {/* 페이지 배경 이미지 */}
                  <img
                    src={`/Pdf-img/VQ/${page.id}.png`}
                    alt={page.name}
                    className="w-full h-full object-cover pointer-events-none"
                  />

                  {/* 각 페이지별 section-img 이미지들을 개별적으로 배치 */}
                  {vqSectionImgMapping[page.id] &&
                    vqIndividualImagePositions[page.id] && (
                      <>
                        {vqSectionImgMapping[page.id].map(
                          (mediaSrc, imgIndex) => {
                            const isVideo = mediaSrc.endsWith(".mp4");
                            const imagePosition = vqIndividualImagePositions[page.id]?.[imgIndex];
                            
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
                                  handleSectionImgClick(mediaSrc, e, page.id)
                                }
                              >
                                {isVideo ? (
                                  <video
                                    src={mediaSrc}
                                    className="w-full h-full rounded-lg object-contain opacity-100 cursor-pointer hover:scale-105 transition-transform duration-300"
                                    controls
                                    muted
                                    loop
                                    autoPlay={false}
                                  />
                                ) : (
                                  <img
                                    src={mediaSrc}
                                    alt={`Section ${page.id}-${imgIndex + 1}`}
                                    className="w-full h-full object-contain opacity-0 hover:opacity-100 transition-opacity duration-300"
                                  />
                                )}
                              </div>
                            );
                          }
                        )}
                      </>
                    )}

                  {/* 페이지 그림자 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 모든 해상도에서 하단 기능 버튼 표시 */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0e1a26] p-4 z-40">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {/* Friender 버튼 */}
          <button 
            onClick={() => {
              // Friender로 전환
              window.location.href = '/friender';
            }} 
            className="flex flex-col items-center gap-1 text-white hover:text-blue-400 transition-colors"
          >
            <span className="text-sm font-medium">Friender</span>
          </button>
          
          {/* VQ 버튼 */}
          <button 
            onClick={() => {
              // VQ로 전환 (현재 페이지)
              window.location.href = '/vq';
            }} 
            className="flex flex-col items-center gap-1 text-white hover:text-blue-400 transition-colors"
          >
            <span className="text-sm font-medium">VQ</span>
          </button>
          
          {/* PDF 다운로드 버튼 */}
          <button 
            onClick={() => {
              const link = document.createElement("a");
              link.href = "/func-file/VQFile/(주)브이큐스튜디오_소개 카달로그.pdf";
              link.download = "(주)브이큐스튜디오_소개 카달로그.pdf";
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
              const pdfUrl = "/func-file/VQFile/(주)브이큐스튜디오_소개 카달로그.pdf";
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

            {/* 미디어 (이미지 또는 비디오) */}
            {selectedGif.endsWith(".mp4") ? (
              <video
                src={selectedGif}
                className="w-full h-auto object-contain rounded-lg"
                controls
                muted
                loop
                autoPlay={false}
              />
            ) : (
              <img
                src={selectedGif}
                alt="Selected Media"
                className="w-full h-auto object-contain rounded-lg"
              />
            )}
          </div>
        </div>
      )}

      {/* 3D 모델 모달 */}
      {is3DModalOpen && <Model3D onClose={close3DModal} />}
    </div>
  );
}

export default VQBook;
