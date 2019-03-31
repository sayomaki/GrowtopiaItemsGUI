const app = require('electron').remote; // Load remote compnent that contains the dialog dependency
const dialog = app.dialog;
const fs = require('fs');

let itemFile, itemPath;
let loaded = false;
let parsedDB = {};
let parsedHash = 0;
let itemMD5 = '';
let tableHTML = '';

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
            itemPath = fileNames[0];
            loaded = true;
            itemMD5 = require('crypto').createHash('md5').update(itemFile).digest('hex');

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

    const stats = fs.statSync(itemPath);
    const mtime = new Date(require('util').inspect(stats.mtime));

    $('#content').html(`
    <div class="item-content">
        <div class="item-header">
            <ol class="breadcrumb">
                <li class="breadcrumb-item active">Home</li>
            </ol>
        </div>
        <div class="item-info">
            <div class="item-count card border-success mb-3 mr-3">
                <div class="card-header h4">Items Info</div>
                <div class="card-body">
                    <p>
                    Total item count: ${parsedDB.itemCount}<br/>
                    File version: ${parsedDB.itemsdatVersion}
                    </p>
                    <button type="button" class="btn btn-success btn-lg" onclick="browseItems()">Browse Items...</button>
                </div>
            </div>
            <div class="item-count card border-info mb-3 mr-3">
                <div class="card-header h4">File Info</div>
                <div class="card-body">
                    <p>
                    File size: ${(itemFile.length / 1000 / 1000).toFixed(2)} MB<br/>
                    Last modified: ${mtime.toISOString().slice(0,19).replace(/T/g," ")}
                    </p>
                    <button type="button" class="btn btn-info btn-lg" onclick="fileInfo()">More info...</button>
                </div>
            </div>
        </div>
    </div>
    `);
}

const browseItems = () => {
    if (!loaded) return;

    if (tableHTML == '') {
      let generatedHTML = '';
      let alt = true;
      Object.values(parsedDB.items).forEach(item => {
          if (alt) {
              generatedHTML += `
              <tr class="table-primary">
                  <td>${item.itemID}</td>
                  <td>${item.name}</td>
                  <td>-</td>
                  <td>-</td>
              </tr>`;
          }
          else {
              generatedHTML += `
              <tr class="table-secondary">
                  <td>${item.itemID}</td>
                  <td>${item.name}</td>
                  <td>-</td>
                  <td>-</td>
              </tr>`;
          }
          alt = !alt;
      });
      tableHTML = generatedHTML;
    }

    $('#content').html(`
    <div class="item-content">
        <div class="item-header">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="#" onclick="showInfo()">Home</a></li>
                <li class="breadcrumb-item active">Browse</li>
            </ol>
        </div>
        <div class="item-search form-group">
            <div class="input-group">
              <div class="input-group-prepend">
                  <span class="input-group-text"><img src="https://img.icons8.com/small/16/000000/search.png"/></span>
              </div>
              <input type="text" class="form-control" placeholder="Search item" id="search-input" onkeyup="dynamicSearch()"/>
            </div>
        </div>
        <div class="item-table">
            <table id="item-list" class="table table-hover">
                <thead>
                    <tr class="table-success">
                    <th scope="col" class="table-sticky">ID</th>
                    <th scope="col" class="table-sticky">Name</th>
                    <th scope="col" class="table-sticky">-</th>
                    <th scope="col" class="table-sticky">-</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableHTML}
                </tbody>
            </table>
        </div>
    </div>
    `);
}

const dynamicSearch = () => {
  let td, i, txtValue;
  const filter = $('#search-input').val().toUpperCase();
  const table = document.getElementById("item-list");
  const tr = table.getElementsByTagName("tr");

 // Loop through all table rows, and hide those who don't match the search query
 for (i = 0; i < tr.length; i++) {
   td = tr[i].getElementsByTagName("td")[1];
   if (td) {
     txtValue = td.textContent || td.innerText;
     if (txtValue.toUpperCase().indexOf(filter) > -1) {
       tr[i].style.display = "";
     } else {
       tr[i].style.display = "none";
     }
   }
 }
}

const fileInfo = () => {
  if (!loaded) return;

  $('#content').html(`
  <div class="item-content">
      <div class="item-header">
          <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#" onclick="showInfo()">Home</a></li>
              <li class="breadcrumb-item active">File Info</li>
          </ol>
      </div>
  </div>`);
}
