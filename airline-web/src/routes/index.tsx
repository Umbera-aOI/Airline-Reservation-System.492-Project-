import {
    Autocomplete, Card, CardActions, Grid,
    CardContent, Button, TextField
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: Index,
})

const airports = ['Denver', 'Newark', 'New York City', 'Chicago', 'San Francisco'];

function Index() {
    return (
        <Card sx={{minWidth: 500}}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid size={2}>
                        <Autocomplete
                            disablePortal
                            options={airports}
                            sx={{ width: 200 }}
                            renderInput={(params) => <TextField {...params} label="Origin" />}
                        />
                    </Grid>
                    <Grid size={2}>
                        <Autocomplete
                            disablePortal
                            options={airports}
                            sx={{ width: 200 }}
                            renderInput={(params) => <TextField {...params} label="Destination" />}
                        />
                    </Grid>
                    <Grid size={2}>
                    </Grid>
                    <Grid size={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker disablePast={true} label="Start Date"/>
                        </LocalizationProvider>
                    </Grid>
                    <Grid size={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker disablePast={true} label="End Date"/>
                        </LocalizationProvider>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button size="medium">Search</Button>
            </CardActions>
        </Card>
    );
}
