import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from './ui/select';
import { Card, CardHeader, CardDescription } from './ui/card';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Table, TableHeader, TableBody, TableRow, TableCell } from './ui/table';

export default function CreateDataset() {
	const [name, setName] = useState('');
	const [subset, setSubset] = useState('Train set');
	// 'file' will be used for upload logic and backend integration
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState('');
	const [preview, setPreview] = useState<string[][]>([]);
	const [columns, setColumns] = useState<string[]>([]);
	const [availableColumns, setAvailableColumns] = useState<string[]>([]);
	// All columns selected by default
	const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState('');
	const navigate = useNavigate();

	// File upload handler
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setError('');
		const f = e.target.files?.[0];
		if (!f) return;
		if (f.type !== 'text/csv' && !f.name.endsWith('.csv')) {
			setError('Only .csv files are allowed.');
			return;
		}
		if (f.size > 20 * 1024 * 1024) {
			setError('File size must be less than 20MB.');
			return;
		}
		setFile(f);
		// Read and preview first 10 rows
		const reader = new FileReader();
		reader.onload = (ev) => {
			const text = ev.target?.result as string;
			const lines = text.split(/\r?\n/).filter(Boolean);
			const rows = lines.slice(0, 11).map((line) => line.split(','));
			setPreview(rows);
			if (rows.length > 0) {
				setColumns(rows[0]);
				setAvailableColumns(rows[0]);
				setSelectedColumns(rows[0]); // All selected by default
			}
		};
		reader.readAsText(f);
	};


	return (
		<Card className="bg-slate-950 min-h-[60vh] border-purple-800 p-0">
			<CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-purple-400">Create Dataset</h1>
					<CardDescription className="text-slate-300 mt-2">
						Fill in the details below to create a new dataset.
					</CardDescription>
				</div>
				<Button
					variant="outline"
					className="text-purple-600 border-purple-600 hover:bg-purple-50 hover:text-purple-900"
					onClick={() => navigate('/dataset')}
				>
					Back
				</Button>
			</CardHeader>
			<form className="space-y-4 p-8">
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-1">
						Name
					</label>
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Dataset name"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-1">
						Subset
					</label>
					<Select value={subset} onValueChange={setSubset}>
						<SelectTrigger>
							<SelectValue placeholder="Select subset" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Train set">Train set</SelectItem>
							<SelectItem value="Test set">Test set</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-1">
						Choose file to upload
					</label>
					<Input
						type="file"
						accept=".csv"
						onChange={handleFileChange}
						className=" border border-purple-700 bg-violet-200 rounded-md shadow-sm transition-colors cursor-pointer"
					/>
					{error && (
						<Alert variant="destructive" className="mt-2">
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
				</div>
				<div className="bg-slate-900 border border-purple-700 rounded-lg p-3 text-xs text-purple-300 mt-2">
					<strong>Note:</strong>
					<ul className="list-disc ml-5 mt-1">
						<li>The total size of files should be less than 20MB.</li>
						<li>The column names of all files must be the same.</li>
						<li>The column names of all files cannot be empty.</li>
						<li>The column names cannot prefix with underscore.</li>
					</ul>
				</div>
				{/* Preview table */}
				{preview.length > 1 && (
					<div className="mt-6">
						<h3 className="text-purple-400 font-semibold mb-2">
							Preview (first 10 rows)
						</h3>
						<Table>
							<TableHeader>
								<tr>
									{preview[0].map((col, idx) => (
										<th
											key={idx}
											className="px-2 py-1 text-left text-xs text-purple-300"
										>
											{col}
										</th>
									))}
								</tr>
							</TableHeader>
							<TableBody>
								{preview.slice(1).map((row, idx) => (
									<TableRow key={idx}>
										{row.map((cell, cidx) => (
											<TableCell
												key={cidx}
												className="px-2 py-1 text-xs text-slate-300"
											>
												{cell}
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
				{/* Column selection UI */}
				{columns.length > 0 && (
					<div className="mt-6">
						<h4 className="text-sm font-semibold text-purple-300 mb-2">
							Available columns/features
						</h4>
						<div className="bg-slate-900 border border-purple-700 rounded-lg p-2 min-h-[120px] flex flex-wrap gap-2">
							{availableColumns.map((col) => (
								<label
									key={col}
									className="flex items-center gap-2 text-xs text-slate-300 py-1 px-2 rounded cursor-pointer select-none"
								>
									<input
										type="checkbox"
										checked={selectedColumns.includes(col)}
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedColumns((prev) => [...prev, col]);
											} else {
												setSelectedColumns((prev) =>
													prev.filter((c) => c !== col)
												);
											}
										}}
										className="accent-purple-600"
									/>
									{col}
								</label>
							))}
						</div>
					</div>
				)}
				{/* Sort by dropdown */}
				{selectedColumns.length > 0 && (
					<div className="mt-4">
						<label className="block text-sm font-medium text-slate-300 mb-1">
							Sort by
						</label>
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger>
								<SelectValue placeholder="Select column" />
							</SelectTrigger>
							<SelectContent>
								{selectedColumns.map((col) => (
									<SelectItem key={col} value={col}>
										{col}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
				<div className="pt-6">
					<button
						type="button"
						className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all"
						onClick={async () => {
							alert('Dataset created successfully! (Demo only)');
							navigate('/dataset');
						}}
					>
						Create
					</button>
				</div>
			</form>
		</Card>
	);
}
