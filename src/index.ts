import 'dotenv/config';

process.title = "dash hub system"

import http from "http";
import cors from "cors";

import morgan from "morgan";

import express from "express";

import validator from "express-validator";
import ratelimit from "express-rate-limit";

import { DashClient } from './structures/Client';

const app = express();
export const client = new DashClient();
const server = new http.Server(app);

const PORT = process.env.PORT || 3000;
process.env.NODE_ENV === "development" ? app.use(morgan("dev")) : null;

app.set("trust proxy", 1);

app.use(cors({ credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.options('*', cors());

app.get("/", (_, response) => {
    return response.json({
        uptime: Math.floor(process.uptime() / 60)
    });
});

const limiter = ratelimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: "Ratelimited, please try again later."
    }
});

const middleware = [limiter];

import routes from './routes';

app.use('/api', [...middleware, routes]);

client.start();
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));