//
//  ContentView.swift
//  BrowserForPokeAutoChess
//
//  Created by 안준경 on 6/1/25.
//

import SwiftUI
import WebKit

// MARK: - WebView Coordinator
class WebViewCoordinator: NSObject, WKNavigationDelegate {
    var parent: WebView
    
    init(_ parent: WebView) {
        self.parent = parent
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        parent.onPageLoaded?()
    }
}

// MARK: - WebView UIViewRepresentable
struct WebView: UIViewRepresentable {
    let url: URL
    var onPageLoaded: (() -> Void)?
    var screenSize: CGSize
    
    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        
        // JavaScript 활성화
        if #available(iOS 14.0, *) {
            let webpagePreferences = WKWebpagePreferences()
            webpagePreferences.allowsContentJavaScript = true
            configuration.defaultWebpagePreferences = webpagePreferences
        } else {
            // ✅ iOS 13 이하에서는 기존 방식 사용
            configuration.preferences.javaScriptEnabled = true
        }
        configuration.mediaTypesRequiringUserActionForPlayback = []
        
        // PC 브라우저로 인식되도록 User Agent 설정
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.customUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        
        webView.navigationDelegate = context.coordinator
        
        // 스크롤 비활성화
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.scrollView.showsHorizontalScrollIndicator = false
        webView.scrollView.showsVerticalScrollIndicator = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        let width = Int(screenSize.width)
        let height = Int(screenSize.height)
        
        // JavaScript 파일 경로
        guard let jsPath = Bundle.main.path(forResource: "viewport", ofType: "js"),
              let jsContent = try? String(contentsOfFile: jsPath, encoding: .utf8) else {
            print("JavaScript 파일을 찾을 수 없습니다.")
            return
        }
        
        // 디바이스 크기 정보를 JavaScript에 주입
        let deviceInfoScript = """
        const DEVICE_WIDTH = \(width);
        const DEVICE_HEIGHT = \(height);
        """
        
        // 최종 스크립트 결합
        let finalScript = deviceInfoScript + "\n" + jsContent
        
        let userScript = WKUserScript(source: finalScript, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        webView.configuration.userContentController.removeAllUserScripts()
        webView.configuration.userContentController.addUserScript(userScript)
        
        // URL 로드
        let request = URLRequest(url: url)
        webView.load(request)
    }
    
    func makeCoordinator() -> WebViewCoordinator {
        WebViewCoordinator(self)
    }
}

// MARK: - Main ContentView
struct ContentView: View {
    @State private var isLoading = true
    @State private var showControls = false
    @State private var showSettings = false
    @State private var selectedOrientation: UIInterfaceOrientationMask = .portrait
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                Color.black
                    .ignoresSafeArea(.all)
                
                // 웹뷰
                WebView(
                    url: URL(string: "https://pokemon-auto-chess.com/")!,
                    onPageLoaded: {
                        withAnimation(.easeInOut(duration: 0.5)) {
                            isLoading = false
                        }
                    },
                    screenSize: geometry.size
                )
                .frame(width: 1600, height: 900) // 웹사이트 기본 크기 설정
                .scaleEffect(
                    min(
                        geometry.size.width / 1600,  // 가로 비율
                        geometry.size.height / 900   // 세로 비율
                    )
                )
                .position(
                    x: geometry.size.width / 2,   // 화면 중앙 X
                    y: geometry.size.height / 2   // 화면 중앙 Y
                )
                .clipped()
                
                // 로딩 인디케이터
                if isLoading {
                    VStack(spacing: 20) {
                        ProgressView()
                            .scaleEffect(1.5)
                            .tint(.white)
                        
                        Text("Pokemon Auto Chess 로딩 중...")
                            .foregroundColor(.white)
                            .font(.headline)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color.black.opacity(0.8))
                    .transition(.opacity)
                }
                
                // 컨트롤 버튼 (우상단)
                VStack {
                    
                    HStack {
                        Spacer()
                        
                        // 새로고침
                        Button(action: {
                            withAnimation(.easeInOut(duration: 0.3)) {
                                isLoading = true
                            }
                        }) {
                            Image(systemName: "arrow.clockwise.circle.fill")
                                .font(.title2)
                                .foregroundColor(.white)
                                .background(Color.black.opacity(0.6))
                                .clipShape(Circle())
                                .padding()
                        }
                        .padding(.top)
                        .padding(.trailing)
                        
                    }
                    
                    Spacer()
                }
            }
        }
        .navigationBarHidden(true)
        .statusBarHidden()
        .ignoresSafeArea(.all)
    }
}
