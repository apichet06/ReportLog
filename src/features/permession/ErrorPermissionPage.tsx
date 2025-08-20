import { Button, Card, CardActions, CardContent, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authService } from "../auth/services/authService";

export default function ErrorPermissionPage() {
    const navigate = useNavigate();
    const heldleClick = () => {
        authService.logout();
        navigate('/login');
    }
    return (
        <>
            <Container>
                <Card sx={{ sx: 12, sm: 12, md: 12, lg: 12, xl: 12, mt: 5 }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" color="error">
                            {/* Access denied. Please contact your system administrator. */}
                            Not eligible for the privilege
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Please contact it to request access rights.
                        </Typography>
                    </CardContent>
                    <CardActions>
                        {/* <Button size="small" onClick={() => window.location.href = "https://www.google.com"}>Go Back</Button> */}
                        <Button size="small" color="error" variant="contained" onClick={heldleClick}>Go Back</Button>
                    </CardActions>

                </Card>
            </Container>
        </>

    )
}


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { CircularProgress, Container, Typography } from "@mui/material";

// export default function AutoUpdatePage() {
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("Updating...");

//   useEffect(() => {
//     const updateData = async () => {
//       try {
//         // ตัวอย่าง PUT API
//         await axios.put("https://your-api.com/update/123", {
//           status: "done"
//         });

//         setMessage("Update completed!");

//         // รอให้ user เห็นข้อความสักนิด
//         setTimeout(() => {
//           if (window.opener) {
//             window.close(); // ปิดได้ ถ้ามี opener (เปิดจาก target="_blank")
//           } else {
//             window.location.href = "/login"; // fallback ถ้าปิดไม่ได้
//           }
//         }, 1500);
//       } catch (error) {
//         console.error(error);
//         setMessage("Update failed!");
//         setLoading(false);
//       }
//     };

//     updateData();
//   }, []);

//   return (
//     <Container sx={{ textAlign: "center", mt: 5 }}>
//       {loading ? (
//         <>
//           <CircularProgress />
//           <Typography variant="h6" mt={2}>
//             {message}
//           </Typography>
//         </>
//       ) : (
//         <Typography variant="h6" color="error">
//           {message}
//         </Typography>
//       )}
//     </Container>
//   );
// }
