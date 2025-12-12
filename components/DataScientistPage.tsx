import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert } from './ui/alert';
import { Progress } from './ui/progress';
import { Label } from './ui/label';
import {
	Brain,
	TrendingUp,
	Upload,
	Play,
	RotateCcw,
	CheckCircle2,
	Download,
} from 'lucide-react';
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts';


// Color mapping for metrics
const metricColors: Record<string, string> = {
	Accuracy: '#10b981',
	Precision: '#06b6d4',
	Recall: '#8b5cf6',
	'F1-Score': '#f59e0b',
};

const rocCurveData = [
	{ fpr: 0, tpr: 0 },
	{ fpr: 0.05, tpr: 0.62 },
	{ fpr: 0.1, tpr: 0.78 },
	{ fpr: 0.15, tpr: 0.86 },
	{ fpr: 0.2, tpr: 0.91 },
	{ fpr: 0.25, tpr: 0.94 },
	{ fpr: 0.3, tpr: 0.96 },
	{ fpr: 0.4, tpr: 0.98 },
	{ fpr: 0.5, tpr: 0.99 },
	{ fpr: 1, tpr: 1 },
];


const performanceMetrics = [
	{ metric: 'Accuracy', value: 94.2, color: '#10b981' },
	{ metric: 'Precision', value: 92.8, color: '#06b6d4' },
	{ metric: 'Recall', value: 96.1, color: '#8b5cf6' },
	{ metric: 'F1-Score', value: 84.4, color: '#f59e0b' },
];

const trainingHistory = [
	{ version: 'v2.0.0', trainAccuracy: 90.5, testAccuracy: 88.9 },
	{ version: 'v2.1.0', trainAccuracy: 92.1, testAccuracy: 90.8 },
	{ version: 'v2.2.0', trainAccuracy: 93.3, testAccuracy: 92.5 },
	{ version: 'v2.3.0', trainAccuracy: 94.5, testAccuracy: 93.8 },
	{ version: 'v2.4.1', trainAccuracy: 95.1, testAccuracy: 94.2 },
	{ version: 'v2.5.0', trainAccuracy: 95.8, testAccuracy: 94.7 },
];

// Mock data cho Validation
const validationAlarms = [
	{
		id: 'TRG-20251109-001',
		link: '/shareddrive/random_forest/ddos_alarm/TRG-20251109-001',
		timestamp: '2025-11-09 14:23:45',
	},
	{
		id: 'TRG-20251109-002',
		link: '/shareddrive/random_forest/ddos_alarm/TRG-20251109-002',
		timestamp: '2025-11-09 14:25:12',
	},
	{
		id: 'TRG-20251109-003',
		link: '/shareddrive/random_forest/ddos_alarm/TRG-20251109-003',
		timestamp: '2025-11-09 14:30:05',
	},
	{
		id: 'TRG-20251109-004',
		link: '/shareddrive/random_forest/sql_injection/TRG-20251109-004',
		timestamp: '2025-11-09 14:35:50',
	},
	{
		id: 'TRG-20251109-005',
		link: '/shareddrive/random_forest/port_scan/TRG-20251109-005',
		timestamp: '2025-11-09 14:40:15',
	},
	{
		id: 'TRG-20251109-006',
		link: '/shareddrive/random_forest/malware_traffic/TRG-20251109-006',
		timestamp: '2025-11-09 14:45:33',
	},
	{
		id: 'TRG-20251109-007',
		link: '/shareddrive/random_forest/ddos_alarm/TRG-20251109-007',
		timestamp: '2025-11-09 14:50:01',
	},
	{
		id: 'TRG-20251109-008',
		link: '/shareddrive/random_forest/port_scan/TRG-20251109-008',
		timestamp: '2025-11-09 14:55:20',
	},
	{
		id: 'TRG-20251109-009',
		link: '/shareddrive/random_forest/sql_injection/TRG-20251109-009',
		timestamp: '2025-11-09 15:00:48',
	},
	{
		id: 'TRG-20251109-010',
		link: '/shareddrive/random_forest/malware_traffic/TRG-20251109-010',
		timestamp: '2025-11-09 15:05:10',
	},
];

export default function DataScientistPage() {
	// Model info state
	const [modelInfo, setModelInfo] = useState<any | null>(null);
	// Training result state
	const [trainingResult, setTrainingResult] = useState<any | null>(null);

	// State cho upload
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// State cho training progress
	const [trainingStatus, setTrainingStatus] = useState<{
		stage: string;
		percent: number;
	} | null>(null);
	const [isTraining, setIsTraining] = useState(false);

	// Hyperparameters
	const [numberOfTrees, setNumberOfTrees] = useState(100);
	const [maxDepth, setMaxDepth] = useState(10);
	const [minSamplesSplit, setMinSamplesSplit] = useState(2);
	const [minSamplesLeaf, setMinSamplesLeaf] = useState(1);
	const [maxFeatures, setMaxFeatures] = useState(20);

	// Fetch model info on mount
	useEffect(() => {
		const fetchModelInfo = async () => {
			try {
				const res = await fetch('http://localhost:8000/api/model/info');
				if (!res.ok) throw new Error('Failed to fetch model info');
				const data = await res.json();
				setModelInfo(data);
			} catch (err) {
				setModelInfo(null);
			}
		};
		fetchModelInfo();
	}, []);

	// Hàm xử lý upload
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUploadError(null);
		setUploadSuccess(false);
		const file = e.target.files?.[0];
		if (!file) return;
		if (!file.name.endsWith('.csv')) {
			setUploadError('Chỉ chấp nhận file .csv');
			return;
		}
		if (file.size > 50 * 1024 * 1024) {
			setUploadError('Dung lượng file vượt quá 50MB');
			return;
		}
		setUploadedFile(file);
		setUploadSuccess(true);
	};

	// Hàm xử lý training
	const handleStartTraining = async () => {
		setUploadError(null);
		setTrainingResult(null);
		if (!uploadedFile) {
			setUploadError('Please upload a CSV dataset before training.');
			return;
		}
		setIsTraining(true);
		setTrainingStatus({ stage: 'Uploading dataset...', percent: 5 });
		try {
			const formData = new FormData();
			formData.append('data_file', uploadedFile);
			formData.append('n_trees', numberOfTrees.toString());
			formData.append('max_depth', maxDepth.toString());
			formData.append('min_samples_split', minSamplesSplit.toString());
			formData.append('min_samples_leaf', minSamplesLeaf.toString());
			formData.append('max_features', maxFeatures.toString());

			setTrainingStatus({ stage: 'Training in progress...', percent: 20 });
			const res = await fetch('http://localhost:8000/api/model/train', {
				method: 'POST',
				body: formData,
			});
			if (!res.ok) {
				throw new Error('Retraining failed.');
			}
			setTrainingStatus({ stage: 'Finalizing...', percent: 90 });
			const data = await res.json();
			setTrainingResult(data.data);
			setTrainingStatus({ stage: 'Hoàn thành', percent: 100 });
			// Refresh model info
			const infoRes = await fetch('http://localhost:8000/api/model/info');
			if (infoRes.ok) {
				const infoData = await infoRes.json();
				setModelInfo(infoData.data);
			}
		} catch (err: any) {
			setUploadError(err.message || 'Retraining failed.');
		} finally {
			setIsTraining(false);
			setTimeout(() => setTrainingStatus(null), 1500);
		}
	};

	// Hàm reset
	const handleReset = () => {
		setTrainingStatus(null);
		setIsTraining(false);
		setUploadedFile(null);
		setUploadError(null);
		setUploadSuccess(false);
		setTrainingResult(null);
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	// Hàm tải model
	const handleDownloadModel = async () => {
		try {
			const res = await fetch('http://localhost:8000/api/model/download-model', {
				method: 'GET',
			});
			if (!res.ok) throw new Error('Failed to download model');
			const blob = await res.blob();
			// Lấy tên file từ header nếu có, nếu không thì đặt mặc định
			let filename = 'rf_model_retrain.pkl';
			const disposition = res.headers.get('Content-Disposition');
			if (disposition && disposition.indexOf('filename=') !== -1) {
				const match = disposition.match(/filename="?([^";]+)"?/);
				if (match && match[1]) filename = match[1];
			}
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			setTimeout(() => {
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			}, 100);
		} catch (err) {
			alert('Download failed.');
		}
	};

	return (
		<div className="space-y-6">
			{/* Model Status Banner */}
			<Card className="bg-linear-to-r from-purple-900/30 to-blue-900/90 border-purple-500">
				<CardContent className="pt-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="bg-purple-500 p-3 rounded-lg">
								<Brain className="w-6 h-6 text-white" />
							</div>
							<div>
								<h3 className="text-black">
									Random Forest Model Overview
								</h3>
								<p className="text-slate-800 text-sm">
									{modelInfo
										? `Last trained: 10/12/2025 • 150 trees • Max depth: 2`
										: 'Fetching model info...'}
								</p>
							</div>
						</div>
						<Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
							<CheckCircle2 className="w-4 h-4 mr-2" />
							Production Ready
						</Badge>
					</div>
				</CardContent>
			</Card>

			{/* Performance Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				{performanceMetrics.map((metric, index) => (
					<Card key={index} className="bg-slate-900 border-slate-800">
						<CardHeader className="pb-3">
							<CardTitle className="text-sm text-slate-400">
								{metric.metric}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl text-white">{metric.value}%</div>
							<div className="mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
								<div
									className="h-full rounded-full transition-all"
									style={{
										width: `${metric.value}%`,
										backgroundColor: metric.color,
									}}
								/>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* ROC Curve and Training History */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* ROC Curve */}
				<Card className="bg-slate-900 border-slate-800">
					<CardHeader>
						<CardTitle className="text-white">ROC Curve</CardTitle>
						<p className="text-slate-400 text-sm">AUC = 0.967</p>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={rocCurveData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
								<XAxis
									dataKey="fpr"
									stroke="#64748b"
									label={{
										value: 'False Positive Rate',
										position: 'insideBottom',
										offset: -5,
										fill: '#94a3b8',
									}}
								/>
								<YAxis
									stroke="#64748b"
									label={{
										value: 'True Positive Rate',
										angle: -90,
										position: 'insideLeft',
										fill: '#94a3b8',
									}}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: '#1e293b',
										border: '1px solid #334155',
										borderRadius: '8px',
									}}
									labelStyle={{ color: '#e2e8f0' }}
								/>
								<Line
									type="monotone"
									dataKey="tpr"
									stroke="#8b5cf6"
									strokeWidth={3}
									dot={false}
								/>
								<Line
									type="monotone"
									data={[
										{ fpr: 0, tpr: 0 },
										{ fpr: 1, tpr: 1 },
									]}
									stroke="#64748b"
									strokeDasharray="5 5"
									dot={false}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Training History */}
				<Card className="bg-slate-900 border-slate-800">
					<CardHeader>
						<CardTitle className="text-white">Training History</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart
								data={trainingHistory}
								margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
							>
								<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
								<XAxis
									dataKey="version"
									stroke="#64748b"
									style={{ fontSize: '12px' }}
								/>
								<YAxis
									stroke="#64748b"
									style={{ fontSize: '12px' }}
									domain={[80, 100]} // Zoom vào khoảng 80-100% để dễ thấy sự thay đổi
									tickFormatter={(value) => `${value}%`}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: '#1e293b',
										border: '1px solid #334155',
										borderRadius: '8px',
										fontSize: '12px',
									}}
									labelStyle={{ color: '#e2e8f0' }}
									formatter={(value: number, name: string) => [
										`${value.toFixed(2)}%`,
										name === 'trainAccuracy'
											? 'Train Accuracy'
											: 'Test Accuracy',
									]}
								/>
								<Legend wrapperStyle={{ fontSize: '12px' }} />
								{/* Đường cho Train Accuracy */}
								<Line
									type="monotone"
									dataKey="trainAccuracy"
									stroke="#10b981" // Green
									strokeWidth={3}
									name="Train Accuracy"
									activeDot={{ r: 8 }}
								/>
								{/* Đường cho Test Accuracy */}
								<Line
									type="monotone"
									dataKey="testAccuracy"
									stroke="#06b6d4" // Cyan
									strokeWidth={3}
									name="Test Accuracy"
									activeDot={{ r: 8 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
			{/* Validation Alarm Section */}
			<Card className="bg-slate-900 border-slate-800">
				<CardHeader>
					<CardTitle className="text-white">Validation</CardTitle>
					<p className="text-slate-400 text-sm">
						List of recent validation alarms generated by the model
					</p>
				</CardHeader>
				<CardContent>
					<div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
						<ul className="space-y-2">
							{validationAlarms.map((alarm, idx) => (
								<li key={alarm.id} className="flex items-center gap-2 text-sm">
									<span className="font-semibold text-blue-400">
										{idx + 1}.
									</span>
									<span className="font-mono text-slate-300">{alarm.id}</span>
									<a
										href={alarm.link}
										target="_blank"
										rel="noopener noreferrer"
										className="text-green-400 underline hover:text-green-300"
									>
										{alarm.link}
									</a>
								</li>
							))}
						</ul>
					</div>
					<div className="mt-4">
						<Button
							variant="outline"
							className="border-slate-800  hover:bg-amber-50 hover:cursor-pointer"
						>
							Generate Validation Report
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Model Retraining Interface */}
			<Card className="bg-slate-900 border-slate-800">
				<CardHeader>
					<CardTitle className="text-white">Model Retraining</CardTitle>
					<p className="text-slate-400 text-sm">
						Upload new dataset and configure hyperparameters
					</p>
				</CardHeader>
				<CardContent>
					{/* Thanh trạng thái training */}
					{trainingStatus && (
						<div className="mb-4 gap-1 bg-slate-800 p-4 rounded-lg">
							<Alert className="mb-2 flex items-center justify-between">
								<span className="font-semibold text-base text-blue-700">
									{trainingStatus.stage}
								</span>
								<span className="font-semibold text-base text-green-400 text-right">
									{trainingStatus.percent}%
								</span>
							</Alert>
							<Progress value={trainingStatus.percent} max={100} />
						</div>
					)}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Upload Section */}
						<div className="space-y-4">
							<div>
								<Label className="text-slate-300">Training Dataset</Label>
								<div className="mt-2 border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
									<Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
									<input
										ref={fileInputRef}
										type="file"
										accept=".csv"
										style={{ display: 'none' }}
										onChange={handleFileChange}
									/>
									<Button
										variant="outline"
										className="mt-2"
										onClick={() => fileInputRef.current?.click()}
									>
										Choose File
									</Button>
									<p className="text-slate-400 text-sm mt-2">
										Only .csv files are accepted, up to 50MB.
									</p>
									{uploadedFile && (
										<div className="text-green-400 text-xs mt-2">
											Selected: {uploadedFile.name}
										</div>
									)}
									{uploadError && (
										<div className="text-red-400 text-xs mt-2">
											{uploadError}
										</div>
									)}
									{uploadSuccess && (
										<div className="text-green-400 text-xs mt-2">
											Upload successful!
										</div>
									)}
								</div>
							</div>
							<div className="bg-slate-800 rounded-lg p-4">
								<div className="text-slate-300 text-sm mb-2">
									Current Dataset
								</div>
								<div className="text-white">
									{uploadedFile
										? uploadedFile.name
										: 'ddos_training_data_v2.csv'}
								</div>
								<div className="text-slate-400 text-xs mt-1">
									Size:{' '}
									{uploadedFile
										? `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`
										: '3.5 MB'}
									
								</div>
							</div>
						</div>

						{/* Hyperparameters */}
						<div className="space-y-2">
							<div>
								<Label className="text-slate-300">Number of Trees</Label>
								<div className="flex items-center gap-4 mt-2">
									<Input
										type="number"
										value={numberOfTrees}
										className="w-20 bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-lg px-3 py-2 transition-colors"
										onChange={(e) => setNumberOfTrees(Number(e.target.value))}
									/>
									<p className="text-slate-400 text-sm px-3 py-2 italic">
										Recommended value: 100 - 500
									</p>
								</div>
							</div>
							<Label className="text-slate-300">Max Depth</Label>
							<div className="flex items-center gap-4 mt-2">
								<Input
									type="number"
									value={maxDepth}
									className="w-20 bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-lg px-3 py-2 transition-colors"
									onChange={(e) => setMaxDepth(Number(e.target.value))}
								/>
								<p className="text-slate-400 text-sm px-3 py-2  italic">
									Recommended value: 10 - 50
								</p>
							</div>
							<div></div>
							<div>
								<Label className="text-slate-300">Min Samples Split</Label>
								<div className="flex items-center gap-4 mt-2">
									<Input
										type="number"
										value={minSamplesSplit}
										className="w-20 bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-lg px-3 py-2 transition-colors"
										onChange={(e) => setMinSamplesSplit(Number(e.target.value))}
									/>
									<p className="text-slate-400 text-sm px-3 py-2 italic">
										Recommended value: 2 - 10
									</p>
								</div>
							</div>
							<div>
								<Label className="text-slate-300">Min Samples Leaf</Label>
								<div className="flex items-center gap-4 mt-2">
									<Input
										type="number"
										value={minSamplesLeaf}
										className="w-20 bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-lg px-3 py-2 transition-colors"
										onChange={(e) => setMinSamplesLeaf(Number(e.target.value))}
									/>
								<p className="text-slate-400 text-sm px-3 py-2 italic">
									Recommended value: 1 - 5
								</p>
								</div>
							</div>
							<div>
								<Label className="text-slate-300">Max Features</Label>
								<div className="flex items-center gap-4 mt-2">
									<Input
										type="number"
										value={maxFeatures}
										className="w-20 bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-lg px-3 py-2 transition-colors"
										onChange={(e) => setMaxFeatures(Number(e.target.value))}
									/>
									<p className="text-slate-400 text-sm px-3 py-2 italic">
										Recommended value: 1 - 23
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="flex gap-3 mt-6">
						<Button
							className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
							disabled={isTraining}
							onClick={handleStartTraining}
						>
							<Play className="w-4 h-4 mr-2" />
							Start Training
						</Button>
						<Button
							variant="outline"
							className="border-slate-800 hover:bg-amber-50"
							onClick={handleReset}
						>
							<RotateCcw className="w-4 h-4 mr-2" />
							Reset to Default
						</Button>
						<Button
							variant="outline"
							className="border-slate-800 hover:bg-green-50"
							onClick={handleDownloadModel}
							disabled={isTraining}
						>
							<Download className="w-4 h-4 mr-2" />
							Download Model
						</Button>
					</div>
				</CardContent>
			</Card>
			{/* Feature Importance */}
			<Card className="bg-slate-900 border-slate-800">
				<CardHeader>
					<CardTitle className="text-white flex items-center gap-2">
						<TrendingUp className="w-5 h-5" />
						Feature Importance
					</CardTitle>
					<p className="text-slate-400 text-sm">
						Top features contributing to model predictions
					</p>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						{trainingResult ? 
						<BarChart
							data={
								(trainingResult && trainingResult.feature_importances) ||
								(modelInfo && modelInfo.feature_importances) ||
								[]
							}
							layout="vertical"
						>
							<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
							<XAxis type="number" stroke="#64748b" />
							<YAxis
								dataKey="feature"
								type="category"
								stroke="#64748b"
								fontSize={12}
								width={200}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: '#1e293b',
									border: '1px solid #334155',
									borderRadius: '8px',
								}}
								labelStyle={{ color: '#e2e8f0' }}
								formatter={(value: number) => value.toFixed(3)}
							/>
							<Bar dataKey="importance" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
						</BarChart>
						: <p className="text-slate-400 text-sm w-100">No Data...</p>
						}
					</ResponsiveContainer>
				</CardContent>
			</Card>

			

			{/* Kết quả chỉ hiển thị khi training xong */}
			{trainingResult && (
				<div className="mb-4 ">
					{/* Khuyến nghị RE-TRAIN MODEL nếu chất lượng thấp */}
					{trainingResult && trainingResult.f1_score < 0.80 && (
						<Alert className="mb-2 bg-orange-500/10 border-orange-500 text-orange-700 font-semibold flex items-center whitespace-nowrap">
							<span className="mr-2">RETRAIN MODEL (recommended):</span>
							<span>
								F1-Score is below acceptable threshold (currently {(trainingResult.f1_score * 100).toFixed(2)}%). Consider retraining with different hyperparameters or more data.
							</span>
						</Alert>
					)}
					{/* Thông số mô hình */}
					<Card className="bg-slate-900 border-slate-800">
						<CardHeader>
							<CardTitle className="text-white">Training Result</CardTitle>
							<p className="text-slate-400 text-sm">
								Model performance and parameters after retraining
							</p>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="space-y-2">
									<div className="text-slate-400 text-xs">Training Time</div>
									<div className="text-lg text-white font-semibold">{trainingResult.training_time_seconds.toFixed(4) || '--'}s</div>
								</div>
								<div className="space-y-2">
									<div className="text-slate-400 text-xs">F1-score</div>
									<div className="text-lg text-white font-semibold">{(trainingResult.f1_score * 100).toFixed(2) ?? '--'}</div>
								</div>
								<div className="space-y-2">
									<div className="text-slate-400 text-xs">OOB Score</div>
									<div className="text-lg text-white font-semibold">{(trainingResult.oob_score * 100).toFixed(2) ?? '--'}</div>
								</div>
								<div className="space-y-2">
									<div className="text-slate-400 text-xs">Precision</div>
									<div className="text-lg text-white font-semibold">{(trainingResult.precision * 100).toFixed(2) ?? '--'}</div>
								</div>
								<div className="space-y-2">
									<div className="text-slate-400 text-xs">Train Accuracy</div>
									<div className="text-lg text-white font-semibold">{trainingResult.train_accuracy.toFixed(4) ?? '--'}</div>
								</div>
								<div className="space-y-2">
									<div className="text-slate-400 text-xs">Test Accuracy</div>
									<div className="text-lg text-white font-semibold">{trainingResult.test_accuracy.toFixed(4) ?? '--'}</div>
								</div>
								<div className="space-y-2">
									<div className="text-slate-400 text-xs">Recall</div>
									<div className="text-lg text-white font-semibold">{(trainingResult.recall * 100).toFixed(2) ?? '--'}</div>
								</div>
								<div className="space-y-2">
									<div className="text-slate-400 text-xs">Number of Trees</div>
									<div className="text-lg text-white font-semibold">{trainingResult.n_trees ?? '--'}</div>
								</div>
								<div className="space-y-2">
									<div className="text-slate-400 text-xs">Max Depth</div>
									<div className="text-lg text-white font-semibold">{trainingResult.max_depth ?? '--'}</div>
								</div>
								<div className="space-y-2">
									<div className="text-slate-400 text-xs">Number of Samples</div>
									<div className="text-lg text-white font-semibold">{trainingResult.n_samples ?? '--'}</div>
								</div>
							</div>
						</CardContent>
					</Card>
					{/* Confusion Matrix */}
					{trainingResult.confusion_matrix && (
						<Card className="bg-slate-900 border-slate-800">
							<CardHeader>
								<CardTitle className="text-white">Confusion Matrix</CardTitle>
								<p className="text-slate-400 text-sm">
									Model predictions vs actual labels
								</p>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
									<div></div>
									<div className="text-center text-slate-400 text-sm">Predicted Normal</div>
									<div className="text-center text-slate-400 text-sm">Predicted Attack</div>
									<div className="text-slate-400 text-sm flex items-center">Actual Normal</div>
									<div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-6 text-center">
										<div className="text-2xl text-green-400">{trainingResult.confusion_matrix[0][0]}</div>
										<div className="text-xs text-green-300 mt-1">True Negative</div>
									</div>
									<div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-6 text-center">
										<div className="text-2xl text-orange-400">{trainingResult.confusion_matrix[0][1]}</div>
										<div className="text-xs text-orange-300 mt-1">False Positive</div>
									</div>
									<div className="text-slate-400 text-sm flex items-center">Actual Attack</div>
									<div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-6 text-center">
										<div className="text-2xl text-orange-400">{trainingResult.confusion_matrix[1][0]}</div>
										<div className="text-xs text-orange-300 mt-1">False Negative</div>
									</div>
									<div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-6 text-center">
										<div className="text-2xl text-green-400">{trainingResult.confusion_matrix[1][1]}</div>
										<div className="text-xs text-green-300 mt-1">True Positive</div>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			)}
		</div>
	);
}
