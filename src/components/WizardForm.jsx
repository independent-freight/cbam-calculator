import React, { useEffect, useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import { Button } from "components/Button"; // Using shadcn/ui for styling
import { Input } from "./Input";
import { Dropdown } from "./Dropdown";

export function WizardForm({
    formData,
    initialValues,
    onFieldArrayPush,
    onFieldArrayRemove,
    validation,
    onSubmit = () => {},
    isFieldArray = false,
    formName = "",
    dataTemplate = {},
    formikRef,
}) {
    const [fieldData, setFieldData] = useState({ ...initialValues });
    useEffect(() => {
        setFieldData((prevState) => ({ ...prevState, ...initialValues }));
    }, [initialValues]);

    const handleSubmit = (values) => {
        onSubmit({ ...fieldData, ...values });
    };

    const renderAddRemove = (index, remove, push) => {
        return (
            <div className='flex justify-between items-center'>
                {/* Remove Button */}
                {index > 0 && (
                    <Button
                        type='button'
                        className='text-white-500'
                        onClick={() => {
                            remove(index);
                            onFieldArrayRemove && onFieldArrayRemove(index);
                        }}
                        label='Remove'
                    />
                )}
                {/* Add new Supplier */}
                <Button
                    type='button'
                    onClick={() => {
                        push(dataTemplate ?? initialValues[0]);
                        onFieldArrayPush &&
                            onFieldArrayPush(dataTemplate ?? initialValues[0]);
                    }}
                    className='text-white-500'
                    label='Add'
                />
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
        prefix
    ) => {
        return fields.map(
            (
                {
                    componentType = "input",
                    name,
                    label,
                    setField,
                    tooltip,
                    ...props
                },
                field_index
            ) => {
                let fieldName =
                    prefix === 0 || prefix
                        ? `${formName}[${prefix}][${name}]`
                        : name;
                return (
                    <div
                        key={`${field_index}-${name}-${fieldName}`}
                        className='mb-4'>
                        {componentType === "input" ? (
                            <Input
                                value={values?.[name]}
                                label={label}
                                name={fieldName}
                                tooltip={tooltip}
                                onChange={(e) => {
                                    setField &&
                                        setField(
                                            e.target.value,
                                            fieldName,
                                            fieldData
                                        );
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
                                    setField &&
                                        setField(option, fieldName, fieldData);
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
        <div>
            <Formik
                innerRef={formikRef}
                initialValues={fieldData}
                validationSchema={validation}
                onSubmit={handleSubmit}
                enableReinitialize={true}>
                {({ values, touched, errors, handleChange, setFieldValue }) => (
                    <Form>
                        {isFieldArray ? (
                            <FieldArray name={formName}>
                                {({ push, remove }) => {
                                    return values[formName]?.map((_, index) => {
                                        return (
                                            <>
                                                {fieldRender(
                                                    formData,
                                                    values[formName]?.[index],
                                                    touched[formName]?.[index],
                                                    errors[formName]?.[index],
                                                    handleChange,
                                                    setFieldValue,
                                                    index
                                                )}
                                                {renderAddRemove(
                                                    index,
                                                    remove,
                                                    push
                                                )}
                                            </>
                                        );
                                    });
                                }}
                            </FieldArray>
                        ) : (
                            fieldRender(
                                formData,
                                values,
                                touched,
                                errors,
                                handleChange,
                                setFieldValue
                            )
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
}
