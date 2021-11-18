
/* 
**************************
Menu
**************************
*/


function onOpen() {

  openSidebar();

  let menu = SpreadsheetApp.getUi()
  
  menu.createMenu("⚙️ Additional Tools")
  .addItem('Import Backup File from Drive', 'openSidebar')
  .addSeparator()
  .addSubMenu(menu.createMenu('Data Tools')
  .addItem('Freeze Data', 'freezeData')
  .addItem('Refresh Data (Update & Freeze)', 'refreshData'))
  .addSeparator()
  .addSubMenu(menu.createMenu('PDF Tools')
  .addItem('Save PDF Report', 'sendPDFs')
  .addItem('Open PDF Folder', 'openPDFfolder'))
  .addToUi();
}

function openSidebar() {
  
  let sideBar = HtmlService.createTemplateFromFile("sidebar.html")
  .evaluate()
  .setTitle("Sidebar Menu Spreadsheet");
  SpreadsheetApp.getUi().showSidebar(sideBar);

}

function openPDFfolder() {
  const folderId = '1-b23tGSPaJUMscCeE8X4VLuCCtXzWqJ9'
  const urlFolder = "https://drive.google.com/drive/folders/" + folderId;
  const html = "<script>window.open('" + urlFolder + "');google.script.host.close();</script>";
  const userInterface = HtmlService.createHtmlOutput(html);
  SpreadsheetApp.getUi().showModalDialog(userInterface, 'Opening Drive Folder');
}


/* 
**************************
Choosing file on backup folder
**************************
*/

// get folder and file on Gdrive
function getFiles(e, rootFolderId) {
  let data = {};
  let idn = e;
  e = e == "root" ? DriveApp.getRootFolder().getId() : e;
  data[e] = {};
  data[e].keyname = DriveApp.getFolderById(e).getName();
  data[e].keyparent = idn == rootFolderId
    ? null : DriveApp.getFolderById(e).getParents().hasNext()
    ? DriveApp.getFolderById(e).getParents().next().getId() : null;
  data[e].files = [];
  let da = idn == "root" ? DriveApp.getRootFolder() : DriveApp.getFolderById(e);
  let folders = da.getFolders();
  let files = da.getFiles();
  while (folders.hasNext()) {
    let folder = folders.next();
    data[e].files.push({name: folder.getName(), id: folder.getId(), mimeType: "folder"});
  }
  while (files.hasNext()) {
    let file = files.next();
    data[e].files.push({name: file.getName(), id: file.getId(), mimeType: file.getMimeType()});
  }
  return data;
}

function doSomething(id) {

  // do something
  let res = id;
  return res;
}

/* 
**************************
Importrange File Backup
**************************
*/

function submitKey(sidebar){
  let input_row = [sidebar.id, sidebar.date, sidebar.time];
  let tmpSs = SpreadsheetApp.getActive().getSheetByName('tempsheet');

  // make temporary key value
  
  tmpSs.getRange('A1:C1').clearContent();
  tmpSs.appendRow(input_row);
  
  // do importrange
  
  importRange()
}

function importRange() {

  SpreadsheetApp.getActive().getSheetByName('hist_emonvl').activate()  

  // clear content in exsisting (emonvl) sheet
  const dstSheet = SpreadsheetApp.getActive().getSheetByName('hist_emonvl');
  dstSheet.getRange('A:AI').clearContent();

  // set importrange destination
  const dstCell = dstSheet.getRange('A1');

  // set importrange parameter
  const valSs = SpreadsheetApp.getActive().getSheetByName('tempsheet');
  const idSrc = valSs.getSheetValues(1,1,1,1) // id files target store at this cell
  const rangeSrc = "EmonVLOOKUP!$A:$AI";

  // importrange formula  
  dstCell.setFormula('IFERROR(IMPORTRANGE("'+idSrc+'";"'+rangeSrc+'");"Please select backup file.."'+")");
}

function freezeData() {

  // copy values only
  const sheet = SpreadsheetApp.getActive().getSheetByName('hist_emonvl')
  const range = sheet.getRange('A:AI')
  range.copyTo(range, {contentsOnly: true});
}

function refreshData (){
  
  try {
  importRange()
  SpreadsheetApp.flush()
  freezeData()
  }

  catch(err) {
    console.log(err.message)
  }

}

/* 
**************************
Export file to PDF
**************************
*/

function hideSheet(sheetName) {
 SpreadsheetApp.getActive().getSheetByName(sheetName).hideSheet();
}

function showSheet(sheetName) {
 SpreadsheetApp.getActive().getSheetByName(sheetName).showSheet();
}

function openSheet(){

  // format per Nov 21
  hideSheet("emonvl-src");
  hideSheet("Daftar Paket TA 2022");
  showSheet("Scorecard");
  showSheet("Rekap UNOR 2022");
  showSheet("Detail Progres UNOR 2022");
  showSheet("Detail Progres BP2JK 2022 v2");
  showSheet("Tabel Progres BP2JK-UNOR 2022");

}

function closeSheet(){

  // format per Nov 21
  showSheet("emonvl-src");
  showSheet("Daftar Paket TA 2022");
}

function sendPDFs(optSSId, optSheetId) {

  openSheet()

  // If a sheet ID was provided, open that sheet, otherwise assume script is sheet-bound, and open the active spreadsheet.
  const sheetID = '1ycoe-dmiKXm0fuDAafvoYkd-BKd1vs7O6SsJ0Ss3gRU';
  const sourceSpreadsheet = (optSSId) ? /* SpreadsheetApp.openById(optSSId) */ SpreadsheetApp.open(DriveApp.getFileById(sheetID))
                          : SpreadsheetApp.getActiveSpreadsheet();

  // Get folder containing spreadsheet, for later export
  let parents = DriveApp.getFileById(sourceSpreadsheet.getId()).getParents();
  if (parents.hasNext()) {
    var folder = parents.next();
  }
  else {
    folder = DriveApp.getRootFolder();
  }

  //additional parameters for exporting the sheet as a pdf
  const url_ext = 'export?exportFormat=pdf&format=pdf'   //export as pdf

    // Print either the entire Spreadsheet or the specified sheet if option Sheet ID is provided
    + (optSheetId ? ('&gid=' + sheet.getSheetId()) : ('&id=' + sourceSpreadsheet.getId()))

      // set paramaters for PDF file
    +    '&size=A4'                               // paper size legal / letter / A4
    +    '&portrait=false'                        // orientation, false for landscape
    +    '&scale=2'                              //1= Normal 100% / 2= Fit to width / 3= Fit to height / 4= Fit to Page
    +    '&top_margin=0.1&bottom_margin=0.1'    //All four margins must be set!
    +    '&left_margin=0.4&right_margin=0.4'   //All four margins must be set!
    +    '&gridlines=false'                    //hide gridlines - true/false
    +    '&sheetnames=false&printtitle=false' // hide optional headers and footers
    +    '&pagenum=RIGHT'                   // hide page numbers or position
    +    '&fzr=true'                        // repeat row headers (frozen rows) on each page - true/false
    +    '&horizontal_alignment=CENTER'     //LEFT/CENTER/RIGHT
    +    '&vertical_alignment=TOP'          //TOP/MIDDLE/BOTTOM

  let options = {
    headers: {
      'Authorization': 'Bearer ' +  ScriptApp.getOAuthToken()
    }
  }
  
  const pdfName = "Rekap Progres PBJ 2022 Backup - " + Utilities.formatDate(new Date, "GMT+7", "dd MMMM yyyy") + ".pdf";
  let response = UrlFetchApp.fetch("https://docs.google.com/spreadsheets/" + url_ext, options);
  let pdfFile = response.getBlob().setName(pdfName);

  //PDF file create a backup file per usual and send to email

  // save file
  let newPDF = folder.createFile(pdfFile)
  const folderID = '1-b23tGSPaJUMscCeE8X4VLuCCtXzWqJ9'
  DriveApp.getFileById(newPDF.getId())
  .moveTo(DriveApp.getFolderById(folderID));

  closeSheet()

}
