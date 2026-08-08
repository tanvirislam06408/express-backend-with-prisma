import app from './app.js'; 
import 'dotenv/config';


const port = process.env.PORT || 5000;

const startServer = async () => {
    app.listen(port, () => {
        console.log(`Server is running successfully on port ${port}`);
    });
};

startServer();