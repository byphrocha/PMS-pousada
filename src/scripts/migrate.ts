import { migrator } from '../config/migrator';

(async () => {
  await migrator.up();
  console.log('Migrations executadas com sucesso');
  process.exit(0);
})();