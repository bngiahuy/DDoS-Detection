import { useState } from 'react';
import { Card, CardHeader, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input'; // Giả định component Input
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from './ui/select'; // Giả định component Select/Dropdown
import { Table, TableHeader, TableBody, TableRow, TableCell } from './ui/table';
import { ChevronLeft, ChevronRight, Zap, FolderOpen } from 'lucide-react';

// --- MOCK DATA ---
const existingPipelines = [
	{ id: 'ppl-001', name: 'Standard Cleaning V1' },
	{ id: 'ppl-002', name: 'DDoS Feature Engineering' },
	{ id: 'ppl-003', name: 'IoT Log Normalization' },
];

const mockDatasets = [
	{ id: 'ds-001', name: 'Network Traffic 2025', version: '1.0' },
	{ id: 'ds-002', name: 'DDoS Samples', version: '1.1' },
	{ id: 'ds-003', name: 'IoT Botnet', version: '1.0' },
];

const mockDatasetPreview = {
	headers: [
		'Packet ID',
		'Timestamp',
		'Source IP',
		'Destination IP',
		'Protocol',
		'Length',
		'Label',
	],
	data: [
		{
			id: 1,
			ts: '16:00:01',
			src: '192.168.1.10',
			dst: '10.0.0.1',
			proto: 'TCP',
			len: 64,
			label: 'Normal',
		},
		{
			id: 2,
			ts: '16:00:02',
			src: '192.168.1.11',
			dst: '10.0.0.2',
			proto: 'UDP',
			len: 128,
			label: 'Normal',
		},
		{
			id: 3,
			ts: '16:00:03',
			src: '203.0.113.5',
			dst: '10.0.0.3',
			proto: 'ICMP',
			len: 32,
			label: 'Attack',
		},
		{
			id: 4,
			ts: '16:00:03',
			src: '192.168.1.12',
			dst: '10.0.0.4',
			proto: 'TCP',
			len: 80,
			label: 'Normal',
		},
		{
			id: 5,
			ts: '16:00:03',
			src: '203.0.113.6',
			dst: '10.0.0.5',
			proto: 'UDP',
			len: 150,
			label: 'Attack',
		},
		{
			id: 6,
			ts: '16:00:03',
			src: '203.0.113.6',
			dst: '10.0.0.5',
			proto: 'UDP',
			len: 150,
			label: 'Attack',
		},
		{
			id: 7,
			ts: '16:00:03',
			src: '203.0.113.6',
			dst: '10.0.0.5',
			proto: 'UDP',
			len: 150,
			label: 'Attack',
		},
		{
			id: 8,
			ts: '16:00:03',
			src: '203.0.113.6',
			dst: '10.0.0.5',
			proto: 'UDP',
			len: 150,
			label: 'Attack',
		},
		{
			id: 9,
			ts: '16:00:03',
			src: '203.0.113.6',
			dst: '10.0.0.5',
			proto: 'UDP',
			len: 150,
			label: 'Attack',
		},
		{
			id: 10,
			ts: '16:00:03',
			src: '203.0.113.6',
			dst: '10.0.0.5',
			proto: 'UDP',
			len: 150,
			label: 'Attack',
		},
	],
	totalRecords: 1000000,
	pageSize: 10000,
};
// --- END MOCK DATA ---

export default function CreatePreprocessing() {
	const [pipelineName, setPipelineName] = useState('');
	const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
	const [sampleSize, setSampleSize] = useState(10000);
	const [currentPage, setCurrentPage] = useState(1);

	// Giả định có thể tính toán totalPages
	const totalPages = Math.ceil(
		mockDatasetPreview.totalRecords / mockDatasetPreview.pageSize
	);

	// Xử lý chuyển trang (chỉ là mock UI, không xử lý logic fetch data)
	const handlePageChange = (direction: string) => {
		if (direction === 'next' && currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		} else if (direction === 'prev' && currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	// Component hiển thị Dataset Preview (Bảng)
	const DatasetPreviewTable = () => (
		<div className="mt-4 p-4 border border-slate-700 rounded-lg bg-slate-800/50">
			<h3 className="text-xl font-semibold mb-3 text-purple-300 border-b border-slate-700/50 pb-2">
				Dataset Preview
			</h3>

			{!selectedDataset ? (
				<p className="text-slate-500 italic p-4 text-center">
					Vui lòng chọn Dataset Version để xem trước dữ liệu.
				</p>
			) : (
				<>
					{/* Bảng dữ liệu */}
					<div className="overflow-x-auto max-h-96">
						<Table className="w-full text-left table-auto border-collapse">
							<TableHeader className="sticky top-0 bg-slate-800/80 backdrop-blur-sm">
								<TableRow className="border-b border-purple-500/50">
									{mockDatasetPreview.headers.map((header, index) => (
										<th
											key={index}
											className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-amber-400"
										>
											{header}
										</th>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{mockDatasetPreview.data.map((row, index) => (
									<TableRow
										key={index}
										className={`border-b border-slate-700/50 transition duration-150 ${
											index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/70'
										} hover:bg-slate-700/50`}
									>
										{Object.values(row).map((value, idx) => (
											<TableCell
												key={idx}
												className={`px-4 py-2 text-sm ${
													idx === mockDatasetPreview.headers.length - 1 &&
													value === 'Attack'
														? 'text-red-400 font-medium'
														: 'text-slate-300'
												}`}
											>
												{value}
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{/* Pagination */}
					<div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700">
						<p className="text-sm text-slate-400">
							Showing {mockDatasetPreview.data.length} / {sampleSize} records.
							(Total: {mockDatasetPreview.totalRecords.toLocaleString()}{' '}
							records)
						</p>
						<div className="flex items-center space-x-2">
							<span className="text-sm text-slate-400">
								Page {currentPage} / {totalPages}
							</span>
							<Button
								onClick={() => handlePageChange('prev')}
								disabled={currentPage === 1}
								variant="outline"
								className="p-2 h-auto text-purple-400 hover:bg-purple-900/50 border-purple-600/50 disabled:opacity-50"
							>
								<ChevronLeft className="w-4 h-4" />
							</Button>
							<Button
								onClick={() => handlePageChange('next')}
								disabled={currentPage === totalPages}
								variant="outline"
								className="p-2 h-auto text-purple-400 hover:bg-purple-900/50 border-purple-600/50 disabled:opacity-50"
							>
								<ChevronRight className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</>
			)}
		</div>
	);

	return (
		<div className="bg-slate-950 min-h-screen p-8">
			<Card className="w-full max-w-7xl mx-auto bg-slate-900 border-t-4 border-purple-500 rounded-xl shadow-2xl text-slate-100 overflow-hidden">
				<CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 sm:p-8 border-b border-slate-700/50 space-y-4 md:space-y-0">
					{/* Tiêu đề & Description (Bên trái) */}
					<div>
						<h1 className="text-4xl font-extrabold text-purple-400 flex items-center space-x-3">
							<Zap className="w-8 h-8 text-amber-400" />
							<span>Create Preprocess</span>
						</h1>
						<CardDescription className="mt-2 text-slate-400 text-lg">
							Create preprocess pipeline to enrich your data.
						</CardDescription>
					</div>

					{/* Load Existing Pipeline (Bên phải) */}
					<div className="flex items-center space-x-3 w-full md:w-auto">
						<FolderOpen className="w-10 h-10 text-slate-500" />
						<label
							htmlFor="load-pipeline"
							className="text-slate-400 whitespace-nowrap"
						>
							Load existing pipeline:
						</label>
						<Select onValueChange={(value) => console.log('Loaded:', value)}>
							<SelectTrigger
								id="load-pipeline"
								className="bg-slate-800 border-slate-700 text-slate-300 hover:border-purple-500/50"
							>
								<SelectValue placeholder="Select a pipeline..." />
							</SelectTrigger>
							<SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
								{existingPipelines.map((p) => (
									<SelectItem key={p.id} value={p.id}>
										{p.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardHeader>

				<CardContent className="p-6 sm:p-8">
					{/* Nội dung chính: Chia 2 cột */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Cột Trái: Tên Pipeline & Dataset Preview */}
						<div className="lg:col-span-2 space-y-6">
							{/* Trường Name */}
							<div>
								<label
									htmlFor="pipeline-name"
									className="block text-sm font-medium text-slate-300 mb-2"
								>
									Pipeline Name
								</label>
								<Input
									id="pipeline-name"
									placeholder="e.g., Network Traffic Cleaning Pipeline V2"
									value={pipelineName}
									onChange={(e) => setPipelineName(e.target.value)}
									className="w-full bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-purple-500"
								/>
							</div>

							{/* Dataset Preview */}
							<DatasetPreviewTable />
						</div>

						{/* Cột Phải: Control & Preprocessing Method */}
						<div className="lg:col-span-1 space-y-6">
							<h2 className="text-2xl font-bold text-amber-400 border-b border-slate-700/50 pb-2">
								Control
							</h2>

							{/* Trường Dataset Version */}
							<div>
								<label
									htmlFor="dataset-version"
									className="block text-sm font-medium text-slate-300 mb-2"
								>
									Dataset Version
								</label>
								<Select
									onValueChange={(value: string) => setSelectedDataset(value)}
								>
									<SelectTrigger
										id="dataset-version"
										className="bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-500/50"
									>
										<SelectValue placeholder="Select a dataset..." />
									</SelectTrigger>
									<SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
										{mockDatasets.map((d) => (
											<SelectItem key={d.id} value={d.id}>
												{d.name} ({d.version})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Trường Sample Size */}
							<div>
								<label
									htmlFor="sample-size"
									className="block text-sm font-medium text-slate-300 mb-2"
								>
									Sample Size (for preview & processing)
								</label>
								<Input
									id="sample-size"
									type="number"
									defaultValue={10000}
									onChange={(e) => setSampleSize(parseInt(e.target.value))}
									className="w-full bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-purple-500"
								/>
								<p className="text-xs text-slate-500 mt-1">
									Max number of records to load/process.
								</p>
							</div>

							{/* Placeholder cho Preprocessing Method */}
							<div className="pt-4 border-t border-slate-700">
								<h2 className="text-2xl font-bold text-purple-400">
									Preprocessing Method
								</h2>
								<div className="p-4 mt-3 border border-purple-600/50 rounded-lg bg-slate-800/80 text-slate-400 italic">
									// TODO: Preprocessing method configuration goes here.
								</div>
							</div>

							{/* Nút Save/Submit */}
							<Button className="w-full bg-purple-600 hover:bg-purple-700 font-semibold text-white shadow-lg shadow-purple-500/50 transition duration-200">
								Save Pipeline
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
