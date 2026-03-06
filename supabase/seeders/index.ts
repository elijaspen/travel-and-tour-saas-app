import { logger } from './utils/logger';

async function runAllSeeders() {
  const appEnv = process.env.APP_ENVIRONMENT || process.env.NODE_ENV || 'development';
  logger.info({ environment: appEnv }, 'Starting database seeding...\n');

  const seeders: { name: string; fn: () => Promise<void> }[] = [
    // Add seeders here as your project grows:
    // { name: 'Categories', fn: seedCategories },
  ];

  if (seeders.length === 0) {
    logger.info('No seeders configured. Add seeders to the array in supabase/seeders/index.ts');
    process.exit(0);
  }

  const results: { name: string; success: boolean; error?: unknown }[] = [];

  for (const seeder of seeders) {
    try {
      await seeder.fn();
      results.push({ name: seeder.name, success: true });
      logger.debug('');
    } catch (error) {
      results.push({ name: seeder.name, success: false, error });
      logger.debug('');
    }
  }

  // Summary
  logger.info('\nSeeding Summary:');
  logger.info('='.repeat(50));
  results.forEach((result) => {
    if (result.success) {
      logger.info(`[OK] ${result.name}`);
    } else {
      logger.error({ error: result.error }, `[FAIL] ${result.name}`);
    }
  });
  logger.info('='.repeat(50));

  const successCount = results.filter((r) => r.success).length;
  const totalCount = results.length;

  if (successCount === totalCount) {
    logger.info({ successCount, totalCount }, 'All seeders completed successfully!');
    process.exit(0);
  } else {
    logger.warn({ successCount, totalCount }, 'Some seeders failed.');
    process.exit(1);
  }
}

if (require.main === module) {
  runAllSeeders().catch((error) => {
    logger.fatal({ error }, 'Fatal error in seeder');
    process.exit(1);
  });
}

export { runAllSeeders };
