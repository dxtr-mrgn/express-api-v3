import {app} from './app';
import {SETTINGS} from './settings';
import {runDB} from './db/mongodb';


const startApp = async () => {
    const res = await runDB();
    if (!res) process.exit(1);
};

app.listen(SETTINGS.PORT, () => {
    console.log('App listening on port ', SETTINGS.PORT);
});

startApp();
