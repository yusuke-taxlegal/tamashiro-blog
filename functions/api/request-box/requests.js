import { handleIntake } from "../../../lib/request-box/requests.js";
export const onRequest = (context) => handleIntake(context);
