import { DataSource } from 'typeorm';

export const DATABASE_CONFIG = {
  PROVIDER_NAME: 'DATA_SOURCE',
  TYPE: 'postgres',
  HOST: process.env.DB_HOST ?? 'localhost',
  PORT: 5432,
  USERNAME: process.env.DB_USERNAME ?? 'postgres',
  PASSWORD: process.env.DB_PASSWORD ?? 'postgres',
  DATABASE: process.env.DB_NAME ?? 'molly_users_test',
  SYNCHRONIZE: process.env.MODE !== 'production',
  MIGRATIONS_RUN: process.env.MODE === 'production',
};

export const dataSource = new DataSource({
  type: 'postgres',
  host: DATABASE_CONFIG.HOST,
  port: DATABASE_CONFIG.PORT,
  username: DATABASE_CONFIG.USERNAME,
  password: DATABASE_CONFIG.PASSWORD,
  database: DATABASE_CONFIG.DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: DATABASE_CONFIG.SYNCHRONIZE,
  migrationsRun: DATABASE_CONFIG.MIGRATIONS_RUN,
});

export const databaseProviders = [
  {
    provide: DATABASE_CONFIG.PROVIDER_NAME,
    useFactory: async () => {
      return dataSource.initialize();
    },
  },
];
