import {
    Chart as ChartJS,
    BarElement,
    LineElement,
    PointElement, 
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    BarElement,
    LineElement,
    PointElement, 
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend
);
