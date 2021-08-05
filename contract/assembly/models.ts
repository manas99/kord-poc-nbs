@nearBindgen
export class File {
	owner: string;
	name: string;
	type: string;
	cid: string;
}

@nearBindgen
export class FileAccess {
	owner_pub_key: string;
	encrypted_file_key: string;
}

@nearBindgen
export class FileAccessFile {
	file: File
	file_access: FileAccess;
}
