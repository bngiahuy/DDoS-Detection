import { useState } from 'react';
import { useNavigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import NetworkAdminPage from '../components/NetworkAdminPage';
import DataScientistPage from '../components/DataScientistPage';
import DevOpsPage from '../components/DevOpsPage';
import DatasetPage from '../components/DatasetPage';
import CreateDataset from '../components/CreateDataset';
import CreatePreprocessing from '../components/CreatePreprocessing';
import DataPreprocessingPage from '../components/DataPreprocessingPage';
import {
	ArrowRightFromLine,
	ArrowLeftFromLine,
	FolderCog,
	Shield,
	Brain,
	FileSpreadsheet,
	Server,
} from 'lucide-react';
export default function App() {
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
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
					indent ? '8' : '4'
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

	return (
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

							<SidebarButton
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
							/>
						</div>
						<SidebarButton
							to="/devops"
							icon={<Server className="w-5 h-5" />}
							label="DevOps"
						/>
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
							<Route path="/data-preprocessing" element={<DataPreprocessingPage />} />
							<Route path="/dataset" element={<DatasetPage />} />
							<Route path="/devops" element={<DevOpsPage />} />
							<Route path="/create-dataset" element={<CreateDataset />} />
							<Route path="/create-preprocessing" element={<CreatePreprocessing />} />
						</Routes>
					</main>
				</div>
			</div>
		</BrowserRouter>
	);
}
