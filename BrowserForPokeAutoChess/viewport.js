//
//  viewport.js
//  BrowserForPokeAutoChess
//
//  Created by 안준경 on 7/2/25.
//

var existingViewport = document.querySelector('meta[name="viewport"]');
if (existingViewport) {
    existingViewport.remove();
}

var meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
document.head.appendChild(meta);

// 디바이스 정보 저장
const DEVICE_WIDTH = \(width);
const DEVICE_HEIGHT = \(height);

// 16:9 비율 기준으로 최적 크기 계산
const TARGET_RATIO = 16 / 9;
const DEVICE_RATIO = DEVICE_WIDTH / DEVICE_HEIGHT;

let OPTIMAL_WIDTH, OPTIMAL_HEIGHT, SCALE_FACTOR;

if (DEVICE_RATIO > TARGET_RATIO) {
    // 디바이스가 더 넓음 - 높이 기준으로 16:9 맞춤
    OPTIMAL_HEIGHT = DEVICE_HEIGHT;
    OPTIMAL_WIDTH = DEVICE_HEIGHT * TARGET_RATIO;
    SCALE_FACTOR = DEVICE_HEIGHT / 900; // 900px 기준 높이
} else {
    // 디바이스가 더 좁음 - 너비 기준으로 16:9 맞춤
    OPTIMAL_WIDTH = DEVICE_WIDTH;
    OPTIMAL_HEIGHT = DEVICE_WIDTH / TARGET_RATIO;
    SCALE_FACTOR = DEVICE_WIDTH / 1600; // 1600px 기준 너비
}

// 중앙 정렬을 위한 오프셋 계산
const OFFSET_X = (DEVICE_WIDTH - OPTIMAL_WIDTH) / 2;
const OFFSET_Y = (DEVICE_HEIGHT - OPTIMAL_HEIGHT) / 2;

// 글로벌 CSS 변수 설정
var rootStyle = document.createElement('style');
rootStyle.textContent = `
    :root {
        --device-width: ${DEVICE_WIDTH}px;
        --device-height: ${DEVICE_HEIGHT}px;
        --optimal-width: ${OPTIMAL_WIDTH}px;
        --optimal-height: ${OPTIMAL_HEIGHT}px;
        --scale-factor: ${SCALE_FACTOR};
        --offset-x: ${OFFSET_X}px;
        --offset-y: ${OFFSET_Y}px;
        --base-font-size: ${Math.max(12, 16 * SCALE_FACTOR)}px;
    }
`;
document.head.appendChild(rootStyle);

// 포괄적인 CSS 스타일 추가
var style = document.createElement('style');
style.textContent = `
    /* === 기본 레이아웃 리셋 === */
    html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        overflow: hidden !important;
        position: relative !important;
        box-sizing: border-box !important;
        background: #000 !important;
    }
    
    * {
        box-sizing: border-box !important;
    }
    
    /* === 메인 게임 컨테이너 16:9 비율 === */
    #app, .app, #root, .root, main, .main,
    [class*="container"], [class*="wrapper"], [class*="layout"],
    [id*="game"], [class*="game"], [id*="app"], [class*="app"] {
        width: var(--optimal-width) !important;
        height: var(--optimal-height) !important;
        max-width: var(--optimal-width) !important;
        max-height: var(--optimal-height) !important;
        position: absolute !important;
        top: var(--offset-y) !important;
        left: var(--offset-x) !important;
        overflow: hidden !important;
        transform-origin: top left !important;
        background: transparent !important;
    }
    
    /* === 전체 스케일링 적용 === */
    body > * {
        transform: scale(var(--scale-factor)) !important;
        transform-origin: top left !important;
    }
    
    /* === 이미지 처리 === */
    img {
        max-width: 100% !important;
        max-height: 100% !important;
        width: auto !important;
        height: auto !important;
        object-fit: contain !important;
        display: block !important;
    }
    
    /* === 캔버스 요소 === */
    canvas {
        max-width: 100% !important;
        max-height: 100% !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
        image-rendering: pixelated !important;
    }
    
    /* === SVG 요소 === */
    svg {
        max-width: 100% !important;
        max-height: 100% !important;
        width: auto !important;
        height: auto !important;
    }
    
    /* === 비디오 요소 === */
    video {
        max-width: 100% !important;
        max-height: 100% !important;
        object-fit: contain !important;
    }
    
    /* === 텍스트 및 폰트 === */
    body, input, button, textarea, select {
        font-size: var(--base-font-size) !important;
        line-height: 1.4 !important;
    }
    
    h1, h2, h3, h4, h5, h6 {
        font-size: calc(var(--base-font-size) * 1.2) !important;
        margin: 0.5em 0 !important;
    }
    
    /* === 버튼 및 UI 요소 === */
    button, input[type="button"], input[type="submit"], .btn, [class*="button"] {
        min-height: calc(44px * var(--scale-factor)) !important;
        min-width: calc(44px * var(--scale-factor)) !important;
        font-size: var(--base-font-size) !important;
        padding: calc(8px * var(--scale-factor)) calc(16px * var(--scale-factor)) !important;
        border-radius: calc(4px * var(--scale-factor)) !important;
        cursor: pointer !important;
        touch-action: manipulation !important;
    }
    
    /* === 입력 필드 === */
    input, textarea, select {
        min-height: calc(40px * var(--scale-factor)) !important;
        font-size: var(--base-font-size) !important;
        padding: calc(8px * var(--scale-factor)) !important;
    }
    
    /* === 고정 크기 요소들 동적 조절 === */
    [style*="width:"], [style*="height:"] {
        width: auto !important;
        height: auto !important;
        max-width: 100% !important;
        max-height: 100% !important;
    }
    
    /* === 절대 위치 요소들 === */
    [style*="position: absolute"], [style*="position:absolute"] {
        position: absolute !important;
        max-width: var(--optimal-width) !important;
        max-height: var(--optimal-height) !important;
    }
    
    [style*="position: fixed"], [style*="position:fixed"] {
        position: fixed !important;
        max-width: var(--optimal-width) !important;
        max-height: var(--optimal-height) !important;
    }
    
    /* === 팝업 및 모달 === */
    .modal, .popup, .dialog, [class*="modal"], [class*="popup"], [class*="dialog"] {
        max-width: calc(var(--optimal-width) * 0.9) !important;
        max-height: calc(var(--optimal-height) * 0.9) !important;
        margin: auto !important;
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) scale(var(--scale-factor)) !important;
    }
    
    /* === 스크롤 영역 === */
    .scroll, .scrollable, [class*="scroll"] {
        overflow-y: auto !important;
        max-height: calc(var(--optimal-height) * 0.7) !important;
    }
    
    /* === 아이콘 크기 조절 === */
    .icon, [class*="icon"], [class*="Icon"] {
        width: calc(24px * var(--scale-factor)) !important;
        height: calc(24px * var(--scale-factor)) !important;
        min-width: calc(16px * var(--scale-factor)) !important;
        min-height: calc(16px * var(--scale-factor)) !important;
    }
    
    /* === 배경 이미지 === */
    [style*="background-image"] {
        background-size: contain !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
    }
    
    /* === 테이블 === */
    table {
        width: 100% !important;
        table-layout: auto !important;
        border-collapse: collapse !important;
    }
    
    td, th {
        padding: calc(8px * var(--scale-factor)) !important;
        font-size: var(--base-font-size) !important;
    }
    
    /* === 특수 게임 요소들 === */
    .pokemon, .card, .tile, .piece, [class*="pokemon"], [class*="card"] {
        max-width: calc(120px * var(--scale-factor)) !important;
        max-height: calc(120px * var(--scale-factor)) !important;
    }
`;
document.head.appendChild(style);

// 화면 크기 정보를 동적으로 설정
Object.defineProperty(window.screen, 'width', {
    writable: false,
    configurable: false,
    value: OPTIMAL_WIDTH
});

Object.defineProperty(window.screen, 'height', {
    writable: false,
    configurable: false,
    value: OPTIMAL_HEIGHT
});

Object.defineProperty(window, 'innerWidth', {
    writable: false,
    configurable: false,
    value: OPTIMAL_WIDTH
});

Object.defineProperty(window, 'innerHeight', {
    writable: false,
    configurable: false,
    value: OPTIMAL_HEIGHT
});

// 포괄적 요소 조절 함수
function adjustAllElements() {
    console.log('Adjusting all elements for 16:9 ratio');
    console.log('Device:', DEVICE_WIDTH + 'x' + DEVICE_HEIGHT);
    console.log('Optimal:', OPTIMAL_WIDTH + 'x' + OPTIMAL_HEIGHT);
    console.log('Scale factor:', SCALE_FACTOR);
    
    // 1. 메인 컨테이너 16:9 비율 적용
    adjustMainContainer();
    
    // 2. 모든 이미지 조절
    adjustImages();
    
    // 3. 캔버스 요소 조절
    adjustCanvas();
    
    // 4. UI 요소 조절
    adjustUIElements();
    
    // 5. 레이아웃 조절
    adjustLayout();
}

function adjustMainContainer() {
    // 메인 게임 컨테이너 선택
    const containers = document.querySelectorAll('#app, .app, #root, .root, main, .main, [class*="game"], [id*="game"]');
    
    containers.forEach(function(container) {
        container.style.width = OPTIMAL_WIDTH + 'px';
        container.style.height = OPTIMAL_HEIGHT + 'px';
        container.style.position = 'absolute';
        container.style.top = OFFSET_Y + 'px';
        container.style.left = OFFSET_X + 'px';
        container.style.overflow = 'hidden';
        container.style.background = 'transparent';
    });
}

function adjustImages() {
    const images = document.querySelectorAll('img');
    images.forEach(function(img) {
        if (img.complete) {
            resizeImage(img);
        } else {
            img.addEventListener('load', function() {
                resizeImage(img);
            });
        }
    });
}

function resizeImage(img) {
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    
    if (naturalWidth && naturalHeight) {
        const imageRatio = naturalWidth / naturalHeight;
        
        // 16:9 영역 내에서 이미지 크기 조절
        if (naturalWidth > OPTIMAL_WIDTH || naturalHeight > OPTIMAL_HEIGHT) {
            if (imageRatio > TARGET_RATIO) {
                img.style.width = Math.min(OPTIMAL_WIDTH * 0.95, naturalWidth) + 'px';
                img.style.height = 'auto';
            } else {
                img.style.height = Math.min(OPTIMAL_HEIGHT * 0.95, naturalHeight) + 'px';
                img.style.width = 'auto';
            }
        }
    }
}

function adjustCanvas() {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(function(canvas) {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > OPTIMAL_WIDTH || rect.height > OPTIMAL_HEIGHT) {
            const scale = Math.min(
                OPTIMAL_WIDTH / rect.width,
                OPTIMAL_HEIGHT / rect.height
            );
            canvas.style.transform = `scale(${scale})`;
            canvas.style.transformOrigin = 'top left';
        }
        
        // 16:9 비율 강제 적용
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.maxWidth = OPTIMAL_WIDTH + 'px';
        canvas.style.maxHeight = OPTIMAL_HEIGHT + 'px';
    });
}

function adjustFixedSizeElements() {
    // 인라인 스타일로 고정된 크기를 가진 요소들 찾기
    const allElements = document.querySelectorAll('*');
    allElements.forEach(function(element) {
        const style = element.style;
        const computedStyle = window.getComputedStyle(element);
        
        // 너무 큰 고정 너비/높이 조절
        if (style.width && parseInt(style.width) > DEVICE_WIDTH) {
            style.width = 'auto';
            style.maxWidth = '100%';
        }
        
        if (style.height && parseInt(style.height) > DEVICE_HEIGHT) {
            style.height = 'auto';
            style.maxHeight = '100vh';
        }
        
        // 절대 위치 요소들 처리
        if (computedStyle.position === 'absolute' || computedStyle.position === 'fixed') {
            const rect = element.getBoundingClientRect();
            if (rect.right > DEVICE_WIDTH || rect.bottom > DEVICE_HEIGHT) {
                element.style.position = 'relative';
                element.style.top = 'auto';
                element.style.left = 'auto';
                element.style.right = 'auto';
                element.style.bottom = 'auto';
            }
        }
    });
}

function adjustTextElements() {
    const textElements = document.querySelectorAll('p, span, div, a, label, h1, h2, h3, h4, h5, h6');
    textElements.forEach(function(element) {
        const fontSize = window.getComputedStyle(element).fontSize;
        const currentSize = parseInt(fontSize);
        
        // 너무 작은 텍스트는 읽기 가능한 크기로 조절
        if (currentSize && currentSize < 12 * UNIFORM_SCALE) {
            element.style.fontSize = Math.max(12 * UNIFORM_SCALE, currentSize) + 'px';
        }
        
        // 너무 큰 텍스트는 화면에 맞게 조절
        if (currentSize && currentSize > 32 * UNIFORM_SCALE) {
            element.style.fontSize = Math.min(32 * UNIFORM_SCALE, currentSize) + 'px';
        }
    });
}

function adjustUIElements() {
    // 버튼들
    const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"], .btn');
    buttons.forEach(function(button) {
        const rect = button.getBoundingClientRect();
        if (rect.width < 44 * SCALE_FACTOR) {
            button.style.minWidth = (44 * SCALE_FACTOR) + 'px';
        }
        if (rect.height < 44 * SCALE_FACTOR) {
            button.style.minHeight = (44 * SCALE_FACTOR) + 'px';
        }
    });
    
    // 입력 필드들
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(function(input) {
        const rect = input.getBoundingClientRect();
        if (rect.height < 40 * SCALE_FACTOR) {
            input.style.minHeight = (40 * SCALE_FACTOR) + 'px';
        }
    });
}

function adjustLayout() {
    // 플렉스박스 조정
    const flexContainers = document.querySelectorAll('[style*="display: flex"], [style*="display:flex"]');
    flexContainers.forEach(function(container) {
        // 16:9 영역 내에서만 조정
        container.style.maxWidth = OPTIMAL_WIDTH + 'px';
        container.style.maxHeight = OPTIMAL_HEIGHT + 'px';
        
        if (OPTIMAL_WIDTH < 768) { // 작은 화면
            container.style.flexDirection = 'column';
            container.style.flexWrap = 'wrap';
        }
    });
    
    // 그리드 조정
    const gridContainers = document.querySelectorAll('[style*="display: grid"], [style*="display:grid"]');
    gridContainers.forEach(function(container) {
        container.style.maxWidth = OPTIMAL_WIDTH + 'px';
        container.style.maxHeight = OPTIMAL_HEIGHT + 'px';
        
        if (OPTIMAL_WIDTH < 768) { // 작은 화면
            container.style.gridTemplateColumns = '1fr';
        }
    });
}

// 동적 요소 감지 및 처리
const observer = new MutationObserver(function(mutations) {
    let shouldAdjust = false;
    
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    shouldAdjust = true;
                }
            });
        }
        
        if (mutation.type === 'attributes') {
            if (mutation.attributeName === 'style' ||
                mutation.attributeName === 'class') {
                shouldAdjust = true;
            }
        }
    });
    
    if (shouldAdjust) {
        setTimeout(adjustAllElements, 100);
    }
});

// 옵저버 시작
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
});

// 초기 실행
setTimeout(function() {
    adjustAllElements();
    
    // 리사이즈 이벤트 발생
    window.dispatchEvent(new Event('resize'));
    
    // 주기적으로 재조정 (동적 변화 대응)
    setInterval(adjustAllElements, 2000);
}, 1000);

// 리사이즈 이벤트 리스너
window.addEventListener('resize', function() {
    setTimeout(adjustAllElements, 100);
});

// 터치 이벤트 최적화
document.addEventListener('touchstart', function(e) {
    // 터치 영역이 너무 작은 요소들 확대
    const target = e.target;
    const rect = target.getBoundingClientRect();
    
    if (rect.width < 44 || rect.height < 44) {
        target.style.minWidth = '44px';
        target.style.minHeight = '44px';
        target.style.padding = '8px';
    }
});

console.log('16:9 dynamic element adjustment system initialized');
console.log('Device size:', DEVICE_WIDTH, 'x', DEVICE_HEIGHT);
console.log('Optimal size:', OPTIMAL_WIDTH, 'x', OPTIMAL_HEIGHT);
console.log('Scale factor:', SCALE_FACTOR);
console.log('Offset:', OFFSET_X, 'x', OFFSET_Y); 'Uniform:', UNIFORM_SCALE);
