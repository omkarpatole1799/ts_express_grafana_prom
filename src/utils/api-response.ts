class ApiResponse<T = undefined | null> {
  public message;
  public data: T;

  constructor(message: string, data: T ) {
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse