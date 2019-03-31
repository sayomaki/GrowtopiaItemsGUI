const app = require('electron').remote; // Load remote compnent that contains the dialog dependency
const dialog = app.dialog;
const fs = require('fs');

let itemFile;
let loaded = false;
let parsedDB = {};
let parsedHash = 0;

const getFile = () => {
    dialog.showOpenDialog((fileNames) => {
        // fileNames is an array that contains all the selected
        if(fileNames === undefined){
            console.log("No file selected");
            return;
        }

        if (fileNames.length > 1) {
            alert("Error: Please only choose 1 file!");
            return;
        }
        else if (fileNames[0].lastIndexOf('.dat') != fileNames[0].length - 4) {
            alert("Error: Not an items.dat file!");
            return;
        }

        fs.readFile(fileNames[0], (err, data) => {
            if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
            }
            
            itemFile = data;
            loaded = true;
            generateView();
        });
    });
}

const generateView = () => {
    parsedDB = JSON.parse(ItemUtils.parseItems(itemFile, itemFile.length));
    if (!parsedDB.success) {
        alert(parsedDB.error);
        loaded = false;
        return;
    }
    console.log(`Loaded items.dat with ${parsedDB.itemCount} items!`);
    parsedHash = ItemUtils.hashItems(itemFile, itemFile.length);

    $('#content').html(`
    <div class="item-content">
        <div class="item-header">
            <ol class="breadcrumb">
                <li class="breadcrumb-item active">Home</li>
            </ol>
        </div>
        <div class="item-info">
            <div class="item-count card border-success mb-3" style="max-width: 20rem;">
                <div class="card-header h4">Items Info</div>
                    <div class="card-body">
                        <p>
                        Total item count: ${parsedDB.itemCount}<br/>
                        File version: ${parsedDB.itemsdatVersion}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `);
}