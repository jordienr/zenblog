import AppLayout from "@/layouts/AppLayout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BlogAnalytics() {
  const maxRequests = 100_000;
  const currentRequests = 15_000;
  const percentage = (currentRequests / maxRequests) * 100;
  const percentageText = `${percentage.toFixed(2)}%`;
  const data = [
    { month: "Jan", requests: 1000, percentage: 10 },
    { month: "Feb", requests: 1200, percentage: 12 },
    { month: "Mar", requests: 1500, percentage: 15 },
  ];

  return (
    <AppLayout>
      <div className="mx-auto mt-8 flex max-w-4xl flex-col gap-10 p-4 px-3">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium">API Usage</h1>
        </div>

        <section className="section px-6 py-4">
          <h2 className="text-lg font-medium">Current month</h2>
          <p className="text-sm text-gray-500">API Requests in current month</p>

          <div className="mt-4 h-4 w-full rounded-full bg-gray-200">
            <div
              className="h-4 rounded-full bg-blue-600"
              style={{ width: percentageText }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {percentageText} of your API usage limit has been reached.
          </p>
        </section>

        <section className="section">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Requests</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.month}>
                  <TableCell>{item.month}</TableCell>
                  <TableCell className="text-right font-mono">
                    {item.requests}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {item.percentage}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
    </AppLayout>
  );
}
