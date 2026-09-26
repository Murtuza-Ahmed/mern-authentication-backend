# MERN Authentication Backend

A Node.js and Express backend providing user registration, email/phone verification, JWT-based session handling, MongoDB persistence, validation, logging, and centralized error handling for a MERN application.

> Project Status: Active Development

This repository is currently focused on the authentication foundation and backend architecture. It includes the core user lifecycle, session management, password reset, and request/error handling, while broader authorization, RBAC, testing, and production hardening are still being expanded.

---

## 1. Features

### Currently Implemented

| Area                            | Status      | Notes                                                                                                 |
| ------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| User registration               | Implemented | `POST /api/v1/register` validates input, checks for duplicate records, and sends a verification code. |
| Email verification              | Implemented | Verification code generation and email delivery via Nodemailer.                                       |
| Phone verification              | Implemented | Twilio-based verification call path for `verificationMethod === "phone"`.                             |
| Account verification            | Implemented | Users must verify before login.                                                                       |
| Login                           | Implemented | Validates email/phone + password and issues JWT tokens.                                               |
| JWT authentication              | Implemented | Access and refresh tokens are generated with `jsonwebtoken`.                                          |
| Cookie-based session handling   | Implemented | Refresh token is stored in an `HttpOnly` cookie.                                                      |
| Logout                          | Implemented | Clears the refresh cookie and invalidates the stored refresh token.                                   |
| Password reset flow             | Implemented | Reset token generation, email link, and password reset endpoint.                                      |
| Password hashing                | Implemented | `bcrypt` is used in the `Users` schema pre-save hook.                                                 |
| MongoDB persistence             | Implemented | Mongoose connection to MongoDB with a `Users` model.                                                  |
| Request validation              | Implemented | Joi schemas are used for registration, verification, and login input.                                 |
| CORS configuration              | Implemented | Requests are filtered based on configured frontend origins.                                           |
| Centralized error handling      | Implemented | A global middleware translates common errors into JSON responses.                                     |
| HTTP request logging            | Implemented | Morgan logs incoming HTTP requests through a Pino stream.                                             |
| Application logging             | Implemented | Pino + `pino-pretty` provide structured development logging.                                          |
| Authentication middleware       | Implemented | Cookie-based auth check for protected routes.                                                         |
| Environment-based configuration | Implemented | Runtime settings are loaded from environment variables.                                               |

### Partially Implemented / In Progress

- Role-based access control is not fully implemented. The project currently authenticates users but does not enforce a robust permission or RBAC layer.
- A `refresh` flow exists as a commented-out controller and is not part of the active route configuration.
- `registerWithOtp.js` is commented out and not mounted in the API router, so the OTP registration flow is not active.
- The phone verification workflow is present, but it is still a basic implementation centered on Twilio call-based verification rather than a broader multi-factor or SMS management system.
- There is no active file upload/storage module in the backend at this time.

### Planned

- Complete RBAC and permission checks
- Fine-grained authorization middleware
- Advanced file upload and storage integration
- Refresh token rotation and stronger token lifecycle management
- Rate limiting and brute-force protection
- Security headers and CSRF strategy review
- Automated test suite
- OpenAPI/Swagger API documentation
- Production monitoring and observability improvements
- CI/CD deployment workflow
- Additional authentication providers and account recovery options

---

## 2. Tech Stack

| Technology    | Purpose                                              |
| ------------- | ---------------------------------------------------- |
| Node.js       | JavaScript runtime for the backend                   |
| Express.js    | HTTP server and API framework                        |
| MongoDB       | Primary database                                     |
| Mongoose      | MongoDB object modeling and schema validation        |
| JWT           | Access and refresh token generation and verification |
| bcrypt        | Password hashing                                     |
| Joi           | Request validation                                   |
| Nodemailer    | Email delivery for verification and reset flows      |
| Twilio        | Phone verification integration                       |
| cookie-parser | Cookie parsing for refresh-token sessions            |
| CORS          | Cross-origin request control                         |
| Morgan        | HTTP request logging                                 |
| Pino          | Application logging                                  |
| pino-pretty   | Readable console logging in development              |
| Nodemon       | Development server restart                           |

---

## 3. Current Architecture

The backend follows a simple layered Express architecture with a clear separation between routes, controllers, models, middleware, utilities, and hooks.

```text
Client
  │
  ▼
Express App
  │
  ├── CORS
  ├── Cookie Parser
  ├── JSON / URL Encoded Body Parsing
  ├── Request Logging (Morgan + Pino)
  │
  ▼
API Routes
  │
  ▼
Controllers
  │
  ├── Validation
  ├── Business Logic
  ├── Token Generation
  └── Response Handling
  │
  ▼
Mongoose Models
  │
  ▼
MongoDB
```

### Layer Responsibilities

- `app.js`: application bootstrap, middleware setup, CORS configuration, route mounting, and database initialization.
- `server.js`: starts the HTTP server on the configured port.
- `src/routes/userRoutes.js`: registers all active API routes.
- `src/controllers/usersController/`: contains registration, login, verification, reset, logout, and user retrieval logic.
- `src/models/Users.js`: defines the user schema, password hashing, verification code generation, and reset token generation.
- `src/middlewares/`: includes `asyncHandler`, authentication checks, response logging, and centralized error handling.
- `src/utils/`: contains JWT utilities, the custom `ErrorHandler`, request status constants, logging helpers, and token response helpers.
- `src/hooks/`: contains email sending and Twilio verification flows.
- `src/validations/schemas.js`: defines Joi validation rules for requests.
- `src/database/db.js`: initializes MongoDB connectivity and connection lifecycle logging.

---

## 4. Current Project Structure

```text
.
├── app.js
├── server.js
├── package.json
├── config.env
├── dev.env
├── .env
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── render.yaml
├── vercel.json
├── src/
│   ├── controllers/
│   │   └── usersController/
│   │       ├── forgotPassword.js
│   │       ├── getUser.js
│   │       ├── login.js
│   │       ├── logout.js
│   │       ├── refresh.js
│   │       ├── register.js
│   │       ├── registerWithOtp.js
│   │       ├── resetPassword.js
│   │       └── verifyAccount.js
│   ├── database/
│   │   └── db.js
│   ├── hooks/
│   │   ├── emailTemplate.js
│   │   ├── sendEmail.js
│   │   └── sendVerificationCode.js
│   ├── middlewares/
│   │   ├── asyncHandler.js
│   │   ├── error.js
│   │   ├── morganLogger.js
│   │   └── authMiddleware/
│   │       ├── auth.js
│   │       └── authCookies.js
│   ├── models/
│   │   └── Users.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── errorHandler.js
│   │   ├── jwt.js
│   │   ├── logger.js
│   │   ├── sendToken.js
│   │   └── statusCodes.js
│   ├── validations/
│   │   └── schemas.js
│   └── ...
└── ...
```

Notable implementation files:

- `server.js` starts the Express app and listens on `PORT`.
- `app.js` sets up middleware, CORS, request logging, and mounts the `/api/v1` router.
- `src/database/db.js` connects to MongoDB and logs connection events.
- `src/models/Users.js` defines the user document schema and password/verification logic.
- `src/routes/userRoutes.js` exposes the active user-authentication endpoints.
- `src/middlewares/authMiddleware/authCookies.js` validates refresh-token cookies for protected routes.
- `src/middlewares/error.js` centralizes error response handling.
- `src/utils/jwt.js` creates and verifies JWT access/refresh tokens.
- `src/utils/sendToken.js` sets the refresh token cookie and returns the user payload.
- `src/utils/logger.js` configures Pino logging.
- `src/validations/schemas.js` validates registration, verification, and login requests.

---

## 5. Authentication Flow

The current flow is centered on email or phone verification before login.

```text
Register
  │
  ▼
Validate request body (Joi)
  │
  ▼
Check for existing user
  │
  ▼
Generate verification code
  │
  ▼
Send code via email or Twilio phone flow
  │
  ▼
Verify account
  │
  ▼
Login with email/phone + password
  │
  ▼
Validate password with bcrypt
  │
  ▼
Generate access + refresh JWT tokens
  │
  ▼
Store refresh token and set HttpOnly cookie
  │
  ▼
Protected routes use refresh-token middleware
```

### Implementation Details

- Passwords are hashed in the Mongoose pre-save hook before being stored.
- The verification code is generated with `crypto.randomInt(10000, 99999)` and expires after 5 minutes.
- Access tokens are created with `JWT_ACCESS_SECRET` and a short expiry value.
- Refresh tokens are created with `JWT_REFRESH_SECRET` and stored both in the cookie and in the user document.
- Protected endpoints use the refresh token in the cookie to validate the authenticated session.
- `logout` clears the cookie and removes the stored refresh token.
- Password reset tokens are hashed before storage and expires after 15 minutes.

---

## 6. Authorization / RBAC

Authorization is still in the early stages of development.

The repository currently provides user authentication, not a full role or permission system. The active middleware verifies whether a request is authenticated by checking the refresh-token cookie and matching it to the user record. There is no active `admin`, `manager`, or permission-based authorization model in the current source.

This means:

- Authentication is implemented.
- Role-based access control is not yet a complete part of the backend.
- Protected routes currently rely on session checks, not a permission layer.

Future work should add explicit role definitions, permission enforcement, and scoped access control for resources.

---

## 7. File Upload

There is no active file upload implementation in this repository.

This backend does not currently expose upload routes, file storage handling, image processing, or cloud media integration. The codebase is focused on account lifecycle and session management rather than media or document management.

Potential future improvements include:

- Cloud storage integration (S3, Cloudinary, Azure Blob Storage)
- File size and MIME validation
- Secure filename generation
- Virus/malware scanning
- CDN delivery and optimization

---

## 8. API

The active API base path is:

```text
/api/v1
```

### Active Endpoints

| Method | Endpoint                        | Auth      | Description                                                     |
| ------ | ------------------------------- | --------- | --------------------------------------------------------------- |
| `POST` | `/api/v1/register`              | Public    | Register a new user and send a verification code.               |
| `POST` | `/api/v1/verify-account`        | Public    | Verify the 5-digit account code.                                |
| `POST` | `/api/v1/login`                 | Public    | Authenticate with email/phone and password.                     |
| `GET`  | `/api/v1/logout`                | Protected | Clear the refresh token cookie and invalidate the stored token. |
| `GET`  | `/api/v1/me`                    | Protected | Return the authenticated user profile.                          |
| `POST` | `/api/v1/password/forgot`       | Public    | Send a password reset email.                                    |
| `PUT`  | `/api/v1/password/reset/:token` | Public    | Reset the password using the reset token.                       |

> Notes: `isAuthenticated` exists in the middleware folder, but the active route set currently uses the cookie-based `isAuthCookies` pattern for protected endpoints.

---

## 9. Environment Variables

The repository relies on environment variables for database, JWT, SMTP, Twilio, and frontend CORS configuration.

Example configuration:

```env
PORT=4000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/your-database
DB_NAME=MERN_AUTHENTICATION

FRONTEND_URL=http://localhost:5173
FRONTEND_URLS=http://localhost:5173,https://your-frontend.example

JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_SECRET_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_SECRET_EXPIRES_IN=7d

SMTP_SERVICE=gmail
SMTP_MAIL=you@example.com
SMTP_PASSWORD=your_app_password

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+12345678901
```

> Never commit `.env` or `config.env` files containing real secrets to Git.

---

## 10. Installation

```bash
git clone https://github.com/Murtuza-Ahmed/mern-authentication-backend.git
cd mern-authentication-backend
npm install
```

After installation, create a local environment file at the project root and populate the variables above. The project currently loads configuration with `dotenv` using the root `config.env` path in `app.js`.

---

## 11. Running the Project

The scripts in `package.json` are:

```bash
npm start
```

Starts the server with:

```bash
node server.js
```

```bash
npm run server
```

Runs the app with `nodemon` for local development.

There is also a placeholder `npm test` script in `package.json`, but it is not a functioning automated test setup. No meaningful automated test suite is currently implemented.

---

## 12. Error Handling

The backend uses a centralized error middleware at `src/middlewares/error.js` to normalize common exceptions into JSON responses.

Current handling includes:

- `CastError` for invalid object ids
- `JsonWebTokenError` for invalid JWT payloads
- `TokenExpiredError` for expired tokens
- duplicate key errors from MongoDB
- MongoDB validation errors
- general fallback responses for unexpected server errors

This provides a consistent error response structure for the active API.

---

## 13. Logging and Observability

The project currently uses:

- `morgan` for HTTP request logging
- `pino` for application-level structured logs
- `pino-pretty` for readable console output in development

The logger is configured in `src/utils/logger.js`, and request logging is attached in `src/middlewares/morganLogger.js`.

Current logging responsibilities are focused on:

- request lifecycle visibility
- database connection status
- token verification issues
- error-level reporting

Planned improvements include:

- request IDs
- structured production logging
- external monitoring and error tracking
- metrics and health endpoints

---

## 14. Security

### Implemented

- Password hashing with `bcrypt`
- JWT-based session handling
- Refresh token stored in an `HttpOnly` cookie
- CORS allowlist based on configured frontend origins
- Joi input validation for API request payloads
- Environment-variable handling for secrets and runtime config
- Centralized error handling to prevent raw stack traces in production mode

### Still Needed / Planned

- Rate limiting
- Brute-force protection on login endpoints
- Stronger security headers
- CSRF strategy review for cookie-based auth
- Refresh token rotation and invalidation policies
- Account lockout or abuse prevention
- Dependency auditing and security scanning
- Production hardening and policy review

---

## 15. Frontend Integration

This backend is designed to work with a MERN frontend that uses the configured CORS origins and handles refresh-token cookies for authenticated requests.

The frontend should:

- allow the backend origin in `FRONTEND_URLS` or `FRONTEND_URL`
- send requests with credentials enabled when using cookies
- handle login, verification, logout, and password reset flows
- store or use the returned access token as required by the client application

---

## 16. Deployment

The repository includes basic deployment configuration for Render and Vercel:

- `render.yaml`
- `vercel.json`

These files indicate deployment intent, but they should be treated as deployment scaffolding rather than a complete production deployment strategy. Before deployment, make sure to:

- configure environment variables securely
- set the correct MongoDB connection string
- define frontend origins for CORS
- use HTTPS in production
- ensure SMTP and Twilio credentials are available in runtime config
- review cookie and JWT settings for production security

---

## 17. Current Limitations

This backend is intentionally still evolving. At the current stage, some areas remain intentionally limited or incomplete:

- Automated tests are not yet in place
- Role-based authorization is not fully modeled
- File upload and storage are not implemented
- API documentation is not yet established
- Production security hardening is still ongoing
- Refresh token rotation and advanced session policies are planned
- Observability and deployment hardening are still being expanded

---

## 18. Roadmap

```text
[x] Authentication foundation
[x] User registration
[x] Email verification
[x] Phone verification flow
[x] Login and logout
[x] Password reset flow
[x] JWT access/refresh token handling
[x] MongoDB integration with Mongoose
[x] Input validation with Joi
[x] Error handling middleware
[x] Logging and request monitoring basics
[ ] Complete authorization / RBAC
[ ] Permission-based access control
[ ] Advanced file upload / storage
[ ] Refresh token rotation
[ ] Rate limiting and abuse protection
[ ] Security hardening
[ ] Automated testing
[ ] API documentation
[ ] CI/CD workflows
[ ] Production observability
```

---

## 19. Contributing

Contributions are welcome. Please follow the repository guidelines in [CONTRIBUTING.md](CONTRIBUTING.md) and keep changes focused, well-documented, and easy to review.

Suggested workflow:

1. Create a feature branch
2. Keep changes scoped to a single concern
3. Follow the existing project structure and conventions
4. Validate behavior locally before opening a pull request
5. Open a clear pull request with a concise summary

---

## 20. License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Summary

This backend is a functional authentication foundation for a MERN application, with real implementations for registration, verification, login, logout, password reset, JWT sessions, MongoDB persistence, validation, logging, and centralized error handling. It is actively evolving and should be treated as a current authentication backend in progress rather than a fully production-complete enterprise API.
