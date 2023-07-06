

/**
 * Gets the time the file was created from the file metadata.
 *
 * @param file the file
 */
export function fileToDate(file: File): Date | undefined {
    const lastModified = file.lastModified;
    const date = new Date(lastModified);
    // Make sure the date is valid
    if (isNaN(date.getTime())) {
        return undefined;
    }

    return date;
}

/**
 * Save the file to the local file system.
 *
 * @param file the file
 * @param date the date
 */
export async function saveFile(file: File, date: Date): Promise<string | undefined> {
    const {appLocalDataDir, resolve} = (await import ("@tauri-apps/api/path"));
    const {createDir, exists, writeBinaryFile} = (await import("@tauri-apps/api/fs"));
    const folderName = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
    const folderPath = await resolve(await appLocalDataDir(), folderName);

    // Ensure the folder exists
    if (!await exists(folderPath)) {
        await createDir(folderPath, {recursive: true});
    }

    // Write the file
    const filePath = await resolve(folderPath, file.name);
    const fileBuffer = await file.arrayBuffer();

    writeBinaryFile(filePath, fileBuffer)
    return filePath;
}