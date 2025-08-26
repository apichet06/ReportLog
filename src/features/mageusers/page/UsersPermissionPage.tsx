import { useState } from "react";
import { useUsersPermission } from "../hooks/useUsersPermission";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import userService from "../services/userservice";
import type { UsersPermission } from "../types/UsersPermission";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { resultData } from "@/shared/utils/useToken";
import Swal from "sweetalert2";

export default function UsersPermissionPage() {
  const { data, appName, buPlant, fetchData } = useUsersPermission();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UsersPermission | null>(null);

  const handleCreate = async (row: UsersPermission) => {
    const newRow = {
      ...row,
      created_by: resultData?.username,
      app_Id: Array.isArray(row.app_Id) ? row.app_Id.join(",") : row.app_Id,
    };
    const res = await userService.createUsersPermission(newRow);
    if (res.data.isSuccess == true) {
      Swal.fire({
        title: "Success!",
        text: `Insert Successfully`,
        icon: "success",
      });
      fetchData();
      setOpen(false);
    } else {
      Swal.fire({
        title: "Warning!",
        text: `${res.data.message}`,
        icon: "warning",
      });
    }
  };

  const handleUpdate = async (row: UsersPermission) => {
    if (!row.id) return;
    const newRow = {
      ...row,
      updated_by: resultData?.username,
      app_Id: Array.isArray(row.app_Id) ? row.app_Id.join(",") : row.app_Id,
    };
    const res = await userService.updateUsersPermission(row.id, newRow);
    if (res.data.isSuccess == true) {
      Swal.fire({
        title: "Success!",
        text: `Update Successfully`,
        icon: "success",
      });
      fetchData();
      setOpen(false);
    } else {
      Swal.fire({
        title: "Warning!",
        text: `${res.data.message}`,
        icon: "warning",
      });
    }

  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await userService.deleteUsersPermission(id);
        fetchData();
        Swal.fire({
          title: "Success!",
          text: `Delete Successfully`,
          icon: "success",
        });
      }
    });

  };
  const isBetween1201And1536 = useMediaQuery("(min-width:1201px) and (max-width:1536px)");
  const isAbove1537 = useMediaQuery("(min-width:1537px)");
  return (
    <div>
      <h2>Users Permission</h2>
      <>
        <Container
          fixed
          disableGutters
          maxWidth={isAbove1537 ? "xl" : "lg"}
        >
          <Grid container spacing={2} sx={{
            ...(isAbove1537 ? { marginInline: "-9%" } : {}),
            ...(isBetween1201And1536
              ? { marginInline: "-10%" }
              : {}),
          }}>
            <Grid
              size={{ sm: 12, xs: 12, md: 12, lg: 12, xl: 12 }}
              mb={2}
              justifyContent="flex-end"
              display="flex"
            >
              <Button
                variant="contained"
                size="small"
                color="success"
                onClick={() => {
                  setEditing(null);
                  setOpen(true);
                }}
              >
                Add New
              </Button>
            </Grid>
          </Grid>
        </Container>
        <UserTable
          rows={data}
          onEdit={(row) => {
            setEditing(row);
            setOpen(true);
          }}
          isBetween1201And1536={isBetween1201And1536}
          isAbove1537={isAbove1537}
          onDelete={handleDelete}
        />
      </>

      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        onClose={() => setOpen(false)}
      >
        <div style={{ padding: 20 }}>
          <UserForm
            defaultValues={editing || ({} as UsersPermission)}
            onSubmit={editing ? handleUpdate : handleCreate}
            appName={appName}
            buPlant={buPlant}
          />
        </div>
      </Dialog>
    </div>
  );
}
