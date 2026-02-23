import { Router, Request, Response } from 'express';

const router = Router();

// API Documentation endpoint
router.get('/', (req: Request, res: Response) => {
  res.json({
    apiVersion: 'v1',
    documentation: {
      base: {
        title: 'HHTrails API Documentation',
        version: '1.0.0',
        description: 'RESTful API for HHTrails tour planning platform with authentication',
        baseUrl: `${req.protocol}://${req.get('host')}/api/v1`,
      },
      authentication: {
        type: 'Bearer Token',
        header: 'Authorization: Bearer <access_token>',
        description: 'Most endpoints require JWT authentication. Include the access token in the Authorization header.',
      },
      endpoints: {
        auth: {
          signup: {
            method: 'POST',
            path: '/auth/signup',
            description: 'Register a new user with email and password',
            authentication: false,
            requestBody: {
              email: 'string (required) - Valid email address',
              password: 'string (required) - Min 8 chars, must contain uppercase, lowercase, and number',
              fullName: 'string (optional) - User\'s full name',
            },
            responses: {
              201: 'User created successfully',
              400: 'Validation error',
              409: 'Email already registered',
            },
            example: {
              request: {
                email: 'user@example.com',
                password: 'SecurePass123',
                fullName: 'John Doe',
              },
              response: {
                success: true,
                data: {
                  user: {
                    id: 'uuid',
                    email: 'user@example.com',
                    fullName: 'John Doe',
                  },
                  session: {
                    access_token: 'jwt_token',
                    refresh_token: 'refresh_token',
                  },
                  message: 'Please check your email to verify your account',
                },
              },
            },
          },
          signin: {
            method: 'POST',
            path: '/auth/signin',
            description: 'Sign in with email and password',
            authentication: false,
            requestBody: {
              email: 'string (required) - User email',
              password: 'string (required) - User password',
            },
            responses: {
              200: 'Successfully authenticated',
              401: 'Invalid credentials',
            },
            example: {
              request: {
                email: 'user@example.com',
                password: 'SecurePass123',
              },
              response: {
                success: true,
                data: {
                  user: {
                    id: 'uuid',
                    email: 'user@example.com',
                    fullName: 'John Doe',
                  },
                  session: {
                    accessToken: 'jwt_token',
                    refreshToken: 'refresh_token',
                    expiresIn: 3600,
                    expiresAt: 1234567890,
                  },
                },
              },
            },
          },
          googleAuth: {
            method: 'POST',
            path: '/auth/google',
            description: 'Authenticate with Google ID token',
            authentication: false,
            requestBody: {
              idToken: 'string (required) - Google ID token from OAuth flow',
            },
            responses: {
              200: 'Successfully authenticated',
              401: 'Invalid Google token',
            },
            example: {
              request: {
                idToken: 'google_id_token_here',
              },
              response: {
                success: true,
                data: {
                  user: {
                    id: 'uuid',
                    email: 'user@gmail.com',
                    fullName: 'John Doe',
                    avatar: 'https://avatar-url.com',
                  },
                  session: {
                    accessToken: 'jwt_token',
                    refreshToken: 'refresh_token',
                    expiresIn: 3600,
                  },
                },
              },
            },
          },
          googleAuthUrl: {
            method: 'GET',
            path: '/auth/google/url',
            description: 'Get Google OAuth authorization URL',
            authentication: false,
            responses: {
              200: 'OAuth URL generated',
            },
            example: {
              response: {
                success: true,
                data: {
                  url: 'https://accounts.google.com/o/oauth2/v2/auth?...',
                },
              },
            },
          },
          signout: {
            method: 'POST',
            path: '/auth/signout',
            description: 'Sign out current user',
            authentication: true,
            responses: {
              200: 'Successfully signed out',
              401: 'Not authenticated',
            },
            example: {
              response: {
                success: true,
                data: {
                  message: 'Successfully signed out',
                },
              },
            },
          },
          getCurrentUser: {
            method: 'GET',
            path: '/auth/me',
            description: 'Get current authenticated user profile',
            authentication: true,
            responses: {
              200: 'User profile retrieved',
              401: 'Not authenticated',
            },
            example: {
              response: {
                success: true,
                data: {
                  user: {
                    id: 'uuid',
                    email: 'user@example.com',
                    fullName: 'John Doe',
                    avatar: 'https://avatar-url.com',
                    emailVerified: true,
                    createdAt: '2026-01-01T00:00:00Z',
                  },
                },
              },
            },
          },
          refreshToken: {
            method: 'POST',
            path: '/auth/refresh',
            description: 'Refresh access token using refresh token',
            authentication: false,
            requestBody: {
              refreshToken: 'string (required) - Refresh token from signin',
            },
            responses: {
              200: 'Token refreshed successfully',
              401: 'Invalid or expired refresh token',
            },
            example: {
              request: {
                refreshToken: 'refresh_token_here',
              },
              response: {
                success: true,
                data: {
                  session: {
                    accessToken: 'new_jwt_token',
                    refreshToken: 'new_refresh_token',
                    expiresIn: 3600,
                  },
                },
              },
            },
          },
          requestPasswordReset: {
            method: 'POST',
            path: '/auth/password/reset-request',
            description: 'Request password reset email',
            authentication: false,
            requestBody: {
              email: 'string (required) - User email',
            },
            responses: {
              200: 'Reset email sent (if email exists)',
            },
            example: {
              request: {
                email: 'user@example.com',
              },
              response: {
                success: true,
                data: {
                  message: 'If the email exists, a password reset link has been sent',
                },
              },
            },
          },
          resetPassword: {
            method: 'POST',
            path: '/auth/password/reset',
            description: 'Reset password with reset token',
            authentication: false,
            requestBody: {
              token: 'string (required) - Reset token from email',
              password: 'string (required) - New password (min 8 chars, uppercase, lowercase, number)',
            },
            responses: {
              200: 'Password reset successfully',
              401: 'Invalid or expired token',
            },
            example: {
              request: {
                token: 'reset_token_from_email',
                password: 'NewSecurePass123',
              },
              response: {
                success: true,
                data: {
                  message: 'Password successfully reset',
                },
              },
            },
          },
        },
      },
      responseFormat: {
        success: {
          description: 'All successful responses follow this format',
          structure: {
            success: 'boolean - Always true for successful responses',
            data: 'object - Response data',
            meta: {
              timestamp: 'string - ISO 8601 timestamp',
            },
          },
        },
        error: {
          description: 'All error responses follow this format',
          structure: {
            success: 'boolean - Always false for errors',
            error: {
              message: 'string - Human-readable error message',
              code: 'string - Error code (optional)',
              details: 'any - Additional error details (optional)',
            },
            meta: {
              timestamp: 'string - ISO 8601 timestamp',
            },
          },
        },
      },
      statusCodes: {
        200: 'OK - Request succeeded',
        201: 'Created - Resource created successfully',
        400: 'Bad Request - Invalid input or validation error',
        401: 'Unauthorized - Authentication failed or missing',
        403: 'Forbidden - Authenticated but not authorized',
        404: 'Not Found - Resource not found',
        409: 'Conflict - Resource already exists',
        429: 'Too Many Requests - Rate limit exceeded',
        500: 'Internal Server Error - Unexpected server error',
      },
      rateLimiting: {
        windowMs: 900000,
        maxRequests: 100,
        description: 'API requests are rate-limited to 100 requests per 15 minutes per IP address',
      },
      validation: {
        email: 'Must be a valid email format',
        password: {
          minLength: 8,
          requirements: ['At least one uppercase letter', 'At least one lowercase letter', 'At least one number'],
        },
      },
    },
  });
});

export default router;
