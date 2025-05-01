import axios from 'axios';
import { useState, useEffect } from 'react';
import PieChartMUI from './PieChartMUI'

const AllPieCharts = () => {
    const [chartData, setChartData] = useState([]);
    const [initialStageTotalParcels, setInitialStageTotalParcels] = useState(0);
    const [initialStageParcels, setInitialParcelStages] = useState([]);
    const [inTransitParcels, setInTransitParcels] = useState([]);
    const [inTransitStageTotalParcels, setInTransitStageTotalParcels] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/admin/pieChart/data', { withCredentials: true });
                const rawData = response.data;
                console.log("Raw", rawData);

                // Process data for pie chart
                const filteredData = rawData
                    .filter(item => item.totalCount > 0) // Ensure only groups with data
                    .map(item => ({
                        id: item.group,
                        value: item.percentage,
                        label: item.group.replace(/([A-Z])/g, ' $1').trim(), // Format labels
                    }));

                // Calculate total parcels
                const total = rawData.reduce((sum, item) => sum + item.totalCount, 0);

                // Extract initial stage parcels ("OrderPlaced" and "PendingPickup")
                const initialStage = rawData
                    .filter(item => item.group === "Order Processing") // Find "Order Processing"
                    .flatMap(item => item.subStages) // Extract subStages
                    .filter(stage => ["OrderPlaced", "PendingPickup"].includes(stage.status)) // Keep only relevant statuses
                    .map(stage => ({
                        id: stage.status,
                        count: stage.count,
                        value: stage.percentage,
                        label: stage.status.replace(/([A-Z])/g, ' $1').trim(), // Format labels
                    }));

                const inTransitStage = rawData.filter(item => item.group === "In Transit")
                    .flatMap(item => item.subStages) // Extract subStages
                    .filter(stage => ["PickedUp","ArrivedAtDistributionCentre","ShipmentAssigned","InTransit","ArrivedAtCollectionCentre"].includes(stage.status)) // Keep only relevant statuses
                    .map(stage => ({
                        id: stage.status,
                        count: stage.count,
                        value: stage.percentage,
                        label: stage.status.replace(/([A-Z])/g, ' $1').trim(), // Format labels
                    }));



                setChartData(filteredData);
                setInitialStageTotalParcels(total);
                setInitialParcelStages(initialStage);
                setInTransitParcels(inTransitStage);
                setInTransitStageTotalParcels(30);
            } catch (error) {
                console.error('Error fetching pie chart data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const hello = () => {
            console.log("Chart Data", chartData);
            console.log("Initial Stage Parcels Data", initialStageParcels);
            console.log("In Transit Stage Parcels Data", inTransitParcels);
        }
        hello();
    }, [chartData, initialStageParcels])

    return (
        <div className="flex gap-3">

            <PieChartMUI title="Initial Stage" chartData={initialStageParcels} totalParcels={initialStageTotalParcels} statusParcelCount="6"/>
            <PieChartMUI title="In Transit Stage" chartData={inTransitParcels} totalParcels={initialStageTotalParcels} statusParcelCount="6"/>

        </div>
    );
};

export default AllPieCharts;
