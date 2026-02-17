module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', '72.62.67.205'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'new_project_db'),
      user: env('DATABASE_USERNAME', 'new_project_user'),
      password: env('DATABASE_PASSWORD'),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
      },
    },
    debug: false,
  },
});
