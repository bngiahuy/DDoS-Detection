import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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

// Mock data
const systemMetrics = [
	{ time: '10:00', cpu: 45, memory: 62, network: 340 },
	{ time: '10:05', cpu: 52, memory: 64, network: 420 },
	{ time: '10:10', cpu: 68, memory: 71, network: 680 },
	{ time: '10:15', cpu: 82, memory: 78, network: 920 },
	{ time: '10:20', cpu: 91, memory: 84, network: 1240 },
	{ time: '10:25', cpu: 88, memory: 86, network: 1180 },
	{ time: '10:30', cpu: 76, memory: 79, network: 850 },
];

const pipelineStages = [
	{ name: 'Source', status: 'success', duration: '2s', timestamp: '10:15:23' },
	{ name: 'Build', status: 'success', duration: '45s', timestamp: '10:16:08' },
	{
		name: 'Test',
		status: 'success',
		duration: '1m 23s',
		timestamp: '10:17:31',
	},
	{
		name: 'Security Scan',
		status: 'success',
		duration: '34s',
		timestamp: '10:18:05',
	},
	{
		name: 'Deploy to Staging',
		status: 'success',
		duration: '28s',
		timestamp: '10:18:33',
	},
	{
		name: 'Integration Tests',
		status: 'running',
		duration: '12s',
		timestamp: '10:18:45',
	},
	{
		name: 'Deploy to Production',
		status: 'pending',
		duration: '-',
		timestamp: '-',
	},
];

const services = [
	{
		name: 'ml-inference-api',
		status: 'running',
		version: 'v2.4.1',
		replicas: '3/3',
		cpu: '42%',
		memory: '1.8 GB',
		uptime: '12d 5h',
	},
	{
		name: 'traffic-collector',
		status: 'running',
		version: 'v1.9.3',
		replicas: '5/5',
		cpu: '68%',
		memory: '3.2 GB',
		uptime: '12d 5h',
	},
	{
		name: 'alert-manager',
		status: 'running',
		version: 'v3.1.0',
		replicas: '2/2',
		cpu: '12%',
		memory: '512 MB',
		uptime: '12d 5h',
	},
	{
		name: 'model-trainer',
		status: 'degraded',
		version: 'v2.4.0',
		replicas: '1/2',
		cpu: '89%',
		memory: '4.1 GB',
		uptime: '2h 34m',
	},
	{
		name: 'metrics-exporter',
		status: 'running',
		version: 'v1.2.1',
		replicas: '3/3',
		cpu: '8%',
		memory: '256 MB',
		uptime: '12d 5h',
	},
];

const recentLogs = [
	{
		timestamp: '10:30:42',
		level: 'INFO',
		service: 'ml-inference-api',
		message: 'Prediction request processed successfully',
	},
	{
		timestamp: '10:30:38',
		level: 'WARN',
		service: 'model-trainer',
		message: 'High memory usage detected: 4.1GB/4.5GB',
	},
	{
		timestamp: '10:30:35',
		level: 'ERROR',
		service: 'model-trainer',
		message: 'Replica 2 failed health check, attempting restart',
	},
	{
		timestamp: '10:30:32',
		level: 'INFO',
		service: 'traffic-collector',
		message: 'Processed 45,230 packets in last minute',
	},
	{
		timestamp: '10:30:28',
		level: 'INFO',
		service: 'alert-manager',
		message: 'Critical alert sent to Network Admin dashboard',
	},
	{
		timestamp: '10:30:25',
		level: 'WARN',
		service: 'ml-inference-api',
		message: 'Response time exceeded threshold: 245ms',
	},
	{
		timestamp: '10:30:21',
		level: 'INFO',
		service: 'metrics-exporter',
		message: 'Metrics exported to Prometheus',
	},
];

const alerts = [
	{
		id: 1,
		severity: 'critical',
		message: 'Model trainer service degraded - 1/2 replicas running',
		time: '2 min ago',
		service: 'model-trainer',
	},
	{
		id: 2,
		severity: 'warning',
		message: 'High CPU usage on inference API pods (>80%)',
		time: '5 min ago',
		service: 'ml-inference-api',
	},
	{
		id: 3,
		severity: 'warning',
		message: 'Network bandwidth approaching limit (85%)',
		time: '8 min ago',
		service: 'traffic-collector',
	},
];

export default function DevOpsPage() {
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
			{/* System Alerts */}
			{alerts.filter((a) => a.severity === 'critical').length > 0 && (
				<Alert className="border-red-500/50 bg-red-500/10">
					<AlertCircle color='red' width={5} height={5}/>
					<AlertDescription className="text-red-300">
						{alerts.filter((a) => a.severity === 'critical').length} critical
						system issue(s) require immediate attention
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
						<div className="text-3xl text-white">76%</div>
						<div className="mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
							<div
								className="h-full bg-orange-500 rounded-full"
								style={{ width: '76%' }}
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
						<div className="text-3xl text-white">79%</div>
						<div className="mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
							<div
								className="h-full bg-orange-500 rounded-full"
								style={{ width: '79%' }}
							/>
						</div>
						<p className="text-slate-400 text-xs mt-2">12.6 GB / 16 GB</p>
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
						<div className="text-3xl text-white">850 Mbps</div>
						<div className="mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
							<div
								className="h-full bg-cyan-500 rounded-full"
								style={{ width: '85%' }}
							/>
						</div>
						<p className="text-slate-400 text-xs mt-2">
							↓ 620 Mbps / ↑ 230 Mbps
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
						{pipelineStages.map((stage, index) => (
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
						))}
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
						{services.map((service, index) => (
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
						))}
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
							{alerts.map((alert) => (
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
										<span className="text-slate-400 text-xs">{alert.time}</span>
									</div>
									<p className="text-white text-sm mb-1">{alert.message}</p>
									<p className="text-slate-400 text-xs">
										Service: {alert.service}
									</p>
								</div>
							))}
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
							{recentLogs.map((log, index) => (
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
									<div className="text-slate-300 mt-1 ml-2">{log.message}</div>
								</div>
							))}
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
