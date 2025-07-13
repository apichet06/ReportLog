// src/layouts/MainLayout.tsx
import { type ReactNode, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
    Box,
    CssBaseline,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    // Button,
    Menu,
    MenuItem,
} from '@mui/material';
import MuiAppBar, { type AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';
import DescriptionIcon from '@mui/icons-material/Description';
import { Link as RouterLink } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';

const drawerWidth = 240;

/* ---------- styled components ---------- */
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: open ? 0 : `-${drawerWidth}px`,
}));

interface StyledAppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<StyledAppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

/* ---------- component ---------- */
type MainLayoutProps = {
    /** React elements that will be rendered inside <Main> */
    children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const menuItems = [
        { label: 'Report Log', icon: <InboxIcon />, path: '/reportlog' },
        // { label: 'Mail', icon: <MailIcon />, path: '/mail' },
        { label: 'Save Report', icon: <DescriptionIcon />, path: '/saved_report' },
    ];

    // const extraItems = [
    //     { label: 'All mail', icon: <MailIcon />, path: '/all-mail' },
    //     { label: 'Trash', icon: <InboxIcon />, path: '/trash' },
    //     { label: 'Spam', icon: <MailIcon />, path: '/spam' },
    // ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* ---------- Top AppBar ---------- */}
            <AppBar position="fixed" open={open} color="success">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Report Log
                    </Typography>
                    {/* <Button color="inherit">Login</Button> */}
                    <>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Mr.Apichet Singnakrong</MenuItem>
                            <MenuItem onClick={handleClose}>Logout</MenuItem>
                        </Menu>
                    </>
                </Toolbar>
            </AppBar>

            {/* ---------- Side Drawer ---------- */}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>

                <Divider />

                <List>
                    {menuItems.map(({ label, icon, path }) => (
                        <ListItem key={label} disablePadding>
                            <ListItemButton component={RouterLink} to={path} onClick={handleDrawerClose}>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider />

                {/*  <List>
                    {extraItems.map(({ label, icon, path }) => (
                        <ListItem key={label} disablePadding>
                            <ListItemButton component={RouterLink} to={path} onClick={handleDrawerClose}>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List> */}
            </Drawer>

            {/* ---------- Main Content ---------- */}
            <Main open={open}>
                <DrawerHeader /> {/* pushes content below AppBar */}
                {children}
            </Main>
        </Box>
    );
};

export default MainLayout;
