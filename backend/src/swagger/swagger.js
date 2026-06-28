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
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'User registered successfully',
                    },
                    data: {
                      type: 'object',
                      example: {},
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
                    success: {
                      type: 'boolean',
                      example: false,
                    },
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
                    success: {
                      type: 'boolean',
                      example: false,
                    },
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
    '/auth/login': {
      post: {
        summary: 'Login User',
        description: 'Endpoint untuk login user dan mendapatkan JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
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
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Login successful',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        accessToken: {
                          type: 'string',
                          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                        user: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                              example: 'uuid',
                            },
                            name: {
                              type: 'string',
                              example: 'John Doe',
                            },
                            email: {
                              type: 'string',
                              example: 'johndoe@example.com',
                            },
                            role: {
                              type: 'string',
                              example: 'BUYER',
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
          400: {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Email is required',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Invalid email or password',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/profile': {
      get: {
        summary: 'Get User Profile',
        description: 'Endpoint untuk mendapatkan profil user yang sedang login',
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: 'Success retrieve profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          example: 'uuid',
                        },
                        name: {
                          type: 'string',
                          example: 'John Doe',
                        },
                        email: {
                          type: 'string',
                          example: 'johndoe@example.com',
                        },
                        role: {
                          type: 'string',
                          example: 'BUYER',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Unauthorized: Missing or invalid token format',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'User not found',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        summary: 'Logout User',
        description: 'Endpoint untuk melakukan logout',
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: 'Logout successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Logout successful',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Unauthorized: Missing or invalid token format',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/store': {
      post: {
        summary: 'Create Store',
        description: 'Endpoint untuk Seller membuat toko baru',
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'SeaFood Store',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Store created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Store created successfully',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          example: 'uuid',
                        },
                        name: {
                          type: 'string',
                          example: 'SeaFood Store',
                        },
                      },
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
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Store name must be at least 3 characters long',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Unauthorized: Missing or invalid token format',
                    },
                  },
                },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Forbidden: Insufficient permissions',
                    },
                  },
                },
              },
            },
          },
          409: {
            description: 'Store already exists',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Store already exists for this user',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/store/me': {
      get: {
        summary: 'Get My Store',
        description: 'Endpoint untuk mendapatkan informasi toko milik seller yang sedang login',
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: 'Success retrieve store',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          example: 'uuid',
                        },
                        name: {
                          type: 'string',
                          example: 'SeaFood Store',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Unauthorized: Missing or invalid token format',
                    },
                  },
                },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Forbidden: Insufficient permissions',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Store not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false,
                    },
                    message: {
                      type: 'string',
                      example: 'Store not found',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/products': {
      get: {
        summary: 'Get All Products',
        description: 'Endpoint publik untuk melihat katalog produk',
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 },
            description: 'Page number',
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', default: 12 },
            description: 'Items per page',
          },
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Search by product name',
          },
        ],
        responses: {
          200: {
            description: 'Success retrieve all products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', example: 'uuid' },
                          name: { type: 'string', example: 'Fresh Salmon' },
                          description: { type: 'string', example: 'Fresh Norwegian Salmon' },
                          price: { type: 'number', example: 120000 },
                          stock: { type: 'number', example: 20 },
                          store: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', example: 'store-uuid' },
                              name: { type: 'string', example: 'SeaFresh Store' }
                            }
                          }
                        }
                      }
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 12 },
                        total: { type: 'integer', example: 85 },
                        totalPages: { type: 'integer', example: 8 },
                      }
                    }
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create Product',
        description: 'Endpoint untuk Seller membuat produk baru',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Fresh Salmon' },
                  description: { type: 'string', example: 'Fresh Norwegian Salmon' },
                  price: { type: 'number', example: 120000 },
                  stock: { type: 'number', example: 20 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Product created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Product created successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'uuid' },
                        name: { type: 'string', example: 'Fresh Salmon' },
                        price: { type: 'number', example: 120000 },
                        stock: { type: 'number', example: 20 },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Validation Error' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/products/me': {
      get: {
        summary: 'Get My Products',
        description: 'Endpoint untuk mendapatkan daftar produk milik seller',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Success retrieve products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', example: 'uuid' },
                          name: { type: 'string', example: 'Fresh Salmon' },
                          price: { type: 'number', example: 120000 },
                          stock: { type: 'number', example: 20 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Store not found' },
        },
      },
    },
    '/products/{id}': {
      get: {
        summary: 'Get Product Details',
        description: 'Endpoint publik untuk mendapatkan detail produk',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID',
          },
        ],
        responses: {
          200: {
            description: 'Success retrieve product',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'uuid' },
                        name: { type: 'string', example: 'Fresh Salmon' },
                        description: { type: 'string', example: 'Fresh Norwegian Salmon' },
                        price: { type: 'number', example: 120000 },
                        stock: { type: 'number', example: 20 },
                        store: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: 'store-uuid' },
                            name: { type: 'string', example: 'SeaFresh Store' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: { description: 'Product not found' },
        },
      },
      put: {
        summary: 'Update Product',
        description: 'Endpoint untuk mengupdate produk milik seller',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Fresh Salmon' },
                  description: { type: 'string', example: 'Fresh Norwegian Salmon' },
                  price: { type: 'number', example: 120000 },
                  stock: { type: 'number', example: 20 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Product updated successfully' },
          400: { description: 'Validation Error' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Product not found' },
        },
      },
      delete: {
        summary: 'Delete Product',
        description: 'Endpoint untuk menghapus produk milik seller',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID',
          },
        ],
        responses: {
          200: {
            description: 'Product deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Product deleted successfully' },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Product not found' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

module.exports = swaggerSpec;
