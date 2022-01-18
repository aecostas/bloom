const { ChartJSNodeCanvas } = require('chartjs-node-canvas')
const fs = require('fs')

/* 
numbers-array-first 0.0028 0.0071
numbers-array-middle 6.3784 0.8538
numbers-array-last 11.9417 0.3189
numbers-bloom-first 0.0470 0.0245
numbers-bloom-middle 0.0402 0.0067
numbers-bloom-last  0.0053
*/
const generateChart = async () => {
    const width = 400;
    const height = 400;
    const configuration = {
        type: 'bar',
        data: {
            labels: ['First', 'Middle', 'Last'],
            datasets: [
                {
                    label: "bloom",
                    fillColor: "blue",
                    backgroundColor: "yellow",
                    data: [0.0470, 0.0402, 0.0395]
                }, {
                    label: "array",
                    fillColor: "red",
                    data: [0.0028, 6.3784, 11.9417]
                },
            ],
        },
        options: {
        },
        plugins: [{
            id: 'background-colour',
            beforeDraw: (chart) => {
                const ctx = chart.ctx;
                ctx.save();
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, width, height);
                ctx.restore();
            }
        }]
    };
    const chartCallback = (ChartJS) => {
        ChartJS.defaults.responsive = true;
        ChartJS.defaults.maintainAspectRatio = false;
    };
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });
    const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    fs.writeFileSync('./example.png', buffer, 'base64');
}

generateChart();