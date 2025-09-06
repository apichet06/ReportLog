export interface LoginRequest {
  user_name: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  result: {
    id: number;
    emp_no: string;
    emp_email: string;
    username: string;
    firstname: string;
    lastname: string;
    is_accept: boolean;
    is_active: boolean;
    is_review: boolean;
    is_export: boolean;
    plant: string;
    plant_Id: number;
    plant_Name: string;
    app_Id: number;
    status: string;
    created_by: string;
    created_date: string;
    updated_by: string;
    updated_date: string;
  };
  token: string;
  message: string;
}
