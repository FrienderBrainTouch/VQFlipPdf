import React, { useState, useEffect, useRef } from "react";

/**
 * IntroScreen 컴포넌트
 * 
 * 이 컴포넌트는 독립적인 인트로 화면을 구현합니다.
 * 주요 기능:
 * - 초기 로딩 애니메이션 (Friender 로고)
 * - 흰 화면에서 본 화면으로의 전환 효과
 * - 중앙 이미지 애니메이션
 * - 네비게이션 및 툴바 기능
 */
function IntroScreen() {
  // 상태 관리 변수들
  const [showIntro, setShowIntro] = useState(true); // 인트로 화면 표시 여부
  const [logoOpacity, setLogoOpacity] = useState(0); // 로고 투명도
  const [whiteScreenVisible, setWhiteScreenVisible] = useState(true); // 흰 화면 표시 여부
  const [mainScreenVisible, setMainScreenVisible] = useState(false); // 본 화면 표시 여부
  const [imageScale, setImageScale] = useState(1.2); // 중앙 이미지 스케일 (120%에서 시작)
  const [imageOpacity, setImageOpacity] = useState(0); // 중앙 이미지 투명도
  const [mainLogoOpacity, setMainLogoOpacity] = useState(0); // Main-Logo.png 투명도
  const [mainLogoScale, setMainLogoScale] = useState(0); // Main-Logo.png 스케일
  const [mainLogoPosition, setMainLogoPosition] = useState({ x: 0, y: 0 }); // Main-Logo.png 위치
  const [subTitleOpacity, setSubTitleOpacity] = useState(0); // VQ-Main-subTitle.png 투명도
  const [subTitleTransform, setSubTitleTransform] = useState('translateX(-100%)'); // VQ-Main-subTitle.png 위치
  const [subTitle2Opacity, setSubTitle2Opacity] = useState(0); // VQ-Main-subTitle2.png 투명도
  const [titleOpacity, setTitleOpacity] = useState(0); // VQ-Main-Title.png 투명도
  const [titleTransform, setTitleTransform] = useState('translateX(-100%)'); // VQ-Main-Title.png 위치
  // 스크롤 방식에서는 currentPage 상태가 필요하지 않음
  const [selectedGif, setSelectedGif] = useState(null); // 선택된 GIF 파일
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [modalSourcePage, setModalSourcePage] = useState(null); // 모달을 연 페이지
  const [loadedVideos, setLoadedVideos] = useState(new Set()); // 로드된 비디오 상태 관리

  // ref 변수들
  const animationRef = useRef(null);

  /**
   * 중앙 이미지 애니메이션 시작 함수 (배경 이미지 애니메이션 제거)
   */
  const startImageAnimation = () => {
    // 배경 이미지는 즉시 표시
    setImageScale(1);
    setImageOpacity(1);
    
    // 1초 대기 후 Main-Logo 애니메이션 시작
    // setTimeout(() => {
    //   startMainLogoAnimation();
    // }, 1000);
    
    // Main-Logo 애니메이션 대신 오버레이 애니메이션 바로 시작
    setTimeout(() => {
      startOverlayAnimations();
    }, 1000);
  };

  /**
   * Main-Logo 애니메이션 시작 함수
   */
  // const startMainLogoAnimation = () => {
  //   const startTime = performance.now();
  //   const duration = 4000; // 4초 (1초 대기 추가)

  //   const animate = (currentTime) => {
  //     const elapsed = currentTime - startTime;
  //     const progress = Math.min(elapsed / duration, 1);
      
  //     // ease-out 효과 적용
  //     const easeOut = 1 - Math.pow(1 - progress, 3);
      
  //     // 반응형 최종 설정 계산 (1024px 미만에서만 적용)
  //     const finalSettings = window.innerWidth < 1024 ? getResponsiveMainLogoFinalSettings() : { scale: 1.0, position: { x: 42, y: -41 } };
  //     const maxScale = 1.5; // 최대 scale은 고정
      
  //     // 1단계: opacity 0 → 1, scale 0 → maxScale (첫 1.5초)
  //     if (progress < 0.375) { // 1.5초 / 4초 = 0.375
  //       const firstPhaseProgress = progress / 0.375;
  //       setMainLogoOpacity(firstPhaseProgress);
  //       setMainLogoScale(firstPhaseProgress * maxScale);
  //       setMainLogoPosition({ x: 0, y: 0 }); // 중앙 위치
  //     }
  //     // 대기 단계: 1초 대기 (1.5초~2.5초)
  //     else if (progress < 0.625) { // 2.5초 / 4초 = 0.625
  //       setMainLogoOpacity(1);
  //       setMainLogoScale(maxScale);
  //       setMainLogoPosition({ x: 0, y: 0 }); // 중앙 위치 유지
  //     }
  //     // 2단계: 반응형 위치로 이동하면서 scale maxScale → finalScale (2.5초~4초)
  //     else {
  //       setMainLogoOpacity(1);
  //       const moveProgress = (progress - 0.625) / 0.375; // 1.5초 / 4초 = 0.375
  //       setMainLogoScale(maxScale - (maxScale - finalSettings.scale) * moveProgress); // maxScale에서 finalScale로 줄어듦
  //       // 반응형 위치로 이동
  //       const moveX = moveProgress * finalSettings.position.x; // 반응형 X 위치로 이동
  //       const moveY = moveProgress * finalSettings.position.y; // 반응형 Y 위치로 이동
  //       setMainLogoPosition({ x: moveX, y: moveY });
  //     }

  //     if (progress < 1) {
  //       animationRef.current = requestAnimationFrame(animate);
  //     } else {
  //       // Main-Logo 애니메이션 완료 후 오버레이 애니메이션 시작
  //       startOverlayAnimations();
  //     }
  //   };

  //   animationRef.current = requestAnimationFrame(animate);
  // };

  /**
   * 오버레이 애니메이션 시작 함수
   */
  const startOverlayAnimations = () => {
    // 1. VQ-Main-subTitle.png 왼쪽에서 나타남
    setTimeout(() => {
      animateOverlayFromLeft(setSubTitleOpacity, setSubTitleTransform, 1000);
    }, 500);

    // 2. VQ-Main-subTitle2.png로 바뀜
    setTimeout(() => {
      setSubTitleOpacity(0);
      setSubTitle2Opacity(1);
    }, 2000);

    // 3. VQ-Main-Title.png 왼쪽에서 나타남
    setTimeout(() => {
      animateOverlayFromLeft(setTitleOpacity, setTitleTransform, 1000);
    }, 2500);
  };

  /**
   * 왼쪽에서 나타나는 오버레이 애니메이션 함수
   */
  const animateOverlayFromLeft = (setOpacity, setTransform, duration) => {
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setOpacity(easeOut);
      setTransform(`translateX(${-100 + 100 * easeOut}%)`);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };


  // YouTube 비디오 ID 추출 함수
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // YouTube 썸네일 URL 생성 함수
  const getYouTubeThumbnail = (videoId, quality = 'hqdefault') => {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  };

  // 비디오 카테고리 데이터
  const videoCategories = [
    {
      title: "기업영상",
      color: "#f51818",
      videos: [
        "https://youtu.be/2YWRzzADzNw",
        "https://youtu.be/J89KuWAW87c",
        "https://youtu.be/72Sq-BJUsqs"
      ]
    },
    {
      title: "기관영상",
      color: "#f51818",
      videos: [
        "https://youtu.be/7b91z8DuvW0",
        "https://youtu.be/VzwAiSr9Rpg",
        "https://youtu.be/Sq64lYKgOhU"
      ]
    },
    {
      title: "인터뷰영상",
      color: "#f51818",
      videos: [
        "https://youtu.be/Eu4Frvecd40",
        "https://youtu.be/YBIfwqxkOEk",
        "https://youtu.be/Hz4K1VOUEvs"
      ]
    },
    {
      title: "교육영상",
      color: "#f51818",
      videos: [
        "https://youtu.be/wQ7HyzKQIDU",
        "https://youtu.be/dz2P2VxmVz4",
        "https://youtu.be/COSDutUnbxk"
      ]
    },
    {
      title: "모션그래픽",
      color: "#f51818",
      videos: [
        "https://youtu.be/9Tecvh3k5dU",
        "https://youtu.be/oKo8d7KoLco",
        "https://youtu.be/6uaaYcdflHc"
      ]
    },
    {
      title: "3D VFX",
      color: "#f51818",
      videos: [
        "https://youtu.be/hXTZvuxqWsY",
        "https://youtu.be/Wh6Wm5WnZtE",
        "https://youtu.be/j-Ra92wtxxw"
      ]
    }
  ];

  // VQ section-img 이미지 매핑 (페이지별 상세 이미지)
  const sectionImgMapping = {
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
      // 비디오 카테고리 페이지 - YouTube 링크들
    ],
    20: ["/interacivefile/VQFile/sectionimg/20-1.png"],
    21: ["/interacivefile/VQFile/sectionimg/21-1.png"],
    22: ["/interacivefile/VQFile/sectionimg/22-1.png"],
    23: ["/interacivefile/VQFile/sectionimg/23-1.png"],
    24: ["/interacivefile/VQFile/sectionimg/24-1.png"],
  };

  /**
   * 반응형 이미지 크기 계산 함수
   * @param {number} baseSize - 기본 크기
   * @returns {number} 조정된 크기
   */
  const getResponsiveImageSize = (baseSize) => {
    const isLargeScreen = window.innerWidth >= 1024;
    return isLargeScreen ? baseSize : baseSize * 0.8;
  };

  /**
   * 반응형 Main-Logo 최종 설정 계산 함수 (1024px 미만만 적용)
   * @returns {Object} 조정된 최종 scale과 위치 값
   */
  const getResponsiveMainLogoFinalSettings = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1024) {
      return {
        scale: 1.0,
        position: { x: 42, y: -41 } // 데스크톱: 기본 위치
      };
    } else if (screenWidth >= 768) {
      return {
        scale: 0.8, // 태블릿: 80%
        position: { x: 41, y: -41 } // 태블릿: 약간 왼쪽으로, 위로 덜 이동
      };
    } else if (screenWidth >= 480) {
      return {
        scale: 0.4, // 큰 모바일: 70%
        position: { x: 41, y: -41 } // 큰 모바일: 더 왼쪽으로, 위로 덜 이동
      };
    } else {
      return {
        scale: 0.3, // 작은 모바일: 60%
        position: { x: 40, y: -40 } // 작은 모바일: 가장 왼쪽으로, 위로 가장 덜 이동
      };
    }
  };

  /**
   * 화면 크기 변경 감지 및 이미지 크기 업데이트 (1024px 미만만 적용)
   */
  useEffect(() => {
    const handleResize = () => {
      // 화면 크기가 변경되면 컴포넌트를 다시 렌더링하여 이미지 크기 업데이트
      // 스크롤 방식에서는 currentPage 상태가 없으므로 별도 처리 불필요
      
      // 1024px 미만에서만 Main-Logo 반응형 설정 업데이트
      if (window.innerWidth < 1024 && mainLogoOpacity > 0 && mainLogoScale > 0) {
        const finalSettings = getResponsiveMainLogoFinalSettings();
        setMainLogoScale(finalSettings.scale);
        setMainLogoPosition(finalSettings.position);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mainLogoOpacity, mainLogoScale]);

  /**
   * 18번 페이지가 화면에 보이지 않을 때 비디오 정리 (메모리 절약)
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && entry.target.dataset.pageIndex === '18') {
            // 18번 페이지가 화면에서 벗어나면 비디오 정리
            setLoadedVideos(new Set());
          }
        });
      },
      { threshold: 0.1 }
    );

    // 18번 페이지 요소 관찰
    const page18Element = document.querySelector('[data-page-index="18"]');
    if (page18Element) {
      observer.observe(page18Element);
    }

    return () => observer.disconnect();
  }, []);

  // VQ 페이지별 개별 이미지 위치 설정 (절대 위치)
  const individualImagePositions = {
    2: [
      {
        // 2-1번 이미지 - 상단
        position: "absolute",
        top: "17%",
        left: "9%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
      {
        // 2-2번 이미지 - 중단
        position: "absolute",
        top: "48%",
        left: "8%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
      {
        // 2-3번 이미지 - 하단
        position: "absolute",
        bottom: "8%",
        left: "9%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    3: [
      {
        // 3-1번 이미지 - 상단 왼쪽
        position: "absolute",
        top: "17%",
        left: "4%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
      {
        // 3-2번 이미지 - 하단 오른쪽
        position: "absolute",
        bottom: "4%",
        right: "12%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    4: [
      {
        // 4-1번 이미지 - 상단
        position: "absolute",
        top: "9%",
        left: "8%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    5: [
      {
        // 5-1번 이미지 - 하단 오른쪽
        position: "absolute",
        bottom: "6%",
        right: "7%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    6: [
      {
        // 6-1번 이미지 - 중앙
        position: "absolute",
        top: "1%",
        left: "7%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    7: [
      {
        // 7-1번 이미지 - 상단 왼쪽
        position: "absolute",
        top: "19%",
        left: "9%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    8: [
      {
        // 8-1번 이미지 - 중앙
        position: "absolute",
        top: "1%",
        left: "7%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    9: [
      {
        // 9-1번 이미지 - 중앙
        position: "absolute",
        top: "1%",
        left: "7%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    10: [
      {
        // 10-1번 이미지 - 중앙
        position: "absolute",
        top: "2%",
        left: "7%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    11: [
      {
        // 11-1번 이미지 - 중앙
        position: "absolute",
        top: "5%",
        left: "14%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(70)}%`,
      },
    ],
    12: [
      {
        // 12-1번 이미지 - 중앙
        position: "absolute",
        top: "4%",
        left: "7%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    13: [
      {
        // 13-1번 이미지 - 상단
        position: "absolute",
        top: "11%",
        left: "0%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    14: [
      {
        // 14-1번 이미지 - 중앙
        position: "absolute",
        top: "4%",
        left: "7%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    15: [
      {
        // 15-1번 이미지 - 중앙
        position: "absolute",
        top: "30%",
        left: "14%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    16: [
      {
        // 16-1번 이미지 - 중앙
        position: "absolute",
        top: "4%",
        left: "7%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    17: [
      {
        // 17-1번 이미지 - 상단
        position: "absolute",
        top: "8%",
        left: "0%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    18: [
      {
        // 18-1번 이미지 - 상단
        position: "absolute",
        top: "10%",
        left: "9%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    19: [
      // 비디오 카테고리 페이지 - YouTube 링크들
    ],
    20: [
      {
        // 20-1번 이미지 - 상단
        position: "absolute",
        top: "9%",
        left: "9%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    21: [
      {
        // 21-1번 이미지 - 상단
        position: "absolute",
        top: "9%",
        left: "12%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    22: [
      {
        // 22-1번 이미지 - 중앙
        position: "absolute",
        top: "27%",
        left: "13%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    23: [
      {
        // 23-1번 이미지 - 중앙
        position: "absolute",
        top: "20%",
        left: "10%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
    24: [
      {
        // 24-1번 이미지 - 오른쪽 하단
        position: "absolute",
        bottom: "5%",
        right: "5%",
        width: "100%",
        maxWidth: `${getResponsiveImageSize(81)}%`,
      },
    ],
  };

  // VQ 페이지별 이미지 데이터 (24페이지)
  const pageImages = [
    {
      id: 0,
      name: "표지",
      backgroundImage: "/Pdf-img/VQ/1.png",
      overlays: []
    },
    {
      id: 1,
      name: "페이지 1",
      backgroundImage: "/Pdf-img/VQ/2.png",
      overlays: []
    },
    {
      id: 2,
      name: "페이지 2", 
      backgroundImage: "/Pdf-img/VQ/3.png",
      overlays: []
    },
    {
      id: 3,
      name: "페이지 3",
      backgroundImage: "/Pdf-img/VQ/4.png",
      overlays: []
    },
    {
      id: 4,
      name: "페이지 4",
      backgroundImage: "/Pdf-img/VQ/5.png",
      overlays: []
    },
    {
      id: 5,
      name: "페이지 5",
      backgroundImage: "/Pdf-img/VQ/6.png",
      overlays: []
    },
    {
      id: 6,
      name: "페이지 6",
      backgroundImage: "/Pdf-img/VQ/7.png",
      overlays: []
    },
    {
      id: 7,
      name: "페이지 7",
      backgroundImage: "/Pdf-img/VQ/8.png",
      overlays: []
    },
    {
      id: 8,
      name: "페이지 8",
      backgroundImage: "/Pdf-img/VQ/9.png",
      overlays: []
    },
    {
      id: 9,
      name: "페이지 9",
      backgroundImage: "/Pdf-img/VQ/10.png",
      overlays: []
    },
    {
      id: 10,
      name: "페이지 10",
      backgroundImage: "/Pdf-img/VQ/11.png",
      overlays: []
    },
    {
      id: 11,
      name: "페이지 11",
      backgroundImage: "/Pdf-img/VQ/12.png",
      overlays: []
    },
    {
      id: 12,
      name: "페이지 12",
      backgroundImage: "/Pdf-img/VQ/13.png",
      overlays: []
    },
    {
      id: 13,
      name: "페이지 13",
      backgroundImage: "/Pdf-img/VQ/14.png",
      overlays: []
    },
    {
      id: 14,
      name: "페이지 14",
      backgroundImage: "/Pdf-img/VQ/15.png",
      overlays: []
    },
    {
      id: 15,
      name: "페이지 15",
      backgroundImage: "/Pdf-img/VQ/16.png",
      overlays: []
    },
    {
      id: 16,
      name: "페이지 16",
      backgroundImage: "/Pdf-img/VQ/17.png",
      overlays: []
    },
    {
      id: 17,
      name: "페이지 17",
      backgroundImage: "/Pdf-img/VQ/18.png",
      overlays: []
    },
    {
      id: 18,
      name: "페이지 18",
      backgroundImage: "/Pdf-img/VQ/19.png",
      overlays: []
    },
    {
      id: 19,
      name: "페이지 19",
      backgroundImage: "/Pdf-img/VQ/20.png",
      overlays: []
    },
    {
      id: 20,
      name: "페이지 20",
      backgroundImage: "/Pdf-img/VQ/21.png",
      overlays: []
    },
    {
      id: 21,
      name: "페이지 21",
      backgroundImage: "/Pdf-img/VQ/22.png",
      overlays: []
    },
    {
      id: 22,
      name: "페이지 22",
      backgroundImage: "/Pdf-img/VQ/23.png",
      overlays: []
    },
    {
      id: 23,
      name: "페이지 23",
      backgroundImage: "/Pdf-img/VQ/24.png",
      overlays: []
    }
  ];


  /**
   * 컴포넌트 마운트 시 애니메이션 시퀀스 실행
   */
  useEffect(() => {
    // 1단계: 로고 애니메이션 (opacity 0 → 100)
    const logoAnimation = () => {
      const startTime = performance.now();
      const duration = 1500; // 1.5초

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // ease-out 효과 적용
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setLogoOpacity(easeOut);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // 로고 애니메이션 완료 후 2초 대기
          setTimeout(() => {
            startTransition();
          }, 2000);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // 2단계: 흰 화면이 위로 사라지는 전환
    const startTransition = () => {
      setWhiteScreenVisible(false);
      
      // 전환 완료 후 본 화면 표시
      setTimeout(() => {
        setMainScreenVisible(true);
        startImageAnimation();
      }, 500);
    };

    // 3단계: 중앙 이미지 애니메이션

    // 애니메이션 시작
    setTimeout(() => {
      logoAnimation();
    }, 500);

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  /**
   * 표지 페이지 애니메이션 시작 함수
   */
  const startCoverPageAnimation = () => {
    // 애니메이션 상태 초기화
    resetAnimationStates();
    
    // 1초 대기 후 Main-Logo 애니메이션 시작
    // setTimeout(() => {
    //   startMainLogoAnimation();
    // }, 1000);
    
    // Main-Logo 애니메이션 대신 오버레이 애니메이션 바로 시작
    setTimeout(() => {
      startOverlayAnimations();
    }, 1000);
  };

  /**
   * 애니메이션 상태 초기화 함수
   */
  const resetAnimationStates = () => {
    // 기존 애니메이션 정리
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // 모든 애니메이션 상태 초기화
    setMainLogoOpacity(0);
    setMainLogoScale(0);
    setMainLogoPosition({ x: 0, y: 0 });
    setSubTitleOpacity(0);
    setSubTitleTransform('translateX(-100%)');
    setSubTitle2Opacity(0);
    setTitleOpacity(0);
    setTitleTransform('translateX(-100%)');
  };


  /**
   * section-img 클릭 핸들러
   * 페이지별 상세 이미지/비디오를 클릭하면 모달로 표시
   * @param {string} mediaSrc - 미디어 경로 (이미지 또는 비디오)
   * @param {Event} event - 클릭 이벤트
   * @param {string} pageId - 페이지 ID
   */
  const handleSectionImgClick = (mediaSrc, event, pageId) => {
    event.stopPropagation(); // 이벤트 전파 방지

    setSelectedGif(mediaSrc);
    setModalSourcePage(parseInt(pageId));
    setIsModalOpen(true);
  };

  /**
   * 모달 닫기 핸들러
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGif(null);
    setModalSourcePage(null);
  };





  /**
   * 홈 버튼 클릭 핸들러 - IntroScreen 재시작
   */
  const handleHomeClick = () => {
    // 상태 초기화
    setShowIntro(true);
    setLogoOpacity(0);
    setWhiteScreenVisible(true);
    setMainScreenVisible(false);
    setImageScale(1.2);
    setImageOpacity(0);
    setMainLogoOpacity(0);
    setMainLogoScale(0);
    setMainLogoPosition({ x: 0, y: 0 });
    setSubTitleOpacity(0);
    setSubTitleTransform('translateX(-100%)');
    setSubTitle2Opacity(0);
    setTitleOpacity(0);
    setTitleTransform('translateX(-100%)');
    setSelectedGif(null);
    setIsModalOpen(false);
    setModalSourcePage(null);

    // 애니메이션 재시작
    setTimeout(() => {
      const logoAnimation = () => {
        const startTime = performance.now();
        const duration = 1500;

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          const easeOut = 1 - Math.pow(1 - progress, 3);
          setLogoOpacity(easeOut);

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            setTimeout(() => {
              setWhiteScreenVisible(false);
              setTimeout(() => {
                setMainScreenVisible(true);
                startCoverPageAnimation();
              }, 500);
            }, 2000);
          }
        };

        animationRef.current = requestAnimationFrame(animate);
      };


      logoAnimation();
    }, 500);
  };


  /**
   * 프린터 버튼 클릭 핸들러 - PDF를 열고 프린트
   */
  const handlePrintClick = () => {
    const pdfUrl = "/func-file/VQFile/(주)브이큐스튜디오_소개 카달로그.pdf";
    const pdfWindow = window.open(pdfUrl, "_blank");
    if (pdfWindow) {
      pdfWindow.onload = () => {
        pdfWindow.print();
      };
    }
  };

  /**
   * PDF 다운로드 버튼 클릭 핸들러
   */
  const handleDownloadClick = () => {
    const link = document.createElement("a");
    link.href = "/func-file/VQFile/(주)브이큐스튜디오_소개 카달로그.pdf";
    link.download = "(주)브이큐스튜디오_소개 카달로그.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * 공유 버튼 클릭 핸들러
   */
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: 'VQ',
        text: 'VQ 프로젝트를 확인해보세요!',
        url: window.location.href,
      }).then(() => {
        // Web Share API 성공 후에도 클립보드에 복사
        navigator.clipboard.writeText(window.location.href).then(() => {
          console.log('링크가 클립보드에 복사되었습니다!');
        }).catch(() => {
          console.log('클립보드 복사에 실패했습니다.');
        });
      }).catch(() => {
        // Web Share API 실패 시 클립보드에 복사
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('링크가 클립보드에 복사되었습니다!');
        }).catch(() => {
          alert('클립보드 복사에 실패했습니다.');
        });
      });
    } else {
      // Web Share API를 지원하지 않는 경우 클립보드에 복사
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('링크가 클립보드에 복사되었습니다!');
      }).catch(() => {
        alert('클립보드 복사에 실패했습니다.');
      });
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* 인트로 화면 (흰 화면 + 로고) */}
      {showIntro && (
        <div 
          className={`fixed inset-0 bg-white z-50 transition-transform duration-500 ease-out ${
            whiteScreenVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* VQ 로고 */}
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src="/interacivefile/VQFile/MainImg/VQ-Logo.svg"
              alt="VQ Logo"
              className="max-w-full max-h-full object-contain"
              style={{ opacity: logoOpacity }}
            />
          </div>
        </div>
      )}

      {/* 본 화면 */}
      {mainScreenVisible && (
        <div className="w-full h-full relative bg-white flex flex-col">
          {/* 상단 중앙 VQ 로고 (홈 버튼) */}
          <div className="flex justify-center items-center py-4 bg-white z-40">
            <button
              onClick={handleHomeClick}
              className="cursor-pointer"
            >
              <img 
                src="/interacivefile/VQFile/MainImg/VQ-Logo2.png"
                alt="VQ Logo"
                className="h-10 w-auto"
              />
            </button>
          </div>

          {/* 스크롤 컨테이너 - Book.jsx 방식 적용 */}
          <div className="flex-1 overflow-y-auto pb-20">
            {/* 페이지들을 세로로 배치 */}
            <div className="w-full space-y-0">
              {pageImages.map((page, index) => (
                <div
                  key={page.id}
                  className="relative overflow-hidden bg-white"
                  data-page-index={index}
                  style={{ 
                    width: '100%', 
                    aspectRatio: 'auto',
                    // minHeight: '100vh'
                  }}
                >
                  <div className="w-full h-full flex flex-col justify-center items-center p-4 text-center relative">
                    {/* 페이지 배경 이미지 */}
                    <img
                      src={page.backgroundImage}
                      alt={page.name}
                      className="w-full h-full object-cover"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />

                    {/* 표지 페이지(0번)일 때만 Main-Logo.png와 오버레이 이미지들 표시 */}
                    {index === 0 && (
                      <>
                        {/* Main-Logo.png - 주석처리 */}
                        {/* <div 
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            opacity: mainLogoOpacity,
                            transform: `translate(${mainLogoPosition.x}%, ${mainLogoPosition.y}%) scale(${mainLogoScale})`,
                            transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
                          }}
                        >
                          <img
                            src="/interacivefile/VQFile/MainImg/Main-Logo.png"
                            alt="Main Logo"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div> */}

                        {/* Main-LogoLarge.png - 고정 배치 */}
                        <div className="absolute inset-0">
                          <img
                            src="/interacivefile/VQFile/MainImg/Main-LogoLage.png"
                            alt="Main Logo Large"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* VQ-Main-subTitle.png - 왼쪽에서 나타남 */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            opacity: subTitleOpacity,
                            transform: subTitleTransform,
                            transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
                          }}
                        >
                          <img
                            src="/interacivefile/VQFile/MainImg/VQ-Main-subTitle.png"
                            alt="VQ Main SubTitle"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* VQ-Main-subTitle2.png - 바뀌는 이미지 */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            opacity: subTitle2Opacity,
                            transition: 'opacity 0.3s ease-in-out'
                          }}
                        >
                          <img
                            src="/interacivefile/VQFile/MainImg/VQ-Main-subTitle2.png"
                            alt="VQ Main SubTitle 2"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* VQ-Main-Title.png - 왼쪽에서 나타남 */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            opacity: titleOpacity,
                            transform: titleTransform,
                            transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
                          }}
                        >
                          <img
                            src="/interacivefile/VQFile/MainImg/VQ-Main-Title.png"
                            alt="VQ Main Title"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </>
                    )}

                    {/* 내부 페이지들(1-23번)의 인터랙티브 요소들 */}
                    {index > 0 && (
                      <>
                        {/* 18번 페이지 - 비디오 카테고리 */}
                        {index === 18 && (
                          <div className="absolute inset-0 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                            <div className="grid grid-cols-1 gap-2 h-full">
                              {videoCategories.map((category, categoryIndex) => (
                                <div key={categoryIndex} className="flex flex-col">
                                  {/* 카테고리 제목 */}
                                  <h3 
                                    className="text-lg font-black mb-2 text-center"
                                    style={{ 
                                      color: category.color,
                                      textShadow: '1px 1px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000'
                                    }}
                                  >
                                    {category.title}
                                  </h3>
                                  
                                  {/* YouTube 플레이어들 */}
                                  <div className="flex-1 space-y-1">
                                    {category.videos.map((videoUrl, videoIndex) => {
                                      const videoId = getYouTubeVideoId(videoUrl);
                                      const videoKey = `${categoryIndex}-${videoIndex}`;
                                      const isLoaded = loadedVideos.has(videoKey);
                                      
                                      return (
                                        <div key={videoIndex} className="relative">
                                          {videoId ? (
                                            <div 
                                              className="relative w-full" 
                                              style={{ 
                                                paddingBottom: '56.25%', 
                                                pointerEvents: 'auto',
                                                touchAction: 'manipulation',
                                                WebkitTouchCallout: 'none',
                                                WebkitUserSelect: 'none',
                                                userSelect: 'none'
                                              }}
                                            >
                                              {isLoaded ? (
                                                <iframe
                                                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0&enablejsapi=1`}
                                                  title={`${category.title} ${videoIndex + 1}`}
                                                  frameBorder="0"
                                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                  allowFullScreen
                                                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                                                  style={{ 
                                                    border: 'none',
                                                    pointerEvents: 'auto',
                                                    zIndex: 1,
                                                    touchAction: 'manipulation',
                                                    WebkitTouchCallout: 'none',
                                                    WebkitUserSelect: 'none',
                                                    userSelect: 'none',
                                                    WebkitTapHighlightColor: 'transparent'
                                                  }}
                                                  onLoad={(e) => {
                                                    // iframe 로드 후 터치 이벤트 활성화
                                                    const iframe = e.target;
                                                    if (iframe) {
                                                      iframe.style.pointerEvents = 'auto';
                                                      iframe.style.touchAction = 'manipulation';
                                                      iframe.style.WebkitTouchCallout = 'none';
                                                      iframe.style.WebkitUserSelect = 'none';
                                                      iframe.style.userSelect = 'none';
                                                    }
                                                  }}
                                                />
                                              ) : (
                                                <div 
                                                  className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300 transition-all duration-300 group"
                                                  onClick={() => {
                                                    setLoadedVideos(prev => new Set([...prev, videoKey]));
                                                  }}
                                                >
                                                  <img 
                                                    src={getYouTubeThumbnail(videoId, 'hqdefault')}
                                                    alt={`${category.title} ${videoIndex + 1} 썸네일`}
                                                    className="w-full h-full object-cover rounded-lg"
                                                  />
                                                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg group-hover:bg-black/60 transition-colors duration-300">
                                                    <div className="text-white text-center">
                                                      <svg className="w-8 h-8 mx-auto mb-1 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z"/>
                                                      </svg>
                                                      <p className="text-xs font-semibold drop-shadow-lg">클릭하여 재생</p>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          ) : (
                                            <div className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                              <span className="text-gray-500 text-sm">비디오 로드 실패</span>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 다른 페이지들의 section-img 이미지들을 개별적으로 배치 */}
                        {index !== 18 && sectionImgMapping[index + 1] &&
                          individualImagePositions[index + 1] && (
                            <>
                              {sectionImgMapping[index + 1].map((mediaSrc, imgIndex) => {
                                const isVideo = mediaSrc.endsWith(".mp4");
                                const imagePosition = individualImagePositions[index + 1]?.[imgIndex];
                                
                                // 이미지 위치 설정이 없는 경우 렌더링하지 않음
                                if (!imagePosition) {
                                  return null;
                                }
                                
                                return (
                                  <div
                                    key={imgIndex}
                                    className="absolute cursor-pointer hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-500 rounded-lg pointer-events-auto bg-transparent"
                                    style={imagePosition}
                                    onClick={(e) =>
                                      handleSectionImgClick(mediaSrc, e, index + 1)
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
                                        alt={`Section ${index + 1}-${imgIndex + 1}`}
                                        className="w-full h-full object-contain opacity-0 hover:opacity-100 transition-opacity duration-300"
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </>
                          )}

                      </>
                    )}

                    {/* 페이지 그림자 효과 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 기능 탭 - 가로 배치 */}
          <div className="absolute bottom-0 left-0 right-0 z-40 bg-gray-800 p-3">
            <div className="flex justify-center items-center gap-4">
              {/* 홈(Intro) 버튼 */}
              <button
                onClick={() => window.location.href = '/'}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title="홈(Intro)"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>

              {/* 프린터 버튼 */}
              <button
                onClick={handlePrintClick}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title="프린트"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>

              {/* PDF 다운로드 버튼 */}
              <button
                onClick={handleDownloadClick}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title="PDF 다운로드"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>

              {/* 공유 버튼 */}
              <button
                onClick={handleShareClick}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title="공유"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
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



    </div>
  );
}

export default IntroScreen;
