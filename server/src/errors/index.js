class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends CustomError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

class UnauthenticatedError extends CustomError {
  constructor(message = "Unauthenticated") {
    super(message, 401);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = "You do not have permission to access this resource.") {
    super(message, 403);
  }
}

class NotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

class ConflictError extends CustomError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}

class InternalServerError extends CustomError {
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}

module.exports = {
  InternalServerError,
  NotFoundError,
  BadRequestError,
  CustomError,
  ConflictError,
  ForbiddenError,
  UnauthenticatedError,
};
