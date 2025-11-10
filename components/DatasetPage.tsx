import { Card, CardHeader, CardDescription, CardAction } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import React from 'react';
// Giả định các component Table, TableHeader, TableBody, TableRow, TableCell từ thư viện UI của bạn
import { Table, TableHeader, TableBody, TableRow, TableCell } from './ui/table';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export default function DatasetPage() {
    const navigate = useNavigate();

    const redirectToCreateDataset = () => {
        navigate('/create-dataset');
    };

    // Mock data
    const datasets = [
        {
            id: 1,
            name: 'Network Traffic 2025',
            type: 'Train set',
            version: '1.0',
            created: '2025-10-01 17:00:00',
            updated: '2025-10-10 12:00:00',
        },
        {
            id: 2,
            name: 'DDoS Samples',
            type: 'Test set',
            version: '1.1',
            created: '2025-09-15 10:00:00',
            updated: '2025-10-09 14:00:00',
        },
        {
            id: 3,
            name: 'IoT Botnet',
            type: 'Train set',
            version: '1.0',
            created: '2025-08-20 09:00:00',
            updated: '2025-09-01 11:00:00',
        },
        {
            id: 4,
            name: 'Web Attacks',
            type: 'Test set',
            version: '1.2',
            created: '2025-07-30 09:00:00',
            updated: '2025-08-15 16:00:00',
        },
        {
            id: 5,
            name: 'Cloud Traffic',
            type: 'Train set',
            version: '1.1',
            created: '2025-06-10 09:00:00',
            updated: '2025-07-01 10:00:00',
        },
        {
            id: 6,
            name: 'Enterprise Logs',
            type: 'Test set',
            version: '1.0',
            created: '2025-05-05 09:00:00',
            updated: '2025-06-01 10:00:00',
        },
        {
            id: 7,
            name: 'ISP Data',
            type: 'Train set',
            version: '1.3',
            created: '2025-04-20 09:00:00',
            updated: '2025-05-10 10:00:00',
        },
        {
            id: 8,
            name: 'Mobile Traffic',
            type: 'Test set',
            version: '1.2',
            created: '2025-03-15 09:00:00',
            updated: '2025-04-01 10:00:00',
        },
        {
            id: 9,
            name: 'Academic Dataset',
            type: 'Train set',
            version: '1.0',
            created: '2025-02-10 09:00:00',
            updated: '2025-03-01 10:00:00',
        },
        {
            id: 10,
            name: 'Synthetic DDoS',
            type: 'Test set',
            version: '1.1',
            created: '2025-01-05 09:00:00',
            updated: '2025-02-01 10:00:00',
        },
    ];

    // Hàm render badge cho Type (Train set / Test set)
    const renderTypeBadge = (type: string) => {
        const isTrain = type === 'Train set';
        return (
            <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium 
                ${isTrain 
                    ? 'bg-purple-800/50 text-purple-300 border border-purple-600' // Train set: Purple
                    : 'bg-amber-800/50 text-amber-300 border border-amber-600' // Test set: Amber
                }`}
            >
                {type}
            </span>
        );
    };

    return (
        <div className="bg-slate-950 min-h-screen p-8">
            <Card className="w-full max-w-6xl mx-auto bg-slate-900 border-t-4 border-purple-500 rounded-xl shadow-2xl text-slate-100 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between p-6 sm:p-8 border-b border-slate-700/50">
                    <div>
                        <h1 className="text-4xl font-extrabold text-purple-400">
                            Datasets 🚀
                        </h1>
                        <CardDescription className="mt-2 text-slate-400 text-lg">
                            Quản lý các tập dữ liệu và phiên bản.
                        </CardDescription>
                    </div>
                    <CardAction>
                        <Button
                            onClick={redirectToCreateDataset}
                            variant="default"
                            size="lg"
                            className="bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 transition duration-200 shadow-lg hover:shadow-amber-500/50"
                        >
                            ➕ Tạo Dataset Mới
                        </Button>
                    </CardAction>
                </CardHeader>
                {/* Dataset Table */}
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
                                    Type
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 w-24">
                                    Version
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
                            {datasets.map((ds, index) => (
                                <TableRow
                                    key={ds.id}
                                    // Hiệu ứng hover cho hàng, và phân biệt hàng chẵn/lẻ nhẹ nhàng
                                    className={`border-b border-slate-800 transition duration-150 hover:bg-slate-700/30 ${
                                        index % 2 === 1 ? 'bg-slate-800/50' : ''
                                    }`}
                                >
                                    <TableCell className="px-6 py-4 font-mono text-slate-400">
                                        #{ds.id}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 font-medium text-purple-300">
                                        {ds.name}
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        {renderTypeBadge(ds.type)}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-amber-300 font-semibold">
                                        {ds.version}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-slate-400 hidden lg:table-cell">
                                        {ds.created.split(' ')[0]}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-slate-400 hidden sm:table-cell">
                                        {ds.updated.split(' ')[0]}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-center space-x-2">
                                        <button
                                            className="p-2 rounded-full text-purple-400 hover:bg-purple-700/50 transition duration-150"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2 rounded-full text-amber-400 hover:bg-amber-700/50 transition duration-150"
                                            title="Edit Dataset"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2 rounded-full text-red-500 hover:bg-red-700/50 transition duration-150"
                                            title="Delete Dataset"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* Footer hoặc Pagination có thể thêm ở đây */}
            </Card>
        </div>
    );
}