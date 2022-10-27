export const configuration = () => ({
  apiPrefix: 'api',
  port: 3000,

  // Cors
  corsOrigins: ['http://localhost:4200'],

  // OpenAPI
  openAPIPath: 'api-docs',
  openAPITitle: 'skulljs nestjs example',
  openAPIDescription: 'nestjs component for skulljs',
  openAPIVersion: '1.0',

  // Session
  sessionSecret: 'BVfSn4G9ZStpNxgCe2Pp',
  sessionCookieMaxAge: 86400000, // 1 day
});
