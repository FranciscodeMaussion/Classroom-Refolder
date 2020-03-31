var TEACHERS = ["prof1@gmail.com","prof2@domain.com", "prof3@domain.edu.ar"]
var FOLDERID = "folderid";
var FOLDERNAME = "foldername"
var FOLDERPROFESSORS = "profesor(no backup) folderid"

function main() {
  var parentFolder = DriveApp.getFolderById(FOLDERID).getFolders();
  while (parentFolder.hasNext()) {
    var folder = parentFolder.next();
    if (!folder.isStarred()){
      copyFilesToFolder(folder)
      folder.setStarred(true);
    }
  }
}

function copyFilesToFolder(source_folder) {
  var files = source_folder.getFiles();
  var correction = createIfDoesntExists(source_folder, FOLDERNAME);
  var dest_folder;
  var folderName;
  var fileName;
  while (files.hasNext()) {
    var file = files.next();
    if (!file.isStarred()){
      // get file owner
      var editors = file.getViewers();
      var email;
      var owner = 'none';
      for (var i = 0; i < editors.length; i++) {
        email = editors[i].getEmail();
        if (TEACHERS.indexOf(email) < 0){
          Logger.log(email);
          owner = editors[i]
          break;
        }
      }
      if (owner == 'none'){
        owner = file.getOwner();
        Logger.log(owner.getEmail())
      }
      // set owner as a folder
      folderName = owner.getName()+"-"+owner.getEmail();
      dest_folder = createIfDoesntExists(correction, folderName);
      // save in folder
      fileName = "("+formatDate(file.getLastUpdated())+")-"+file.getName();
      Logger.log(file.getLastUpdated());
      file.makeCopy(dest_folder).setName(fileName);
      file.setStarred(true);
    }
  }
}

function createIfDoesntExists(source_folder, folder_name){
  var folders = source_folder.getFolders();   
  while (folders.hasNext()) {
    var folder = folders.next();
    if(folder_name == folder.getName()) {
      return folder;
    }
  }
  return source_folder.createFolder(folder_name);
}

function unStarModified(){
  var parentFolder = DriveApp.getFolderById(FOLDERID).getFolders();
  while (parentFolder.hasNext()) {
    var folder = parentFolder.next();
    if (folder.isStarred() && verifyFiles(folder) && folder.getId() != FOLDERPROFESSORS){
      folder.setStarred(false);
    }
  }
}

function verifyFiles(folder){
  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    if (!file.isStarred()){
      return true;
    }
  }
  return false;
}

function formatDate (now) {
  year = "" + now.getFullYear();
  month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
  day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  return day + "/" + month + "/" + year + "-" + hour + ":" + minute;
}
