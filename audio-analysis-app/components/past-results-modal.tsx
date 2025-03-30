import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/table';

import axios from 'axios';

interface PastResult {
    id: number;
    created_at: string;
    score: number;
    feedback: string;
    model: string;
}

interface PastResultsModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string | null;
}

const PastResultsModal: React.FC<PastResultsModalProps> = ({ isOpen, onClose, token }) => {
    const [results, setResults] = useState<PastResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && token) {
            fetchPastResults();
        }
    }, [isOpen, token]);

    const fetchPastResults = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:8000/api/past-results/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setResults(response.data.results);
        } catch (err) {
            setError('Failed to fetch past results');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score <= 50) {
            const redComponent = 255;
            const greenComponent = Math.floor((score / 50) * 255);
            return `rgb(${redComponent}, ${greenComponent}, 0)`;
        } else {
            const redComponent = Math.floor(255 - ((score - 50) / 50) * 255);
            const greenComponent = 255;
            return `rgb(${redComponent}, ${greenComponent}, 0)`;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[1200px]">
                <DialogHeader>
                    <DialogTitle>Past Results</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <div className="flex justify-center items-center py-4">
                        {/* <Spinner /> Replace with your Spinner component */}
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center">{error}</div>
                ) : (
                    <div className="overflow-x-auto max-h-[500px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Model</TableHead>
                                    <TableHead>Feedback</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.map((result) => (
                                    <TableRow key={result.id}>                                     
                                       <TableCell>
                                            {(() => {
                                                try {
                                                    return new Date(result.created_at).toLocaleString();
                                                } catch (e) {
                                                    console.error("Invalid date format:", result.created_at);
                                                    return result.created_at;
                                                }
                                            })()}
                                        </TableCell>
                                        <TableCell>
                                            <span style={{ color: getScoreColor(result.score), fontWeight: 'bold' }}>
                                                {result.score}
                                            </span>
                                        </TableCell>
                                        <TableCell>{result.model}</TableCell>
                                        <TableCell>{result.feedback}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PastResultsModal;