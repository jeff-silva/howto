export enum AppErrorType {
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  UNAUTHORIZED = "UNAUTHORIZED",
  VALIDATION = "VALIDATION",
  BUSINESS_RULE = "BUSINESS_RULE",
}

export class AppError extends Error {
  public readonly type: AppErrorType;

  constructor(message: string, type: AppErrorType) {
    super(message);
    this.type = type;
  }
}
