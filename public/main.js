const form = document.getElementById('flow-form');
const ctx = document.getElementById('flowChart');

const COLORS = {
  primary: '#1976d2',
  gradientStart: 'rgba(25, 118, 210, 0.35)',
  gradientEnd: 'rgba(25, 118, 210, 0.05)'
};

const INITIAL_STATE = {
  staticPressure: 120,
  coefficient: 120,
  diameter: 4.5,
  length: 300,
  minFlow: 250,
  maxFlow: 2500,
  flowStep: 100
};

const hazenWilliamsLoss = ({
  flow,
  coefficient,
  diameter
}) => {
  const numerator = 4.52 * Math.pow(flow, 1.85);
  const denominator = Math.pow(coefficient, 1.85) * Math.pow(diameter, 4.87);
  return numerator / denominator;
};

const computeSeries = (parameters) => {
  const {
    staticPressure,
    coefficient,
    diameter,
    length,
    minFlow,
    maxFlow,
    flowStep
  } = parameters;

  const flows = [];
  const residualPressures = [];

  for (let flow = minFlow; flow <= maxFlow; flow += flowStep) {
    const frictionLossPer100 = hazenWilliamsLoss({ flow, coefficient, diameter });
    const totalLoss = frictionLossPer100 * (length / 100);
    const residual = Math.max(staticPressure - totalLoss, 0);
    flows.push(flow);
    residualPressures.push(Number(residual.toFixed(2)));
  }

  return { flows, residualPressures };
};

const buildGradient = (chart) => {
  const {
    ctx,
    chartArea
  } = chart;
  if (!chartArea) {
    return null;
  }

  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, COLORS.gradientEnd);
  gradient.addColorStop(1, COLORS.gradientStart);
  return gradient;
};

const createChart = (context, parameters) => {
  const data = computeSeries(parameters);

  const chartInstance = new Chart(context, {
    type: 'line',
    data: {
      labels: data.flows,
      datasets: [
        {
          label: 'Residual pressure (psi)',
          data: data.residualPressures,
          tension: 0.35,
          fill: true,
          borderColor: COLORS.primary,
          backgroundColor: (context) => buildGradient(context.chart) || COLORS.gradientStart,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 2,
          pointBorderColor: COLORS.primary
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 600,
        easing: 'easeOutCubic'
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const flow = context.label;
              const pressure = context.raw;
              return `Flow ${flow} gpm → Residual ${pressure} psi`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Flow (gpm)'
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.25)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Residual pressure (psi)'
          },
          min: 0,
          grid: {
            color: 'rgba(148, 163, 184, 0.25)'
          }
        }
      }
    }
  });

  return chartInstance;
};

const updateParametersFromForm = () => {
  const formData = new FormData(form);
  const parameters = { ...INITIAL_STATE };
  for (const [key, value] of formData.entries()) {
    parameters[key] = Number(value);
  }
  return parameters;
};

const applyParametersToForm = (parameters) => {
  Object.entries(parameters).forEach(([key, value]) => {
    const input = form.elements.namedItem(key);
    if (input) {
      input.value = value;
    }
  });
};

applyParametersToForm(INITIAL_STATE);

let flowChart = null;

const render = () => {
  const parameters = updateParametersFromForm();
  const dataset = computeSeries(parameters);

  if (flowChart) {
    const gradient = buildGradient(flowChart);
    flowChart.data.labels = dataset.flows;
    flowChart.data.datasets[0].data = dataset.residualPressures;
    flowChart.data.datasets[0].backgroundColor = gradient || COLORS.gradientStart;
    flowChart.update();
  }
};

const initialize = () => {
  const parameters = updateParametersFromForm();
  flowChart = createChart(ctx, parameters);
};

form.addEventListener('input', () => {
  render();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}
