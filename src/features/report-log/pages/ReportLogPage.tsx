 
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import EditIcon from '@mui/icons-material/Edit';
import {
  DataGridPro,
  type GridColDef,
  type GridRowsProp,
  GridActionsCellItem,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomTraderName,
  randomEmail,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';


import Container from '@mui/material/Container';


export default function ReportLogPages() {
const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 160, editable: true },
  { field: 'email', headerName: 'Email', width: 200, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
    editable: true,
  },
  { field: 'email', headerName: 'Email', width: 200, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
    editable: true,
  },{ field: 'email', headerName: 'Email', width: 200, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
    editable: true,
  },{ field: 'email', headerName: 'Email', width: 200, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
    editable: true,
  },
  {
    field: 'actions',
    type: 'actions',
    width: 100,
    getActions: () => [
      <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
      <GridActionsCellItem icon={<DeleteIcon />} label="Delete" />,
    ],
  },
];

const rows: GridRowsProp = [
  {
    id: 1,
    name: randomTraderName(),
    email: randomEmail(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    email: randomEmail(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    email: randomEmail(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    email: randomEmail(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    email: randomEmail(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 6,
    name: randomTraderName(),
    email: randomEmail(),
    age: 27,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 7,
    name: randomTraderName(),
    email: randomEmail(),
    age: 18,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 8,
    name: randomTraderName(),
    email: randomEmail(),
    age: 31,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 9,
    name: randomTraderName(),
    email: randomEmail(),
    age: 24,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 10,
    name: randomTraderName(),
    email: randomEmail(),
    age: 35,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];
  const theme = useTheme();
  // ตรวจสอบว่าหน้าจอมีความกว้างตั้งแต่ breakpoint 'xl' (โดยปกติคือ 1536px) ขึ้นไปหรือไม่
  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));
 

 return (
   
    <Container fixed disableGutters maxWidth={isExtraLargeScreen ? 'xl' : 'lg'}>
        {/* <Container fixed disableGutters maxWidth={'md'}> */}
      <DataGridPro
        rows={rows}
        columns={columns}
        initialState={{ pinnedColumns: { left: ['name'], right: ['actions'] } }}
      />
    </Container>
  );
  
}



// import { useState } from "react";
// import { Container } from "@mui/material";
// import ReportLogToolbar from "../components/ReportLogToolbar";
// import ReportLogDialog from "../components/ReportLogDialog";
// // import ReportLogTabs from "../components/ReportLogTabs";

// export default function ReportLogPages() {



    
//     const [textSearch, setTextSearch] = useState("");
//     const [valueRedio, setValueRedio] = useState("Usual");
//     const [comment, setComment] = useState("");
//     const [open, setOpen] = useState(false);

//     const handleSearch = () => { console.log("Search", textSearch); };
//     const handleClear = () => setTextSearch("");
//     const handleClose = () => setOpen(false);
//     const handleSubmit = () => {
//         console.log("Submit", { valueRedio, comment });
//         setOpen(false);
//     };

//     return (
//         <Container maxWidth="xl">
//             <ReportLogToolbar
//                 textSearch={textSearch}
//                 onSearchChange={setTextSearch}
//                 onSearchClick={handleSearch}
//                 onClearClick={handleClear}
//             />
//             {/* <ReportLogTabs /> */}
//             <ReportLogDialog
//                 open={open}
//                 valueRedio={valueRedio}
//                 comment={comment}
//                 onClose={handleClose}
//                 onSubmit={handleSubmit}
//                 onRadioChange={setValueRedio}
//                 onCommentChange={setComment}
//             />
//         </Container>
//     );
// }
