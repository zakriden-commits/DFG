.class public Lcom/deniislam/game/MainActivity;
.super Landroid/app/Activity;
.source "MainActivity.java"

.field private wv:Landroid/webkit/WebView;

.method public constructor <init>()V
    .locals 0
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V
    return-void
.end method

.method protected onCreate(Landroid/os/Bundle;)V
    .locals 7
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    const/4 v0, 0x1
    invoke-static {v0}, Landroid/webkit/WebView;->setWebContentsDebuggingEnabled(Z)V

    invoke-virtual {p0}, Landroid/app/Activity;->getWindow()Landroid/view/Window;
    move-result-object v1
    const/16 v2, 0x80
    invoke-virtual {v1, v2}, Landroid/view/Window;->addFlags(I)V
    invoke-virtual {v1}, Landroid/view/Window;->getDecorView()Landroid/view/View;
    move-result-object v2
    const/16 v3, 0x1006
    invoke-virtual {v2, v3}, Landroid/view/View;->setSystemUiVisibility(I)V

    new-instance v2, Landroid/webkit/WebView;
    invoke-direct {v2, p0}, Landroid/webkit/WebView;-><init>(Landroid/content/Context;)V
    iput-object v2, p0, Lcom/deniislam/game/MainActivity;->wv:Landroid/webkit/WebView;

    const/high16 v3, -0x1000000
    invoke-virtual {v2, v3}, Landroid/webkit/WebView;->setBackgroundColor(I)V

    invoke-virtual {v2}, Landroid/webkit/WebView;->getSettings()Landroid/webkit/WebSettings;
    move-result-object v3

    invoke-virtual {v3, v0}, Landroid/webkit/WebSettings;->setJavaScriptEnabled(Z)V
    invoke-virtual {v3, v0}, Landroid/webkit/WebSettings;->setDomStorageEnabled(Z)V
    invoke-virtual {v3, v0}, Landroid/webkit/WebSettings;->setDatabaseEnabled(Z)V
    invoke-virtual {v3, v0}, Landroid/webkit/WebSettings;->setAllowFileAccess(Z)V
    invoke-virtual {v3, v0}, Landroid/webkit/WebSettings;->setAllowContentAccess(Z)V
    invoke-virtual {v3, v0}, Landroid/webkit/WebSettings;->setMediaPlaybackRequiresUserGesture(Z)V
    invoke-virtual {v3, v0}, Landroid/webkit/WebSettings;->setJavaScriptCanOpenWindowsAutomatically(Z)V
    invoke-virtual {v3, v0}, Landroid/webkit/WebSettings;->setLoadWithOverviewMode(Z)V
    invoke-virtual {v3, v0}, Landroid/webkit/WebSettings;->setUseWideViewPort(Z)V

    const/4 v4, 0x0
    invoke-virtual {v3, v4}, Landroid/webkit/WebSettings;->setSupportZoom(Z)V
    invoke-virtual {v3, v4}, Landroid/webkit/WebSettings;->setBuiltInZoomControls(Z)V
    const/4 v5, -0x1
    invoke-virtual {v3, v5}, Landroid/webkit/WebSettings;->setCacheMode(I)V

    new-instance v3, Landroid/webkit/WebViewClient;
    invoke-direct {v3}, Landroid/webkit/WebViewClient;-><init>()V
    invoke-virtual {v2, v3}, Landroid/webkit/WebView;->setWebViewClient(Landroid/webkit/WebViewClient;)V

    new-instance v3, Lcom/deniislam/game/MyChromeClient;
    invoke-direct {v3}, Lcom/deniislam/game/MyChromeClient;-><init>()V
    invoke-virtual {v2, v3}, Landroid/webkit/WebView;->setWebChromeClient(Landroid/webkit/WebChromeClient;)V

    new-instance v3, Lcom/deniislam/game/StorageBridge;
    invoke-direct {v3, p0}, Lcom/deniislam/game/StorageBridge;-><init>(Landroid/content/Context;)V
    const-string v4, "AndroidStore"
    invoke-virtual {v2, v3, v4}, Landroid/webkit/WebView;->addJavascriptInterface(Ljava/lang/Object;Ljava/lang/String;)V

    invoke-virtual {p0, v2}, Landroid/app/Activity;->setContentView(Landroid/view/View;)V

    const-string v3, "file:///android_asset/index.html"
    invoke-virtual {v2, v3}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V

    const-string v3, "android.permission.RECORD_AUDIO"
    invoke-virtual {p0, v3}, Landroid/app/Activity;->checkSelfPermission(Ljava/lang/String;)I
    move-result v4
    if-nez v4, :permgranted

    new-array v4, v0, [Ljava/lang/String;
    const/4 v5, 0x0
    aput-object v3, v4, v5
    const/16 v5, 0x64
    invoke-virtual {p0, v4, v5}, Landroid/app/Activity;->requestPermissions([Ljava/lang/String;I)V

    :permgranted
    return-void
.end method

.method public onWindowFocusChanged(Z)V
    .locals 2
    invoke-super {p0, p1}, Landroid/app/Activity;->onWindowFocusChanged(Z)V
    if-eqz p1, :done
    invoke-virtual {p0}, Landroid/app/Activity;->getWindow()Landroid/view/Window;
    move-result-object v0
    invoke-virtual {v0}, Landroid/view/Window;->getDecorView()Landroid/view/View;
    move-result-object v0
    const/16 v1, 0x1006
    invoke-virtual {v0, v1}, Landroid/view/View;->setSystemUiVisibility(I)V
    :done
    return-void
.end method

.method public onBackPressed()V
    .locals 1
    const/4 v0, 0x1
    invoke-virtual {p0, v0}, Landroid/app/Activity;->moveTaskToBack(Z)Z
    return-void
.end method

.method protected onPause()V
    .locals 1
    invoke-super {p0}, Landroid/app/Activity;->onPause()V
    iget-object v0, p0, Lcom/deniislam/game/MainActivity;->wv:Landroid/webkit/WebView;
    if-eqz v0, :done
    invoke-virtual {v0}, Landroid/webkit/WebView;->onPause()V
    :done
    return-void
.end method

.method protected onResume()V
    .locals 1
    invoke-super {p0}, Landroid/app/Activity;->onResume()V
    iget-object v0, p0, Lcom/deniislam/game/MainActivity;->wv:Landroid/webkit/WebView;
    if-eqz v0, :done
    invoke-virtual {v0}, Landroid/webkit/WebView;->onResume()V
    :done
    return-void
.end method

.method protected onDestroy()V
    .locals 1
    iget-object v0, p0, Lcom/deniislam/game/MainActivity;->wv:Landroid/webkit/WebView;
    if-eqz v0, :done
    invoke-virtual {v0}, Landroid/webkit/WebView;->destroy()V
    :done
    invoke-super {p0}, Landroid/app/Activity;->onDestroy()V
    return-void
.end method
