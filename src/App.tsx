import { useState, createContext, useContext, useRef, useEffect } from 'react';


import { useNavigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import NetworkAdminPage from '../components/NetworkAdminPage';
import DataScientistPage from '../components/DataScientistPage';
import DevOpsPage from '../components/DevOpsPage';
import NotFoundPage from '../components/NotFoundPage';
// import DatasetPage from '../components/DatasetPage';
// import CreateDataset from '../components/CreateDataset';
// import CreatePreprocessing from '../components/CreatePreprocessing';
// import DataPreprocessingPage from '../components/DataPreprocessingPage';
import {
	ArrowRightFromLine,
	ArrowLeftFromLine,
	// FolderCog,
	Shield,
	Brain,
	// FileSpreadsheet,
	Server,
	Power,
	Pause,
} from 'lucide-react';


// Context for attack status
// Alert type
type AlertType = {
	label: string;
	src: string;
	dst: string;
	sample: number;
	serverity: string;
};

export const AttackContext = createContext<{
	attackActive: boolean;
	setAttackActive: (b: boolean) => void;
	alerts: AlertType[];
	addAlert: (a: AlertType) => void;
}>({
	attackActive: false,
	setAttackActive: (_: boolean) => {},
	alerts: [],
	addAlert: (_: AlertType) => {},
});

export default function App() {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	// DDoS Attack Simulation State
	const [attackActive, setAttackActive] = useState(false);
	// Alert popup state
	const [alerts, setAlerts] = useState<AlertType[]>([]);
	// WebSocket ref
	const wsRef = useRef<WebSocket | null>(null);

	// Thêm alert mới
	const addAlert = (alert: AlertType) => {
		setAlerts((prev) => [...prev, alert]);
		// Tự động xóa sau 5s
		setTimeout(() => {
			setAlerts((prev) => prev.slice(1));
		}, 5000);
	};

	// Quản lý WebSocket khi attackActive thay đổi
	useEffect(() => {
		if (attackActive) {
			// Gửi request bắt đầu attack
			fetch('/simulate_attack?status=start');
			// Kết nối WebSocket
			const ws = new WebSocket(
				'ws://localhost:8000/ws/simulate_attack'
			);
			wsRef.current = ws;
			ws.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					addAlert({
						label: data.label,
						src: data.src,
						dst: data.dst,
						sample: data.sample,
						serverity: data.severity,
					});
				} catch (e) {}
			};
			ws.onclose = () => {
				wsRef.current = null;
			};
		} else {
			// Đóng WebSocket nếu đang mở
			if (wsRef.current) {
				wsRef.current.close();
				wsRef.current = null;
			}
		}
		// Cleanup khi unmount
		return () => {
			if (wsRef.current) {
				wsRef.current.close();
				wsRef.current = null;
			}
		};
	}, [attackActive]);

	type SidebarButtonProps = {
		to: string;
		icon: React.ReactNode;
		label: string;
		indent?: boolean;
	};

	function SidebarButton({
		to,
		icon,
		label,
		indent = false,
	}: SidebarButtonProps) {
		const navigate = useNavigate();
		const isActive = window.location.pathname === to;
		return (
			<button
				onClick={() => navigate(to)}
				className={`flex items-center gap-3 px-${
					indent ? '6' : '3'
				} py-2 rounded-lg transition-all text-left w-full mt-1 text-sm ${
					isActive
						? indent
							? 'bg-purple-700 text-white shadow-lg shadow-purple-500/20'
							: 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
						: 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
				}`}
			>
				{icon}
				<span>{label}</span>
			</button>
		);
	}

	// Button for simulating DDoS attack
	function DDoSAttackButton() {
		const { attackActive, setAttackActive } = useContext(AttackContext);
		return (
			<button
				onClick={() => setAttackActive(!attackActive)}
				className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left w-full mt-1 text-sm font-semibold ${
					attackActive
						? 'bg-red-700 text-white shadow-lg shadow-red-500/20'
						: 'bg-green-600 text-white hover:bg-green-700'
				}`}
			>
				{attackActive ? <Pause className="w-5 h-5" /> : <Power className="w-5 h-5" />}
				<span>{attackActive ? 'DDoS Attack End' : 'DDoS Attack Begin'}</span>
			</button>
		);
	}

	return (
		<AttackContext.Provider value={{ attackActive, setAttackActive, alerts, addAlert }}>
			<BrowserRouter>
				<div className="min-h-screen bg-slate-950 flex">
					{/* Sidebar Dashboard */}
					<div
						className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ${
							sidebarOpen ? 'translate-x-0' : '-translate-x-full'
						} bg-slate-900 border-r border-slate-800 w-64 flex flex-col shadow-lg`}
					>
						<div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800">
							<div className="bg-linear-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
								<Shield className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-white text-lg font-semibold">
									DDoS Defense System
								</h1>
								<p className="text-slate-400 text-xs">
									Random Forest Detection Engine
								</p>
							</div>
						</div>
						<nav className="flex flex-col gap-2 px-4 py-6">
							<SidebarButton
								to="/"
								icon={<Shield className="w-5 h-5" />}
								label="Network Administrator"
							/>
							<div>
								<SidebarButton
									to="/data-scientist"
									icon={<Brain className="w-5 h-5" />}
									label="Data Scientist"
								/>
								{/* Child navigation for Data Scientist */}
								{/* <SidebarButton
									to="/dataset"
									icon={<FileSpreadsheet className="w-4 h-4" />}
									label="Dataset"
									indent
								/>
								<SidebarButton
									to="/data-preprocessing"
									icon={<FolderCog className="w-4 h-4" />}
									label="Data Preprocessing"
									indent
								/> */}
							</div>
							<SidebarButton
								to="/devops"
								icon={<Server className="w-5 h-5" />}
								label="DevOps"
							/>
							{/* DDoS Attack Simulation Button */}
							<DDoSAttackButton />
						</nav>
					</div>
					{/* Sidebar Toggle Button */}
					<button
						className="fixed left-4 bottom-4 z-50 bg-slate-800 text-slate-200 rounded-full p-2 shadow-lg hover:bg-slate-700 transition-all"
						onClick={() => setSidebarOpen((open) => !open)}
						aria-label="Toggle sidebar"
					>
						{sidebarOpen ? <ArrowRightFromLine /> : <ArrowLeftFromLine />}
					</button>

					{/* Main Content */}
					<div
						className={`flex-1 transition-all duration-300 ${
							sidebarOpen ? 'ml-64' : 'ml-0'
						}`}
					>
						{/* Popup alerts ở góc trên phải */}
						<div className="fixed top-6 right-6 z-50" style={{pointerEvents: 'none'}}>
							<div style={{position: 'relative', width: '320px', height: alerts.length ? `${80 + (alerts.length-1)*32}px` : '0'}}>
								{[...alerts].slice().reverse().map((alert, idx) => (
									<div
										key={alerts.length-1-idx}
										className="absolute right-0 w-full px-5 py-4 rounded-2xl shadow-2xl border border-red-500/40 bg-gradient-to-br from-red-600 via-pink-500 to-slate-900 backdrop-blur-lg flex flex-col gap-2 animate-fade-in"
										style={{
											top: `${idx*32}px`,
											zIndex: alerts.length-idx,
											opacity: idx === 0 ? 1 : Math.max(0.45, 1-idx*0.25),
											boxShadow: '0 8px 32px 0 rgba(255,0,80,0.25), 0 1.5px 8px 0 rgba(255,0,80,0.15)',
											border: '1.5px solid #f43f5e',
											animation: 'fadein 0.4s cubic-bezier(.4,2,.3,1)',
											pointerEvents: 'auto',
										}}
									>
										<div className="flex items-center gap-3 mb-1">
											<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-yellow-300 drop-shadow-lg"><path d="M12 9v4m0 4h.01M21 20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7l5 5v11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
											<span className="font-bold text-lg text-white tracking-wide drop-shadow">DDoS Alert #{alert.sample}</span>
										</div>
										<div className="text-sm text-white/90 font-semibold">Label: <span className="px-2 py-1 rounded bg-black/20 text-pink-200 font-bold tracking-wide">{alert.label}</span></div>
										<div className="flex gap-2 text-xs text-white/80">
											<span className="bg-white/10 px-2 py-1 rounded-lg">Src: <b className="text-yellow-200">{alert.src}</b></span>
											<span className="bg-white/10 px-2 py-1 rounded-lg">Dst: <b className="text-blue-200">{alert.dst}</b></span>
										</div>
									</div>
								))}
							</div>
						</div>
						<header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-30">
							<div className="container mx-auto px-6 py-4 flex items-center justify-between">
								<div className="flex items-center gap-3">
									{/* Logo and Title moved to sidebar */}
								</div>
							</div>
						</header>
						<main className="container mx-auto px-6 py-6">
							<Routes>
								<Route path="/" element={<NetworkAdminPage />} />
								<Route path="/data-scientist" element={<DataScientistPage />} />
								{/* <Route
									path="/data-preprocessing"
									element={<DataPreprocessingPage />}
								/>
								<Route path="/dataset" element={<DatasetPage />} /> */}
								<Route path="/devops" element={<DevOpsPage />} />
								{/* <Route path="/create-dataset" element={<CreateDataset />} />
								<Route
									path="/create-preprocessing"
									element={<CreatePreprocessing />}
								/> */}
								<Route path="*" element={<NotFoundPage />} />
							</Routes>
						</main>
					</div>

                    
				</div>
			</BrowserRouter>
		</AttackContext.Provider>
	);
}
