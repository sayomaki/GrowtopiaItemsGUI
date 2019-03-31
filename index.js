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

    showInfo();
}

const showInfo = () => {
    if (!loaded) return;

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
                        <button type="button" class="btn btn-success btn-lg" onclick="browseItems()">Browse Items...</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `);
}

const browseItems = () => {
    if (!loaded) return;

    $('#content').html(`
    <div class="item-content">
        <div class="item-header">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="#" onclick="showInfo()">Home</a></li>
                <li class="breadcrumb-item active">Browse</li>
            </ol>
        </div>
        <div class="item-table">
            <table class="table table-hover">
                <thead>
                    <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Column heading</th>
                    <th scope="col">Column heading</th>
                </tr>
            </thead>
            <tbody>
                <tr class="table-active">
                <th scope="row">Active</th>
                <td>Column content</td>
                <td>Column content</td>
                <td>Column content</td>
                </tr>
                <tr>
                <th scope="row">Default</th>
                <td>Column content</td>
                <td>Column content</td>
                <td>Column content</td>
                </tr>
                <tr class="table-primary">
                <th scope="row">Primary</th>
                <td>Column content</td>
                <td>Column content</td>
                <td>Column content</td>
                </tr>
                <tr class="table-secondary">
                <th scope="row">Secondary</th>
                <td>Column content</td>
                <td>Column content</td>
                <td>Column content</td>
                </tr>
                <tr class="table-success">
                <th scope="row">Success</th>
                <td>Column content</td>
                <td>Column content</td>
                <td>Column content</td>
                </tr>
                <tr class="table-danger">
                <th scope="row">Danger</th>
                <td>Column content</td>
                <td>Column content</td>
                <td>Column content</td>
                </tr>
                <tr class="table-warning">
                <th scope="row">Warning</th>
                <td>Column content</td>
                <td>Column content</td>
                <td>Column content</td>
                </tr>
                <tr class="table-info">
                <th scope="row">Info</th>
                <td>Column content</td>
                <td>Column content</td>
                <td>Column content</td>
                </tr>
                <tr class="table-light">
                <th scope="row">Light</th>
                <td>Column content</td>
                <td>Column content</td>
                <td>Column content</td>
                </tr>
                <tr class="table-dark">
                <th scope="row">Dark</th>
                <td>Column content</td>
                <td>Column content</td>
                <td>Column content</td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
    `);
}