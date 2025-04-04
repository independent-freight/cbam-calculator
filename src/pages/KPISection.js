import React from "react";

function KPICard({ title, value, icon: Icon, bgColor }) {
    return (
        <div
            className={`flex items-center p-4 rounded-lg shadow-lg ${bgColor} text-white`}>
            <div className='p-3 rounded-full bg-white bg-opacity-20'>
                <Icon size={24} className='text-white' />
            </div>
            <div className='ml-4'>
                <p className='text-sm font-medium'>{title}</p>
                <h3 className='text-xl font-semibold'>{value}</h3>
            </div>
        </div>
    );
}

export function KPISection({ sections }) {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4'>
            {sections.map((section, index) => {
                return (
                    <KPICard
                        key={`${index}-${section?.title}`}
                        title={section?.title}
                        value={section?.value}
                        icon={section?.icon}
                        bgColor={section?.bgColor}
                    />
                );
            })}
        </div>
    );
}
