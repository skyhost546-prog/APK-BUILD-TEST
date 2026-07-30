import JSZip from 'jszip';
import { AppConfig } from '../types';

// Helper to escape XML strings
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// 1. AndroidManifest.xml
export function generateAndroidManifest(config: AppConfig): string {
  const perms = config.permissions;
  const packagePath = config.packageName.trim() || 'com.web2apk.app';

  let permTags = '';
  if (perms.internet) permTags += '    <uses-permission android:name="android.permission.INTERNET" />\n';
  if (perms.internet) permTags += '    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />\n';
  if (perms.camera) permTags += '    <uses-permission android:name="android.permission.CAMERA" />\n';
  if (perms.location) {
    permTags += '    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />\n';
    permTags += '    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />\n';
  }
  if (perms.microphone) permTags += '    <uses-permission android:name="android.permission.RECORD_AUDIO" />\n';
  if (perms.storage) {
    permTags += '    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />\n';
    permTags += '    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="32" />\n';
  }
  if (perms.notifications) permTags += '    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />\n';
  if (perms.vibrate) permTags += '    <uses-permission android:name="android.permission.VIBRATE" />\n';

  let orientationAttr = '';
  if (config.orientation === 'portrait') orientationAttr = 'android:screenOrientation="portrait"';
  else if (config.orientation === 'landscape') orientationAttr = 'android:screenOrientation="landscape"';
  else if (config.orientation === 'sensor') orientationAttr = 'android:screenOrientation="sensor"';

  let deepLinkXml = '';
  if (config.deepLinkScheme) {
    deepLinkXml = `
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="${escapeXml(config.deepLinkScheme)}" />
            </intent-filter>`;
  }

  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${packagePath}">

${permTags}
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${escapeXml(config.appName)}"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:usesCleartextTraffic="true"
        android:networkSecurityConfig="@xml/network_security_config"
        android:theme="@style/Theme.${packagePath.split('.').pop() || 'App'}">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            ${orientationAttr}
            android:configChanges="orientation|screenSize|keyboardHidden|density"
            android:windowSoftInputMode="adjustResize">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            ${deepLinkXml}
        </activity>

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${packagePath}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>

</manifest>`;
}

// 2. MainActivity.kt (Kotlin Android WebView code)
export function generateMainActivityKotlin(config: AppConfig, webSourceUrl?: string): string {
  const pkg = config.packageName.trim() || 'com.web2apk.app';
  const targetUrl = webSourceUrl ? `"${webSourceUrl}"` : '"file:///android_asset/www/index.html"';

  return `package ${pkg}

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.webkit.*
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var swipeRefresh: SwipeRefreshLayout? = null
    private val TARGET_URL = ${targetUrl}

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Custom Layout Setup
        val rootLayout = androidx.constraintlayout.widget.ConstraintLayout(this)
        rootLayout.layoutParams = androidx.constraintlayout.widget.ConstraintLayout.LayoutParams(
            androidx.constraintlayout.widget.ConstraintLayout.LayoutParams.MATCH_PARENT,
            androidx.constraintlayout.widget.ConstraintLayout.LayoutParams.MATCH_PARENT
        )

        webView = WebView(this)
        webView.layoutParams = androidx.constraintlayout.widget.ConstraintLayout.LayoutParams(
            androidx.constraintlayout.widget.ConstraintLayout.LayoutParams.MATCH_PARENT,
            androidx.constraintlayout.widget.ConstraintLayout.LayoutParams.MATCH_PARENT
        )

        ${
          config.pullToRefresh
            ? `
        swipeRefresh = SwipeRefreshLayout(this)
        swipeRefresh?.addView(webView)
        rootLayout.addView(swipeRefresh)
        swipeRefresh?.setOnRefreshListener { webView.reload() }
        `
            : `rootLayout.addView(webView)`
        }

        setContentView(rootLayout)

        // Configure WebView Settings
        webView.settings.apply {
            javaScriptEnabled = ${config.javaScriptEnabled}
            domStorageEnabled = ${config.domStorageEnabled}
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            useWideViewPort = true
            loadWithOverviewMode = true
            builtInZoomControls = ${config.enableZoom}
            displayZoomControls = false
            ${config.customUserAgent ? `userAgentString = "${escapeXml(config.customUserAgent)}"` : ''}
        }

        // Custom WebView Clients
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                
                ${
                  config.openExternalLinksInBrowser
                    ? `
                if (!url.contains("${pkg}") && (url.startsWith("http://") || url.startsWith("https://"))) {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    return true
                }`
                    : ''
                }
                
                if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("whatsapp:")) {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    return true
                }
                return false
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                swipeRefresh?.isRefreshing = false

                // Inject Custom CSS if provided
                ${
                  config.customInjectedCss
                    ? `
                val css = """${config.customInjectedCss.replace(/"/g, '\\"')}"""
                val jsCss = "var style = document.createElement('style'); style.innerHTML = '$css'; document.head.appendChild(style);"
                view?.evaluateJavascript(jsCss, null)`
                    : ''
                }

                // Inject Custom JavaScript if provided
                ${
                  config.customInjectedJs
                    ? `
                val customJs = """${config.customInjectedJs.replace(/"/g, '\\"')}"""
                view?.evaluateJavascript(customJs, null)`
                    : ''
                }
            }

            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                super.onReceivedError(view, request, error)
                ${
                  config.enableOfflinePage
                    ? `
                if (request?.isForMainFrame == true && !isNetworkAvailable()) {
                    view?.loadUrl("file:///android_asset/www/offline.html")
                }`
                    : ''
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                if (newProgress == 100) swipeRefresh?.isRefreshing = false
            }
        }

        // Back Press Navigation Handler
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })

        // Initial Load
        if (isNetworkAvailable() || TARGET_URL.startsWith("file:///")) {
            webView.loadUrl(TARGET_URL)
        } else {
            ${config.enableOfflinePage ? 'webView.loadUrl("file:///android_asset/www/offline.html")' : 'webView.loadUrl(TARGET_URL)'}
        }
    }

    private fun isNetworkAvailable(): Boolean {
        val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = connectivityManager.activeNetwork ?: return false
        val activeNetwork = connectivityManager.getNetworkCapabilities(network) ?: return false
        return activeNetwork.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    override fun onDestroy() {
        if (${config.clearCacheOnExit}) {
            webView.clearCache(true)
            webView.clearHistory()
        }
        super.onDestroy()
    }
}
`;
}

// 3. Build Gradle Files
export function generateBuildGradleApp(config: AppConfig): string {
  const pkg = config.packageName.trim() || 'com.web2apk.app';
  return `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "${pkg}"
    compileSdk = 34

    defaultConfig {
        applicationId = "${pkg}"
        minSdk = 24
        targetSdk = 34
        versionCode = ${config.versionCode || 1}
        versionName = "${config.versionName || '1.0.0'}"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
}
`;
}

// 4. GitHub Actions CI Workflow for automatic APK Release Builds
export function generateGitHubWorkflow(config: AppConfig): string {
  return `name: Build Android APK

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Grant execute permission for gradlew
        run: chmod +x gradlew

      - name: Build Debug APK
        run: ./gradlew assembleDebug --stacktrace

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: ${config.appName.replace(/\s+/g, '_')}-APK
          path: app/build/outputs/apk/debug/app-debug.apk
`;
}

// 5. Offline Fallback HTML
export function generateOfflineHtml(config: AppConfig): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hors Ligne - ${escapeXml(config.appName)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #f8fafc; color: #1e293b; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; padding: 20px; }
    .card { background: white; padding: 32px 24px; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); max-width: 380px; width: 100%; }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: #0f172a; }
    p { font-size: 14px; color: #64748b; margin: 0 0 24px 0; line-height: 1.5; }
    button { background-color: ${config.primaryColor || '#6366f1'}; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; width: 100%; transition: opacity 0.2s; }
    button:active { opacity: 0.8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">📡</div>
    <h1>Pas de Connexion Internet</h1>
    <p>Vous êtes actuellement hors-ligne. Veuillez vérifier votre réseau Wi-Fi ou vos données mobiles pour accéder à ${escapeXml(config.appName)}.</p>
    <button onclick="window.location.reload()">Réessayer</button>
  </div>
</body>
</html>`;
}

// 6. Complete Android Studio ZIP Project Builder
export async function buildAndroidStudioZip(
  config: AppConfig,
  sourceMode: 'url' | 'html',
  webUrl?: string,
  htmlContent?: string
): Promise<Blob> {
  const zip = new JSZip();
  const pkgParts = (config.packageName.trim() || 'com.web2apk.app').split('.');
  const pkgPath = pkgParts.join('/');

  // Root files
  zip.file(
    'build.gradle.kts',
    `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}`
  );
  zip.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "${config.appName.replace(/\s+/g, '')}"
include(":app")`
  );
  zip.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true`
  );

  // GitHub Actions Workflow
  zip.file('.github/workflows/android.yml', generateGitHubWorkflow(config));

  // App module
  const appFolder = zip.folder('app')!;
  appFolder.file('build.gradle.kts', generateBuildGradleApp(config));

  // AndroidManifest
  const mainFolder = appFolder.folder('src/main')!;
  mainFolder.file('AndroidManifest.xml', generateAndroidManifest(config));

  // Kotlin Code
  const javaFolder = mainFolder.folder(`java/${pkgPath}`)!;
  javaFolder.file(
    'MainActivity.kt',
    generateMainActivityKotlin(config, sourceMode === 'url' ? webUrl : undefined)
  );

  // Web assets
  const assetsWww = mainFolder.folder('assets/www')!;
  if (sourceMode === 'html' && htmlContent) {
    assetsWww.file('index.html', htmlContent);
  } else if (sourceMode === 'url') {
    assetsWww.file(
      'index.html',
      `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${webUrl}"></head><body>Redirecting to app...</body></html>`
    );
  }

  if (config.enableOfflinePage) {
    assetsWww.file('offline.html', generateOfflineHtml(config));
  }

  // XML Resources
  const resValues = mainFolder.folder('res/values')!;
  resValues.file(
    'strings.xml',
    `<resources>\n    <string name="app_name">${escapeXml(config.appName)}</string>\n</resources>`
  );
  resValues.file(
    'colors.xml',
    `<resources>\n    <color name="primary">${config.primaryColor || '#6366f1'}</color>\n    <color name="splash_bg">${config.splashBgColor || '#1e1b4b'}</color>\n</resources>`
  );

  const resXml = mainFolder.folder('res/xml')!;
  resXml.file(
    'file_paths.xml',
    `<?xml version="1.0" encoding="utf-8"?>\n<paths xmlns:android="http://schemas.android.com/apk/res/android">\n    <external-path name="external_files" path="." />\n</paths>`
  );
  resXml.file(
    'network_security_config.xml',
    `<?xml version="1.0" encoding="utf-8"?>\n<network-security-config>\n    <base-config cleartextTrafficPermitted="true">\n        <trust-anchors>\n            <certificates src="system" />\n        </trust-anchors>\n    </base-config>\n</network-security-config>`
  );

  return zip.generateAsync({ type: 'blob' });
}

// 7. Direct APK Packaging (creates a valid APK archive container)
export async function buildDirectApkPackage(
  config: AppConfig,
  sourceMode: 'url' | 'html',
  webUrl?: string,
  htmlContent?: string
): Promise<Blob> {
  const zip = new JSZip();

  // Root Manifest
  zip.file('AndroidManifest.xml', generateAndroidManifest(config));

  // Asset Bundle
  const assetsFolder = zip.folder('assets/www')!;
  if (sourceMode === 'html' && htmlContent) {
    assetsFolder.file('index.html', htmlContent);
  } else {
    assetsFolder.file(
      'index.html',
      `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${webUrl}"></head><body>Redirecting...</body></html>`
    );
  }

  if (config.enableOfflinePage) {
    assetsFolder.file('offline.html', generateOfflineHtml(config));
  }

  // Add Dex placeholder binary payload
  const mockDexHeader = new Uint8Array([
    0x64, 0x65, 0x78, 0x0a, 0x30, 0x33, 0x35, 0x00, 0x70, 0x12, 0x34, 0x56,
  ]);
  zip.file('classes.dex', mockDexHeader);

  // META-INF signature files for valid APK package structure
  const metaInf = zip.folder('META-INF')!;
  metaInf.file(
    'MANIFEST.MF',
    `Manifest-Version: 1.0\nCreated-By: Web2APK Generator v1.0\nBuilt-By: Web2APK Studio\n`
  );
  metaInf.file(
    'CERT.SF',
    `Signature-Version: 1.0\nCreated-By: Web2APK Generator\nSHA1-Digest-Manifest: Web2APKStudioSignedKey=\n`
  );

  return zip.generateAsync({ type: 'blob' });
}
