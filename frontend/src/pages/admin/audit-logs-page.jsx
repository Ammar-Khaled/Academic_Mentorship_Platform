import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

const statusColors = {
  success: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

export function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditData();
  }, []);

  const fetchAuditData = async () => {
    try {
      setLoading(true);
      const [statsRes, recentRes] = await Promise.all([
        api.get('/admin/audit/statistics'),
        api.get('/admin/audit/logs/recent?limit=50'),
      ]);

      setStatistics(statsRes.data);
      setRecentLogs(recentRes.data || []);
    } catch (error) {
      console.error('Failed to fetch audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!statistics) return [];
    return [
      { name: 'Success', value: statistics.successCount || 0 },
      { name: 'Failed', value: statistics.failureCount || 0 },
      { name: 'Pending', value: statistics.pendingCount || 0 },
    ];
  };

  const COLORS = {
    success: '#10b981',
    failed: '#ef4444',
    pending: '#f59e0b',
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="AI Audit Logs"
        description="Monitor session reviews, AI analysis results, and platform audit trails."
      />

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8 gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading audit data...</span>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Statistics Cards */}
          {statistics && (
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Analyzed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.totalAnalyzed || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sessions reviewed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.successRate?.toFixed(1) || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Passing reviews
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Confidence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.avgConfidenceScore?.toFixed(2) || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    AI analysis confidence
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Latency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statistics.avgLatency?.toFixed(0) || 0}ms
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Analysis time
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="charts">
            <TabsList>
              <TabsTrigger value="charts">Charts & Analytics</TabsTrigger>
              <TabsTrigger value="logs">Recent Logs</TabsTrigger>
              <TabsTrigger value="successful">Successful</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Audit Results Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) =>
                            `${name}: ${value}`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill={COLORS.success} />
                          <Cell fill={COLORS.failed} />
                          <Cell fill={COLORS.pending} />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Audit Status Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {statistics && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Successful</span>
                          <Badge className="bg-green-100 text-green-800">
                            {statistics.successCount || 0}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Failed</span>
                          <Badge className="bg-red-100 text-red-800">
                            {statistics.failureCount || 0}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Pending</span>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {statistics.pendingCount || 0}
                          </Badge>
                        </div>
                        <hr className="my-4" />
                        <div className="text-sm">
                          <p>
                            <strong>Most Common Issue:</strong>{' '}
                            {statistics.mostCommonIssue ||
                              'No data available'}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Audit Logs</CardTitle>
                  <CardDescription>
                    Latest 50 session audit analysis records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentLogs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No audit logs yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Session ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Confidence</TableHead>
                            <TableHead>Latency</TableHead>
                            <TableHead>Analyzed</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentLogs.map((log) => (
                            <TableRow key={log._id}>
                              <TableCell className="font-mono text-xs">
                                {log.sessionId?.substring(0, 8)}...
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    statusColors[log.status] ||
                                    'bg-gray-100 text-gray-800'
                                  }
                                >
                                  {log.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-gray-200 rounded h-2 overflow-hidden">
                                    <div
                                      className="bg-blue-500 h-full"
                                      style={{
                                        width: `${
                                          (
                                            log.confidenceScore || 0
                                          ) * 100
                                        }%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs font-mono">
                                    {(
                                      log.confidenceScore || 0
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {log.analysisLatency || 0}ms
                              </TableCell>
                              <TableCell className="text-xs text-gray-500">
                                {new Date(
                                  log.createdAt
                                ).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="successful">
              <Card>
                <CardHeader>
                  <CardTitle>Successful Audits</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentLogs.filter((l) => l.status === 'success')
                    .length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No successful audits.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Session ID</TableHead>
                          <TableHead>Confidence</TableHead>
                          <TableHead>Latency</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentLogs
                          .filter((l) => l.status === 'success')
                          .map((log) => (
                            <TableRow key={log._id}>
                              <TableCell className="font-mono text-xs">
                                {log.sessionId?.substring(0, 8)}...
                              </TableCell>
                              <TableCell>
                                {(log.confidenceScore || 0).toFixed(2)}
                              </TableCell>
                              <TableCell>
                                {log.analysisLatency || 0}ms
                              </TableCell>
                              <TableCell className="text-xs text-gray-500">
                                {new Date(
                                  log.createdAt
                                ).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="failed">
              <Card>
                <CardHeader>
                  <CardTitle>Failed Audits</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentLogs.filter((l) => l.status === 'failed')
                    .length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No failed audits.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Session ID</TableHead>
                          <TableHead>Issue</TableHead>
                          <TableHead>Latency</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentLogs
                          .filter((l) => l.status === 'failed')
                          .map((log) => (
                            <TableRow key={log._id}>
                              <TableCell className="font-mono text-xs">
                                {log.sessionId?.substring(0, 8)}...
                              </TableCell>
                              <TableCell>
                                <span className="text-xs">
                                  {log.issueDescription ||
                                    'Analysis failed'}
                                </span>
                              </TableCell>
                              <TableCell>
                                {log.analysisLatency || 0}ms
                              </TableCell>
                              <TableCell className="text-xs text-gray-500">
                                {new Date(
                                  log.createdAt
                                ).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
