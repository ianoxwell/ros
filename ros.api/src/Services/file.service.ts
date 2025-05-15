import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  async saveJsonFile<T>(fileName: string, data: T, folder = './recipesJson/'): Promise<void | string> {
    if (!fileName.endsWith('.json')) {
      fileName += '.json';
    }

    let jsonData = JSON.stringify({});

    try {
      jsonData = JSON.stringify(data, null, 2);
    } catch (error) {
      console.log('Error converting data to json', error);
      return `Error converting data to json or saving file, ${error}`;
    }

    try {
      return await writeFile(`${folder}${fileName}`, jsonData);
    } catch (error) {
      console.log('error writing file', error);
    }
  }

  async getFilesInFolder(folderPath: string, filePartialName: string): Promise<string[]> {
    const files = await fs.readdir(folderPath);
    const filteredFiles = files.filter((file: string) => file.includes(filePartialName));
    return filteredFiles;
  }

  async readJsonFile<T>(filePath: string): Promise<T | null> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const jsonData = JSON.parse(data);
      return jsonData;
    } catch (error) {
      console.error('Error reading or parsing JSON file:', error);
      return null;
    }
  }

  async moveFile(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      await fs.rename(sourcePath, destinationPath);
    } catch (error) {
      console.error('Error moving file:', error);
    }
  }
}
