const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const registerUser = async (data) => {
  const { name, email, password } = data;

  // Cek email sudah ada atau belum
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error('Email already exists');
    error.status = 409;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Buat User dan UserRole dalam satu transaction
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        activeRole: 'BUYER',
      },
    });

    await tx.userRole.create({
      data: {
        userId: user.id,
        role: 'BUYER',
      },
    });

    return user;
  });

  return result;
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.activeRole,
  };

  const secret = process.env.JWT_SECRET || 'secret';
  const accessToken = jwt.sign(payload, secret, { expiresIn: '7d' });

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.activeRole,
    }
  };
};

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      activeRole: true,
    }
  });

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.activeRole,
  };
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
