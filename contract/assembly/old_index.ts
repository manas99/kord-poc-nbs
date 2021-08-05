import {
	context, // visibility into account, contract and blockchain details
	// logging, // append to the execution environment log (appears in JS Developer Console when using near-api-js)
	storage, // key-value store for the contract (used by PersistentMap, PersistentVector and PersistentDeque)
	PersistentMap, // data structure that wraps storage to appear like a Map
	// PersistentVector, // data structure that wraps storage to appear like a Vector
	// PersistentDeque, // data structure that wraps storage to appear like a Deque
	PersistentSet, // data structure that wraps storage to appear like a Set
	// ContractPromise, // make asynchronous calls to other contracts and receive callbacks
	// base58, // utility base58 encoder
	// base64, // utility base64 encoder / decoder
	// math, // utility math functions for hashing using SHA and Keccak as well as pseudo-random data
} from "near-sdk-as";

import { File, FileArray, FileAccess } from "./models";

// CID -> File
let files = new PersistentMap<string, File>("files");
// user -> [CID]
let filesByOwner = new PersistentMap<string, Set<string>>("filesByOwner");
// CID -> [user]
let accessorsByFile = new PersistentMap<string, Set<string>>("accessorsByFile");
// user -> CID -> FileAccess
let fileAccessByOwner = new PersistentMap<string, Map<string, FileAccess>>("fileAccessByOwner");



// export function ownerOf(tokenId: string): string {
// 	let file = getFile(tokenId);
// 	let owner = file.owner;
// 	return owner;
// }
//
function _getFile(tokenId: string): File {
	let file = files.getSome(tokenId);
	return file;
}

function _getFilesByOwner(owner: string): Set<string> {
	let fileCIDs = filesByOwner.get(owner);
	if (!fileCIDs) {
		return new Set<string>();
	}
	return fileCIDs;
}

export function getSendersFiles(owner: string): FileArray {
	let cl = new FileArray();
	cl.files = new Array<File>();
	let fileCids = _getFilesByOwner(owner).values();
	for (let i = 0; i < fileCids.length; i++) {
		cl.files.push(_getFile(fileCids[i]));
	}
	cl.length = cl.files.length;
	return cl;
}

export function createFile(owner_pub_key: string, enc_key: string, cid: string, name: string, type: string): File {
	return _createFile(owner_pub_key, enc_key, cid, name, type);
}

function _setFile(file: File): void {
	files.set(file.cid, file);
}

function _addFileToOwner(file: File): void {
	let fileCIDs = _getFilesByOwner(file.owner);
	if (fileCIDs == null) {
		fileCIDs = new Set<string>();
	}
	fileCIDs.add(file.cid);
	filesByOwner.set(file.owner, fileCIDs);
}

function _addUserToAccessorsByFile(user: string, cid: string): void {
	let accessors = accessorsByFile.get(cid);
	if (!accessors) {
		accessors = new Set<string>();
	}
	accessors.add(user);
	accessorsByFile.set(cid, accessors);
}

function _addAccessToUser(user: string, file: File, owner_pub_key: string, enc_key: string): void {
	let files = fileAccessByOwner.get(user);
	let fa = new FileAccess();
	fa.owner_pub_key = owner_pub_key;
	fa.encrypted_file_key = enc_key;
	if (!files) {
		files = new Map<string, FileAccess>();
	}
	files.set(file.cid, fa);
	fileAccessByOwner.set(user, files);
	_addUserToAccessorsByFile(user, file.cid)
}

function _createFile(owner_pub_key: string, enc_key: string, cid: string, name: string, type: string): File {
	let file = new File();
	file.owner = context.sender;
	file.cid = cid;
	file.name = name;
	file.type = type;
	_setFile(file);
	_addFileToOwner(file);
	_addAccessToUser(context.sender, file, owner_pub_key, enc_key);
	return file;
}
