import { NestFactory } from '@nestjs/core';
import { Seeder } from './Database/seeders/seeder';
import { SeederModule } from './Database/seeders/seeder.module';

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then((appContext) => {
      const seeder = appContext.get(Seeder);
      seeder
        .seed()
        .then(() => {
          console.debug('Seeding complete!');
        })
        .catch((error) => {
          console.error('Seeding failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch((error) => {
      throw error;
    });
}
bootstrap();
