import { configSchema } from './config.schema';

export default () => {
  const result = configSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment configuration:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    throw new Error('Invalid environment configuration');
  }

  return result.data;
};
