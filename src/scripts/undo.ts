import { migrator } from '../config/migrator';

(async () => {
  await migrator.down({ to: 0 });
  console.log('Migrations revertidas');
  process.exit(0);
})();