import {appLocalDataDir, resolve} from "@tauri-apps/api/path";
import {createDir, exists, writeBinaryFile} from "@tauri-apps/api/fs";

/**
 * Convert the file name to a date
 *
 * @param fileName the file name
 */
export function fileNameToDate(fileName: string): Date | undefined {
    // Ensure the file name is in the correct format
    if (!fileName.match(/^\d{6}_\d{4}\.mp3$/)) {
        return undefined;
    }

    // Get the year, month, day, hour, and minute from the file name
    const year = fileName.substring(0, 2);
    const month = fileName.substring(2, 4);
    const day = fileName.substring(4, 6);
    const hour = fileName.substring(7, 9);
    const minute = fileName.substring(9, 11);
    const date = new Date();

    // Set the year, month, day, hour, minute, and second
    date.setFullYear(2000 + parseInt(year));
    date.setMonth(parseInt(month));
    date.setDate(parseInt(day));
    date.setHours(parseInt(hour));
    date.setMinutes(parseInt(minute));
    date.setSeconds(0);

    return date;
}

/**
 * Save the file to the local file system.
 *
 * @param file the file
 * @param date the date
 */
export async function saveFile(file: File, date: Date): Promise<string | undefined> {
    const folderName = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
    const fileName = `${date.getFullYear()}${date.getMonth()}${date.getDate()}_${date.getHours()}${date.getMinutes()}.mp3`;
    const folderPath = await resolve(await appLocalDataDir(), folderName);

    // Ensure the folder exists
    if (!await exists(folderPath)) {
        await createDir(folderPath, {recursive: true});
    }

    // Write the file
    const filePath = await resolve(folderPath, fileName);
    const fileBuffer = await file.arrayBuffer();

    writeBinaryFile(filePath, fileBuffer)
    return filePath;
}