/* Credit to
    26 - Oktober - 2021
*/

//UI menu
function onOpen() {
  let ui = SpreadsheetApp.getUi();

  ui.createMenu('⚙️ Additional Tools')
      .addItem('Update Paket GS', 'updatePaketGS')
      .addItem('Freeze Paket GS', 'freezePaketGS')
      .addSeparator()
      .addItem('Backup Data EmonVL', 'emonVLbackup')
      .addItem('Backup Data Emon', 'dataEmonBackup')
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

// Sheet Data Emon
function dataEmonBackup(){
      try{
        const sheets = ['DataEmon']
        const srcSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        const dateFormat = Utilities.formatDate(new Date(), "GMT+7", "dd-MMM-yyy' 'HH:mm");
        const backupFileName = dateFormat + " WIB" + " - Backup_DataEmon";
        const backupSpreadsheet = SpreadsheetApp.create(backupFileName);

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
          .moveTo(DriveApp.getFolderById(folder_1));
          
      }catch(err){
        console.log(err.message)
      }
}

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

// ******* update process ******* //

function updateFreeze(){
  updatePaketGS()
  SpreadsheetApp.flush()
  freezePaketGS()
}

function updatePaketGS() {
  paketGSpartOne()
  paketGSpartTwo()
  paketGSpartThree()
}

function freezePaketGS() {

  SpreadsheetApp.flush()

  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let range_1 = ss.getSheetByName('gs_00-10').getRange('A:CD')
  let range_2 = ss.getSheetByName('gs_11-22').getRange('A:CD')
  let range_3 = ss.getSheetByName('gs_23-34').getRange('A:CD')
      
      range_1.copyTo(range_1, {contentsOnly: true});
      range_2.copyTo(range_2, {contentsOnly: true});
      range_3.copyTo(range_3, {contentsOnly: true});
      
      ss.getSheetByName('gs_00-10').hideSheet();
      ss.getSheetByName('gs_11-22').hideSheet();
      ss.getSheetByName('gs_23-34').hideSheet();
  }

function paketGSpartOne() {

  let ss = SpreadsheetApp.getActiveSpreadsheet();
        
  // sheet gs part 1
    ss.getSheetByName('gs_00-10').showSheet();
    ss.getSheetByName('gs_00-10').clear().getRange('A1');
    ss.getSheetByName('gs_00-10').getRange('A1').setFormula('=QUERY({IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(2,2,1,1)+'";"Data Paket!$A5:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(3,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(4,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(5,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(6,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(7,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(8,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(9,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(10,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(11,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(12,2,1,1)+'";"Data Paket!$A6:$CD")};"WHERE Col1 IS NOT NULL";1)');
}

function paketGSpartTwo() {

  let ss = SpreadsheetApp.getActiveSpreadsheet();
        
  // sheet gs part 2
    ss.getSheetByName('gs_11-22').showSheet();
    ss.getSheetByName('gs_11-22').clear().getRange('A1');
    ss.getSheetByName('gs_11-22').getRange('A1').setFormula('=QUERY({IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(13,2,1,1)+'";"Data Paket!$A5:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(14,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(15,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(16,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(17,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(18,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(19,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(20,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(21,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(22,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(23,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(24,2,1,1)+'";"Data Paket!$A6:$CD")};"WHERE Col1 IS NOT NULL";1)');
}

function paketGSpartThree(){

  let ss = SpreadsheetApp.getActiveSpreadsheet();
        
  // sheet gs part 3
    ss.getSheetByName('gs_23-34').showSheet();
    ss.getSheetByName('gs_23-34').clear().getRange('A1');
    ss.getSheetByName('gs_23-34').getRange('A1').setFormula('=QUERY({IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(25,2,1,1)+'";"Data Paket!$A5:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(26,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(27,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(28,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(29,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(30,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(31,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(32,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(33,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(34,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(35,2,1,1)+'";"Data Paket!$A6:$CD");IMPORTRANGE("'+ ss.getSheetByName('reference#').getSheetValues(36,2,1,1)+'";"Data Paket!$A6:$CD")};"WHERE Col1 IS NOT NULL";1)');
}
