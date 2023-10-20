import { createBrowserRouter } from "react-router-dom";
import Login from "./Ahtentification/Login";
import Register from "./Ahtentification/Register";
import Questionnaire from "./Components/Questionnaire";
import Result from "./Components/Result";

const router = createBrowserRouter([
    {
        path:"/",
        element:<Register/>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/questionnaire",
        element:<Questionnaire/>
    },
    {
        path:"/result",
        element:<Result/>
    },
]);
export default router;