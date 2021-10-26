/* Credit to

    ** Anees Hameed
    ** Abhijeet Chopra
    ** Google
    ** Stackoverflow
    ** Stackexchange
    ** Reddit
    ** Github
    ** Google Apps Script Reference

    30 - July - 2021
*/

// for debugging only
/* function archiveSheet() {
  //onOpen()
  //openArchive()
  backUpVL ()
  backUpEmon ()
} */


// ******* backup process ******* //

// Sheet emonVL
function backUpVL(){
      try{
        const folderIdEvl = 'xxxxxxxxxxxxxxxxxx'; //drop folder ID in here
        const urlFolderEvl = "https://drive.google.com/drive/folders/" + folderIdEvl;
        const sheets = ['EmonVLOOKUP'];
        const tmpsheets = ['backup'];
        const srcSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        const formattedDate = Utilities.formatDate(new Date(), "GMT+7", "dd-MMM-yyy' 'HH:mm");
        const destSpreadsheetName = formattedDate + " WIB" + " ; Backup_EmonVL";
        const backupSpreadsheet = SpreadsheetApp.create(destSpreadsheetName);
        
        // copy to temp sheet -> to remove all formula and copy only values
        let srcRange = srcSpreadsheet.getSheetByName(sheets).getRange("A:AK");
        srcRange.copyTo(srcSpreadsheet.getSheetByName(tmpsheets).getRange("A1"), {contentsOnly:true});

        // loop range and copy to backup file
        for(let i=0;i<tmpsheets.length;i++){
          srcSpreadsheet
           .getSheetByName(tmpsheets[i])
           .copyTo(backupSpreadsheet)
           .setName(sheets[i]);
        }

        // delete default sheet on new spreadsheet
        const blank = backupSpreadsheet.getSheetByName('Sheet1');
        backupSpreadsheet.deleteSheet(blank);
        
        // move to folder
        DriveApp
          .getFileById(backupSpreadsheet.getId())
          .moveTo(DriveApp.getFolderById(folderIdEvl));

        // delete source in temp sheet
        srcSpreadsheet.getSheetByName(tmpsheets).clear();
        /*SpreadsheetApp.flush();
        srcSpreadsheet.getSheetByName().hideSheet(tmpsheets);*/
      
        // email notification
        let message = {
            to : "xxxxxxxxxx",
            subject : "[Mail Notification] File Backup Successful",
            body : "Dear Team, \nFile has been backed up in the following folder " + urlFolderEvl + "\nDetail : Data  EmonVLOOKUP "
            + Utilities.formatDate(new Date(), "GMT+7", "dd-MMM-yyy") + "\nThank you in advance\n\nGS Admin",
            name : "GS Admin"
        }
        MailApp.sendEmail(message);

      }catch(err){
          
        // email notification
        let message = {
            to : "xxxxxxx",
            subject : "[Mail Notification] File Backup Failed",
            body : "Dear Team, \nFailed to backup file in the following folder \nPlease try again latter.\nThank you in advance\n\nGS Admin",
            name : "GS Admin"
        }
        MailApp.sendEmail(message);

        console.log(err.message)
      }
}

// Sheet Data Emon
function backUpEmon(){
      try{
        const folderIdEvl = 'xxxxxxxxxxxxxxxxxx'; //drop folder ID in here
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
            to : "xxxxxxxxxxxxxxxxxx",
            subject : "[Mail Notification] File Backup Successful",
            body : "Dear Team, \n\nFile has been backed up in the following folder " + urlFolderEmon + "\nDetail : Data Emon " 
            + Utilities.formatDate(new Date(), "GMT+7", "dd-MMM-yyy") + "\nThank you in advance\n\nGS Admin",
            name : "GS Admin"
        }
        MailApp.sendEmail(message);

      }catch(err){

        // email notification
        let message = {
            to : "xxxxxxxxxxxxx",
            subject : "[Mail Notification] File Backup Failed",
            body : "Dear Team, \nFailed to backup file in the following folder \nPlease try again latter.\nThank you in advance\n\nGS Admin",
            name : "GS Admin"
        }
        MailApp.sendEmail(message);

        console.log(err.message)
      }
}


//add UI menu
function onOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('Archive Tools')
      .addItem('Backup EmonVL', 'backUpVL')
      .addItem('Backup Data Emon', 'backUpEmon')
      .addSeparator()
      .addSubMenu(ui.createMenu('Open Folder')
        .addItem('Archive Data Emon', 'openArchiveEmon')
        .addItem('Archive Emon VL', 'openArchiveVL'))
      .addToUi();
}

// go to folder
function openArchiveEmon() {

  const folderIdEmon = 'xxxxxxxxxxxxxx';
  const urlFolderEmon = "https://drive.google.com/drive/folders/" + folderIdEmon;
  const html = "<script>window.open('" + urlFolderEmon + "');google.script.host.close();</script>";
  const userInterface = HtmlService.createHtmlOutput(html);
  SpreadsheetApp.getUi().showModalDialog(userInterface, 'Opening Drive Folder');
}

function openArchiveVL() {

  const folderIdEvl = 'xxxxxxxxxxxxxxx';
  const urlFolderEvl = "https://drive.google.com/drive/folders/" + folderIdEvl;
  const html = "<script>window.open('" + urlFolderEvl + "');google.script.host.close();</script>";
  const userInterface = HtmlService.createHtmlOutput(html);
  SpreadsheetApp.getUi().showModalDialog(userInterface, 'Opening Drive Folder');
}

