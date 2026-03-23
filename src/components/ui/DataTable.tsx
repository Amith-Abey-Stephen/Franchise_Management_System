import React from 'react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (row: T) => string;
}

export function DataTable<T>({ columns, data, keyExtractor }: DataTableProps<T>) {
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-white/5 shadow-premium bg-white dark:bg-slate-900/50">
            <table className="w-full min-w-[800px] text-sm text-left border-collapse">

                <thead className="text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} scope="col" className={`px-6 py-4 ${col.className || ''}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 font-medium">
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr key={keyExtractor(row)} className="group hover:bg-primary-soft/30 dark:hover:bg-primary-soft/5 transition-colors">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className={`px-6 py-4 text-gray-700 dark:text-gray-300 ${col.className || ''}`}>
                                        {typeof col.accessor === 'function'
                                            ? col.accessor(row)
                                            : (row[col.accessor] as React.ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

