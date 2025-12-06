import {useState, type MouseEvent} from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    MenuItem,
    Menu
} from '@mui/material';
import {Menu as MenuIcon} from '@mui/icons-material';
import {useNavigate} from "@tanstack/react-router";
import {Route} from "@/routes/reservations/search.tsx";

export default function Header() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate({from: Route.fullPath})
    const open = !!anchorEl;
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClickBookFlight = () => {
        setAnchorEl(null);
        navigate({
            to: '/'
        });
    };
    const handleClickFindReservation = () => {
        setAnchorEl(null);
        navigate({
            to: '/reservations/search'
        });
    };
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr: 2}}
                    onClick={handleClick}
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
                </Menu>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    Airline Reservation System
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    );
}