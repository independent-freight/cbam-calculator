import React, { useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import { Button } from "components/Button"; // Using shadcn/ui for styling
import { Card } from "./Card";
import { Input } from "./Input";
import { Dropdown } from "./Dropdown";
import { ArrowLeft } from "lucide-react";
import { Text } from "./Text";

export function WizardForm({
    formSteps,
    onSubmit,
    initialValues,
    customStep = 0,
}) {
    const [allFormData, setAllFormData] = useState({ ...initialValues });
    const [step, setStep] = useState(customStep);
    const isLastStep = step === formSteps.length - 1;

    const handleNext = (values, { setTouched }) => {
        setAllFormData((prevState) => ({ ...prevState, ...values }));
        setTouched({});
        setStep(step + 1);
    };

    const handlePrev = () => {
        setStep(step - 1);
    };

    const handleSubmit = (values) => {
        onSubmit({ ...allFormData, ...values });
    };

    const renderAddRemove = (index, remove, push) => {
        return (
            <div className='flex justify-between items-center'>
                {/* Remove Button */}
                {index > 0 && (
                    <Button
                        type='button'
                        className='text-white-500'
                        onClick={() => remove(index)}
                        label='Remove'
                    />
                )}
                {/* Add new Supplier */}
                <Button
                    type='button'
                    onClick={() =>
                        push(initialValues[formSteps[step]?.name][0])
                    }
                    className='text-white-500'
                    label='Add'></Button>
            </div>
        );
    };

    const fieldRender = (
        fields,
        values,
        touched,
        errors,
        handleChange,
        setFieldValue,
        prefixName
    ) => {
        return fields.map(
            ({ componentType = "input", name, label, setField, ...props }) => {
                let fieldName = `${
                    prefixName === 0 || prefixName ? `${prefixName}.` : ""
                }${name}`;
                return (
                    <div key={fieldName} className='mb-4'>
                        {componentType === "input" ? (
                            <Input
                                value={values?.[name]}
                                label={label}
                                name={fieldName}
                                onChange={(e) => {
                                    setField && setField(e.target.value);
                                    handleChange(e);
                                }}
                                className='py-1'
                                error={touched?.[name] && errors?.[name]}
                                {...props}
                            />
                        ) : componentType === "dropdown" ? (
                            <Dropdown
                                name={fieldName}
                                label={label}
                                value={values?.[name] ?? null}
                                onSelect={(option) => {
                                    setField && setField(option);
                                    setFieldValue(fieldName, option);
                                }}
                                error={touched?.[name] && errors?.[name]}
                                {...props}
                            />
                        ) : null}
                    </div>
                );
            }
        );
    };

    return (
        <Card className='max-w-md mx-auto'>
            <div className='mb-4 flex items-center justify-between'>
                {step > 0 && <ArrowLeft onClick={handlePrev} />}
                <Text type='semiBold-subHeader' className='text-center flex-1'>
                    {formSteps[step].title}
                </Text>
            </div>

            <Formik
                initialValues={allFormData}
                validationSchema={formSteps[step].validationSchema}
                onSubmit={isLastStep ? handleSubmit : handleNext}>
                {({
                    isValid,
                    values,
                    touched,
                    errors,
                    handleChange,
                    setFieldValue,
                }) => (
                    <Form>
                        {formSteps[step]?.componentType === "fieldArray" ? (
                            <FieldArray name={formSteps[step]?.name}>
                                {({ push, remove }) =>
                                    values[formSteps[step]?.name]?.map(
                                        (_, index) => {
                                            let fieldErrors =
                                                errors?.[
                                                    formSteps[step]?.name
                                                ]?.[index];
                                            let fieldValues =
                                                values?.[
                                                    formSteps[step]?.name
                                                ]?.[index];
                                            let fieldTouched =
                                                touched?.[
                                                    formSteps[step]?.name
                                                ]?.[index];
                                            return (
                                                <>
                                                    {fieldRender(
                                                        formSteps[step].fields,
                                                        fieldValues,
                                                        fieldTouched,
                                                        fieldErrors,
                                                        handleChange,
                                                        setFieldValue,
                                                        `${formSteps[step]?.name}[${index}]`
                                                    )}
                                                    {renderAddRemove(
                                                        index,
                                                        remove,
                                                        push
                                                    )}
                                                </>
                                            );
                                        }
                                    )
                                }
                            </FieldArray>
                        ) : (
                            fieldRender(
                                formSteps[step].fields,
                                values?.[formSteps[step]?.name],
                                touched?.[formSteps[step]?.name],
                                errors?.[formSteps[step]?.name],
                                handleChange,
                                setFieldValue,
                                formSteps[step]?.name
                            )
                        )}
                        <div className='flex justify-between mt-4'>
                            <Button
                                error={
                                    typeof errors[formSteps[step]?.name] ===
                                        "string" &&
                                    errors[formSteps[step]?.name]
                                }
                                className='w-screen'
                                type='submit'
                                disabled={!isValid}
                                label={isLastStep ? "Submit" : "Next"}
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
}
