const productService = require('../services/product.service');

const createProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const product = await productService.createProduct(sellerId, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const products = await productService.getMyProducts(sellerId);
    
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error fetching my products:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = req.params.id;
    const product = await productService.getProductById(sellerId, productId);
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error fetching product by id:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = req.params.id;
    const updatedProduct = await productService.updateProduct(sellerId, productId, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = req.params.id;
    await productService.deleteProduct(sellerId, productId);
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getProducts = async (req, res) => {
  try {
    const result = await productService.getAllProducts(req.query);
    
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getPublicProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productService.getProductDetail(productId);
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error fetching public product by id:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const uploadImage = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = req.params.id;
    const file = req.file;

    const product = await productService.uploadProductImage(sellerId, productId, file);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: product
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error uploading product image:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProducts,
  getPublicProductById,
  uploadImage,
};
