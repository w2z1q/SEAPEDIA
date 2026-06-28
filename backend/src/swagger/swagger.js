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
                          imageUrl: { type: 'string', example: 'https://xxxx.supabase.co/storage/v1/object/public/products/...' },
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
                          imageUrl: { type: 'string', example: 'https://xxxx.supabase.co/storage/v1/object/public/products/...' },
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
                        imageUrl: { type: 'string', example: 'https://xxxx.supabase.co/storage/v1/object/public/products/...' },
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
    '/products/{id}/image': {
      post: {
        summary: 'Upload Product Image',
        description: 'Endpoint untuk seller mengupload gambar produk ke Supabase Storage',
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
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file (jpg, jpeg, png, webp)',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Image uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Image uploaded successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'uuid' },
                        imageUrl: { type: 'string', example: 'https://xxxx.supabase.co/storage/v1/object/public/products/...' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Bad Request / Validation Error / File > 5MB' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Product not found / Not owned by seller' },
        },
      },
    },
    '/cart': {
      get: {
        summary: 'Get My Cart',
        description: 'Endpoint untuk Buyer melihat isi keranjang belanjanya beserta kalkulasi summary',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Success retrieve cart items and summary',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        items: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', example: 'cart-item-id' },
                              quantity: { type: 'integer', example: 2 },
                              subtotal: { type: 'number', example: 240000 },
                              product: {
                                type: 'object',
                                properties: {
                                  id: { type: 'string', example: 'product-id' },
                                  name: { type: 'string', example: 'Fresh Salmon' },
                                  price: { type: 'number', example: 120000 },
                                  imageUrl: { type: 'string', example: 'https://xxxxx.supabase.co/storage/v1/object/public/products/salmon.jpg' },
                                  storeId: { type: 'string', example: 'store-id' },
                                },
                              },
                            },
                          },
                        },
                        summary: {
                          type: 'object',
                          properties: {
                            totalItems: { type: 'integer', example: 1 },
                            totalQuantity: { type: 'integer', example: 2 },
                            totalPrice: { type: 'number', example: 240000 },
                          },
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
        },
      },
      post: {
        summary: 'Add to Cart / Update Quantity',
        description: 'Endpoint untuk Buyer menambahkan produk ke keranjang belanja atau mengupdate kuantitas jika sudah ada',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  productId: { type: 'string', example: 'product-id' },
                  quantity: { type: 'integer', example: 2 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Item added to cart successfully (new item)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'cart-item-id' },
                        quantity: { type: 'integer', example: 2 },
                        subtotal: { type: 'number', example: 240000 },
                        product: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: 'product-id' },
                            name: { type: 'string', example: 'Fresh Salmon' },
                            price: { type: 'number', example: 120000 },
                            imageUrl: { type: 'string', example: 'https://xxxxx.supabase.co/storage/v1/object/public/products/salmon.jpg' },
                            storeId: { type: 'string', example: 'store-id' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          200: {
            description: 'Item quantity updated successfully (existing item)',
          },
          400: {
            description: 'Bad Request / Insufficient stock',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Insufficient stock' },
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
    '/cart/{id}': {
      put: {
        summary: 'Update Cart Item Quantity',
        description: 'Endpoint untuk Buyer mengupdate kuantitas item di keranjangnya',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Cart Item ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  quantity: { type: 'integer', example: 5 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Cart item updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'cart-item-id' },
                        quantity: { type: 'integer', example: 5 },
                        subtotal: { type: 'number', example: 600000 },
                        product: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: 'product-id' },
                            name: { type: 'string', example: 'Fresh Salmon' },
                            price: { type: 'number', example: 120000 },
                            imageUrl: { type: 'string', example: 'https://xxxxx.supabase.co/storage/v1/object/public/products/salmon.jpg' },
                            storeId: { type: 'string', example: 'store-id' },
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
            description: 'Bad Request / Insufficient stock',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Insufficient stock' },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Cart item not found' },
        },
      },
      delete: {
        summary: 'Delete Cart Item',
        description: 'Endpoint untuk Buyer menghapus item dari keranjang belanjanya',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Cart Item ID',
          },
        ],
        responses: {
          200: {
            description: 'Cart item deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Cart item deleted successfully' },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Cart item not found' },
        },
      },
    },
    '/orders/checkout': {
      post: {
        summary: 'Checkout Cart to Order',
        description: 'Endpoint untuk Buyer melakukan checkout seluruh isi keranjang menjadi Order beserta OrderItems, sekaligus mengurangi stok produk secara atomik.',
        security: [{ bearerAuth: [] }],
        responses: {
          201: {
            description: 'Checkout berhasil dan Order dibuat',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        order: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: 'uuid-order' },
                            userId: { type: 'string', example: 'uuid-user' },
                            storeId: { type: 'string', example: 'uuid-store' },
                            addressId: { type: 'string', example: 'uuid-address' },
                            status: { type: 'string', example: 'SEDANG_DIKEMAS' },
                            subtotal: { type: 'number', example: 240000 },
                            shippingCost: { type: 'number', example: 0 },
                            tax: { type: 'number', example: 0 },
                            discount: { type: 'number', example: 0 },
                            total: { type: 'number', example: 240000 },
                            createdAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
                          },
                        },
                        items: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', example: 'uuid-order-item' },
                              orderId: { type: 'string', example: 'uuid-order' },
                              productId: { type: 'string', example: 'uuid-product' },
                              quantity: { type: 'integer', example: 2 },
                              price: { type: 'number', example: 120000 },
                              product: {
                                type: 'object',
                                properties: {
                                  id: { type: 'string', example: 'uuid-product' },
                                  name: { type: 'string', example: 'Fresh Salmon' },
                                  price: { type: 'number', example: 120000 },
                                  imageUrl: { type: 'string', example: 'https://xxxxx.supabase.co/storage/v1/object/public/products/salmon.jpg' },
                                  storeId: { type: 'string', example: 'uuid-store' },
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
            },
          },
          400: {
            description: 'Cart kosong / Stock tidak cukup',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Cart is empty / Insufficient stock for product: Fresh Salmon' },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/orders/seller': {
      get: {
        summary: 'Get Seller Orders',
        description: 'Endpoint untuk Seller melihat seluruh pesanan yang masuk ke tokonya',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Daftar order toko berhasil diambil',
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
                          id: { type: 'string', example: 'uuid-order' },
                          customer: { type: 'string', example: 'John Doe' },
                          status: { type: 'string', example: 'SEDANG_DIKEMAS' },
                          total: { type: 'number', example: 240000 },
                          createdAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
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
        },
      },
    },
    '/orders/{id}/status': {
      put: {
        summary: 'Update Order Status',
        description: 'Endpoint untuk Seller memperbarui status pesanan tokonya (SEDANG_DIKEMAS, DIKIRIM, SEDANG_DIKIRIM, SELESAI)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Order ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'SEDANG_DIKIRIM' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Status pesanan berhasil diperbarui',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Order status updated successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'uuid-order' },
                        status: { type: 'string', example: 'SEDANG_DIKIRIM' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request / Status tidak valid',
          },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Order not found' },
        },
      },
    },
    '/orders': {
      get: {
        summary: 'Get Buyer Orders',
        description: 'Endpoint untuk Buyer melihat seluruh riwayat pesanannya (diurutkan berdasarkan createdAt DESC)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Daftar riwayat pesanan buyer berhasil diambil',
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
                          id: { type: 'string', example: 'uuid-order' },
                          status: { type: 'string', example: 'SEDANG_DIKEMAS' },
                          total: { type: 'number', example: 240000 },
                          createdAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
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
        },
      },
    },
    '/orders/{id}': {
      get: {
        summary: 'Get Order Detail',
        description: 'Endpoint untuk Buyer melihat detail lengkap pesanannya beserta produk',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Order ID',
          },
        ],
        responses: {
          200: {
            description: 'Detail pesanan berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'uuid-order' },
                        userId: { type: 'string', example: 'uuid-user' },
                        storeId: { type: 'string', example: 'uuid-store' },
                        status: { type: 'string', example: 'SEDANG_DIKEMAS' },
                        subtotal: { type: 'number', example: 240000 },
                        total: { type: 'number', example: 240000 },
                        createdAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
                        orderItems: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', example: 'uuid-order-item' },
                              productId: { type: 'string', example: 'uuid-product' },
                              quantity: { type: 'integer', example: 2 },
                              price: { type: 'number', example: 120000 },
                              product: {
                                type: 'object',
                                properties: {
                                  id: { type: 'string', example: 'uuid-product' },
                                  name: { type: 'string', example: 'Fresh Salmon' },
                                  price: { type: 'number', example: 120000 },
                                  imageUrl: { type: 'string', example: 'https://xxxxx.supabase.co/storage/v1/object/public/products/salmon.jpg' },
                                  storeId: { type: 'string', example: 'uuid-store' },
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
            },
          },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
          404: { description: 'Order not found' },
        },
      },
    },
    '/wallet': {
      get: {
        summary: 'Get Buyer Wallet',
        description: 'Endpoint untuk Buyer melihat informasi dompet beserta riwayat transaksi',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Data wallet dan riwayat transaksi berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'uuid-wallet' },
                        userId: { type: 'string', example: 'uuid-user' },
                        balance: { type: 'number', example: 50000 },
                        createdAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
                        updatedAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
                        transactions: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', example: 'uuid-tx' },
                              walletId: { type: 'string', example: 'uuid-wallet' },
                              amount: { type: 'number', example: 50000 },
                              type: { type: 'string', example: 'TOPUP' },
                              description: { type: 'string', example: 'Top up saldo wallet' },
                              createdAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
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
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/wallet/topup': {
      post: {
        summary: 'Top Up Wallet Balance',
        description: 'Endpoint untuk Buyer mengisi saldo wallet (minimal 1000)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  amount: { type: 'number', example: 50000 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Top up berhasil dilakukan',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Top up successful' },
                    data: {
                      type: 'object',
                      properties: {
                        wallet: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: 'uuid-wallet' },
                            userId: { type: 'string', example: 'uuid-user' },
                            balance: { type: 'number', example: 100000 },
                            createdAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
                            updatedAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
                          },
                        },
                        transaction: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: 'uuid-tx' },
                            walletId: { type: 'string', example: 'uuid-wallet' },
                            amount: { type: 'number', example: 50000 },
                            type: { type: 'string', example: 'TOPUP' },
                            description: { type: 'string', example: 'Top up saldo wallet' },
                            createdAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
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
            description: 'Bad Request / Amount tidak valid atau di bawah 1000',
          },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/orders/checkout': {
      post: {
        summary: 'Checkout Order',
        description: 'Endpoint untuk Buyer melakukan checkout pesanan dengan metode pengiriman dan pemotongan saldo dompet digital (wallet)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  deliveryMethod: { type: 'string', example: 'INSTANT' },
                  voucherId: { type: 'string', example: 'uuid-voucher' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Order berhasil dibuat dan saldo wallet berhasil dipotong',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        order: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: 'uuid-order' },
                            userId: { type: 'string', example: 'uuid-user' },
                            storeId: { type: 'string', example: 'uuid-store' },
                            addressId: { type: 'string', example: 'uuid-address' },
                            status: { type: 'string', example: 'SEDANG_DIKEMAS' },
                            subtotal: { type: 'number', example: 200000 },
                            shippingCost: { type: 'number', example: 25000 },
                            tax: { type: 'number', example: 27000 },
                            total: { type: 'number', example: 252000 },
                            createdAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
                            updatedAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
                          },
                        },
                        items: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', example: 'uuid-order-item' },
                              productId: { type: 'string', example: 'uuid-product' },
                              quantity: { type: 'integer', example: 2 },
                              price: { type: 'number', example: 100000 },
                              product: {
                                type: 'object',
                                properties: {
                                  id: { type: 'string', example: 'uuid-product' },
                                  name: { type: 'string', example: 'Fresh Salmon' },
                                  price: { type: 'number', example: 100000 },
                                  imageUrl: { type: 'string', example: 'https://xxxxx.supabase.co/storage/v1/object/public/products/salmon.jpg' },
                                  storeId: { type: 'string', example: 'uuid-store' },
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
            },
          },
          400: {
            description: 'Bad Request / Insufficient wallet balance / Cart is empty / deliveryMethod invalid',
          },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/reviews': {
      get: {
        summary: 'Get Public Reviews',
        description: 'Endpoint publik untuk melihat seluruh ulasan aplikasi SEAPEDIA (diurutkan dari yang terbaru)',
        responses: {
          200: {
            description: 'Daftar ulasan berhasil diambil',
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
                          id: { type: 'string', example: 'uuid-review' },
                          rating: { type: 'integer', example: 5 },
                          content: { type: 'string', example: 'Aplikasi SEAPEDIA sangat bagus dan mudah digunakan!' },
                          guestName: { type: 'string', example: 'Guest User' },
                          userId: { type: 'string', example: null },
                          user: {
                            type: 'object',
                            properties: {
                              name: { type: 'string', example: 'Hadziq' },
                            },
                          },
                          createdAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
                          updatedAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
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
      post: {
        summary: 'Create Public Review',
        description: 'Endpoint publik untuk mengirim ulasan aplikasi SEAPEDIA (bisa sebagai guest atau user login)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  guestName: { type: 'string', example: 'Budi (Guest)' },
                  rating: { type: 'integer', example: 5 },
                  content: { type: 'string', example: 'Aplikasi SEAPEDIA sangat membantu nelayan dan pembeli ikan laut!' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Review berhasil dibuat',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Review created successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'uuid-review' },
                        rating: { type: 'integer', example: 5 },
                        content: { type: 'string', example: 'Aplikasi SEAPEDIA sangat membantu nelayan dan pembeli ikan laut!' },
                        guestName: { type: 'string', example: 'Budi (Guest)' },
                        userId: { type: 'string', example: null },
                        createdAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
                        updatedAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request / rating tidak valid / content kurang dari 10 karakter / guestName kurang dari 2 karakter',
          },
        },
      },
    },
    '/vouchers': {
      get: {
        summary: 'Get Vouchers',
        description: 'Endpoint publik untuk melihat seluruh voucher diskon yang tersedia',
        responses: {
          200: {
            description: 'Daftar voucher berhasil diambil',
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
                          id: { type: 'string', example: 'uuid-voucher' },
                          code: { type: 'string', example: 'SEAPEDIA10' },
                          discount: { type: 'number', example: 10 },
                          expiry: { type: 'string', example: '2026-12-31T23:59:59.000Z' },
                          usageLimit: { type: 'integer', example: 100 },
                          usedCount: { type: 'integer', example: 5 },
                          createdAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
                          updatedAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
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
      post: {
        summary: 'Create Voucher (ADMIN Only)',
        description: 'Endpoint khusus ADMIN untuk membuat voucher baru',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'string', example: 'SEAPEDIA10' },
                  discount: { type: 'number', example: 10 },
                  expiry: { type: 'string', example: '2026-12-31T23:59:59.000Z' },
                  usageLimit: { type: 'integer', example: 100 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Voucher berhasil dibuat',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Voucher created successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'uuid-voucher' },
                        code: { type: 'string', example: 'SEAPEDIA10' },
                        discount: { type: 'number', example: 10 },
                        expiry: { type: 'string', example: '2026-12-31T23:59:59.000Z' },
                        usageLimit: { type: 'integer', example: 100 },
                        usedCount: { type: 'integer', example: 0 },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Bad Request / Kode voucher sudah ada / expiry di masa lalu' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden (Not Admin)' },
        },
      },
    },
    '/promos': {
      get: {
        summary: 'Get Promos',
        description: 'Endpoint publik untuk melihat seluruh promo toko yang tersedia',
        responses: {
          200: {
            description: 'Daftar promo berhasil diambil',
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
                          id: { type: 'string', example: 'uuid-promo' },
                          name: { type: 'string', example: 'Promo Diskon Salmon' },
                          discount: { type: 'number', example: 15 },
                          expiry: { type: 'string', example: '2026-12-31T23:59:59.000Z' },
                          storeId: { type: 'string', example: 'uuid-store' },
                          createdAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
                          updatedAt: { type: 'string', example: '2026-06-28T12:00:00.000Z' },
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
      post: {
        summary: 'Create Promo (ADMIN Only)',
        description: 'Endpoint khusus ADMIN untuk membuat promo toko baru',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Promo Diskon Salmon' },
                  discount: { type: 'number', example: 15 },
                  expiry: { type: 'string', example: '2026-12-31T23:59:59.000Z' },
                  storeId: { type: 'string', example: 'uuid-store' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Promo berhasil dibuat',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Promo created successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'uuid-promo' },
                        name: { type: 'string', example: 'Promo Diskon Salmon' },
                        discount: { type: 'number', example: 15 },
                        expiry: { type: 'string', example: '2026-12-31T23:59:59.000Z' },
                        storeId: { type: 'string', example: 'uuid-store' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Bad Request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden (Not Admin)' },
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
