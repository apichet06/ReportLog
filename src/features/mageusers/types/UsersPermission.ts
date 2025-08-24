export interface UsersPermission {
  id: number;
  plant_Id: number;
  emp_no: string;
  emp_email: string;
  username: string;
  firstname: string;
  lastname: string;
  app_Id: string;
  is_email: boolean;
  is_accept: boolean;
  is_review: boolean;
  is_export: boolean;
  created_date: string;
  updated_date: string | null;
  status: number;
  fullname: string;
  app_Names: string;
}

export interface AppName {
  id: number;
  app_log: string;
}

export interface BuPlant {
  id: number;
  plant: string;
  plant_Name: string;
}
