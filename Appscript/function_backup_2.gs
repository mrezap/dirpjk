/* Credit to
    Start 26 - Oktober - 2021
*/

//UI menu
function onOpen() {
  let ui = SpreadsheetApp.getUi();

  ui.createMenu('⚙️ Additional Tools')
      .addItem('Read API (EMON)', 'freezeEmonAPI')
      .addItem('Read API (SIPBJ)', 'freezeSipbjAPI')
      .addSeparator()
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
const folder_1 = '1brFpXhOreVyo25ABNVLLsL6sgNrfgA6f'; // data emon
const folder_2 = '1pZoxYbrjCuv4_rXnWSDVOgK3Ka2x9iGC'; // emonVL
  
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

// ******* EMON & SIPBJ API ******* //

// read SIPBJ API - Json

//MD5 - stackoverflow
function MD5 (input) {
  let rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, input);
  let txtHash = '';
  for (i = 0; i < rawHash.length; i++) {
    let hashVal = rawHash[i];
    if (hashVal < 0) {
      hashVal += 256;
    }
    if (hashVal.toString(16).length == 1) {
      txtHash += '0';
    }
    txtHash += hashVal.toString(16);
  }
  return txtHash;
}

function getSipbjAPI(){

  let urlAPI = "https://sipbj.pu.go.id/2022/kontrak_spse_gs?token="; // change this url for SIPBJ API path

  //format token in url source >> $token = md5('GS'.date('yyyymmdd'))
  let token = "GS" + Utilities.formatDate(new Date(), "GMT+7", "YY") + Utilities.formatDate(new Date(), "GMT+7", "YY") + Utilities.formatDate(new Date(), "GMT+7", "YY") + Utilities.formatDate(new Date(), "GMT+7", "YY") + Utilities.formatDate(new Date(), "GMT+7", "MM") + Utilities.formatDate(new Date(), "GMT+7", "MM")  + Utilities.formatDate(new Date(), "GMT+7", "dd") + Utilities.formatDate(new Date(), "GMT+7", "dd");
  
  let tokenHash = MD5(token);
  let endpoint = urlAPI + tokenHash

  const srcSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ['json_sipbj_api']

  //console.log(endpoint) - cek md5 endpoint

  srcSpreadsheet.getSheetByName(sheets).activate();
  srcSpreadsheet.getSheetByName(sheets).getRange("B1:I").clear();
  srcSpreadsheet.getSheetByName(sheets).getRange("B1").setFormula('ImportJSON("' + endpoint + '")')

  }

function freezeSipbjAPI(){

  getSipbjAPI()
  SpreadsheetApp.flush()

  const srcSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ['json_sipbj_api']

  srcSpreadsheet.getSheetByName(sheets).getRange("B1:I")
  .copyTo(srcSpreadsheet.getSheetByName(sheets).getRange("B1"), {contentsOnly:true});
    
  srcSpreadsheet.getSheetByName(sheets).getRange("B1:I").setHorizontalAlignment('center');
  srcSpreadsheet.getSheetByName(sheets).getRange("B2:E").setNumberFormat('General');
  srcSpreadsheet.getSheetByName(sheets).getRange("G2:G").setNumberFormat('General');
}

// read EMON API - Json

function getEmonAPI(){

  const srcSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ['json_emon_api']
  const endpointApi = "https://raw.githubusercontent.com/mrezap/dirpjk_pupr/main/birq3-0k2z9.json" // change this url for Emon API endpoint
  
  srcSpreadsheet.getSheetByName(sheets).activate();
  srcSpreadsheet.getSheetByName(sheets).getRange("B3:CF").clear();
  srcSpreadsheet.getSheetByName(sheets).getRange("B3").setFormula('ImportJSON("' + endpointApi + '")')

}

function freezeEmonAPI(){

  getEmonAPI()
  SpreadsheetApp.flush()

  const srcSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ['json_emon_api']

  srcSpreadsheet.getSheetByName(sheets).getRange("B3:CF")
  .copyTo(srcSpreadsheet.getSheetByName(sheets).getRange("B3"), {contentsOnly:true});
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

// sheet EmonVlookup
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

