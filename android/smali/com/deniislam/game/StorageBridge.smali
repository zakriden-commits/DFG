.class public Lcom/deniislam/game/StorageBridge;
.super Ljava/lang/Object;
.source "StorageBridge.java"

.field private ctx:Landroid/content/Context;

.method public constructor <init>(Landroid/content/Context;)V
    .locals 0
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V
    iput-object p1, p0, Lcom/deniislam/game/StorageBridge;->ctx:Landroid/content/Context;
    return-void
.end method

.method private prefs()Landroid/content/SharedPreferences;
    .locals 3
    iget-object v0, p0, Lcom/deniislam/game/StorageBridge;->ctx:Landroid/content/Context;
    const-string v1, "deni_islam_store"
    const/4 v2, 0x0
    invoke-virtual {v0, v1, v2}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;
    move-result-object v0
    return-object v0
.end method

.method public load()Ljava/lang/String;
    .locals 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation
    invoke-direct {p0}, Lcom/deniislam/game/StorageBridge;->prefs()Landroid/content/SharedPreferences;
    move-result-object v0
    const-string v1, "save"
    const-string v2, ""
    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    move-result-object v0
    if-nez v0, :nonnull
    const-string v0, ""
    :nonnull
    return-object v0
.end method

.method public save(Ljava/lang/String;)V
    .locals 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation
    invoke-direct {p0}, Lcom/deniislam/game/StorageBridge;->prefs()Landroid/content/SharedPreferences;
    move-result-object v0
    invoke-interface {v0}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;
    move-result-object v1
    const-string v2, "save"
    invoke-interface {v1, v2, p1}, Landroid/content/SharedPreferences$Editor;->putString(Ljava/lang/String;Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;
    invoke-interface {v1}, Landroid/content/SharedPreferences$Editor;->apply()V
    return-void
.end method

.method public clear()V
    .locals 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation
    invoke-direct {p0}, Lcom/deniislam/game/StorageBridge;->prefs()Landroid/content/SharedPreferences;
    move-result-object v0
    invoke-interface {v0}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;
    move-result-object v1
    invoke-interface {v1}, Landroid/content/SharedPreferences$Editor;->clear()Landroid/content/SharedPreferences$Editor;
    invoke-interface {v1}, Landroid/content/SharedPreferences$Editor;->apply()V
    return-void
.end method
