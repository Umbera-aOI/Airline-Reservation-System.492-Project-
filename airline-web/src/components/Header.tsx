import {useState, type MouseEvent} from "react";
import {
    Alert,
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    MenuItem,
    Menu,
    Box,
    Snackbar,
} from '@mui/material';
import {Menu as MenuIcon} from '@mui/icons-material';
import LoginDialog from "@/components/LoginDialog.tsx";
import LogoutDialog from "@/components/LogoutDialog.tsx";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {useRouter} from "@tanstack/react-router";
import {useAuth} from "@/api/auth.ts";

type SnackbarMessage = {
    open: boolean
    message: string
    severity: "success" | "error"
}

export default function Header() {
    const userData = useAuth();
    const jwtToken = userData?.jwtToken;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage>({
        open: false,
        message: "",
        severity: "success"
    });
    const router = useRouter()

    const open = !!anchorEl;
    const handleClickMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClickLogin = () => {
        setLoginDialogOpen(true);
    }
    const handleCloseLoginDialog = () => {
        setLoginDialogOpen(false);
    };
    const handleClickLogout = () => {
        setLogoutDialogOpen(true);
    }
    const handleCloseLogoutDialog = () => {
        setLogoutDialogOpen(false);
    };
    const handleClickBookFlight = () => {
        setAnchorEl(null);
        router.navigate({
            to: '/'
        });
    };
    const handleClickFindReservation = () => {
        setAnchorEl(null);
        router.navigate({
            to: '/reservations/search'
        });
    };
    const handleViewAgentReservations = () => {
        setAnchorEl(null);
        router.navigate({
            to: '/reservations/agent'
        });
    };
    const handleViewAgentStatistics = () => {
        setAnchorEl(null);
        router.navigate({
            to: '/admin/agent-statistics'
        });
    };
    const handleOpenSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbarMessage({open: true, message, severity});
    }
    const handleCloseSnackbar = () => {
        setSnackbarMessage({...snackbarMessage, open: false});
    }

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                        onClick={handleClickMenu}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClickBookFlight}>Book Flight</MenuItem>
                        <MenuItem onClick={handleClickFindReservation}>Find Reservation</MenuItem>
                        {!!jwtToken &&
                            <MenuItem onClick={handleViewAgentReservations}>View Agent Reservations</MenuItem>
                        }
                        {userData?.role == 'admin' &&
                            <MenuItem onClick={handleViewAgentStatistics}>View All Agent Statistics</MenuItem>
                        }
                    </Menu>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Airline Reservation System
                    </Typography>
                    {!!jwtToken ?
                        <IconButton color='inherit' onClick={handleClickLogout}><AccountCircleIcon/></IconButton> :
                        <Button color='inherit' onClick={handleClickLogin}>Login</Button>}
                </Toolbar>
            </AppBar>
            <LoginDialog open={loginDialogOpen} onClose={handleCloseLoginDialog} openSnackbar={handleOpenSnackbar}/>
            <LogoutDialog open={logoutDialogOpen} onClose={handleCloseLogoutDialog} openSnackbar={handleOpenSnackbar}/>
            <Snackbar open={snackbarMessage.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarMessage.severity}
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    {snackbarMessage.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}