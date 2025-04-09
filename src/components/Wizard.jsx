import React, { useEffect, useState } from "react";
import { Button } from "components/Button"; // Using shadcn/ui for styling
import { Card } from "./Card";
import { ArrowLeft } from "lucide-react";
import { Text } from "./Text";

export function Wizard({
    submitError = "",
    steps = [],
    submitDisabled = false,
    customStep = 0,
}) {
    const [step, setStep] = useState(customStep);
    const isLastStep = step === steps.length - 1;

    useEffect(() => {
        setStep(customStep);
    }, [customStep]);

    const handleNext = async () => {
        let res = await steps[step]?.onSubmit();
        if (res && !isLastStep) setStep(step + 1);
    };
    const handlePrev = () => {
        setStep(step - 1);
    };
    return (
        <Card className='max-w-md mx-auto'>
            <div className='mb-4'>
                <div className='mb-4 flex items-center justify-between'>
                    {step > 0 && <ArrowLeft onClick={handlePrev} />}
                    <Text
                        type='semiBold-subHeader'
                        className='text-center flex-1'>
                        {steps[step].title}
                    </Text>
                </div>
                <div> {steps[step]?.children}</div>
                <div>
                    <Button
                        error={submitError}
                        className=''
                        type='submit'
                        onClick={handleNext}
                        disabled={submitDisabled}
                        label={isLastStep ? "Submit" : "Next"}
                    />
                </div>
            </div>
        </Card>
    );
}
