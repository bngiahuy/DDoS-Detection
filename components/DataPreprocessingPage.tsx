import React from 'react';
import { Card, CardHeader, CardDescription, CardAction } from './ui/card';
import { Button } from './ui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from './ui/table';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, Zap } from 'lucide-react'; // Thêm icon Zap (Pipeline)

// Mock data for pipelines
const pipelines = [
    {
        id: 1,
        name: 'My Preprocessing Pipeline 1',
        methods: 3,
        created: '2025-10-01 17:00:00',
        updated: '2025-10-10 12:00:00',
    },
    {
        id: 2,
        name: 'My Preprocessing Pipeline 2',
        methods: 2,
        created: '2025-09-15 10:00:00',
        updated: '2025-10-09 14:00:00',
    },
    {
        id: 3,
        name: 'My Preprocessing Pipeline 3',
        methods: 4,
        created: '2025-08-20 09:00:00',
        updated: '2025-09-01 11:00:00',
    },
    {
        id: 4,
        name: 'My Preprocessing Pipeline 4',
        methods: 2,
        created: '2025-07-30 09:00:00',
        updated: '2025-08-15 16:00:00',
    },
    {
        id: 5,
        name: 'My Preprocessing Pipeline 5',
        methods: 3,
        created: '2025-06-10 09:00:00',
        updated: '2025-07-01 10:00:00',
    },
];

export default function DataPreprocessingPage() {
    const navigate = useNavigate();

    const redirectToCreatePreprocessing = () => {
        navigate('/create-preprocessing');
    };

    return (
        <div className="bg-slate-950 min-h-screen p-8">
            <Card className="w-full max-w-6xl mx-auto bg-slate-900 border-t-4 border-purple-500 rounded-xl shadow-2xl text-slate-100 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between p-6 sm:p-8 border-b border-slate-700/50">
                    <div>
                        <h1 className="text-4xl font-extrabold text-purple-400 flex items-center space-x-2">
                            <Zap className="w-8 h-8 text-amber-400" />
                            <span>Preprocess Pipelines</span>
                        </h1>
                        <CardDescription className="mt-2 text-slate-400 text-lg">
                            Manage and create data preprocessing pipelines for your datasets.
                        </CardDescription>
                    </div>
                    <CardAction>
                        <Button
                            onClick={redirectToCreatePreprocessing}
                            variant="default"
                            size="lg"
                            className="bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 transition duration-200 shadow-lg hover:shadow-amber-500/50"
                        >
                            ➕ Create New Pipeline
                        </Button>
                    </CardAction>
                </CardHeader>
                
                {/* Pipelines Table */}
                <div className="p-0 overflow-x-auto">
                    <Table className="w-full text-left table-auto border-collapse">
                        <TableHeader>
                            <TableRow className="bg-slate-800 border-b border-slate-700">
                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 w-16">
                                    ID
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Name
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 w-28">
                                    Methods
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 hidden lg:table-cell">
                                    Created At
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 hidden sm:table-cell">
                                    Last Updated
                                </th>
                                <th className="text-center px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 w-32">
                                    Actions
                                </th>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pipelines.map((p, index) => (
                                <TableRow
                                    key={p.id}
                                    // Hiệu ứng hover cho hàng, và phân biệt hàng chẵn/lẻ nhẹ nhàng
                                    className={`border-b border-slate-800 transition duration-150 hover:bg-slate-700/30 ${
                                        index % 2 === 1 ? 'bg-slate-800/50' : ''
                                    }`}
                                >
                                    <TableCell className="px-6 py-4 font-mono text-slate-400">
                                        #{p.id}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 font-medium text-purple-300">
                                        {p.name}
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-800/50 text-amber-300 border border-amber-600">
                                            {p.methods} Steps
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-slate-400 hidden lg:table-cell">
                                        {p.created.split(' ')[0]}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-slate-400 hidden sm:table-cell">
                                        {p.updated.split(' ')[0]}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-center space-x-2">
                                        <button
                                            className="p-2 rounded-full text-purple-400 hover:bg-purple-700/50 transition duration-150"
                                            title="View Details"
                                            // TODO: Thêm logic điều hướng/hiển thị modal
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2 rounded-full text-amber-400 hover:bg-amber-700/50 transition duration-150"
                                            title="Edit Pipeline"
                                            // TODO: Thêm logic điều hướng/hiển thị form chỉnh sửa
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2 rounded-full text-red-500 hover:bg-red-700/50 transition duration-150"
                                            title="Delete Pipeline"
                                            // TODO: Thêm logic xử lý xóa
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}