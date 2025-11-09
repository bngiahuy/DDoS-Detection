import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert } from './ui/alert';
import { Progress } from './ui/progress';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import {
	Brain,
	TrendingUp,
	Upload,
	Play,
	RotateCcw,
	CheckCircle2,
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

// Mock data
const performanceMetrics = [
	{ metric: 'Accuracy', value: 94.2, color: '#10b981' },
	{ metric: 'Precision', value: 92.8, color: '#06b6d4' },
	{ metric: 'Recall', value: 96.1, color: '#8b5cf6' },
	{ metric: 'F1-Score', value: 94.4, color: '#f59e0b' },
];

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

const featureImportance = [
	{ feature: 'Packet Rate', importance: 0.284 },
	{ feature: 'Bytes per Packet', importance: 0.198 },
	{ feature: 'Connection Duration', importance: 0.165 },
	{ feature: 'Protocol Type', importance: 0.142 },
	{ feature: 'Unique IPs', importance: 0.098 },
	{ feature: 'Port Distribution', importance: 0.067 },
	{ feature: 'Time of Day', importance: 0.046 },
];

const trainingHistory = [
	{ epoch: 1, train_acc: 0.76, val_acc: 0.74, loss: 0.52 },
	{ epoch: 2, train_acc: 0.83, val_acc: 0.81, loss: 0.38 },
	{ epoch: 3, train_acc: 0.88, val_acc: 0.86, loss: 0.28 },
	{ epoch: 4, train_acc: 0.91, val_acc: 0.89, loss: 0.21 },
	{ epoch: 5, train_acc: 0.93, val_acc: 0.91, loss: 0.17 },
	{ epoch: 6, train_acc: 0.94, val_acc: 0.92, loss: 0.14 },
	{ epoch: 7, train_acc: 0.95, val_acc: 0.94, loss: 0.12 },
];

const preprocessingSteps = [
	{ step: 'Data Ingestion', status: 'completed', time: '2.3s' },
	{ step: 'Missing Value Handling', status: 'completed', time: '1.1s' },
	{ step: 'Feature Scaling', status: 'completed', time: '3.7s' },
	{ step: 'Encoding Categorical', status: 'completed', time: '1.9s' },
	{ step: 'Feature Selection', status: 'completed', time: '4.2s' },
	{ step: 'Train-Test Split', status: 'completed', time: '0.8s' },
];

import React, { useRef, useState } from 'react';

export function DataScientistPage() {
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
		if (file.size > 20 * 1024 * 1024) {
			setUploadError('Dung lượng file vượt quá 20MB');
			return;
		}
		setUploadedFile(file);
		setUploadSuccess(true);
	};

	// Hàm xử lý training
	const handleStartTraining = async () => {
		setIsTraining(true);
		setTrainingStatus({ stage: 'Khởi tạo mô hình', percent: 0 });
		await new Promise((res) => setTimeout(res, 1000));
		setTrainingStatus({ stage: 'Tiền xử lý dữ liệu', percent: 20 });
		await new Promise((res) => setTimeout(res, 1000));
		setTrainingStatus({ stage: 'Training', percent: 50 });
		// Tăng từ 50% đến 90% trong 5 giây
		for (let p = 55; p <= 90; p += 7) {
			await new Promise((res) => setTimeout(res, 1000));
			setTrainingStatus({ stage: 'Training', percent: p });
		}
		setTrainingStatus({ stage: 'Hoàn thành', percent: 100 });
		await new Promise((res) => setTimeout(res, 1000));
		setIsTraining(false);
	};

	// Hàm reset
	const handleReset = () => {
		setTrainingStatus(null);
		setIsTraining(false);
		setUploadedFile(null);
		setUploadError(null);
		setUploadSuccess(false);
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	return (
		<div className="space-y-6">
			{/* Model Status Banner */}
			<Card className="bg-linear-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
				<CardContent className="pt-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="bg-purple-500 p-3 rounded-lg">
								<Brain className="w-6 h-6 text-white" />
							</div>
							<div>
								<h3 className="text-white">Random Forest Model v2.4.1</h3>
								<p className="text-slate-300 text-sm">
									Last trained: Oct 31, 2025 09:23 AM • 500 trees • Max depth:
									15
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
							<LineChart data={trainingHistory}>
								<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
								<XAxis
									dataKey="epoch"
									stroke="#64748b"
									label={{
										value: 'Epoch',
										position: 'insideBottom',
										offset: -5,
										fill: '#94a3b8',
									}}
								/>
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
									dataKey="train_acc"
									stroke="#10b981"
									strokeWidth={2}
									name="Train Accuracy"
								/>
								<Line
									type="monotone"
									dataKey="val_acc"
									stroke="#06b6d4"
									strokeWidth={2}
									name="Val Accuracy"
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

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
						<BarChart data={featureImportance} layout="vertical">
							<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
							<XAxis type="number" stroke="#64748b" />
							<YAxis
								dataKey="feature"
								type="category"
								stroke="#64748b"
								width={150}
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
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Data Preprocessing Workflow */}
			<Card className="bg-slate-900 border-slate-800">
				<CardHeader>
					<CardTitle className="text-white">
						Data Preprocessing Pipeline
					</CardTitle>
					<p className="text-slate-400 text-sm">Total processing time: 14.0s</p>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{preprocessingSteps.map((step, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
							>
								<div className="flex items-center gap-3">
									<div className="bg-green-500 rounded-full p-1">
										<CheckCircle2 className="w-4 h-4 text-white" />
									</div>
									<div>
										<div className="text-white">{step.step}</div>
										<div className="text-slate-400 text-sm">
											Completed in {step.time}
										</div>
									</div>
								</div>
								<Badge className="bg-green-500/10 text-green-400 border-green-500/20">
									Success
								</Badge>
							</div>
						))}
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
										Chọn file CSV
									</Button>
									<p className="text-slate-400 text-sm mt-2">
										Chỉ nhận file .csv, tối đa 20MB
									</p>
									{uploadedFile && (
										<div className="text-green-400 text-xs mt-2">
											Đã chọn: {uploadedFile.name}
										</div>
									)}
									{uploadError && (
										<div className="text-red-400 text-xs mt-2">
											{uploadError}
										</div>
									)}
									{uploadSuccess && (
										<div className="text-green-400 text-xs mt-2">
											Upload thành công!
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
									1,245,890 samples • 23 features • Updated Oct 30
								</div>
							</div>
						</div>

						{/* Hyperparameters */}
						<div className="space-y-4">
							<div>
								<Label className="text-slate-300">Number of Trees</Label>
								<div className="flex items-center gap-4 mt-2">
									<Slider
										defaultValue={[500]}
										max={1000}
										step={50}
										className="flex-1"
									/>
									<Input
										type="number"
										value="500"
										className="w-20 bg-slate-800 border-slate-700 text-white"
									/>
								</div>
							</div>
							<div>
								<Label className="text-slate-300">Max Depth</Label>
								<div className="flex items-center gap-4 mt-2">
									<Slider
										defaultValue={[15]}
										max={30}
										step={1}
										className="flex-1"
									/>
									<Input
										type="number"
										value="15"
										className="w-20 bg-slate-800 border-slate-700 text-white"
									/>
								</div>
							</div>
							<div>
								<Label className="text-slate-300">Min Samples Split</Label>
								<div className="flex items-center gap-4 mt-2">
									<Slider
										defaultValue={[2]}
										max={20}
										step={1}
										className="flex-1"
									/>
									<Input
										type="number"
										value="2"
										className="w-20 bg-slate-800 border-slate-700 text-white"
									/>
								</div>
							</div>
							<div>
								<Label className="text-slate-300">Learning Rate</Label>
								<div className="flex items-center gap-4 mt-2">
									<Slider
										defaultValue={[1]}
										max={10}
										step={1}
										className="flex-1"
									/>
									<Input
										type="number"
										value="0.1"
										className="w-20 bg-slate-800 border-slate-700 text-white"
									/>
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
							className="border-slate-700 text-slate-300 hover:bg-slate-800"
							onClick={handleReset}
						>
							<RotateCcw className="w-4 h-4 mr-2" />
							Reset to Default
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Confusion Matrix */}
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
						<div className="text-center text-slate-400 text-sm">
							Predicted Normal
						</div>
						<div className="text-center text-slate-400 text-sm">
							Predicted Attack
						</div>

						<div className="text-slate-400 text-sm flex items-center">
							Actual Normal
						</div>
						<div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-6 text-center">
							<div className="text-2xl text-green-400">8,234</div>
							<div className="text-xs text-green-300 mt-1">True Negative</div>
						</div>
						<div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-6 text-center">
							<div className="text-2xl text-orange-400">156</div>
							<div className="text-xs text-orange-300 mt-1">False Positive</div>
						</div>

						<div className="text-slate-400 text-sm flex items-center">
							Actual Attack
						</div>
						<div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-6 text-center">
							<div className="text-2xl text-orange-400">89</div>
							<div className="text-xs text-orange-300 mt-1">False Negative</div>
						</div>
						<div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-6 text-center">
							<div className="text-2xl text-green-400">2,341</div>
							<div className="text-xs text-green-300 mt-1">True Positive</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
