// adding tgl input terupdate

function onEdit(e) {
  let sheetRow = e.range.getRow();
  let sheetCol = e.range.getColumn();
  let sheet  = e.source.getActiveSheet();
  let sheetName = sheet.getName();
  if((sheetCol === 4 || sheetCol === 2) && sheetName === "08.Form_paketPokja") {
    sheet.getRange(sheetRow,12).setValue(new Date());
  }
}

// this for cloning spreadsheet
function cloneGoogleSheet() {
  const folderId = "1GwpwkLCMkZsNs_cLkGGXcGh5P7bnOFsL";
  const masterFileId = "1sDL6ZcR6b9ivQenFW0uz2zQc4fBV2D_aH-zGJsJ-Lk4";
  
  const destFolder = DriveApp.getFolderById(folderId); 
  DriveApp.getFileById(masterFileId).makeCopy("_GS-Monev [2022]", destFolder); 
}

// this for cloning sheet into multiple workhseet on the folder
function cloneSheetToMultiple(){
    const source = SpreadsheetApp.getActiveSpreadsheet();
    const sourceId = source.getId();
    const sourceSheet = source.getSheets()[3]; // index sheet thats will be copied to others
    const folderId = "1GwpwkLCMkZsNs_cLkGGXcGh5P7bnOFsL"; // destination folder id
    const destFolderId = DriveApp.getFolderById(folderId);
    const sheetDest = destFolderId.getFilesByType(MimeType.GOOGLE_SHEETS); // only on spreadsheet file will be copied
    while (sheetDest.hasNext()) {
          let target_file = sheetDest.next();
          let target_id = target_file.getId();
          let target_exclude = '19g0umK_YiZZkjOfr8Uhq83Uh17d2q-H4LsSYT20f6lI'; // if we have exclude file in folder
          let target_ss = SpreadsheetApp.openById(target_id);
          let newSheetName = "[Monev Paket] v2"
          if(target_id!=sourceId && target_id != target_exclude){
             sourceSheet.copyTo(target_ss).setName(newSheetName);          
          } 
    };
}
