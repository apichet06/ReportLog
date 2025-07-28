import { Button, Card, CardActions, CardContent, Container, Typography } from "@mui/material";
import { useCallback } from "react";
import { authenCookie } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const login = useCallback(async () => {
        const response = await authenCookie({ username: "apichets" })

        if (response.isSuccess) {
            navigate("/reportlog")
        }
    }, [navigate])

    return (
        <Container  >
            <Card sx={{ sx: 12, sm: 12, md: 12, lg: 12, xl: 12, mt: 5 }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" color="warning">
                        Login Form
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Please login.
                    </Typography>
                </CardContent>
                <CardActions>
                    {/* <Button size="small" onClick={() => window.location.href = "https://www.google.com"}>Go Back</Button> */}
                    <Button size="small" onClick={login}>Login</Button>
                </CardActions>
            </Card>
        </Container>
    )
}
