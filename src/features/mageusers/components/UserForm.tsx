import { Controller, useForm } from "react-hook-form";
import type {
  AppName,
  BuPlant,
  UsersPermission,
} from "../types/UsersPermission";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import FormHelperText from '@mui/material/FormHelperText';
interface Props {
  defaultValues?: UsersPermission;
  onSubmit: (data: UsersPermission) => void;
  buPlant: BuPlant[];
  appName: AppName[];
}
export default function UserForm({
  defaultValues,
  buPlant,
  appName,
  onSubmit,
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsersPermission>({
    defaultValues,
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      {" "}
      <DialogTitle>{"Form Users Permission"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <Grid container spacing={2} rowSpacing={3} mt={2}>
            <Grid size={{ sm: 12, md: 4, lg: 4, xl: 4 }}>
              <TextField
                fullWidth
                label="Emp No"
                {...register("emp_no", {
                  required: "Emp No is required",
                  pattern: {
                    value: /^[0-9]{1,6}$/, // 1 ถึง 6 ตัวเลข
                    message: "Emp No must be a number (max 6 digits)",
                  },
                })}
                error={!!errors.emp_no}
                helperText={errors.emp_no?.message}
                inputProps={{ maxLength: 6 }}
              />
            </Grid>
            <Grid size={{ sm: 12, md: 4, lg: 4, xl: 4 }}>
              <TextField
                fullWidth
                label="Email"
                {...register("emp_email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                error={!!errors.emp_email}
                helperText={errors.emp_email ? errors.emp_email.message : null}
              />
            </Grid>
            <Grid size={{ sm: 12, md: 4, lg: 4, xl: 4 }}>
              <TextField
                fullWidth
                label="Firstname"
                {...register("firstname", {
                  required: "Firstname is required",
                })}
                error={!!errors.firstname}
                helperText={errors.firstname ? errors.firstname.message : null}
              />
            </Grid>
            <Grid size={{ sm: 12, md: 4, lg: 4, xl: 4 }}>
              <TextField
                fullWidth
                label="Lastname"
                {...register("lastname", { required: "Lastname is required" })}
                error={!!errors.lastname}
                helperText={errors.lastname ? errors.lastname.message : null}
              />
            </Grid>
            <Grid size={{ sm: 12, md: 4, lg: 4, xl: 4 }}>
              <FormControl fullWidth error={!!errors.plant_Id}>
                <InputLabel id="buPlant-label">BU Plant</InputLabel>
                <Select
                  label="BU Plant"
                  labelId="buPlant-label"
                  defaultValue={defaultValues?.plant_Id || ""}
                  {...register("plant_Id", {
                    required: "Please select BU Plant",
                  })}
                >
                  {buPlant.map((item: BuPlant, index: number) => (
                    <MenuItem key={index} value={item.id}>
                      {item.plant_Name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.plant_Id && (
                  <FormHelperText error>
                    {errors.plant_Id.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ sm: 12, md: 4, lg: 4, xl: 4 }}>
              <FormControl fullWidth error={!!errors.app_Id}>
                <InputLabel id="appName-label">App Name</InputLabel>
                <Select
                  labelId="appName-label"
                  label="App Name"
                  multiple
                  defaultValue={
                    defaultValues?.app_Id ? defaultValues.app_Id.split(",") : []
                  }
                  {...register("app_Id", {
                    required: "Please select at least one app.",
                  })}
                  renderValue={(selected) =>
                    (selected as string[])
                      .map((id) => {
                        const app = appName.find((a) => a.id.toString() === id);
                        return app ? app.app_log : id; // แสดงชื่อจริง
                      })
                      .join(",")
                  }
                >
                  {appName.map((item) => (
                    <MenuItem key={item.id} value={item.id.toString()}>
                      {item.app_log}
                    </MenuItem>
                  ))}
                </Select>
                {errors.app_Id && (
                  <FormHelperText error>{errors.app_Id.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ sm: 12, md: 3, lg: 3, xl: 3 }}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Status"
                  defaultValue={defaultValues?.status || ""}
                  {...register("status", { required: "Please select status" })}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="User">User</MenuItem>
                </Select>
                {errors.status && (
                  <FormHelperText>{errors.status.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ sm: 12, md: 12, lg: 9, xl: 9 }} mt={1}>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Grid
                  size={{ sm: 12, md: 3, lg: 3, xl: 3 }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Controller
                    name="is_email"
                    control={control}
                    defaultValue={defaultValues?.is_email ?? false}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label="Is Email"
                      />
                    )}
                  />
                </Grid>
                <Grid
                  size={{ sm: 12, md: 3, lg: 3, xl: 3 }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Controller
                    name="is_accept"
                    control={control}
                    defaultValue={defaultValues?.is_accept ?? false}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label="Is Accept"
                      />
                    )}
                  />
                </Grid>
                <Grid
                  size={{ sm: 12, md: 3, lg: 3, xl: 3 }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Controller
                    name="is_review"
                    control={control}
                    defaultValue={defaultValues?.is_review ?? false}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label="Is Review"
                      />
                    )}
                  />
                </Grid>
                <Grid
                  size={{ sm: 12, md: 3, lg: 3, xl: 3 }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Controller
                    name="is_export"
                    control={control}
                    defaultValue={defaultValues?.is_export ?? false}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label="Is Export"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Box>
  );
}
