import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useContext } from 'react';
import { AttackContext } from '../src/App';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import {
	Server,
	Cpu,
	HardDrive,
	Activity,
	AlertCircle,
	GitBranch,
	PlayCircle,
	StopCircle,
	RotateCcw,
	CheckCircle2,
	XCircle,
	Clock,
} from 'lucide-react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts';

import { useState, useEffect } from 'react';

interface SystemMetrics {
	time: string;
	cpu: number;
	memory: number;
	network: number;
}

interface PipelineStage {
	name: string;
	status: string;
	duration: string;
	timestamp: string;
}

interface ServiceStatus {
	name: string;
	status: string;
	version: string;
	replicas: string;
	cpu: string;
	memory: string;
	uptime: string;
}

interface LogEntry {
	timestamp: string;
	level: string;
	service: string;
	message: string;
}

interface Alert {
	id: number;
	severity: string;
	message: string;
	time: string;
	service: string;
}

export default function DevOpsPage() {
	// System metrics state
	const [systemMetrics, setSystemMetrics] = useState<SystemMetrics[]>([]);
	const [metricsLoading, setMetricsLoading] = useState(true);
	const [metricsError, setMetricsError] = useState<string | null>(null);

	// Pipeline stages state
	const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
	const [pipelineLoading, setPipelineLoading] = useState(true);
	const [pipelineError, setPipelineError] = useState<string | null>(null);

	// Services state
	const [services, setServices] = useState<ServiceStatus[]>([]);
	const [servicesLoading, setServicesLoading] = useState(true);
	const [servicesError, setServicesError] = useState<string | null>(null);

	// Logs state
	const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);
	const [logsLoading, setLogsLoading] = useState(true);
	const [logsError, setLogsError] = useState<string | null>(null);

	// Alerts state
	const [alerts, setAlerts] = useState<Alert[]>([]);
	const [alertsLoading, setAlertsLoading] = useState(true);
	const [alertsError, setAlertsError] = useState<string | null>(null);

	const metricsFetch = () => {
		setMetricsLoading(true);
		fetch('http://localhost:8000/api/v1/metrics')
			.then((res) => {
				if (!res.ok) throw new Error('Failed to fetch metrics');
				return res.json();
			})
			.then((data) => {
				setSystemMetrics(data);
				setMetricsLoading(false);
			})
			.catch((err) => {
				setMetricsError(err.message);
				setMetricsLoading(false);
			});
	};

	useEffect(() => {
		metricsFetch();
		const interval = setInterval(metricsFetch, 5000); // Refresh every 5 seconds
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		setPipelineLoading(true);
		fetch('http://localhost:8000/api/v1/pipeline')
			.then((res) => {
				if (!res.ok) throw new Error('Failed to fetch pipeline');
				return res.json();
			})
			.then((data) => {
				setPipelineStages(data);
				setPipelineLoading(false);
			})
			.catch((err) => {
				setPipelineError(err.message);
				setPipelineLoading(false);
			});
	}, []);

	useEffect(() => {
		setServicesLoading(true);
		fetch('http://localhost:8000/api/v1/services')
			.then((res) => {
				if (!res.ok) throw new Error('Failed to fetch services');
				return res.json();
			})
			.then((data) => {
				setServices(data);
				setServicesLoading(false);
			})
			.catch((err) => {
				setServicesError(err.message);
				setServicesLoading(false);
			});
	}, []);

	useEffect(() => {
		setLogsLoading(true);
		fetch('http://localhost:8000/api/v1/logs')
			.then((res) => {
				if (!res.ok) throw new Error('Failed to fetch logs');
				return res.json();
			})
			.then((data) => {
				setRecentLogs(data);
				setLogsLoading(false);
			})
			.catch((err) => {
				setLogsError(err.message);
				setLogsLoading(false);
			});
	}, []);

	useEffect(() => {
		setAlertsLoading(true);
		fetch('http://localhost:8000/api/v1/alerts')
			.then((res) => {
				if (!res.ok) throw new Error('Failed to fetch alerts');
				return res.json();
			})
			.then((data) => {
				setAlerts(data);
				setAlertsLoading(false);
			})
			.catch((err) => {
				setAlertsError(err.message);
				setAlertsLoading(false);
			});
	}, []);

	const { attackActive } = useContext(AttackContext);
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'running':
			case 'success':
				return 'bg-green-500/10 text-green-400 border-green-500/20';
			case 'degraded':
			case 'warning':
			case 'running':
				return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
			case 'failed':
			case 'error':
				return 'bg-red-500/10 text-red-400 border-red-500/20';
			case 'pending':
				return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
			default:
				return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
		}
	};

	const getLogLevelColor = (level: string) => {
		switch (level) {
			case 'ERROR':
				return 'text-red-400';
			case 'WARN':
				return 'text-orange-400';
			case 'INFO':
				return 'text-blue-400';
			default:
				return 'text-slate-400';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'success':
				return <CheckCircle2 className="w-4 h-4" />;
			case 'running':
				return <Activity className="w-4 h-4 animate-pulse" />;
			case 'failed':
				return <XCircle className="w-4 h-4" />;
			case 'pending':
				return <Clock className="w-4 h-4" />;
			default:
				return <AlertCircle className="w-4 h-4" />;
		}
	};

	return (
		<div className="space-y-6">
			{/* System Alerts (only show if critical alerts exist) */}
			{alerts.some((a) => a.severity === 'critical') ? (
				<Alert className="border-red-500/50 bg-red-500/10">
					<AlertCircle color="red" width={5} height={5} />
					<AlertDescription className="text-red-300">
						{alerts.filter((a) => a.severity === 'critical').length} critical
						system issue(s) require immediate attention
					</AlertDescription>
				</Alert>
			) : (
				<Alert className="border-green-500/50 bg-green-500/10">
					<CheckCircle2 color="green" width={5} height={5} />
					<AlertDescription className="text-green-300">
						All systems operational. No active incidents.
					</AlertDescription>
				</Alert>
			)}

			{/* Resource Utilization */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="bg-slate-900 border-slate-800">
					<CardHeader className="pb-3">
						<CardTitle className="text-sm text-slate-400 flex items-center gap-2">
							<Cpu className="w-4 h-4" />
							CPU Usage
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl text-white">
							{metricsLoading
								? '...'
								: systemMetrics.length > 0
								? `${systemMetrics[systemMetrics.length - 1].cpu}%`
								: '32%'}
						</div>
						<div className="mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
							<div
								className={`h-full ${
									attackActive ? 'bg-orange-500' : 'bg-green-500'
								} rounded-full`}
								style={{
									width: metricsLoading
										? '0%'
										: systemMetrics.length > 0
										? `${systemMetrics[systemMetrics.length - 1].cpu}%`
										: '32%',
								}}
							/>
						</div>
						<p className="text-slate-400 text-xs mt-2">8 cores @ 3.2 GHz</p>
					</CardContent>
				</Card>

				<Card className="bg-slate-900 border-slate-800">
					<CardHeader className="pb-3">
						<CardTitle className="text-sm text-slate-400 flex items-center gap-2">
							<HardDrive className="w-4 h-4" />
							Memory Usage
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl text-white">
							{metricsLoading
								? '...'
								: systemMetrics.length > 0
								? `${systemMetrics[systemMetrics.length - 1].memory}%`
								: '41%'}
						</div>
						<div className="mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
							<div
								className={`h-full ${
									attackActive ? 'bg-orange-500' : 'bg-green-500'
								} rounded-full`}
								style={{
									width: metricsLoading
										? '0%'
										: systemMetrics.length > 0
										? `${systemMetrics[systemMetrics.length - 1].memory}%`
										: '41%',
								}}
							/>
						</div>
						<p className="text-slate-400 text-xs mt-2">16 GB</p>
					</CardContent>
				</Card>

				<Card className="bg-slate-900 border-slate-800">
					<CardHeader className="pb-3">
						<CardTitle className="text-sm text-slate-400 flex items-center gap-2">
							<Activity className="w-4 h-4" />
							Network I/O
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl text-white">
							{metricsLoading
								? '...'
								: systemMetrics.length > 0
								? `${systemMetrics[systemMetrics.length - 1].network} Mbps`
								: '210 Mbps'}
						</div>
						<div className="mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
							<div
								className={`h-full ${
									attackActive ? 'bg-cyan-500' : 'bg-green-500'
								} rounded-full`}
								style={{
									width: metricsLoading
										? '0%'
										: systemMetrics.length > 0
										? `${Math.min(
												systemMetrics[systemMetrics.length - 1].network / 10,
												100
										  )}%`
										: '21%',
								}}
							/>
						</div>
						<p className="text-slate-400 text-xs mt-2">
							↓{' '}
							{metricsLoading
								? '...'
								: systemMetrics.length > 0
								? `${Math.floor(
										systemMetrics[systemMetrics.length - 1].network * 0.6
								  )} Mbps`
								: '120 Mbps'}{' '}
							/ ↑{' '}
							{metricsLoading
								? '...'
								: systemMetrics.length > 0
								? `${Math.floor(
										systemMetrics[systemMetrics.length - 1].network * 0.4
								  )} Mbps`
								: '90 Mbps'}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* System Metrics Chart */}
			<Card className="bg-slate-900 border-slate-800">
				<CardHeader>
					<CardTitle className="text-white">
						System Metrics (Last 30 minutes)
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={systemMetrics}>
							<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
							<XAxis dataKey="time" stroke="#64748b" />
							<YAxis stroke="#64748b" />
							<Tooltip
								contentStyle={{
									backgroundColor: '#1e293b',
									border: '1px solid #334155',
									borderRadius: '8px',
								}}
								labelStyle={{ color: '#e2e8f0' }}
							/>
							<Legend />
							<Line
								type="monotone"
								dataKey="cpu"
								stroke="#f97316"
								strokeWidth={2}
								name="CPU %"
							/>
							<Line
								type="monotone"
								dataKey="memory"
								stroke="#8b5cf6"
								strokeWidth={2}
								name="Memory %"
							/>
							<Line
								type="monotone"
								dataKey="network"
								stroke="#06b6d4"
								strokeWidth={2}
								name="Network (Mbps)"
							/>
						</LineChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Deployment Pipeline */}
			<Card className="bg-slate-900 border-slate-800">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-white flex items-center gap-2">
								<GitBranch className="w-5 h-5" />
								Deployment Pipeline
							</CardTitle>
							<p className="text-slate-400 text-sm mt-1">
								Build #247 • Branch: main • Commit: a3f82b9
							</p>
						</div>
						<Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
							In Progress
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{pipelineLoading ? (
							<div className="text-slate-400">Loading pipeline...</div>
						) : pipelineError ? (
							<div className="text-red-400">
								Error loading pipeline: {pipelineError}
							</div>
						) : (
							pipelineStages.map((stage, index) => (
								<div key={index} className="flex items-center gap-4">
									<div
										className={`p-2 rounded-lg ${getStatusColor(stage.status)}`}
									>
										{getStatusIcon(stage.status)}
									</div>
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<span className="text-white">{stage.name}</span>
											<div className="flex items-center gap-3">
												<span className="text-slate-400 text-sm">
													{stage.duration}
												</span>
												<span className="text-slate-500 text-xs">
													{stage.timestamp}
												</span>
											</div>
										</div>
										{stage.status === 'running' && (
											<div className="mt-2 bg-slate-800 rounded-full h-1 overflow-hidden">
												<div
													className="h-full bg-blue-500 rounded-full animate-pulse"
													style={{ width: '60%' }}
												/>
											</div>
										)}
									</div>
								</div>
							))
						)}
					</div>
					<div className="flex gap-3 mt-6">
						<Button
							variant="outline"
							className="border-slate-800  hover:bg-amber-50"
						>
							<RotateCcw className="w-4 h-4 mr-2" />
							Rollback to v2.4.0
						</Button>
						<Button
							variant="outline"
							className="border-red-700 text-red-400 hover:bg-red-500"
						>
							<StopCircle className="w-4 h-4 mr-2" />
							Cancel Pipeline
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Services Status */}
			<Card className="bg-slate-900 border-slate-800">
				<CardHeader>
					<CardTitle className="text-white flex items-center gap-2">
						<Server className="w-5 h-5" />
						Running Services
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{servicesLoading ? (
							<div className="text-slate-400">Loading services...</div>
						) : servicesError ? (
							<div className="text-red-400">
								Error loading services: {servicesError}
							</div>
						) : (
							services.map((service, index) => (
								<div
									key={index}
									className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
								>
									<div className="flex items-start justify-between mb-3">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<h4 className="text-white">{service.name}</h4>
												<Badge className={getStatusColor(service.status)}>
													{service.status}
												</Badge>
												<Badge className="bg-slate-700 text-slate-300 border-slate-600 text-xs">
													{service.version}
												</Badge>
											</div>
											<div className="grid grid-cols-4 gap-4 text-sm">
												<div>
													<span className="text-slate-400">Replicas:</span>
													<span className="text-white ml-2">
														{service.replicas}
													</span>
												</div>
												<div>
													<span className="text-slate-400">CPU:</span>
													<span className="text-white ml-2">{service.cpu}</span>
												</div>
												<div>
													<span className="text-slate-400">Memory:</span>
													<span className="text-white ml-2">
														{service.memory}
													</span>
												</div>
												<div>
													<span className="text-slate-400">Uptime:</span>
													<span className="text-white ml-2">
														{service.uptime}
													</span>
												</div>
											</div>
										</div>
										<div className="flex gap-2">
											<Button
												size="sm"
												variant="outline"
												className="border-slate-700 hover:bg-amber-50 h-8"
											>
												<PlayCircle className="w-3 h-3 mr-1" />
												Restart
											</Button>
											{service.status === 'degraded' && (
												<Button
													size="sm"
													className="bg-orange-600 hover:bg-orange-700 text-white h-8"
												>
													Scale Up
												</Button>
											)}
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</CardContent>
			</Card>

			{/* Alerts and Logs */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Active Alerts */}
				<Card className="bg-slate-900 border-slate-800">
					<CardHeader>
						<CardTitle className="text-white">Active Alerts</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{alertsLoading ? (
								<div className="text-slate-400">Loading alerts...</div>
							) : alertsError ? (
								<div className="text-red-400">
									Error loading alerts: {alertsError}
								</div>
							) : (
								alerts.map((alert) => (
									<div
										key={alert.id}
										className={`p-3 rounded-lg border ${getStatusColor(
											alert.severity
										)}`}
									>
										<div className="flex items-start justify-between mb-2">
											<Badge
												className={`${getStatusColor(alert.severity)} text-xs`}
											>
												{alert.severity.toUpperCase()}
											</Badge>
											<span className="text-slate-400 text-xs">
												{alert.time}
											</span>
										</div>
										<p className="text-white text-sm mb-1">{alert.message}</p>
										<p className="text-slate-400 text-xs">
											Service: {alert.service}
										</p>
									</div>
								))
							)}
						</div>
					</CardContent>
				</Card>

				{/* Recent Logs */}
				<Card className="bg-slate-900 border-slate-800">
					<CardHeader>
						<CardTitle className="text-white">Recent Logs</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2 font-mono text-xs">
							{logsLoading ? (
								<div className="text-slate-400">Loading logs...</div>
							) : logsError ? (
								<div className="text-red-400">
									Error loading logs: {logsError}
								</div>
							) : (
								recentLogs.map((log, index) => (
									<div
										key={index}
										className="p-2 bg-slate-950 rounded border border-slate-800"
									>
										<div className="flex items-start gap-2">
											<span className="text-slate-500">{log.timestamp}</span>
											<span className={getLogLevelColor(log.level)}>
												[{log.level}]
											</span>
											<span className="text-cyan-400">{log.service}</span>
										</div>
										<div className="text-slate-300 mt-1 ml-2">
											{log.message}
										</div>
									</div>
								))
							)}
						</div>
						<Button
							variant="outline"
							className="w-full mt-4 border-slate-700 hover:bg-amber-50"
						>
							View Full Logs
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
