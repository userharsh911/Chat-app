import { CronJob } from 'cron';
import https from "https"
import dotenv from "dotenv"

dotenv.config();

const job = new CronJob('14 * * * * *',function () {
    https.get(process.env.API_URL,(res)=>{
        if(res.statusCode==200) console.log("GET request sent successfully");
        else console.log("GET request failed ",res.statusCode);
    })
    .on("error",(e)=> console.log("error while sending request ",e));
});

export default job;