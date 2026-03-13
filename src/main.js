const { app, BrowserWindow, Tray, Menu, nativeImage } = require("electron")
const path = require("path")
const Store = require("electron-store")

const store = new Store()
const APP_URL = "https://petdene.vercel.app/login"

let mainWindow = null
let tray = null
let splashWindow = null

// Tek instance zorunlu
const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.show()
      mainWindow.focus()
    }
  })
}

// Windows başlangıcında otomatik aç
app.setLoginItemSettings({
  openAtLogin: store.get("autoStart", true),
  name: "PetCare",
})

function createSplash() {
  splashWindow = new BrowserWindow({
    width: 420,
    height: 280,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    center: true,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  })
  splashWindow.loadFile(path.join(__dirname, "splash.html"))
}

function createMain() {
  const bounds = store.get("windowBounds", { width: 1280, height: 800 })

  mainWindow = new BrowserWindow({
    ...bounds,
    minWidth: 900,
    minHeight: 600,
    show: false,
    title: "PetCare",
    icon: path.join(__dirname, "../assets/icon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    backgroundColor: "#0f0f0f",
  })

  // Tam ekran mod (F11 veya başlangıç ayarı)
  if (store.get("startMaximized", true)) {
    mainWindow.maximize()
  }

  mainWindow.loadURL(APP_URL)

  mainWindow.webContents.on("did-finish-load", () => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      setTimeout(() => {
        splashWindow.close()
        splashWindow = null
        mainWindow.show()
        mainWindow.focus()
      }, 800)
    } else {
      mainWindow.show()
    }
  })

  // Yüklenemezse (offline) hata sayfası
  mainWindow.webContents.on("did-fail-load", () => {
    mainWindow.loadFile(path.join(__dirname, "offline.html"))
  })

  // Pencere boyutunu kaydet
  mainWindow.on("resize", () => {
    if (!mainWindow.isMaximized()) {
      store.set("windowBounds", mainWindow.getBounds())
    }
  })

  // Kapatınca tray'e küçült
  mainWindow.on("close", (e) => {
    if (!app.isQuiting) {
      e.preventDefault()
      mainWindow.hide()
    }
  })

  // Dış linkler engelle — sadece petdene.vercel.app içinde kal
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://petdene.vercel.app")) {
      mainWindow.loadURL(url)
    }
    return { action: "deny" }
  })

  // Navigation'ı da kısıtla — petdene dışına izin verme
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("https://petdene.vercel.app")) {
      event.preventDefault()
    }
  })
}

function createTray() {
  const iconPath = path.join(__dirname, "../assets/tray.ico")
  tray = new Tray(iconPath)

  const updateMenu = () => {
    const autoStart = store.get("autoStart", true)
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "PetCare'i Aç",
        click: () => { mainWindow.show(); mainWindow.focus() },
      },
      { type: "separator" },
      {
        label: "Windows Başlangıcında Çalış",
        type: "checkbox",
        checked: autoStart,
        click: () => {
          const val = !store.get("autoStart", true)
          store.set("autoStart", val)
          app.setLoginItemSettings({ openAtLogin: val, name: "PetCare" })
          updateMenu()
        },
      },
      { type: "separator" },
      {
        label: "Çıkış",
        click: () => { app.isQuiting = true; app.quit() },
      },
    ])
    tray.setContextMenu(contextMenu)
  }

  updateMenu()
  tray.setToolTip("PetCare Klinik Yönetimi")
  tray.on("double-click", () => { mainWindow.show(); mainWindow.focus() })
}

app.whenReady().then(() => {
  createSplash()
  createMain()
  createTray()
})

app.on("window-all-closed", (e) => {
  e.preventDefault()
})

app.on("activate", () => {
  if (mainWindow) { mainWindow.show(); mainWindow.focus() }
})
