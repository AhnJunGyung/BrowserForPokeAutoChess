//
//  BrowserForPokeAutoChessApp.swift
//  BrowserForPokeAutoChess
//
//  Created by 안준경 on 6/1/25.
//

import SwiftUI
import GoogleSignIn

@main
struct MyApp: App {
    
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

// AppDelegate.swift
class AppDelegate: NSObject, UIApplicationDelegate {
    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey : Any] = [:]
    ) -> Bool {
        return GIDSignIn.sharedInstance.handle(url)
    }
}
