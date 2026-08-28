import { AppError, AppErrorType } from "../shared/errors/AppError";

export class ErrorTranslator {
  public static toHttpCode(error: AppError): number {
    switch (error.type) {
      case AppErrorType.NOT_FOUND:
        return 404;
      case AppErrorType.CONFLICT:
        return 409;
      case AppErrorType.VALIDATION:
        return 400;
      case AppErrorType.UNAUTHORIZED:
        return 401;
      case AppErrorType.BUSINESS_RULE:
        return 422;
      default:
        return 500;
    }
  }
}
