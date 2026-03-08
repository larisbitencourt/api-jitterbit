const authMiddleware = require('../../../src/middlewares/auth');
const isAdminMiddleware = require('../../../src/middlewares/isAdmin');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Unidade: Middlewares de Segurança', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    process.env.JWT_SECRET = 'secret_test';
    jest.clearAllMocks();
  });

  describe('Auth Middleware', () => {
    it('Deve retornar 401 se não houver header de autorização', () => {
      authMiddleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido' });
    });

    it('Deve retornar 401 se o token não tiver o formato Bearer', () => {
      req.headers.authorization = 'TokenInvalido 12345';
      authMiddleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Token malformatado' });
    });

    it('Deve chamar next() e preencher o req se o token for válido', () => {
      req.headers.authorization = 'Bearer token_valido';
      const decoded = { name: 'Laris', email: 'laris@dev.com', role: 'admin' };
      
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, decoded);
      });

      authMiddleware(req, res, next);

      expect(req.userRole).toBe('admin');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('isAdmin Middleware', () => {
    it('Deve retornar 403 se o perfil não for admin', () => {
      req.userRole = 'user'; 
      
      isAdminMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Acesso negado: Esta operação requer perfil de administrador.'
      }));
    });

    it('Deve chamar next() se o perfil for admin', () => {
      req.userRole = 'admin';
      
      isAdminMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});