var TEACHERS = ["prof1@gmail.com","prof2@domain.com", "prof3@domain.edu.ar"]
var FOLDERID = "folderid";
var FOLDERNAME = "foldername"

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
      fileName = "("+file.getLastUpdated()+")-"+file.getName();
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
    if (folder.isStarred() && verifyFiles(folder)){
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
