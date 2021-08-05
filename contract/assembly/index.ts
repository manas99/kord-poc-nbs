import { context, storage, PersistentMap, PersistentSet } from "near-sdk-as";

import { File, FileAccess, FileAccessFile } from "./models";

// CID -> File
let files = new PersistentMap<string, File>("files");
// user -> {CID}
let filesByOwner = new PersistentMap<string, Set<string>>("filesByOwner");
// CID -> {user}
let accessorsByFile = new PersistentMap<string, Set<string>>("accessorsByFile");
// user -> CID -> FileAccess
let fileAccessByOwner = new PersistentMap<string, Map<string, FileAccess>>("fileAccessByOwner");

//Helper functions
function _getFilesByOwner(user: string): Set<string> {
	let fileCIDs = filesByOwner.get(user);
	if (!fileCIDs) {
		return new Set<string>();
	}
	return fileCIDs;
}

function _getUserAccessFiles(user: string): Map<string, FileAccess> {
	let fileCIDs = fileAccessByOwner.get(user);
	if (!fileCIDs) {
		return new Map<string, FileAccess>();
	}
	return fileCIDs;
}

function _getFileAccessors(cid: string): Set<string> {
	let fileCIDs = accessorsByFile.get(cid);
	if (!fileCIDs) {
		return new Set<string>();
	}
	return fileCIDs;
}

function _getFile(tokenId: string): File {
	let file = files.getSome(tokenId);
	return file;
}

function _addFile(cid: string, file: File): void {
	files.set(cid, file);
}

function _addFileToOwner(file: File): void {
	let fileCIDs = _getFilesByOwner(file.owner);
	fileCIDs.add(file.cid);
	filesByOwner.set(file.owner, fileCIDs);
}

function _addUserToFileAccessors(user: string, cid: string): void {
	let accessors = _getFileAccessors(cid);
	accessors.add(user);
	accessorsByFile.set(cid, accessors);
}

function _addAccessToUser(user: string, cid: string, owner_pub_key: string, enc_key: string): void {
	let files = _getUserAccessFiles(user);
	let fa = new FileAccess();
	fa.owner_pub_key = owner_pub_key;
	fa.encrypted_file_key = enc_key;
	files.set(cid, fa);
	fileAccessByOwner.set(user, files);
	_addUserToFileAccessors(user, cid)
}

// Public functions
export function createFile(owner_pub_key: string, enc_key: string, cid: string, name: string, type: string): File {
	let file = new File();
	file.owner = context.sender;
	file.cid = cid;
	file.name = name;
	file.type = type;
	_addFile(cid, file);
	_addFileToOwner(file);
	_addAccessToUser(context.sender, file.cid, owner_pub_key, enc_key);
	return file;
}
export function getCreatedFiles(owner: string): Array<File> {
	let _files = new Array<File>();
	let fileCids = _getFilesByOwner(owner).values();
	for (let i = 0; i < fileCids.length; i++) {
		_files.push(_getFile(fileCids[i]));
	}
	return _files;
}
export function getAccessKeys(owner: string): Map<string, FileAccessFile> {
	let acckeys = _getUserAccessFiles(owner);
	let cids = acckeys.keys()
	let faf = new Map<string, FileAccessFile>();
	for (let i = 0; i < cids.length; i++) {
		let x = new FileAccessFile();
		x.file = _getFile(cids[i]);
		x.file_access = acckeys[cids[i]];
		faf.set(cids[i], x);
	}
	return faf;
}
export function getAccessorsForFile(cid: string): Set<string> {
	return _getFileAccessors(cid);
}

export function shareAccess(cid: string, user: string, owner_pub_key: string, enc_key: string): void {
	_addAccessToUser(user, cid, owner_pub_key, enc_key);
}
