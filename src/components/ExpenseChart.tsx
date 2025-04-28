
import { Card } from '@/components/ui/card';
import { ForecastData } from '@/types/finance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ExpenseChartProps {
  forecastData: ForecastData[];
}

const ExpenseChart = ({ forecastData }: ExpenseChartProps) => {
  // Transform data for the chart
  const chartData = forecastData.map(item => ({
    name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    Predicted: item.predicted,
    Actual: item.actual,
    fill: `var(--tw-color-finance-${item.category})`,
  }));

  return (
    <Card className="finance-card">
      <h2 className="text-lg font-medium mb-4">Monthly Expense Forecast</h2>
      <div className="h-[300px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip 
              formatter={(value) => [`$${value}`, undefined]}
              labelFormatter={(label) => `Category: ${label}`}
            />
            <Legend />
            <Bar dataKey="Predicted" fill="#94a3b8" />
            <Bar dataKey="Actual" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ExpenseChart;
