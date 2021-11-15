//============================================//
//========= Export PDF file on Drive =========//
//============================================//

/* Credit to
    ** Google
    ** Stackoverflow
    ** Google Apps Script Reference
    ** Spreadsheet Dev

    30-07-2021
    13-08-2021 (rev.1) add openSheet and close Sheet function
*/


function hideSheet(sheetName) {
 SpreadsheetApp.getActive().getSheetByName(sheetName).hideSheet();
}

function showSheet(sheetName) {
 SpreadsheetApp.getActive().getSheetByName(sheetName).showSheet();
}

function openSheet(){
  hideSheet("query-new");
  hideSheet("Home");
  hideSheet("Dashboard-Chart");
  hideSheet("Rekap BP2JK-UNOR 2021 v2");
  hideSheet("Daftar Paket TA 2021 (Emon-GS)");
  hideSheet("Daftar Penetapan 2021 (Emon-GS)");
  hideSheet("Rekap66");
  hideSheet("Rekap T/S Gagal BP2JK 2021")
  hideSheet("Rekap Paket PL BP2JK");
  hideSheet("Daftar Pagu TA 2021 (<)&(>) 100 M");
  hideSheet("Daftar Tematik 2021 (Emon-GS)");
  hideSheet("Daftar Tematik Blm T/S 2021 (Emon-GS)");
  showSheet("Scorecard-Nasional");
  showSheet("Detail T/S UNOR 2021");
}

function closeSheet(){
  showSheet("query-new");
  showSheet("Dashboard-Chart");
  showSheet("Rekap BP2JK-UNOR 2021 v2");
  showSheet("Daftar Paket TA 2021 (Emon-GS)");
  showSheet("Daftar Penetapan 2021 (Emon-GS)");
  showSheet("Rekap66");
  showSheet("Rekap T/S Gagal BP2JK 2021");
  showSheet("Rekap Paket PL BP2JK");
  showSheet("Daftar Pagu TA 2021 (<)&(>) 100 M");
  showSheet("Daftar Tematik 2021 (Emon-GS)");
  showSheet("Daftar Tematik Blm T/S 2021 (Emon-GS)");
  hideSheet("Scorecard-Nasional");
  hideSheet("Detail T/S UNOR 2021");
}

function sendPDFs(optSSId, optSheetId) {

  openSheet()

  // If a sheet ID was provided, open that sheet, otherwise assume script is sheet-bound, and open the active spreadsheet.
  const sheetID = '1ZCZ1h7WZjRwrhYKz7PSZUMkq5IFo2rZcdHvD8jXgN88';
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
    +    '&top_margin=0.2&bottom_margin=0.2'    //All four margins must be set!
    +    '&left_margin=0.5&right_margin=0.5'   //All four margins must be set!
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
  
  const pdfName = "Rekap Harian Progres PBJ TA.2021 - " + Utilities.formatDate(new Date, "GMT+7", "dd MMMM yyyy") + ".pdf";
  let response = UrlFetchApp.fetch("https://docs.google.com/spreadsheets/" + url_ext, options);
  let pdfFile = response.getBlob().setName(pdfName);

  //PDF file create a backup file per usual and send to email

  // save file
  let newPDF = folder.createFile(pdfFile)
  const folderID = '1hZHtOUNqhUqaUpt-8Kr2zxWMF_p8kfzA'
  DriveApp.getFileById(newPDF.getId())
  .moveTo(DriveApp.getFolderById(folderID));

  // send email
  let message = {
    //to: "subditevaluasi.direktoratpjk@gmail.com",
    //to: "subdit_ki@outlook.com", // trial
    subject: "[TEST] Laporan Harian Progress PBJ - Status Tgl. " + Utilities.formatDate(new Date, "GMT+7", "dd MMMM yyyy"),
    body: "Yth. Bapak Kasubdit Kepatuhan Intern DPJK,\n\nBerikut terlampir Laporan Progress PBJ Tgl "
            + Utilities.formatDate(new Date, "GMT+7", "dd MMMM yyyy") + "\n\nTerima Kasih,\nTim Monev PBJ",
    name: "Tim Monev PBJ Subdit KI DPJK",
    attachments: [newPDF]
  }
  MailApp.sendEmail(message);

  closeSheet()
}
