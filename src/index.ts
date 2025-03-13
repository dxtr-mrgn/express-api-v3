import {app} from './app';
import {SETTINGS} from './settings';
import {connectDB} from './db/mongodb';


const startApp = async (): Promise<void> => {
    const res = await connectDB();
    if (!res) process.exit(1);
};

app.listen(SETTINGS.PORT, (): void => {
    console.log('App listening on port ', SETTINGS.PORT);
});

startApp();
