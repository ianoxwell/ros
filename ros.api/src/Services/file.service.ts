import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  async saveJsonFile<T>(fileName: string, data: T): Promise<void | string> {
    if (!fileName.endsWith('.json')) {
      fileName += '.json';
    }

    try {
      const jsonData = JSON.stringify(data, null, 2);
      return await writeFile(`./assets/${fileName}`, jsonData);
    } catch (error) {
      console.log('Error converting data to json');
      return `Error converting data to json or saving file, ${error.json()}`;
    }
  }
}
