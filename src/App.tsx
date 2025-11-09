import { useState } from 'react';
import { NetworkAdminPage } from '../components/NetworkAdminPage';
import { DataScientistPage } from '../components/DataScientistPage';
import { DevOpsPage } from '../components/DevOpsPage';
import Dataset from '../components/Dataset';
import {
	ArrowRightFromLine,
	ArrowLeftFromLine,
	FolderCog,
	Shield,
	Brain,
	FileSpreadsheet,
	Server,
} from 'lucide-react';
type Stakeholder =
	// To add more child pages for Data Scientist, add new string literals here, e.g. 'dataset', 'feature-engineering', etc.
	| 'network-admin'
	| 'data-scientist'
	| 'data-preprocessing'
	| 'dataset'
	| 'devops';

export default function App() {
	const [activeStakeholder, setActiveStakeholder] =
		useState<Stakeholder>('network-admin');
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

	return (
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
					<button
						onClick={() => setActiveStakeholder('network-admin')}
						className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
							activeStakeholder === 'network-admin'
								? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
								: 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
						}`}
					>
						<Shield className="w-5 h-5" />
						<span>Network Administrator</span>
					</button>
					<div>
						<button
							onClick={() => setActiveStakeholder('data-scientist')}
							className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left w-full ${
								activeStakeholder === 'data-scientist'
									? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
									: 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
							}`}
						>
							<Brain className="w-5 h-5" />
							<span>Data Scientist</span>
						</button>
						{/* Child navigation for Data Scientist
							To add more child pages, just add more buttons below. Example: "Dataset" below.
						*/}
						{(activeStakeholder === 'data-scientist' ||
							activeStakeholder === 'data-preprocessing' ||
							activeStakeholder === 'dataset') && (
							<>
								{/* Example child: Dataset */}
								<button
									onClick={() => setActiveStakeholder('dataset')}
									className={`flex items-center gap-3 px-8 py-2 rounded-lg transition-all text-left w-full mt-1 text-sm ${
										activeStakeholder === 'dataset'
											? 'bg-purple-700 text-white shadow-lg shadow-purple-500/20'
											: 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
									}`}
								>
									{/* You can change the icon below for your Dataset page */}
									<FileSpreadsheet className="w-4 h-4" />
									<span>Dataset</span>
								</button>
								{/* Example child: Data Preprocessing */}
								<button
									onClick={() => setActiveStakeholder('data-preprocessing')}
									className={`flex items-center gap-3 px-8 py-2 rounded-lg transition-all text-left w-full mt-1 text-sm ${
										activeStakeholder === 'data-preprocessing'
											? 'bg-purple-700 text-white shadow-lg shadow-purple-500/20'
											: 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
									}`}
								>
									<FolderCog className="w-4 h-4" />
									<span>Data Preprocessing</span>
								</button>
							</>
						)}
					</div>
					<button
						onClick={() => setActiveStakeholder('devops')}
						className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
							activeStakeholder === 'devops'
								? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'
								: 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
						}`}
					>
						<Server className="w-5 h-5" />
						<span>DevOps</span>
					</button>
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
					{activeStakeholder === 'network-admin' && <NetworkAdminPage />}
					{activeStakeholder === 'data-scientist' && <DataScientistPage />}
					{activeStakeholder === 'dataset' && <Dataset />}
					
					{activeStakeholder === 'devops' && <DevOpsPage />}
				</main>
			</div>
		</div>
	);
}

// {activeStakeholder === 'dataset' && (
// 						<div className="bg-slate-950 min-h-[60vh] rounded-xl shadow-lg p-8 border border-purple-800">
// 							<h2 className="text-2xl font-bold text-purple-400 mb-4">
// 								Dataset
// 							</h2>
// 							<p className="text-slate-300 mb-2">
// 								This page will be used to manage and view datasets for DDoS
// 								detection.
// 							</p>
// 							{/* Add your dataset management UI here */}
// 						</div>
// 					)}