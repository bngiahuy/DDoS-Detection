import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';
import React from 'react';

export function NotFoundPage({ goHome }: { goHome?: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-slate-900 to-blue-900">
			<Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-xl">
				<CardHeader className="flex flex-col items-center">
					<AlertTriangle className="w-12 h-12 text-orange-400 mb-2" />
					<CardTitle className="text-3xl text-white font-bold">
						404 Not Found
					</CardTitle>
				</CardHeader>
				<CardContent className="text-center">
					<p className="text-slate-400 mb-6 text-lg">
						Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
					</p>
					<Button
						className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
						onClick={goHome}
					>
						Quay về trang chủ
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
