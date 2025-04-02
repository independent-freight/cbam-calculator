import { Text } from "components/Text";
import { Card } from "components/Card";
import { Button } from "components/Button";
import { ArrowLeft } from "lucide-react";

export function CBAMSummary({ data, cbamKeys, onSubmit, goBack, error }) {
    const renderObject = (renderData) => {
        return Object.keys(renderData).map((key) => {
            const value = renderData[key];
            if (typeof value === "object" && value !== null) {
                return (
                    <div key={key} className='my-[10px]'>
                        <Text className='mb-[10px]' type='subHeader-semiBold'>
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
                    <Text type='label'> {value || "N/A"}</Text>
                </div>
            );
        });
    };
    return (
        <Card>
            <div className='mb-4 flex items-center justify-between'>
                <ArrowLeft
                    onClick={() => goBack(data)}
                    className='cursor-pointer'
                />
                <Text type='subHeader-semiBold' className='text-center flex-1'>
                    CBAM Summary
                </Text>
            </div>
            <div>{renderObject(data)}</div>
            <Button
                type='button'
                onClick={() => onSubmit(data)}
                label='Submit'
                error={error}
            />
        </Card>
    );
}
