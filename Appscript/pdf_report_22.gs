//============================================//
//========= Export PDF file on Drive =========//
//============================================//

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
  
  const pdfName = "Rekap Progres PBJ 2022 - " + Utilities.formatDate(new Date, "GMT+7", "dd MMMM yyyy") + ".pdf";
  let response = UrlFetchApp.fetch("https://docs.google.com/spreadsheets/" + url_ext, options);
  let pdfFile = response.getBlob().setName(pdfName);

  //PDF file create a backup file per usual and send to email

  // save file
  let newPDF = folder.createFile(pdfFile)
  const folderID = '1-b23tGSPaJUMscCeE8X4VLuCCtXzWqJ9'
  DriveApp.getFileById(newPDF.getId())
  .moveTo(DriveApp.getFolderById(folderID));

  // send email
  /* let message = {
    //to: "subditevaluasi.direktoratpjk@gmail.com",
    to: "ki.binakon@pu.go.id, bgawans@pu.go.id", // trial
    subject: "Laporan Progres PBJ - Status Tgl. " + Utilities.formatDate(new Date, "GMT+7", "dd MMMM yyyy"),
    body: "Yth. Bapak Kasubdit Kepatuhan Intern DPJK,\n\nBerikut terlampir Laporan Progress PBJ Tgl "
            + Utilities.formatDate(new Date, "GMT+7", "dd MMMM yyyy") + "\n\nTerima Kasih,\nTim Monev PBJ",
    name: "Tim Monev PBJ Subdit KI DPJK",
    attachments: [newPDF]
  }
  MailApp.sendEmail(message); */

  closeSheet()

}
