export interface LoginRequest {
  user_name: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  result: {
    id: number;
    emp_no: string;
    username: string;
    emp_email: string;
    firstname: string;
    lastname: string;
    is_active: number;
    is_accept: number;
    is_review: number;
  };
  token: string;
  message: string;
}
