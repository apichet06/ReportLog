// import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
export default function LoginPage() {
    // const navigate = useNavigate();
    // const login = useCallback(async () => {
    //     const response = await authenCookie({ username: "apichets" })

    //     if (response.isSuccess) {
    //         navigate("/reportlog")
    //     }
    // }, [navigate])

    return (
        <Container>
            {/* <form method="POST" action="https://fits/CRUDLogs/dccduc_Api_new/api/Authen/login"> */}
            <form method="POST" action="https://localhost:7073/api/Authen/login">
                <Card sx={{ sx: 12, sm: 12, md: 12, lg: 12, xl: 12, mt: 5 }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" color="warning">
                            Login Form
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                            Please login.
                        </Typography>
                        <TextField label="Username" name="username" defaultValue="apichets" variant="outlined" sx={{ display: 'none' }} fullWidth />
                    </CardContent>
                    <CardActions>
                        <Button size="small" type="submit">Login</Button>
                    </CardActions>
                </Card>
            </form>
        </Container>
    )
}
