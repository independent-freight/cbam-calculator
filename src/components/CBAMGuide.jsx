export function CBAMGuide() {
    return (
        <div className='mt-6 p-4 bg-yellow-50 rounded border border-yellow-100'>
            <h3 className='text-lg font-semibold mb-2'>Guide to Key Fields</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                <div>
                    <p className='font-medium'>SEE (direct)</p>
                    <p className='text-gray-600'>
                        Specific direct emissions from processes at your
                        facility
                    </p>
                </div>
                <div>
                    <p className='font-medium'>SEE (indirect)</p>
                    <p className='text-gray-600'>
                        Specific indirect emissions from electricity use
                    </p>
                </div>
                <div>
                    <p className='font-medium'>EmbEm (direct)</p>
                    <p className='text-gray-600'>
                        Total embedded direct emissions (SEE direct × quantity)
                    </p>
                </div>
                <div>
                    <p className='font-medium'>EmbEm (indirect)</p>
                    <p className='text-gray-600'>
                        Total embedded indirect emissions (SEE indirect ×
                        quantity)
                    </p>
                </div>
                <div>
                    <p className='font-medium'>Source of electricity EF</p>
                    <p className='text-gray-600'>
                        The method used to determine electricity emissions
                        factor
                    </p>
                </div>
                <div>
                    <p className='font-medium'>Embedded electricity</p>
                    <p className='text-gray-600'>
                        Amount of electricity consumed per tonne of product
                    </p>
                </div>
            </div>
        </div>
    );
}
