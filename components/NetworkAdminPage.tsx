import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import {
	AlertTriangle,
	Shield,
	Activity,
	Ban,
	Network,
	Clock,
	Eye,
} from 'lucide-react';
import {
	AreaChart,
	Area,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts';

// Mock data
const trafficData = [
	{ time: '10:00', normal: 4000, suspicious: 240, attack: 0 },
	{ time: '10:05', normal: 3800, suspicious: 310, attack: 100 },
	{ time: '10:10', normal: 3500, suspicious: 450, attack: 450 },
	{ time: '10:15', normal: 2800, suspicious: 680, attack: 1200 },
	{ time: '10:20', normal: 2200, suspicious: 920, attack: 2400 },
	{ time: '10:25', normal: 1800, suspicious: 1100, attack: 3800 },
	{ time: '10:30', normal: 3200, suspicious: 580, attack: 800 },
];

const alertsData = [
	{
		id: 1,
		severity: 'critical',
		source: '192.168.45.123',
		target: 'web-server-01',
		type: 'SYN Flood',
		time: '2 min ago',
	},
	{
		id: 2,
		severity: 'critical',
		source: '203.45.67.89',
		target: 'api-gateway',
		type: 'HTTP Flood',
		time: '3 min ago',
	},
	{
		id: 3,
		severity: 'warning',
		source: '45.123.67.234',
		target: 'load-balancer',
		type: 'Anomalous Traffic',
		time: '5 min ago',
	},
	{
		id: 4,
		severity: 'critical',
		source: '198.51.100.42',
		target: 'database-proxy',
		type: 'UDP Flood',
		time: '7 min ago',
	},
];

const nodeStatusData = [
	{ name: 'Normal', value: 12, color: '#10b981' },
	{ name: 'Warning', value: 3, color: '#f97316' },
	{ name: 'Critical', value: 2, color: '#ef4444' },
];

const topAttackers = [
	{ ip: '192.168.45.123', requests: 45230, country: 'Unknown', blocked: false },
	{ ip: '203.45.67.89', requests: 38940, country: 'Unknown', blocked: false },
	{ ip: '45.123.67.234', requests: 29450, country: 'Unknown', blocked: true },
	{ ip: '198.51.100.42', requests: 24780, country: 'Unknown', blocked: false },
	{ ip: '172.16.254.1', requests: 18920, country: 'Unknown', blocked: true },
];

export function NetworkAdminPage() {
	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case 'critical':
				return 'bg-red-500/10 text-red-400 border-red-500/20';
			case 'warning':
				return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
			default:
				return 'bg-green-500/10 text-green-400 border-green-500/20';
		}
	};

	return (
		<div className="space-y-6">
			{/* Critical Alerts Banner */}
			<Alert className="border-red-500/50 bg-red-500/10">
				<AlertTriangle className="h-5 w-5 text-red-400" />
				<AlertDescription className="text-red-300">
					<span>Active DDoS Attack Detected!</span> 4 critical incidents require
					immediate attention.
				</AlertDescription>
			</Alert>

			{/* Key Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card className="bg-slate-900 border-slate-800">
					<CardHeader className="pb-3">
						<CardTitle className="text-sm text-slate-400 flex items-center gap-2">
							<Activity className="w-4 h-4" />
							Traffic Volume
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl text-white">
							8.4K <span className="text-sm text-slate-400">req/s</span>
						</div>
						<Badge className="mt-2 bg-red-500/10 text-red-400 border-red-500/20">
							+340% anomaly
						</Badge>
					</CardContent>
				</Card>

				<Card className="bg-slate-900 border-slate-800">
					<CardHeader className="pb-3">
						<CardTitle className="text-sm text-slate-400 flex items-center gap-2">
							<Shield className="w-4 h-4" />
							Blocked Attacks
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl text-white">1,247</div>
						<Badge className="mt-2 bg-green-500/10 text-green-400 border-green-500/20">
							Last hour
						</Badge>
					</CardContent>
				</Card>

				<Card className="bg-slate-900 border-slate-800">
					<CardHeader className="pb-3">
						<CardTitle className="text-sm text-slate-400 flex items-center gap-2">
							<AlertTriangle className="w-4 h-4" />
							Active Threats
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl text-white">4</div>
						<Badge className="mt-2 bg-red-500/10 text-red-400 border-red-500/20">
							Critical
						</Badge>
					</CardContent>
				</Card>

				<Card className="bg-slate-900 border-slate-800">
					<CardHeader className="pb-3">
						<CardTitle className="text-sm text-slate-400 flex items-center gap-2">
							<Network className="w-4 h-4" />
							Network Health
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl text-white">76%</div>
						<Badge className="mt-2 bg-orange-500/10 text-orange-400 border-orange-500/20">
							Degraded
						</Badge>
					</CardContent>
				</Card>
			</div>

			{/* Main Dashboard Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Real-time Traffic Chart */}
				<Card className="bg-slate-900 border-slate-800 lg:col-span-2">
					<CardHeader>
						<CardTitle className="text-white">
							Real-time Network Traffic
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<AreaChart data={trafficData}>
								<defs>
									<linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
										<stop offset="95%" stopColor="#10b981" stopOpacity={0} />
									</linearGradient>
									<linearGradient
										id="colorSuspicious"
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
										<stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
										<stop offset="95%" stopColor="#f97316" stopOpacity={0} />
									</linearGradient>
									<linearGradient id="colorAttack" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
										<stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
									</linearGradient>
								</defs>
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
								<Area
									type="monotone"
									dataKey="normal"
									stroke="#10b981"
									fillOpacity={1}
									fill="url(#colorNormal)"
								/>
								<Area
									type="monotone"
									dataKey="suspicious"
									stroke="#f97316"
									fillOpacity={1}
									fill="url(#colorSuspicious)"
								/>
								<Area
									type="monotone"
									dataKey="attack"
									stroke="#ef4444"
									fillOpacity={1}
									fill="url(#colorAttack)"
								/>
							</AreaChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Node Status */}
				<Card className="bg-slate-900 border-slate-800">
					<CardHeader>
						<CardTitle className="text-white">Network Nodes</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={200}>
							<PieChart>
								<Pie
									data={nodeStatusData}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={80}
									paddingAngle={5}
									dataKey="value"
								>
									{nodeStatusData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										backgroundColor: '#1e293b',
										border: '1px solid #334155',
										borderRadius: '8px',
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
						<div className="mt-4 space-y-2">
							{nodeStatusData.map((node, index) => (
								<div key={index} className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div
											className="w-3 h-3 rounded-full"
											style={{ backgroundColor: node.color }}
										/>
										<span className="text-slate-300 text-sm">{node.name}</span>
									</div>
									<span className="text-white">{node.value}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Alerts and Attackers */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Active Alerts */}
				<Card className="bg-slate-900 border-slate-800">
					<CardHeader>
						<CardTitle className="text-white">Active Alerts</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{alertsData.map((alert) => (
								<div
									key={alert.id}
									className={`p-4 rounded-lg border ${getSeverityColor(
										alert.severity
									)}`}
								>
									<div className="flex items-start justify-between mb-2">
										<div>
											<Badge
												className={`${getSeverityColor(
													alert.severity
												)} text-xs`}
											>
												{alert.type}
											</Badge>
											<div className="text-slate-300 text-sm mt-2">
												Source:{' '}
												<span className="text-white">{alert.source}</span>
											</div>
											<div className="text-slate-300 text-sm">
												Target:{' '}
												<span className="text-white">{alert.target}</span>
											</div>
										</div>
										<div className="flex items-center gap-1 text-slate-400 text-xs">
											<Clock className="w-3 h-3" />
											{alert.time}
										</div>
									</div>
									<div className="flex gap-2 mt-3">
										<Button
											size="sm"
											className="bg-red-600 hover:bg-red-700 text-white h-8"
										>
											<Ban className="w-3 h-3 mr-1" />
											Block IP
										</Button>
										<Button
											size="sm"
											variant="outline"
											className="border-slate-700 hover:bg-amber-50 h-8"
										>
											<Eye className="w-3 h-3 mr-1" />
											Details
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Top Attackers */}
				<Card className="bg-slate-900 border-slate-800">
					<CardHeader>
						<CardTitle className="text-white">Top Attack Sources</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{topAttackers.map((attacker, index) => (
								<div
									key={index}
									className="p-3 rounded-lg bg-slate-800/50 border border-slate-700"
								>
									<div className="flex items-center justify-between mb-2">
										<div className="text-white">{attacker.ip}</div>
										{attacker.blocked ? (
											<Badge className="bg-slate-700 text-slate-300 border-slate-600">
												Blocked
											</Badge>
										) : (
											<Badge className="bg-red-500/10 text-red-400 border-red-500/20">
												Active
											</Badge>
										)}
									</div>
									<div className="flex items-center justify-between text-sm">
										<span className="text-slate-400">
											{attacker.requests.toLocaleString()} requests
										</span>
										{!attacker.blocked && (
											<Button
												size="sm"
												className="bg-red-600 hover:bg-red-700 text-white h-7 text-xs"
											>
												<Ban className="w-3 h-3 mr-1" />
												Block
											</Button>
										)}
									</div>
								</div>
							))}
						</div>
						<Button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-slate-300">
							View All Incidents
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
