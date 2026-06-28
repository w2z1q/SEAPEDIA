const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'SEAPEDIA API Documentation',
    version: '1.0.0',
    description: 'Dokumentasi REST API untuk platform marketplace SEAPEDIA',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development Server',
    },
  ],
  paths: {
    '/': {
      get: {
        summary: 'Health Check Endpoint',
        description: 'Mengecek status server backend Express.js',
        responses: {
          200: {
            description: 'Server berjalan dengan baik',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    message: {
                      type: 'string',
                      example: 'SEAPEDIA Backend Express Server is running smoothly',
                    },
                    docs: {
                      type: 'string',
                      example: 'http://localhost:5000/api-docs',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/test': {
      get: {
        summary: 'Auth Test Endpoint',
        description: 'Mengecek ketersediaan module authentication',
        responses: {
          200: {
            description: 'Auth module siap digunakan',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Auth module is ready',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Register User Baru',
        description: 'Endpoint untuk mendaftarkan user baru',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'John Doe',
                  },
                  email: {
                    type: 'string',
                    example: 'johndoe@example.com',
                  },
                  password: {
                    type: 'string',
                    example: 'password123',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'User registered successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Password must be at least 8 characters long',
                    },
                  },
                },
              },
            },
          },
          409: {
            description: 'Email already exists',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Email already exists',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
