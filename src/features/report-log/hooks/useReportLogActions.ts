import Swal from "sweetalert2";
import reportLogService from "../services/reportLogServices";
import type { User } from "@/layouts/userType";
import type { ReportLog, ReportLogState } from "../types/reportLogTypes";

export function useReportLogActions(
  state: ReportLogState,
  fetchDUC: () => void,
  fetchDCC: () => void,
  LoadingData: () => void,
  userData: User | null,
  setDataDUC: (data: ReportLog[]) => void,
  setDataDCC: (data: ReportLog[]) => void,
  setLoadingDataGrid: (value: boolean) => void
) {
  const handleClickOpen = () => {
    const rawData = Array.isArray(state.selectionModel)
      ? state.selectionModel
      : Array.from(state.selectionModel.ids);

    if (rawData.length === 0) {
      Swal.fire({ title: "No rows selected!", icon: "error" });
      return;
    }
    state.setRowDatas(rawData);
    state.setOpen(true);
  };

  const handleSubmit = async () => {
    const numericIds = state.rowDatas.map((id) => Number(id));
    const email = userData?.emp_email ?? "";

    Swal.fire({
      title: "Are you sure?",
      html: `<b>Action:</b> ${state.valueRedio}<br/><b>Comment:</b> ${
        state.conment || "<i>No comment</i>"
      }`,
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success!",
          text: `Report log total ${numericIds.length} items`,
          icon: "success",
        });
        await reportLogService.ApprovedReportLogService(
          numericIds,
          email,
          state.valueRedio,
          state.conment
        );
        fetchDUC();
        fetchDCC();
        state.setOpen(false);
        handleClose();
      }
    });
  };

  const handleSearch = async () => {
    try {
      state.setLoadingDataGrid(true);

      const res = await reportLogService.SearchReportLogService({
        Search: state.textSearch,
        tapData: state.tapData,
      });
      if (state.tapData === "DUC") setDataDUC(res.data.result);
      else setDataDCC(res.data.result);
      setLoadingDataGrid(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClear = () => {
    state.setTextSearch("");
    fetchDCC();
    fetchDUC();
  };

  const handlePopup = () => {
    state.setOpen(true);
  };

  const handleClose = () => {
    state.setOpen(false);
    state.setComment("");
    state.setValueRedio("Usual Event");
  };

  const handleDialogSubmit = async (id: string) => {
    if (id === null) {
      console.error("Submit clicked, but no ID is being edited.");
      Swal.fire("Error", "No item was selected for editing.", "error");
      return;
    }

    const email = userData?.emp_email ?? "";
    try {
      Swal.fire({
        title: `Are you sure?`,
        html: `<b>Action:</b> ${state.valueRedio}<br/><b>Comment:</b> ${
          state.conment || "<i>No comment</i>"
        }`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const dataToSubmit = {
            Admin_confirm: email,
            Admin_confirm_comment: state.conment,
            Admin_confirm_event: state.valueRedio,
          };
          await reportLogService.ApprovedReportLogByIDService(
            Number(id),
            dataToSubmit
          );

          Swal.fire({
            title: "Success!",
            icon: "success",
          });
          state.setEditingId(null); // ปิด Dialog และรีเซ็ต state
          state.setOpen(false);
          await LoadingData();
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return {
    handleClickOpen,
    handleSubmit,
    handleClose,
    handleSearch,
    handleClear,
    handlePopup,
    handleDialogSubmit,
  };
}
