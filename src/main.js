
const IS_MOZILLA = navigator.userAgent.includes("Mozilla");
console.log("IS_MOZILLA", IS_MOZILLA)

class Recipe {
    constructor(data){
        this.text = data.text;
        this.emoji = data.emoji;
        this.discovered = data.discovered;
    }

    static deCompress(data){
        return new Recipe({
            text: data[0],
            emoji: data[1],
            discovered: data[2]
        });
    }

    compress(){
        return [this.text, this.emoji, this.discovered];
    }
}

function special_array(array){
    return [...new Set(array)];
}

class Save {
    static data = []
};

class SaveFile {
    static encode(data){
        let out = data.map(element => [element.text, element.emoji, element.discovered]);
        return JSON.stringify(special_array(out));
    }

    static decode(text){
        let data = JSON.parse(text);
        return data.map(element => { return { text: element[0], emoji: element[1], discovered: element[2] }; });
    }
}

async function getNewFileHandle() {
    if(!IS_MOZILLA) {
        const options = {
        types: [
            {
            description: 'infinite craft saves please',
            accept: {
                'text/plain': ['.infcraft'],
            },
            },
        ],
        };
        const handle = await window.showSaveFilePicker(options);
        return handle;
    } else {
        return "save.infcraft";
    }
}

async function writeFile(fileHandle, contents) {
    if (!IS_MOZILLA){
        // Create a FileSystemWritableFileStream to write to.
        const writable = await fileHandle.createWritable();
        // Write the contents of the file to the stream.
        await writable.write(SaveFile.encode(contents));
        // Close the file and write the contents to disk.
        await writable.close();
    } else {
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.download = fileHandle;
        a.href = URL.createObjectURL(new Blob([SaveFile.encode(contents)], { type: "text/plain" }));
        a.click();
    }
  }

async function save_button_pressed(){
    let fileHandle = await getNewFileHandle();
    pull();
    console.log("checking", Save.data);
    await writeFile(fileHandle, Save.data);
}

async function load_button_pressed(){
    let elements;
    if(!IS_MOZILLA){
        let [fileHandle] = await window.showSaveFilePicker({
            suggestedName: 'save.infcraft',
            ...options
        })
        const file = await fileHandle.getFile();
        const contents = await file.text();
        elements = SaveFile.decode(contents);
    } else {
        let a = document.createElement("input");
        a.setAttribute("type", "file");
        a.setAttribute("accept", ".infcraft");
        await new Promise((res, rej) => {
            a.addEventListener("change", async () => {
                if (a.files.length == 1) {
                    console.log("File selected: ", a.files[0]);
                    /**
                     * @type {File}
                     */
                    let file = a.files[0];
                    let content = await file.text();
                    elements = SaveFile.decode(content);
                    res();
                }
            });
            a.addEventListener("cancel", () => {
                console.log("Cancelled.");
                res();
            });
            a.click();
        })
    }
    if (elements == null){
        return;
    }
    Save.data = [...new Set([...elements, ...Save.data])];
    push();
    location.reload()
}

function on_page_load(){
    console.log("page loaded");
    let side_controls = document.querySelector("#__layout > div > div > div.side-controls");

    let save_button = document.createElement("button");
    save_button.textContent = "save";
    save_button.addEventListener("click", save_button_pressed);

    let load_button = document.createElement("button");
    load_button.textContent = "load";
    load_button.addEventListener("click", load_button_pressed);

    setTimeout(() => {
        side_controls.appendChild(save_button);
        side_controls.appendChild(load_button);
    }, 1000);
}

function init(){
    console.log("Infinite Craft Save Extension has Init.");

    if (document.readyState == "complete"){
        on_page_load()
    } else if (document.readyState == "interactive") {
        on_page_load();
    } else {
        document.body.addEventListener("load", () => {
            on_page_load();
        })
    }

}



function pull(){
    let rawdata = localStorage.getItem("infinite-craft-data");
    console.log("got data: ", rawdata);
    let data;
    if(rawdata != null){
        data = JSON.parse(rawdata);
        if(data == null){
            Save.data = [...new Set(Save.data)];
            return;
        }
        Save.data = special_array([...Save.data, ...data.elements]);
    }
}

function push(){
    let rawdata = localStorage.getItem("infinite-craft-data");
    let data = null;
    let elements;
    if (rawdata === null){
        elements = new Set(Save.data);
    } else {
        data = JSON.parse(rawdata);
        if(data !== null){
            elements = [...Save.data, ...data["elements"]];
        }
    }
    Save.data = special_array(elements);
    localStorage.setItem("infinite-craft-data", JSON.stringify({
        "elements": Save.data,
        "darkMode": data?.darkMode || false
    }))
}

setTimeout(() => {
    init();

    console.log("hello world");
}, 2000)


