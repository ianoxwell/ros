import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  async saveJsonFile<T>(fileName: string, data: T): Promise<void | string> {
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
      return await writeFile(`./recipesJson/${fileName}`, jsonData);
    } catch (error) {
      console.log('error writing file', error);
    }
  }
}
