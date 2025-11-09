import { useState } from 'react';
import { NetworkAdminPage } from '../components/NetworkAdminPage';
import { DataScientistPage } from '../components/DataScientistPage';
import { DevOpsPage } from '../components/DevOpsPage';
import { Shield, Brain, Server } from 'lucide-react';

type Stakeholder = 'network-admin' | 'data-scientist' | 'devops';

export default function App() {
	const [activeStakeholder, setActiveStakeholder] =
		useState<Stakeholder>('network-admin');

	return (
		<div className="min-h-screen bg-slate-950">
			{/* Top Navigation */}
			<header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="bg-linear-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
								<Shield className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-white">DDoS Defense System</h1>
								<p className="text-slate-400 text-sm">
									Random Forest Detection Engine
								</p>
							</div>
						</div>

						{/* Stakeholder Navigation */}
						<nav className="flex gap-2">
							<button
								onClick={() => setActiveStakeholder('network-admin')}
								className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
									activeStakeholder === 'network-admin'
										? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
										: 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
								}`}
							>
								<Shield className="w-4 h-4" />
								Network Administrator
							</button>
							<button
								onClick={() => setActiveStakeholder('data-scientist')}
								className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
									activeStakeholder === 'data-scientist'
										? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
										: 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
								}`}
							>
								<Brain className="w-4 h-4" />
								Data Scientist
							</button>
							<button
								onClick={() => setActiveStakeholder('devops')}
								className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
									activeStakeholder === 'devops'
										? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'
										: 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
								}`}
							>
								<Server className="w-4 h-4" />
								DevOps
							</button>
						</nav>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-6 py-6">
				{activeStakeholder === 'network-admin' && <NetworkAdminPage />}
				{activeStakeholder === 'data-scientist' && <DataScientistPage />}
				{activeStakeholder === 'devops' && <DevOpsPage />}
			</main>
		</div>
	);
}
