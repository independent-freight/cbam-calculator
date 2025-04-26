import { Text } from "components/Text";

export function CBAMSummary({ data, cbamKeys }) {
    const renderObject = (renderData) => {
        let renderKeys = Object.keys(renderData);
        return renderKeys.map((key, index) => {
            const value = renderData[key];
            if (typeof value === "object" && value !== null) {
                return (
                    <div key={key} className='mt-[20px] mb-[10px]'>
                        <Text className='mb-[10px]' type='body-semiBold'>
                            {cbamKeys[key]}
                        </Text>
                        <div className=''>{renderObject(value)}</div>
                    </div>
                );
            }
            return (
                <div key={key} className='flex justify-start items-center'>
                    <Text type='label-semiBold' className='mr-[5px]'>
                        {cbamKeys[key]}:
                    </Text>
                    <Text type='label'> {value ?? "N/A"}</Text>
                </div>
            );
        });
    };
    return <div className='mb-[20px]'>{renderObject(data)}</div>;
}
