const { copyFileSync, writeFileSync } = require("fs");
const { join, dirname } = require("path");

const CWD = dirname(".");
const OPERA_DIR = join(CWD, "opera");
const CHROME_DIR = join(CWD, "chrome");
const FIREFOX_DIR = join(CWD, "firefox");

const SRC_DIR = join(CWD, "src");
const ASSET_DIR = join(CWD, "assets");

function write(fp, data){
    writeFileSync(fp, JSON.stringify(data))
}

const NAME = "InfiniteCraftSave";
const DESC = "extension to allow the saving of infinite craft data";
const VERSION = "1.0.0";
const MAIN_SCRIPT = "main.js";
const ICON_FILE_NAME = "icon.png";
const BROWSER_TITLE = NAME;

function writeOperaManifest(){
    write(join(OPERA_DIR, "manifest.json"), {
        "manifest_version": 3,
        "name": NAME,
        "description": DESC,
        "version": VERSION,
        "permissions": [
            "tabs",
            "unlimitedStorage",
            "storage",
            "fileSystem"
        ],
        "host_permissions": [
            "https://neal.fun/infinite-craft/",
        ],
        "icons": {
            "256": ICON_FILE_NAME
        },
        "content_scripts": [
            {
                "js": [
                    MAIN_SCRIPT
                ],
                "matches": [
                    "https://neal.fun/infinite-craft/"
                ]
            }
        ]
    });
}

function writeChromeManifest(){
    write(join(CHROME_DIR, "manifest.json"), {
        "manifest_version": 3,
        "name": NAME,
        "description": DESC,
        "version": VERSION,
        "permissions": [
            "tabs",
            "unlimitedStorage",
            "storage"
        ],
        "host_permissions": [
            "https://neal.fun/infinite-craft/",
        ],
        "icons": {
            "256": ICON_FILE_NAME
        },
        "content_scripts": [
            {
                "js": [
                    MAIN_SCRIPT
                ],
                "matches": [
                    "https://neal.fun/infinite-craft/"
                ]
            }
        ]
    });
}

function writeFirefoxManifest() {
    write(join(FIREFOX_DIR, "manifest.json"), {
        "description": DESC,
        "manifest_version": 2,
        "name": NAME,
        "version": "1.0",
        "icons": {
            "256": ICON_FILE_NAME
        },
        "permissions": [
            "downloads",
            "activeTab",
            "downloads.open"
        ],
        "content_scripts": [
            {
                "matches": [
                    "*://neal.fun/infinite-craft/"
                ],
                "js": [
                    MAIN_SCRIPT
                ]
            }
        ],
        "browser_specific_settings": {
            "gecko": {
                "id": "AmashiMcLane@outlook.com",
                "strict_min_version": "42.0"
            }
        }
    })
}

function writeManifests(){
    writeOperaManifest();
    writeChromeManifest();
    writeFirefoxManifest();
}

function buildOpera(){
    copyFileSync(join(ASSET_DIR, "icon.png"), join(OPERA_DIR, "icon.png"));
    copyFileSync(join(SRC_DIR, "main.js"), join(OPERA_DIR, "main.js"))
}

function buildChrome(){
    copyFileSync(join(ASSET_DIR, "icon.png"), join(CHROME_DIR, "icon.png"));
    copyFileSync(join(SRC_DIR, "main.js"), join(CHROME_DIR, "main.js"));
}

function buildFirefox(){
    copyFileSync(join(ASSET_DIR, "icon.png"), join(FIREFOX_DIR, "icon.png"));
    copyFileSync(join(SRC_DIR, "main.js"), join(FIREFOX_DIR, "main.js"));
}

function buildExtensions(){
    buildOpera();
    buildChrome();
    buildFirefox();
}

writeManifests();
buildExtensions();