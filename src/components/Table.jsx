import React from "react";
import "App.css";
export function Table({ data = [], columns, className, footerCols }) {
    const columnKeys = columns[0].map((col) => col.key).filter(Boolean);

    return (
        <div className='overflow-x-auto border border-gray-300 border-1'>
            <table className='ssm-max-w-md-table min-w-full sm:w-3/4 md:w-1/2 lg:w-1/3 table-auto border-collapse border border-gray-300'>
                {/* Table Header */}
                <thead>
                    {columns.map((headerRow, rowIndex) => (
                        <tr key={rowIndex} className='bg-gray-200'>
                            {headerRow.map(
                                ({ label, colSpan, key }, colIndex) => (
                                    <th
                                        key={colIndex}
                                        colSpan={colSpan || 1}
                                        className='border border-gray-300 px-4 py-2 text-center'>
                                        {label}
                                    </th>
                                )
                            )}
                        </tr>
                    ))}
                </thead>

                {/* Table Body */}
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className='hover:bg-gray-100'>
                            {columnKeys.map((colKey, colIndex) => {
                                // Special case for "Product Information" colSpan 2 (Render two values)
                                if (colKey?.includes("custom")) {
                                    const keys = colKey.split("-");
                                    return (
                                        <React.Fragment key={colIndex}>
                                            <td className='border border-gray-300 px-4 py-2'>
                                                {row[keys[1]] || "-"}
                                            </td>
                                            <td className='border border-gray-300 px-4 py-2'>
                                                {row[keys[2]] || "-"}{" "}
                                                {/* Second column under "Product Information" */}
                                            </td>
                                        </React.Fragment>
                                    );
                                }
                                return (
                                    <td
                                        key={colIndex}
                                        className='border border-gray-300 px-4 py-2'>
                                        {row[colKey] || "-"}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    {footerCols.map((footerRow, rIndex) => (
                        <tr key={rIndex} className='bg-gray-200'>
                            {footerRow.map(
                                ({ label, colSpan, key, style }, cIndex) => (
                                    <td
                                        key={`${rIndex}-${cIndex}-${
                                            key ?? "-"
                                        }`}
                                        colSpan={colSpan || 1}
                                        className={`border border-gray-300 px-4 py-2 text-center ${
                                            style ?? ""
                                        }`}>
                                        {label}
                                    </td>
                                )
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
