/* Credit to
    26 - Oktober - 2021
*/

//UI menu
function onOpen() {
  let ui = SpreadsheetApp.getUi();

  ui.createMenu('⚙️ Additional Tools')
      .addSubMenu(ui.createMenu('Backup Data')
        .addItem('Backup Data EmonVL', 'emonVLbackup')
        .addItem('Backup Data Emon', 'backUpEmon'))
      .addSeparator()
      .addSubMenu(ui.createMenu('Open Folder')
        .addItem('History Data Emon', 'openFolderDataEmon')
        .addItem('History Emon VL', 'openFolderEmonVL'))
      .addToUi();
}

const urlFolder = "https://drive.google.com/drive/folders/";
const folder_1 = 'xxx'; // data emon
const folder_2 = 'xxx'; // emonVL
  
//Folder Location
function openFolderDataEmon() {
  const html = "<script>window.open('" + urlFolder + folder_1 + "');google.script.host.close();</script>";
  const userInterface = HtmlService.createHtmlOutput(html);
  SpreadsheetApp.getUi().showModalDialog(userInterface, 'Opening Drive Folder');
}

function openFolderEmonVL() {
  const html = "<script>window.open('" + urlFolder + folder_2 + "');google.script.host.close();</script>";
  const userInterface = HtmlService.createHtmlOutput(html);
  SpreadsheetApp.getUi().showModalDialog(userInterface, 'Opening Drive Folder');
}

// ******* backup process ******* //

/**
// Sheet Data Emon
function backUpEmon(){
      try{
        const folderIdEmon = '17kk0a883UHqAMwTex1hSsqagchcXaZTI';
        const urlFolderEmon = "https://drive.google.com/drive/folders/" + folderIdEmon;
        const sheets = ['DataEmon']
        const srcSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        const formattedDate = Utilities.formatDate(new Date(), "GMT+7", "dd-MMM-yyy' 'HH:mm");
        const destSpreadsheetName = "Bk_DataEmon " + formattedDate;
        const backupSpreadsheet = SpreadsheetApp.create(destSpreadsheetName);

        // loop range and copyto to backup file
        for(let i=0;i<sheets.length;i++){
          srcSpreadsheet
           .getSheetByName(sheets[i])
           .copyTo(backupSpreadsheet)
           .setName(sheets[i]);
        }

        // delete default sheet on new spreadsheet
        const blank = backupSpreadsheet.getSheetByName('Sheet1');
        backupSpreadsheet.deleteSheet(blank);
        
        // move to folder
        DriveApp
          .getFileById(backupSpreadsheet.getId())
          .moveTo(DriveApp.getFolderById(folderIdEmon));

        // email notification
        let message = {
            to : "subditevaluasi.direktoratpjk@gmail.com",
            subject : "[Mail Notification] File Backup Successful",
            body : "Dear Team, \n\nFile has been backed up in the following folder " + urlFolderEmon + "\nDetail : Data Emon " 
            + Utilities.formatDate(new Date(), "GMT+7", "dd-MMM-yyy") + "\nThank you in advance\n\nGS Admin",
            name : "GS Admin"
        }
        MailApp.sendEmail(message);

      }catch(err){

        // email notification
        const folderIdEmon = '17kk0a883UHqAMwTex1hSsqagchcXaZTI';
        const urlFolderEmon = "https://drive.google.com/drive/folders/" + folderIdEmon;
        let message = {
            to : "subditevaluasi.direktoratpjk@gmail.com",
            subject : "[Mail Notification] File Backup Failed",
            body : "Dear Team, \nFailed to backup file in the following folder " 
                      + urlFolderEmon + "Please try again latter.\nThank you in advance\n\nGS Admin",
            name : "GS Admin"
        }
        MailApp.sendEmail(message);

        console.log(err.message)
      }
} */

function emonVLbackup(){
      try{
        const sheets = ['EmonVLOOKUP'];
        const tempSheets = ['backup_temp'];
        const srcSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        const dateFormat = Utilities.formatDate(new Date(), "GMT+7", "dd-MMM-yyy' 'HH:mm");
        const backupFileName = dateFormat + " WIB" + " - Backup_EmonVL";
        const backupSpreadsheet = SpreadsheetApp.create(backupFileName);
        
        // copy to temp sheet with remove all formulas and only copy values
        srcSpreadsheet.getSheetByName(tempSheets).showSheet();
        let srcRange = srcSpreadsheet.getSheetByName(sheets).getRange("A:AI");
        srcRange.copyTo(srcSpreadsheet.getSheetByName(tempSheets).getRange("A1"), {contentsOnly:true});

        // loop range and copy to backup file
        for(let i=0;i<tempSheets.length;i++){
          srcSpreadsheet
           .getSheetByName(tempSheets[i])
           .copyTo(backupSpreadsheet)
           .setName(sheets[i]);
        }

        // delete default sheet on new spreadsheet
        const blank = backupSpreadsheet.getSheetByName('Sheet1');
        backupSpreadsheet.deleteSheet(blank);
        
        // move and save to folder
        DriveApp
          .getFileById(backupSpreadsheet.getId())
          .moveTo(DriveApp.getFolderById(folder_2));
          
        // email notification
        let message = {
            to : "xxxx",
            subject : "[Mail Notification] File Backup Successful",
            body : "Dear Team, \nFile has been backed up in the following folder " + urlFolder + folder_2 + "\nDetail : Data EmonVLOOKUP "
            + Utilities.formatDate(new Date(), "GMT+7", "dd-MMM-yyy") + "\nThank you in advance\n\nGS Admin",
            name : "GS Admin"
        }
        MailApp.sendEmail(message);


        // delete source in temp sheet
        srcSpreadsheet.getSheetByName(tempSheets).clear();
        srcSpreadsheet.getSheetByName(tempSheets).hideSheet();

      }
      catch(err){
        console.log(err.message)
      }
}

